import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import CircularityIndexTotal from "./CircularityIndexTotal"
import calculateVolumeAndMass from "lib/domain-logic/circularity/utils/calculateVolumeAndMass"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

type BuildingOverviewProps = {
  projectId: number
  projectName: string
}

// TODO: rename and move into domain logic
const calculateTotalCircularityIndex = (
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
) => {
  // TODO: ensure to exlude
  // 1. components which don't fall into our selection of DIN categories
  // 2. explicitly excluded components

  // Calculate the total circularity index for the project by iterating over
  // all entries in circulartiyData
  //   and within each entry, summing the
  //     circularity index of each component
  //     calculate the mass of each component
  // At the end, divide the total circularity index by the total mass of the project
  // to get the total circularity index of the project

  const totalCircularityIndex = circularityData.reduce((total, component) => {
    return (
      total +
      component.layers.reduce((totalLayer, layer) => {
        return totalLayer + (layer.circularityIndex || 0)
      }, 0)
    )
  }, 0)

  const totalMass = circularityData.reduce((total, component) => {
    return (
      total +
      component.layers.reduce((totalLayer, layer) => {
        console.log("layer", layer)
        const { mass } = calculateVolumeAndMass(layer)
        return totalLayer + (mass || 0)
      }, 0)
    )
  }, 0)

  console.log("totalMass", totalMass)

  const totalCircularityIndexForProject = totalCircularityIndex / totalMass
  return totalCircularityIndexForProject
}

const BuildingOverview = async ({ projectId, projectName }: BuildingOverviewProps) => {
  const session = await ensureUserIsAuthenticated()

  const circularityData = await getProjectCircularityIndexData(projectId, session.user.id)

  const totalCircularityIndexForProject = calculateTotalCircularityIndex(circularityData)

  return (
    <>
      {/* circularityData: {JSON.stringify(circularityData)} */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-l max-w-xl font-bold leading-none tracking-tight dark:text-white lg:text-3xl">
          Zirkularitätsindex
        </h1>
      </div>
      <div>
        <CircularityIndexTotal circularityIndexPoints={totalCircularityIndexForProject} />
      </div>
      <h2 className="max-w-[50%]">
        {/* <span className="text-sm font-bold uppercase text-indigo-600">{translations("project")}</span>
        <br /> */}
        <span className="text-2xl">{projectName}</span>
      </h2>
      {/* <div className="mt-6 border-gray-100">
        <BuildingBaseInformation passportData={dinEnrichedPassportData} className="mt-16" />
        <Materials dinEnrichedPassportData={dinEnrichedPassportData} className="my-24 flex flex-col" />
        <Resources
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          nrf={dinEnrichedPassportData.buildingBaseData.nrf}
          className="mt-16"
        />
        <Circularity
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          className="mt-16"
        />
      </div> */}
    </>
    // <div>
    //   {/* <h1 className="mx-[5mm] pl-[2mm] pt-[1mm] leading-none tracking-tight">
    //     <div className="font-normal">Zirkularitätsindex</div>
    //     <div className="mt-[1.5mm] font-bold">{projectName}</div>
    //   </h1>
    //   <p>Project ID: {projectId}</p> */}
    // </div>
  )
}

export default BuildingOverview
