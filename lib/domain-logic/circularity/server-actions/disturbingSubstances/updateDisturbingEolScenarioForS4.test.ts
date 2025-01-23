import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import { createUser, deleteUserIfExists } from "prisma/queries/utils"
import { updateDisturbingEolScenarioForS4 } from "./updateDisturbingEolScenarioForS4"
import ensureUserIsAuthenticated from "../../../../../lib/ensureAuthenticated"

jest.mock("../../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const projectOwnerId = 2

// user names
const unauthorizedUsername = "unauthorizedUserName"

// product ids
const productIdNotInAuthorizedProject = 100
const productId = 13

const newScenario = null

describe("updateDisturbingEolScenarioForS4", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
    })
    afterAll(async () => {
      await deleteUserIfExists(unauthorizedUserId)
    })
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("should throw Unauthorized error when user is not existing", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(productId, newScenario)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(productId, newScenario)).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when product id is null", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test null
        updateDisturbingEolScenarioForS4(null, newScenario)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when product id is undefined", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test undefined
        updateDisturbingEolScenarioForS4(undefined, newScenario)
      ).rejects.toThrow(ZodError)
    })
    it("should thrown when product id is not a number", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test string
        updateDisturbingEolScenarioForS4("invalidProductId", newScenario)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when user is project owner and product id is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(productIdNotInAuthorizedProject, newScenario)).rejects.toThrow(
        UnauthorizedError
      )
    })
    it("should return undefined when the user is owner of the project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(productId, newScenario)).resolves.toBeUndefined()
    })
  })
})
