import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Link } from "i18n/routing"
import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/misc/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { calculateTotalCircularityIndexForProject } from "lib/domain-logic/circularity/utils/calculateTotalCircularityIndex"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import CircularityIndexBreakdownByDin from "./CircularityIndexBreakdownByDin/CircularityIndexBreakdownByDin"
import CircularityIndexBreakdownByMaterialType, {
  ProcessCategory,
} from "./CircularityIndexBreakdownByMaterialType/CircularityIndexBreakdownByMaterialType"
import CircularityIndexTotalNumber from "./CircularityIndexTotalNumber"

type BuildingOverviewProps = {
  projectId: number
  projectName: string
  variantId: number
}

const BuildingOverview = async ({ projectId, projectName, variantId }: BuildingOverviewProps) => {
  await ensureUserIsAuthenticated()

  const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
    await getProjectCircularityIndexData(variantId, projectId)

  const totalCircularityIndexForProject = calculateTotalCircularityIndexForProject(circularityData)

  const processCategories: ProcessCategory[] = await legacyDbDalInstance.getAllProcessCategories()

  const isCircularityIndexMissingForAnyProduct = circularityData.some((component) =>
    component.layers.some((layer) => layer.circularityIndex == null)
  )

  const catalogPath = `/projects/${projectId}/variants/${variantId}/catalog`
  const t = await getTranslations("CircularityTool.sections.overview")
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-l max-w-xl font-bold leading-none tracking-tight dark:text-white lg:text-3xl">
          {t("title")}
        </h1>
      </div>
      <h2 className="max-w-[50%]">
        <span className="text-2xl">{projectName}</span>
      </h2>
      {isCircularityIndexMissingForAnyProduct ? (
        <div className="mx-64 flex-col items-center text-center">
          <Image
            src="/missing-circularity-data-icon.svg"
            width={24}
            height={24}
            className="mb-6 inline-block size-28"
            alt={"missing-circularity-data"}
          />
          <h3 className="mx-2 mb-8 text-2xl font-semibold">{t("emptyState.title")}</h3>
          <div>{t("emptyState.body")}</div>
          <Link href={catalogPath} className="mt-8 inline-block rounded-md bg-blue-600 px-2 py-1 text-white">
            {t("emptyState.cta")}
          </Link>
        </div>
      ) : (
        <>
          <div>
            <CircularityIndexTotalNumber circularityIndexPoints={totalCircularityIndexForProject} />
          </div>
          <CircularityIndexBreakdownByDin
            circularityData={circularityData}
            projectName={projectName}
            catalogPath={catalogPath}
          />
          <CircularityIndexBreakdownByMaterialType
            catalogPath={catalogPath}
            projectName={projectName}
            processCategories={processCategories}
            circularityData={circularityData}
            margin={{ top: 0, right: 50, bottom: 50, left: 180 }}
          />
        </>
      )}
    </>
  )
}

export default BuildingOverview
