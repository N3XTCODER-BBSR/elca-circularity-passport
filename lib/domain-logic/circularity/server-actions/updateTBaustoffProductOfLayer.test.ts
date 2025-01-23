import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import {
  createProductWithComponent,
  createTBsProductDefinition,
  createUser,
  deleteComponentIfExists,
  deleteProductIfExists,
  deleteUserIfExists,
} from "prisma/queries/utils"
import { updateTBaustoffProduct } from "./updateTBaustoffProductOfLayer"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const unauthorizedUsername = "unauthorizedUserName"
const projectOwnerId = 2

// product ids
const productIdNotInAuthorizedProject = 100
const productId = 13

// component ids
const componentIdNotInAuthorizedProject = 100

// TB product definition ids
const productDefinitionId = 1

describe("updateTBaustoffProduct", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
      await createProductWithComponent(productIdNotInAuthorizedProject, componentIdNotInAuthorizedProject)
      await createTBsProductDefinition(productDefinitionId)
    })
    afterAll(async () => {
      await deleteUserIfExists(unauthorizedUserId)
      await deleteProductIfExists(productIdNotInAuthorizedProject)
      await deleteComponentIfExists(componentIdNotInAuthorizedProject)
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("should throw Unauthorized error when user is not existing", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(productId, productDefinitionId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(productId, productDefinitionId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when product id is null", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test null
        updateTBaustoffProduct(null, productDefinitionId)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when product id is undefined", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test undefined
        updateTBaustoffProduct(undefined, productDefinitionId)
      ).rejects.toThrow(ZodError)
    })
    it("should thrown when product id is not a number", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test string
        updateTBaustoffProduct("invalidProductId", productDefinitionId)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when user is project owner and product id is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(productIdNotInAuthorizedProject, productDefinitionId)).rejects.toThrow(
        UnauthorizedError
      )
    })
    it("should return undefined when the user is owner of the project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(productId, productDefinitionId)).resolves.toBeUndefined()
    })
  })
})
