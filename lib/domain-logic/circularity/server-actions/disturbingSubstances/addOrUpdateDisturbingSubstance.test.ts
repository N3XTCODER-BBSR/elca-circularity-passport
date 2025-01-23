import { ZodError } from "zod"
import { createMockSession } from "app/(utils)/testUtils"
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/types/domain-types"
import { UnauthorizedError } from "lib/errors"
import {
  createDisturbingSubstanceSelectionWithDependencies,
  createUser,
  createVariant,
  deleteUserIfExists,
  deleteVariantIfExists,
} from "prisma/queries/utils"
import { addOrUpdateDisturbingSubstanceSelection } from "./addOrUpdateDisturbingSubstance"
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

let disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId = {
  disturbingSubstanceClassId: "S0",
  disturbingSubstanceName: null,
  id: null,
  userEnrichedProductDataElcaElementComponentId: 6,
}

describe("addOrUpdateDisturbingSubstanceSelection", () => {
  describe("authorization", () => {
    beforeAll(async () => {
      await createUser(unauthorizedUserId, unauthorizedUsername)
      await createVariant(variantIdNotInProject, projectId)

      const result = await createDisturbingSubstanceSelectionWithDependencies()
      disturbingSubstanceSelectionId = result.id
      disturbingSubstanceSelection = { ...disturbingSubstanceSelection, id: disturbingSubstanceSelectionId }
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

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelection)
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should throw Unauthorized error when user is unauthorized to project", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelection)
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should throw when product id is null", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test null
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, null, disturbingSubstanceSelection)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when product id is undefined", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test undefined
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, undefined, disturbingSubstanceSelection)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when user is project owner and variant is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(
          variantIdNotInProject,
          projectId,
          productId,
          disturbingSubstanceSelection
        )
      ).rejects.toThrow(expect.objectContaining({ code: "P2025" }))
    })
    it("should thrown when product id is not a number", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error test string
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, "invalidProductId", disturbingSubstanceSelection)
      ).rejects.toThrow(ZodError)
    })
    it("should throw when user is project owner and product id is not part of project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(
          variantId,
          projectId,
          productIdNotInAuthorizedProject,
          disturbingSubstanceSelection
        )
      ).rejects.toThrow(UnauthorizedError)
    })
    it("should return undefined when the user is owner of the project", async () => {
      const mockSession = createMockSession(projectOwnerId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variantId, projectId, productId, disturbingSubstanceSelection)
      ).resolves.toBeTruthy()
    })
  })
})
