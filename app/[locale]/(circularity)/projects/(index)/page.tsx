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
import { getTranslations } from "next-intl/server"
import { FC } from "react"
import ListItemLink from "app/(components)/generic/ListItemLink"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import { getProjectsByOwnerId, ProjectWithVariants } from "lib/domain-logic/circularity/projects/getProjectsByOwnerId"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"

const Page = async () => {
  return withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)

    const projects = await getProjectsByOwnerId(userId)

    const t = await getTranslations("Grp.Web.sections.projects")

    if (projects.length === 0) {
      return <>No projects found</>
    }

    const projectList = await ProjectList({ projects })

    return (
      <div className="mb-4 flex flex-col">
        <h3 className="mb-8 text-2xl font-bold">{t("yourProjects")}</h3>
        {projectList}
      </div>
    )
  })
}

const ProjectList: FC<{ projects: ProjectWithVariants[] }> = async ({ projects }) => {
  const t = await getTranslations("Grp.Web.sections.projects")

  return (
    <ul>
      {projects.map((project) => {
        const description = `${t("createdOn")} ${project.created.toLocaleDateString()} • ${t("createdBy")} ${
          project.users.auth_name
        }`

        const variantsCount = project.project_variants_project_variants_project_idToprojects.length
        const badgeText = variantsCount > 0 ? `${variantsCount} ${t("variants")}` : undefined
        const linkTo = `projects/${project.id}/variants`

        return (
          <ListItemLink
            key={project.id}
            linkTo={linkTo}
            title={project.name}
            description={description}
            badgeText={badgeText}
          />
        )
      })}
    </ul>
  )
}

export default Page
