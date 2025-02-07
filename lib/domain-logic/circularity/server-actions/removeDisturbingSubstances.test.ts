import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import {
  createAccessGroup,
  createDisturbingSubstanceSelectionWithDependencies,
  createGroupMember,
  createProductWithComponent,
  createProject,
  createProjectAccessToken,
  createUser,
  createVariant,
  deleteAccessGroupIfExists,
  deleteComponentIfExists,
  deleteDisturbingSubstanceSelectionWithDependenciesIfExist,
  deleteGroupMemberIfExists,
  deleteProductIfExists,
  deleteProjectAccessTokenIfExists,
  deleteProjectIfExists,
  deleteUserIfExists,
  deleteVariantIfExists,
  setProjectAccessTokenToEditTrue,
} from "prisma/queries/testUtils"
import { removeDisturbingSubstanceSelection } from "./removeDisturbingSubstances"
import ensureUserIsAuthenticated from "../../../ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

describe("removeDisturbingSubstanceSelection", () => {
  // USER1 (seed-based, owner of project1)
  const project1Id = 1
  const user1Id = 2
  const group1Id = 3
  const product1Id = 13 // belongs to project1

  // USER2 (test-created, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104
  const variant2Id = 105

  // USER3 (regular user)
  const user3Id = 200
  const user3Username = "user3"

  // Additional references for negative tests
  const notExistingUserId = 1000
  const unauthorizedUserId = 1001
  const unauthorizedUsername = "unauthorizedUserName"

  // Another variant for negative test: belongs to project2, not project1
  const variantIdNotInProject = 1000

  // Product ID not in project1
  const productIdNotInAuthorizedProject = 100

  // Disturbing substance selection references
  let disturbingSubstanceSelectionId: number | undefined
  let elcaComponentId: number | undefined

  describe("authorization", () => {
    beforeAll(async () => {
      // 1) Create user2 with its own project2 & product2
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)
      await createVariant(variant2Id, project2Id)

      // 2) Create user3 (regular user, no default project)
      await createUser(user3Id, user3Username)

      // 3) Create unauthorized user
      await createUser(unauthorizedUserId, unauthorizedUsername)

      // 4) Create a variant not in project1 (already referencing project2 for instance)
      await createVariant(variantIdNotInProject, project2Id)
    })

    afterAll(async () => {
      // Cleanup user2
      await deleteProjectIfExists(project2Id)
      await deleteAccessGroupIfExists(group2Id)
      await deleteVariantIfExists(variant2Id)
      await deleteUserIfExists(user2Id)
      await deleteProductIfExists(product2Id)
      await deleteComponentIfExists(component2Id)

      // Cleanup user3
      await deleteUserIfExists(user3Id)

      // Cleanup unauthorized user
      await deleteUserIfExists(unauthorizedUserId)

      // Cleanup variant not in project1
      await deleteVariantIfExists(variantIdNotInProject)
    })

    beforeEach(async () => {
      jest.clearAllMocks()

      // Create disturbingSubstanceSelection & its dependencies fresh for each test
      const result = await createDisturbingSubstanceSelectionWithDependencies()

      disturbingSubstanceSelectionId = result.id
      elcaComponentId = result.userEnrichedProductDataElcaElementComponentId
    })

    afterEach(async () => {
      if (typeof disturbingSubstanceSelectionId === "number" && typeof elcaComponentId === "number") {
        await deleteDisturbingSubstanceSelectionWithDependenciesIfExist(disturbingSubstanceSelectionId, elcaComponentId)
      }
      disturbingSubstanceSelectionId = undefined
      elcaComponentId = undefined
    })

    it("throws UnauthorizedError if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)).rejects.toThrow(
        UnauthorizedError
      )
    })

    it("throws UnauthorizedError if user lacks project access", async () => {
      // user2: project2 only
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)).rejects.toThrow(
        UnauthorizedError
      )
    })

    it("throws UnauthorizedError if user is not part of the project (unauthorized user)", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)).rejects.toThrow(
        UnauthorizedError
      )
    })

    describe("product id validations", () => {
      it("throws ZodError if product id is null or undefined", async () => {
        const mockSession = createMockSession(user1Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        // null
        await expect(
          // @ts-expect-error Testing null
          removeDisturbingSubstanceSelection(null, disturbingSubstanceSelectionId!)
        ).rejects.toThrow(ZodError)

        // undefined
        await expect(
          // @ts-expect-error Testing undefined
          removeDisturbingSubstanceSelection(undefined, disturbingSubstanceSelectionId!)
        ).rejects.toThrow(ZodError)
      })

      it("throws ZodError if product id is not a number", async () => {
        const mockSession = createMockSession(user1Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          // @ts-expect-error Testing undefined
          removeDisturbingSubstanceSelection("999" as number, disturbingSubstanceSelectionId!)
        ).rejects.toThrow(ZodError)
      })
    })

    it("throws UnauthorizedError if user is project owner but product id is not part of project", async () => {
      // user1 owns project1, but productIdNotInAuthorizedProject belongs to something else
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(productIdNotInAuthorizedProject, disturbingSubstanceSelectionId!)
      ).rejects.toThrow(UnauthorizedError)
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // Give user3 a read-only token for project1
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("throws UnauthorizedError if user holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)).rejects.toThrow(
          UnauthorizedError
        )
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)
        ).resolves.toBeUndefined()
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        // user3 joins group1 => can access project1
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves if user belongs to an authorized group that controls the project", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)
        ).resolves.toBeUndefined()
      })
    })

    it("resolves if user is the project owner (and product is part of the project)", async () => {
      // user1 owns project1; variant1Id/product1Id belong to project1
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(product1Id, disturbingSubstanceSelectionId!)
      ).resolves.toBeUndefined()
    })
  })
})
