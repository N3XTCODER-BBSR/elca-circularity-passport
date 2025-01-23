import { createMockSession } from "app/(utils)/testUtils"
import { UnauthorizedError } from "lib/errors"
import {
  createDisturbingSubstanceSelectionWithDependencies,
  createUser,
  createVariant,
  deleteUserIfExists,
  deleteVariantIfExists,
  removeDisturbingSubstanceSelectionWithDependenciesIfExist,
} from "prisma/queries/utils"
import { removeDisturbingSubstanceSelection } from "./removeDisturbingSubstances"
import ensureUserIsAuthenticated from "../../../../../lib/ensureAuthenticated"

jest.mock("../../../../../lib/ensureAuthenticated", () => jest.fn())

// user ids
const notExistingUserId = 1000
const unauthorizedUserId = 1001
const projectOwnerId = 2

// user names
const unauthorizedUsername = "unauthorizedUserName"

// project ids
const projectId = 1

// variant ids
const variantId = 1
const variantIdNotInProject = 1000

// product ids
const productIdNotInAuthorizedProject = 100
const productId = 13

let disturbingSubstanceSelectionId: number
let elcaComponentId: number

// let disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId = {
//   disturbingSubstanceClassId: "S0",
//   disturbingSubstanceName: null,
//   id: null,
//   userEnrichedProductDataElcaElementComponentId: 6,
// }

describe("removeDisturbingSubstanceSelection", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
      await createVariant(variantIdNotInProject, projectId)
    })
    afterAll(async () => {
      await deleteUserIfExists(unauthorizedUserId)
      await deleteVariantIfExists(variantIdNotInProject)
    })
    beforeEach(async () => {
      jest.clearAllMocks()
      const result = await createDisturbingSubstanceSelectionWithDependencies()
      disturbingSubstanceSelectionId = result.id
      elcaComponentId = result.userEnrichedProductDataElcaElementComponentId
    })
    afterEach(async () => {
      await removeDisturbingSubstanceSelectionWithDependenciesIfExist(disturbingSubstanceSelectionId, elcaComponentId)
    })
    it("should throw Unauthorized error when user is not existing", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelectionId)
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelectionId)
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when user is project owner and variant is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(variantIdNotInProject, projectId, productId, disturbingSubstanceSelectionId)
      ).rejects.toThrow()
    })
    it("should throw when product id is missing", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test null
        removeDisturbingSubstanceSelection(variantId, projectId, null, disturbingSubstanceSelectionId)
      ).rejects.toThrow()

      await expect(
        // @ts-expect-error test undefined
        removeDisturbingSubstanceSelection(variantId, projectId, undefined, disturbingSubstanceSelectionId)
      ).rejects.toThrow()
    })
    it("should thrown when product id is not a number", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test string
        removeDisturbingSubstanceSelection(variantId, projectId, "invalidProductId", disturbingSubstanceSelectionId)
      ).rejects.toThrow()
    })
    it("should throw when user is project owner and product id is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(
          variantId,
          projectId,
          productIdNotInAuthorizedProject,
          disturbingSubstanceSelectionId
        )
      ).rejects.toThrow()
    })
    it("should return undefined when the user is owner of the project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        removeDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelectionId)
      ).resolves.toBeTruthy()
    })
  })
})
