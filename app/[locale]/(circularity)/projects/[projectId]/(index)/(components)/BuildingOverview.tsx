import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import calculateVolumeAndMass from "lib/domain-logic/circularity/utils/calculateVolumeAndMass"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import CircularityIndexBreakdownByDin from "./CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import CircularityIndexTotalNumber from "./CircularityIndexTotalNumber"

type BuildingOverviewProps = {
  projectId: number
  projectName: string
}

// TODO: rename and move into domain logic
const calculateTotalCircularityIndex = async (
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

  let circularityIndexTimesMassSumOverAllComponentLayers = 0
  let totalMass = 0

  for (const component of circularityData) {
    for (const layer of component.layers) {
      console.log("layer", layer)

      // Await the asynchronous function
      const { mass } = await calculateVolumeAndMass(layer)
      if (mass == null) {
        continue
      }

      // Accumulate total mass
      totalMass += mass

      // Only proceed if circularityIndex is not null
      if (layer.circularityIndex == null) {
        continue
      }

      // Accumulate the product of circularityIndex and mass
      circularityIndexTimesMassSumOverAllComponentLayers += layer.circularityIndex * mass
    }
  }

  console.log("FOO circularityData", JSON.stringify(circularityData))
  console.log("FOO circularityIndexSumOverAllComponentLayers", circularityIndexTimesMassSumOverAllComponentLayers)
  console.log("FOO totalMass", totalMass)

  console.log("totalMass", totalMass)

  // Calculate the total circularity index for the project
  const totalCircularityIndexForProject = circularityIndexTimesMassSumOverAllComponentLayers / totalMass
  return totalCircularityIndexForProject
}

const BuildingOverview = async ({ projectId, projectName }: BuildingOverviewProps) => {
  const session = await ensureUserIsAuthenticated()

  const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await getProjectCircularityIndexData(projectId, session.user.id)

  const totalCircularityIndexForProject = await calculateTotalCircularityIndex(circularityData)

  return (
    <>
      {/* <div className="bg-gray-100 px-[-32px]"> */}
      {/* circularityData: {JSON.stringify(circularityData)} */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-l max-w-xl font-bold leading-none tracking-tight dark:text-white lg:text-3xl">
          Zirkularitätsindex
        </h1>
      </div>
      <h2 className="max-w-[50%]">
        {/* <span className="text-sm font-bold uppercase text-indigo-600">{translations("project")}</span>
        <br /> */}
        <span className="text-2xl">{projectName}</span>
      </h2>
      <div>
        <CircularityIndexTotalNumber circularityIndexPoints={totalCircularityIndexForProject} />
      </div>
      <div className="mx-8 my-24 h-[170px]">
        <CircularityIndexBreakdownByDin
          projectId={projectId}
          projectName={projectName}
          circularityData={circularityData}
          // circularityTotalIndexPoints={circularityIndexPoints}
          margin={{ top: 0, right: 50, bottom: 50, left: 180 }}
        />
      </div>
    </>
  )
}

export default BuildingOverview
