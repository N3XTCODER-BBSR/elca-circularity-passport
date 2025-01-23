import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import { createUser, createVariant, deleteUserIfExists, deleteVariantIfExists } from "prisma/queries/utils"
import getElcaComponentDataByLayerId from "./getElcaComponentDataByLayerId"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const authorizedUserId = 2

// user names
const unauthorizedUsername = "unauthorizedUserName"

// project ids
const projectId = 1

// variant ids
const variantId = 1
const variantIdNotInProject = 1000

// layer ids
const productIdNotInProject = 8
const productId = 1

describe("getElcaComponentDataByLayerId", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
      await createVariant(variantIdNotInProject, projectId)
    })
    afterAll(async () => {
      await deleteUserIfExists(unauthorizedUserId)
      await deleteVariantIfExists(variantIdNotInProject)
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("should throw Unauthorized error when user is not existing", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByLayerId(variantId, projectId, productId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByLayerId(variantId, projectId, productId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when user is authorized and layer id is not part of project", async () => {
      const mockSession = createMockSession(authorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByLayerId(variantId, projectId, productIdNotInProject)).rejects.toThrow(
        expect.objectContaining({ code: "P2025" })
      )
    })
    it("should throw when user is project owner and variant is not part of project", async () => {
      const mockSession = createMockSession(authorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(getElcaComponentDataByLayerId(variantIdNotInProject, projectId, productId)).rejects.toThrow(
        expect.objectContaining({ code: "P2025" })
      )
    })
    it("should return element component data when user is authorized and element component is part of project", async () => {
      const mockSession = createMockSession(authorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      const result = await getElcaComponentDataByLayerId(variantId, projectId, productId)

      expect(result).toBeTruthy()
    })
  })
})
