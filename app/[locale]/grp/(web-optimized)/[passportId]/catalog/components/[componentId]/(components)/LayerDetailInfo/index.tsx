"use client"

import { useState } from "react"
import { Layer } from "app/[locale]/grp/(utils)/data-schema/versions/v1/passportSchema"
import CircularityInfo from "./CircularityInfo"
import MaterialInfo from "./MaterialInfo"
import ResourceInfo from "./ResourceInfo"
import TabBar from "./TabBar"

type LayerDetailInfoProps = {
  layerData: Layer
}
const LayerDetailInfo = ({ layerData }: LayerDetailInfoProps) => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0)

  return (
    <div className="mt-8">
      <TabBar currentTabIdx={currentTabIdx} setCurrentTabIdx={setCurrentTabIdx} />
      {currentTabIdx === 0 && <MaterialInfo material={layerData.material} />}
      {currentTabIdx === 1 && <ResourceInfo resources={layerData.ressources} />}
      {currentTabIdx === 2 && <CircularityInfo circularity={layerData.circularity} />}
    </div>
  )
}

export default LayerDetailInfo
