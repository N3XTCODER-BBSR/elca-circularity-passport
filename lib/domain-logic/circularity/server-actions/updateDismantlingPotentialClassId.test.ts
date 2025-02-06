import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import { createUser, deleteUserIfExists } from "prisma/queries/testUtils"
import {
  createAccessGroup,
  createGroupMember,
  createProductWithComponent,
  createProject,
  createProjectAccessToken,
  deleteAccessGroupIfExists,
  deleteComponentIfExists,
  deleteGroupMemberIfExists,
  deleteProductIfExists,
  deleteProjectAccessTokenIfExists,
  deleteProjectIfExists,
  setProjectAccessTokenToEditTrue,
} from "prisma/queries/utils"
import { updateDismantlingPotentialClassId } from "./updateDismantlingPotentialClassId"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

describe("updateDismantlingPotentialClassId", () => {
  // USER1 (created from seeding data, owner of project1)
  const project1Id = 1
  const user1Id = 2
  const product1Id = 1
  const group1Id = 3

  // USER2 (created in test, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104

  // USER3 (created in test, regular user without being owner of any project)
  const user3Id = 200
  const user3Username = "user3"
  const product3Id = 202
  const component3Id = 203

  // MORE
  const notExistingUserId = 1000
  const dismantlingPotentialClassId = "II"

  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)

      await createUser(user3Id, user3Username)
      await createProductWithComponent(product3Id, component3Id)
    })

    afterAll(async () => {
      await deleteProjectIfExists(project2Id)
      await deleteUserIfExists(user2Id)
      await deleteProductIfExists(product2Id)
      await deleteComponentIfExists(component2Id)
      await deleteAccessGroupIfExists(group2Id)

      await deleteUserIfExists(user3Id)
      await deleteComponentIfExists(component3Id)
      await deleteProductIfExists(product3Id)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("throws UnauthorizedError if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)).rejects.toThrow(
        UnauthorizedError
      )
    })

    it("throws UnauthorizedError if user lacks project access", async () => {
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)).rejects.toThrow(
        UnauthorizedError
      )
    })

    it("throws ZodError if productId is null", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error testing null
      await expect(updateDismantlingPotentialClassId(null, dismantlingPotentialClassId)).rejects.toThrow(ZodError)
    })

    it("throws ZodError if productId is undefined", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error testing undefined
      await expect(updateDismantlingPotentialClassId(undefined, dismantlingPotentialClassId)).rejects.toThrow(ZodError)
    })

    it("throws ZodError if productId is not a number", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error testing string
        updateDismantlingPotentialClassId("invalidProductId", dismantlingPotentialClassId)
      ).rejects.toThrow(ZodError)
    })

    it("throws UnauthorizedError if user is the project owner but the product is not in that project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDismantlingPotentialClassId(product2Id, dismantlingPotentialClassId)).rejects.toThrow(
        UnauthorizedError
      )
    })

    it("throws UnauthorizedError if user is in a group that lacks project access", async () => {
      const mockSession = createMockSession(user3Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDismantlingPotentialClassId(product3Id, dismantlingPotentialClassId)).rejects.toThrow(
        UnauthorizedError
      )
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("throws UnauthorizedError if user holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)).rejects.toThrow(
          UnauthorizedError
        )
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)
        ).resolves.toBeUndefined()
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves if user belongs to an authorized access group", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)
        ).resolves.toBeUndefined()
      })
    })

    it("resolves if user is the project owner", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDismantlingPotentialClassId(product1Id, dismantlingPotentialClassId)).resolves.toBeUndefined()
    })
  })
})
