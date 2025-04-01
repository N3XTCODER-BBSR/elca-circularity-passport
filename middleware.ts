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
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { NextRequest } from "next/server"

const intlMiddleware = createMiddleware(routing)

const middleware = (request: NextRequest) => {
  const response = intlMiddleware(request)

  const requestId = crypto.randomUUID()

  response.headers.set("X-Request-ID", requestId)

  return response
}

export const config = {
  /*
//      * Match all request paths except for the ones starting with:
//      * public assets/api routes/_next
//      */
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
}

export default middleware
