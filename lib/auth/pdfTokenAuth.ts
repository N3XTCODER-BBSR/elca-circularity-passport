/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import crypto from "crypto"
import { dbDalInstance } from "prisma/queries/dalSingletons"

/**
 * Generate a one-time PDF token for secure PDF access
 * @param userId - The user ID requesting the token
 * @param projectId - The project ID the token is for
 * @param variantId - The variant ID the token is for
 * @param expiresInSeconds - Token expiration time in seconds (default: 60)
 * @returns The generated token
 */
export const generateOneTimePdfToken = async ({
  userId,
  projectId,
  variantId,
  expiresInSeconds = 60,
}: {
  userId: string
  projectId: number
  variantId: number
  expiresInSeconds?: number
}) => {
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)

  await dbDalInstance.createOneTimePdfToken({
    token,
    userId,
    projectId,
    variantId,
    expiresAt,
  })

  return token
}

/**
 * Validate and consume a one-time PDF token
 * @param token - The token to validate
 * @param projectId - The expected project ID
 * @param variantId - The expected variant ID
 * @returns The user ID if token is valid, null otherwise
 */
export const validateAndUseOneTimePdfToken = async ({
  token,
  projectId,
  variantId,
}: {
  token: string
  projectId: number
  variantId: number
}) => {
  const now = new Date()
  const found = await dbDalInstance.findOneTimePdfToken(token)

  if (!found || found.used || found.expiresAt < now || found.projectId !== projectId || found.variantId !== variantId) {
    return null
  }

  // Mark as used
  await dbDalInstance.markOneTimePdfTokenAsUsed(token)
  return found.userId
}
