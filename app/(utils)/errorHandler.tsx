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
import { notFound } from "next/navigation"
import { ZodError } from "zod"
import UnauthenticatedRedirect from "app/[locale]/(circularity)/(components)/UnauthenticatedRedirect"
import { ActionResponse } from "lib/domain-logic/shared/basic-types"
import { getRequestId } from "./getRequestId"
import { DatabaseError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../lib/errors"
import Unauthorized from "../[locale]/(circularity)/(components)/Unauthorized"

export const withServerComponentErrorHandling = async (fn: () => Promise<React.ReactNode>) => {
  try {
    return await fn()
  } catch (error) {
    console.error(`Error in server component (requestId: ${getRequestId()})`, error)

    if (error instanceof UnauthorizedError) {
      return <Unauthorized />
    }

    if (error instanceof UnauthenticatedError) {
      return <UnauthenticatedRedirect />
    }

    if (error instanceof NotFoundError) {
      return notFound()
    }

    // will be handled as 500 by client side error boundary (error.tsx)
    throw error
  }
}

export const withServerActionErrorHandling = async <TData = unknown,>(
  fn: () => Promise<TData>
): Promise<ActionResponse<TData>> => {
  try {
    const result = await fn()
    return { success: true, data: result }
  } catch (error: unknown) {
    console.error(`Error in server action (requestId: ${getRequestId()})`, error)
    if (error instanceof UnauthorizedError) {
      return { success: false, errorI18nKey: "errors.unauthorized", errorLevel: "error" }
    }
    if (error instanceof DatabaseError) {
      return { success: false, errorI18nKey: "errors.db", errorLevel: "error" }
    }
    if (error instanceof ZodError) {
      return { success: false, errorI18nKey: "errors.validation", errorLevel: "error", details: error.issues }
    }

    return { success: false, errorI18nKey: "errors.unknown" }
  }
}
