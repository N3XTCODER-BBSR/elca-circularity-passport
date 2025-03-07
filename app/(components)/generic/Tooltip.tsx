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
import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { Tooltip as ReactTooltip } from "react-tooltip"

interface TooltipProps {
  id: string
  children: React.ReactNode
}

const Tooltip = ({ id, children }: TooltipProps) => {
  const prefixedId = `info-anchor-${id}`
  return (
    <>
      <span data-tooltip-id={prefixedId} className="flex items-center">
        <InformationCircleIcon className="size-4 text-blue-800" aria-hidden="true" />
      </span>
      <ReactTooltip id={prefixedId}>
        <div className="max-w-md">{children}</div>
      </ReactTooltip>
    </>
  )
}

export default Tooltip
