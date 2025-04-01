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
import { getRequestId } from "app/(utils)/getRequestId"
import { DatabaseError } from "lib/errors"
import { DbDal } from "./db"
import { LegacyDbDal } from "./legacyDb"

export const buildDalProxyInstance = <T extends LegacyDbDal | DbDal>(dal: T) => {
  let database: string

  if (dal instanceof DbDal) {
    database = "new"
  }
  if (dal instanceof LegacyDbDal) {
    database = "legacy"
  }

  return new Proxy<T>(dal, {
    get(target, propKey, receiver) {
      const originalProperty = Reflect.get(target, propKey, receiver)

      if (typeof originalProperty === "function") {
        return async (...args: unknown[]) => {
          const start = Date.now()
          const requestId = getRequestId()

          try {
            const result = await originalProperty.apply(target, args)
            const duration = Date.now() - start
            console.log(
              `[${database} DB]: Call to ${String(propKey)} succeeded in ${duration}ms (requestId: ${requestId})`
            )
            return result
          } catch (error: unknown) {
            const duration = Date.now() - start
            console.error(
              `[${database} DB]: Call to ${String(propKey)} failed in ${duration}ms (requestId: ${requestId})`
            )
            throw new DatabaseError(error)
          }
        }
      }

      return originalProperty
    },
  })
}
