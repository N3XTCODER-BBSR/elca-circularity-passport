import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/server-actions/getProjectCircularityIndex"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import CircularityIndexTotalNumber from "./CircularityIndexTotalNumber"
import calculateVolumeAndMass from "lib/domain-logic/circularity/utils/calculateVolumeAndMass"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import CircularityIndexBreakdownByDin from "./CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import { useRouter } from "next/navigation"
import { Link } from "i18n/routing"

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

  const circularityIndexTimesMassSumOverAllComponentLayers = circularityData.reduce((total, component) => {
    return (
      total +
      component.layers.reduce((acc, layer) => {
        if (layer.circularityIndex == null) {
          return acc
        }
        const { mass } = calculateVolumeAndMass(layer)
        if (mass == null) {
          return acc
        }
        return acc + layer.circularityIndex * mass
      }, 0)
    )
  }, 0)

  const totalMass = circularityData.reduce((total, component) => {
    return (
      total +
      component.layers.reduce((acc, layer) => {
        console.log("layer", layer)
        const { mass } = calculateVolumeAndMass(layer)
        if (mass == null) {
          return acc
        }
        // TODO: better handle null values by removing / skipping them completely
        return acc + mass
      }, 0)
    )
  }, 0)

  console.log("FOO circularityData", JSON.stringify(circularityData))
  console.log("FOO circularityIndexSumOverAllComponentLayers", circularityIndexTimesMassSumOverAllComponentLayers)
  console.log("FOO totalMass", totalMass)

  console.log("totalMass", totalMass)

  const totalCircularityIndexForProject = circularityIndexTimesMassSumOverAllComponentLayers / totalMass
  return totalCircularityIndexForProject
}

const BuildingOverview = async ({ projectId, projectName }: BuildingOverviewProps) => {
  const session = await ensureUserIsAuthenticated()

  const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await getProjectCircularityIndexData(projectId, session.user.id)

  const totalCircularityIndexForProject = calculateTotalCircularityIndex(circularityData)

  const isCircularityIndexMissingForAnyProduct = circularityData.some((component) =>
    component.layers.some((layer) => layer.circularityIndex == null)
  )

  return (
    <>
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
      {isCircularityIndexMissingForAnyProduct ? (
        <div className="mx-64 flex-col items-center text-center">
          <h3 className="mx-2 mb-8 text-2xl font-semibold">Data Needed to Display Circularity Index</h3>
          <div>
            To view the circularity index, please ensure that each building product is either complete or excluded from
            calculation. Once this information is updated, your data will be visualized here.
          </div>
          <Link
            href={"/projects/${projectId}/catalog/components/"}
            className="mt-8 inline-block rounded-md bg-blue-600 px-2 py-1 text-white"
          >
            Update Building Data
          </Link>
        </div>
      ) : (
        <>
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
      )}
    </>
  )
}

export default BuildingOverview
