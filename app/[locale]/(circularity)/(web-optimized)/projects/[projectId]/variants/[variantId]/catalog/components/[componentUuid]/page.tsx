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
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToElementByUuid } from "lib/auth/ensureAuthorized"
import {
  getAvailableTBaustoffProducts,
  getComponentData,
} from "lib/domain-logic/circularity/components/getComponentsData"

import { ComponentPageClientComponent } from "./(components)/ComponentClientPageComponent"

const Page = async ({
  params,
}: {
  params: { projectId: string; variantId: string; componentUuid: string; locale: string }
}) => {
  return withServerComponentErrorHandling(async () => {
    const { componentUuid } = params
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    // Ensure the user is authenticated
    const session = await ensureUserIsAuthenticated()

    // Ensure the user has access to the element
    await ensureUserAuthorizationToElementByUuid(Number(session.user.id), componentUuid)

    const componentData = await getComponentData(componentUuid, variantId, projectId)

    if (componentData == null) {
      return notFound()
    }

    const availableTBaustoffProducts = await getAvailableTBaustoffProducts()
    const availableTBaustoffProductIdAndNames = availableTBaustoffProducts.map((el) => ({
      id: `${el.id}`,
      value: el.name,
      processCategory: el.processCategoryNumber ? { number: el.processCategoryNumber, name: "" } : null,
    }))

    return (
      <ComponentPageClientComponent
        initialComponentData={componentData}
        availableTBaustoffProductIdAndNames={availableTBaustoffProductIdAndNames}
        projectId={projectId}
        variantId={variantId}
        componentUuid={componentUuid}
      />
    )
  })
}

export default Page
