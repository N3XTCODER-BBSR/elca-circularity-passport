import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import {
  createProductWithComponent,
  createUser,
  deleteComponentIfExists,
  deleteProductIfExists,
  deleteUserIfExists,
} from "prisma/queries/utils"
import { updateSpecificEolScenario } from "./updateSpecificScenario"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const unauthorizedUsername = "unauthorizedUserName"
const projectOwnerId = 2

// product ids
const productIdNotInAuthorizedProject = 100
const productId = 1

// component ids
const componentIdNotInAuthorizedProject = 100

const newSpecificEolScenario = "CL_MINUS"
const newProofText = "proof"

describe("updateSpecificEolScenario", () => {
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

      await expect(updateSpecificEolScenario(productId, newSpecificEolScenario, newProofText)).rejects.toThrow(
        UnauthorizedError
      )
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(productId, newSpecificEolScenario, newProofText)).rejects.toThrow(
        UnauthorizedError
      )
    })
    it("should throw when product id is null", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test null
        updateSpecificEolScenario(null, newSpecificEolScenario, newProofText)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when product id is undefined", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test undefined
        updateSpecificEolScenario(undefined, newSpecificEolScenario, newProofText)
      ).rejects.toThrow(ZodError)
    })
    it("should thrown when product id is not a number", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test string
        updateSpecificEolScenario("invalidProductId", newSpecificEolScenario, newProofText)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when user is project owner and product id is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        updateSpecificEolScenario(productIdNotInAuthorizedProject, newSpecificEolScenario, newProofText)
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should return undefined when the user is owner of the project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(productId, newSpecificEolScenario, newProofText)).resolves.toBeUndefined()
    })
  })
})
