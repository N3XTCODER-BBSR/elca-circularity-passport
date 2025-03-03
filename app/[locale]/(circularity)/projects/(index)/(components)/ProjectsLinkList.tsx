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
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { ProjectWithUserName } from "prisma/queries/legacyDb"

type ProjectsLinkListProps = {
  projects: ProjectWithUserName[]
}

const ProjectsLinkList = ({ projects }: ProjectsLinkListProps) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {projects.map((project) => (
        <li key={project.id}>
          <a
            className="flex items-center justify-between gap-x-6 px-2 py-5 hover:bg-gray-50"
            href={`/projects/${project.id}`}
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">{project.name}</p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Created at{" "}
                  <time dateTime={project.created?.toLocaleDateString()}>{project.created?.toLocaleDateString()}</time>
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">Created by {project.users.auth_name}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <ChevronRightIcon className="size-5" aria-hidden="true" />
              <span className="sr-only">View project, {project.name}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default ProjectsLinkList
