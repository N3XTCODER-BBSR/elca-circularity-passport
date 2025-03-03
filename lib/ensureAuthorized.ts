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
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { UnauthorizedError } from "./errors"

/**
 * ensure that the user is authorized to access the project with the given id or throw an error
 * @param userId
 * @param projectId
 */
export const ensureUserAuthorizationToProject = async (userId: number, projectId: number) => {
  const isAuthorized = await legacyDbDalInstance.isUserAuthorizedToProject(userId, projectId)

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}

export const ensureUserAuthorizationToElementByUuid = async (userId: number, elementUuid: string) => {
  const isAuthorized = await legacyDbDalInstance.isUserAuthorizedToElementByUuid(userId, elementUuid)

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}

/**
 * ensure that the user is authorized to access the element with the given id or throw an error
 * @param userId
 * @param elementId
 */
export const ensureUserAuthorizationToElementComponent = async (userId: number, elementComponentId: number) => {
  const isAuthorized = await legacyDbDalInstance.isUserAuthorizedToElementComponent(userId, elementComponentId)

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }
}
