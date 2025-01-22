import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import {
  createProductWithComponent,
  createUser,
  deleteComponentIfExists,
  deleteProductIfExists,
  deleteUserIfExists,
} from "prisma/queries/utils"
import toggleExcludedProduct from "./toggleExcludedProject"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const unauthorizedUsername = "unauthorizedUserName"
const authorizedUserId = 2

// product ids
const productIdNotInAuthorizedProject = 100
const productId = 1

// component ids
const componentIdNotInAuthorizedProject = 100

describe("toggleExcludedProduct", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
      await createProductWithComponent(productIdNotInAuthorizedProject, componentIdNotInAuthorizedProject)
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

      await expect(toggleExcludedProduct(productId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(toggleExcludedProduct(productId)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when user is authorized and product id is not part of project", async () => {
      const mockSession = createMockSession(authorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(toggleExcludedProduct(productIdNotInAuthorizedProject)).rejects.toThrow()
    })
    it("should return element component data when user is authorized and element component is part of project", async () => {
      const mockSession = createMockSession(authorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(toggleExcludedProduct(productId)).resolves.toBeUndefined()
    })
  })
})
