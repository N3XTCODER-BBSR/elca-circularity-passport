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
import { getTranslations } from "next-intl/server"
import ListItemLink from "app/(components)/generic/ListItemLink"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/auth/ensureAuthorized"
import { getProjectDataWithVariants } from "lib/domain-logic/circularity/projects/getProjectDataWithVariants"
import ProjectLayout from "../../(components)/ProjectLayout"

const Page = async ({ params }: { params: { projectId: string } }) => {
  return withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()

    const projectId = Number(params.projectId)
    const userId = Number(session.user.id)

    await ensureUserAuthorizationToProject(userId, projectId)

    const t = await getTranslations("Grp.Web.sections.variants")

    const projectData = await getProjectDataWithVariants(projectId)
    if (!projectData) {
      notFound()
    }

    const variants = projectData?.project_variants_project_variants_project_idToprojects || []

    const displayVariants = variants.map((variant) => {
      const description = `${t("createdOn")} ${variant.created.toLocaleDateString()}`

      return (
        <ListItemLink
          description={description}
          linkTo={`variants/${variant.id}`}
          key={variant.id}
          title={variant.name}
        />
      )
    })

    return (
      <div>
        <h4 className="mb-1 text-sm font-semibold uppercase text-bbsr-blue-600">{t("project")}:</h4>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">{projectData.name || "unnamed"}</h1>
        {displayVariants}
      </div>
    )
  })
}

const PageWithLayout = async ({ params }: { params: { projectId: string } }) => {
  const projectId = Number(params.projectId)
  const page = await Page({ params })

  const projectLayout = await ProjectLayout({
    children: page,
    projectId,
    showAvatar: true,
    backButtonTo: "/projects",
  })

  return <>{projectLayout}</>
}

export default PageWithLayout
