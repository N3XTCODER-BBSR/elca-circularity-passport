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
"use client"

import { MenuButton } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { FC } from "react"

const ProjectVariantInfo: FC<{ projectName: string; variantName: string }> = ({ projectName, variantName }) => {
  return (
    <MenuButton>
      <div className="flex items-center gap-1.5">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{projectName}</p>
          <p className="text-sm font-normal text-bbsr-blue-600">{variantName}</p>
        </div>
        <ChevronDownIcon className="size-5 text-bbsr-blue-600" />
      </div>
    </MenuButton>
  )
}

export default ProjectVariantInfo
