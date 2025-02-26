import { NotFoundError, UnauthorizedError } from "lib/errors"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Validates if a variant belongs to a specific project.
 *
 * @param {number} variantId - The ID of the variant to validate.
 * @param {number} projectId - The ID of the project to validate against.
 * @throws {NotFoundError} If the variant is not found.
 * @throws {UnauthorizedError} If the variant does not belong to the project.
 */
export const ensureVariantAccessible = async (variantId: number, projectId: number) => {
  const variant = await legacyDbDalInstance.getVariantById(variantId)
  if (!variant) {
    throw new NotFoundError()
  }
  if (variant.project_id !== projectId) {
    throw new UnauthorizedError()
  }
}
