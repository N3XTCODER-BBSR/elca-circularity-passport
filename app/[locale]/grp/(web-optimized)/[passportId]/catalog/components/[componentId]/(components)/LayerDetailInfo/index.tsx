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

import { useState } from "react"
import { Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import CircularityInfo from "./CircularityInfo"
import MaterialInfo from "./MaterialInfo"
// import ResourceInfo from "./ResourceInfo"
import TabBar from "./TabBar"

type LayerDetailInfoProps = {
  materialData: Material
}
const LayerDetailInfo = ({ materialData: materialData }: LayerDetailInfoProps) => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0)

  return (
    <div className="mt-8">
      <TabBar currentTabIdx={currentTabIdx} setCurrentTabIdx={setCurrentTabIdx} />
      {currentTabIdx === 0 && <MaterialInfo material={materialData} />}
      {/* {currentTabIdx === 1 && <ResourceInfo resources={materialData.ressources} />} */}
      {currentTabIdx === 1 && <i>Under Construction: This module will be available in future releases</i>}
      {currentTabIdx === 2 && <CircularityInfo circularity={materialData.circularity} />}
    </div>
  )
}

export default LayerDetailInfo
