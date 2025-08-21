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
import { Metadata } from "next/types"
import { getTranslations } from "next-intl/server"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import { ensureVariantAccessible } from "app/[locale]/(circularity)/(utils)/ensureAccessible"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/auth/ensureAuthorized"
import { getProjectCircularityData } from "lib/domain-logic/circularity/misc/getProjectCircularityData"
import { getAllProcessCategories } from "lib/domain-logic/circularity/process/getProcessCategories"
import { getProjectById } from "lib/domain-logic/circularity/projects/getProjectById"
import BuildingOverview from "./(components)/BuildingOverview/BuildingOverview"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CircularityTool.pages")

  return {
    title: t("overview"),
  }
}

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)
    const t = await getTranslations("CircularityTool.sections.overview")

    await ensureUserAuthorizationToProject(userId, projectId)

    await ensureVariantAccessible(variantId, projectId)

    const [projectInfo, circularityData, processCategories] = await Promise.all([
      getProjectById(projectId),
      getProjectCircularityData(variantId, projectId),
      getAllProcessCategories(),
    ])

    if (!projectInfo) {
      return <div>{t("projectNotFound")}</div>
    }

    return (
      <div className="w-full bg-gray-100">
        <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
          <section className="dark:bg-gray-900">
            <div className="py-8">
              <BuildingOverview
                projectName={projectInfo.name}
                projectId={projectInfo.id}
                variantId={variantId}
                initialCircularityData={circularityData}
                processCategories={processCategories}
              />
            </div>
          </section>
        </div>
      </div>
    )
  })
}

export default Page
