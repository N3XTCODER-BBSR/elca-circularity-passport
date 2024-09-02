"use client"
import { DinEnrichedBuildingComponent } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { ModuleContainer, ModuleMain, ModuleTitle } from "app/pdf-optimized/(components)/layout-elements"
import GwpSection from "./GwpSection"
import PenrtSectionSection from "./PenrtSection"
import RmiSection from "./RmiSection"

type ResourcesProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
  className?: string // Add className as an optional prop
}

const Resources: React.FC<ResourcesProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
  return (
    <ModuleContainer>
      <ModuleTitle title="Modul 2: Ressourcen" />
      <ModuleMain>
        <RmiSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
        <GwpSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
        <PenrtSectionSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
      </ModuleMain>
    </ModuleContainer>
  )
}
export default Resources
