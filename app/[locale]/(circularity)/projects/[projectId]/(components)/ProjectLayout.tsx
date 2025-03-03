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
import "styles/global.css"
import { getTranslations } from "next-intl/server"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import NavBar from "./NavBar"

const ProjectLayout = async ({
  children,
  projectId,
  variantId,
  showAvatar,
  backButtonTo,
  showMenu,
  showProjectAndVariantInfo,
}: {
  children: React.ReactNode
  projectId: number
  variantId?: number
  showAvatar?: boolean
  backButtonTo?: string
  showMenu?: boolean
  showProjectAndVariantInfo?: boolean
}) => {
  const t = await getTranslations("Grp.Web.NavBar")

  return await withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const projectData = await legacyDbDalInstance.getProjectDataWithVariants(projectId)
    const variantName =
      projectData?.project_variants_project_variants_project_idToprojects.find((v) => v.id === variantId)?.name || ""

    if (!projectData) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    const navLinks = [
      { id: "overview", name: t("overview"), href: `/projects/${projectData.id}/variants/${variantId}` },
      { id: "catalog", name: t("catalog"), href: `/projects/${projectData.id}/variants/${variantId}/catalog` },
      {
        id: "catalog",
        name: t("buildingPassport"),
        href: `/projects/${projectData.id}/variants/${variantId}/passports`,
      },
    ]

    return (
      <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
        <NavBar
          projectInfo={
            showProjectAndVariantInfo
              ? {
                  projectName: projectData.name,
                  variantName: variantName,
                  projectId: projectData.id,
                }
              : undefined
          }
          navLinks={showMenu ? navLinks : undefined}
          showAvatar={showAvatar}
          backButtonTo={backButtonTo}
        />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8">{children}</div>
        </section>
      </div>
    )
  })
}

export default ProjectLayout
