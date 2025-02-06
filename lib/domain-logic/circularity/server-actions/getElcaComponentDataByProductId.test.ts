import { createMockSession } from "app/(utils)/testUtils"
import { createUser, deleteUserIfExists } from "prisma/queries/testUtils"
import {
  createAccessGroup,
  createGroupMember,
  createProject,
  createProjectAccessToken,
  createVariant,
  deleteAccessGroupIfExists,
  deleteGroupMemberIfExists,
  deleteProjectAccessTokenIfExists,
  deleteProjectIfExists,
  deleteVariantIfExists,
  setProjectAccessTokenToEditTrue,
} from "prisma/queries/utils"
import getElcaComponentDataByProductId from "./getElcaComponentDataByProductId"
import ensureUserIsAuthenticated from "../../../ensureAuthenticated"

jest.mock("../../../ensureAuthenticated", () => jest.fn())

describe("getElcaComponentDataByProductId", () => {
  // USER1: seed-based, assumed project1 owner
  const project1Id = 1
  const user1Id = 2
  const group1Id = 3
  const variant1Id = 1
  const product1ProductId = 1

  // USER2: created in test, owner of project2
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const variant2Id = 102
  const group2Id = 104

  // USER3: created in test, a regular user with no default project ownership
  const user3Id = 200
  const user3Username = "user3"

  // Additional references for negative tests
  const notExistingUserId = 1000
  const unauthorizedUserId = 1001
  const unauthorizedUsername = "unauthorizedUserName"

  const variantIdNotInProject = 1000
  const productIdNotInProject = 8

  describe("authorization", () => {
    beforeAll(async () => {
      // 1) Create user2 and set up their project (project2)
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createVariant(variant2Id, project2Id)

      // 2) Create user3 (no project ownership initially)
      await createUser(user3Id, user3Username)

      await createVariant(variantIdNotInProject, project2Id)
      await createUser(unauthorizedUserId, unauthorizedUsername)
    })

    afterAll(async () => {
      // Clean up user2 resources
      await deleteProjectIfExists(project2Id)
      await deleteVariantIfExists(variant2Id)
      await deleteAccessGroupIfExists(group2Id)
      await deleteUserIfExists(user2Id)

      // Clean up user3
      await deleteUserIfExists(user3Id)

      // Clean up the "not-in-project" variant
      await deleteVariantIfExists(variantIdNotInProject)

      // Clean up the unauthorized user
      await deleteUserIfExists(unauthorizedUserId)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns unauthorized errorI18nKey if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)).resolves.toMatchObject({
        errorI18nKey: "errors.unauthorized",
        success: false,
      })
    })

    it("returns unauthorized errorI18nKey if user lacks project access", async () => {
      // user2 has project2, not project1
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)).resolves.toMatchObject({
        errorI18nKey: "errors.unauthorized",
        success: false,
      })
    })

    it("returns unauthorized errorI18nKey if user is not in the project (unauthorized user)", async () => {
      // unauthorizedUserId is a user with no access to any project
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)).resolves.toMatchObject({
        errorI18nKey: "errors.unauthorized",
        success: false,
      })
    })

    it("returns DB errorI18nKey user is project owner but the productId is not part of the project", async () => {
      const mockSession = createMockSession(user1Id) // user1 owns project1
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // productIdNotInProject doesn't belong to project1
      await expect(
        getElcaComponentDataByProductId(variant1Id, project1Id, productIdNotInProject)
      ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.db" })
    })

    it("returns DB errorI18nKey user is project owner but the variant is not part of the project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // variantIdNotInProject references project2 in this test scenario
      await expect(
        getElcaComponentDataByProductId(variantIdNotInProject, project1Id, product1ProductId)
      ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.db" })
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // Provide user3 a read-only token for project1
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("returns unauthorized errorI18nKey if user has only read access token and tries to fetch data from project1", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)).resolves.toMatchObject(
          {
            errorI18nKey: "errors.unauthorized",
            success: false,
          }
        )
      })

      it("resolves and returns data if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        const data = await getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)
        expect(data).toBeTruthy()
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        // Add user3 to group1, granting them access to project1
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves and returns data if user belongs to an authorized group", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        const data = await getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)
        expect(data).toBeTruthy()
      })
    })

    it("resolves and returns data if user is the project owner (and layer is part of project)", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      const result = await getElcaComponentDataByProductId(variant1Id, project1Id, product1ProductId)
      expect(result).toBeTruthy()
    })
  })
})
