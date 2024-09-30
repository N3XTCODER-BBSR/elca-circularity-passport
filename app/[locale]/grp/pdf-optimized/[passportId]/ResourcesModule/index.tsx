"use client"
import { ModuleContainer, ModuleMain, ModuleTitle } from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import GwpSection from "./GwpSection"
import PenrtSection from "./PenrtSection"
import RmiSection from "./RmiSection"

type ResourcesProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
}

const Resources: React.FC<ResourcesProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
  return (
    <ModuleContainer>
      <ModuleTitle title="Modul 2: Ressourcen" />
      <ModuleMain>
        <RmiSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
        <GwpSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
        <PenrtSection nrf={nrf} dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} />
      </ModuleMain>
    </ModuleContainer>
  )
}
export default Resources
