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
