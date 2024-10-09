"use client"

import { useTranslations } from "next-intl"
import ResourcesPenrtGwpDonutChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPenrtGwpDonutChart"
import ResourcesChartLegendTable, {
  LegendTableDataItem,
} from "app/[locale]/grp/pdf-optimized/[passportId]/ResourcesModule/ResourcesChartLegendTable"
import { lifeCycleSubPhasesColorsMapper } from "constants/styleConstants"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateGwpData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"
import DummyAccordion from "../../../DummyAccordion"

type GWPComponentProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
}

const Gwp: React.FC<GWPComponentProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
  const t = useTranslations("Grp.Web.sections.overview.module2Resources")
  const unitsTranslations = useTranslations("Units")

  const { aggregatedData, aggregatedDataTotal, aggregatedDataTotalPerNrf, aggregatedDataGrayTotal } = aggregateGwpData(
    dinEnrichedBuildingComponents,
    nrf
  )

  const gwpLegendTableData: LegendTableDataItem[] = aggregatedData.map((data) => ({
    color: lifeCycleSubPhasesColorsMapper(data.lifecycleSubphaseId),
    name: t(`gwpAndPenrt.lifeCycleSubPhases.${data.lifecycleSubphaseId}`),
    value: data.aggregatedValue,
    percentage: data.aggregatedValuePercentage,
    pattern: data.isGray ? "dots" : undefined,
  }))

  gwpLegendTableData.push({
    color: "white",
    name: t("gwpAndPenrt.gwp.grayEmissionsTotal"),
    value: aggregatedDataGrayTotal,
    pattern: "dots",
  })

  const faqContent = [
    {
      Q: t("gwpAndPenrt.gwp.faq.1.Q"),
      A: t("gwpAndPenrt.gwp.faq.1.A"),
    },
    {
      Q: t("gwpAndPenrt.gwp.faq.2.Q"),
      A: t("gwpAndPenrt.gwp.faq.2.A"),
    },
  ]
  return (
    <div className="flex flex-col items-center justify-center">
      <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("gwpAndPenrt.gwp.title")}
      </h4>
      <div className="w-full text-center">
        <TotalAndNrfRelativeValuesDisplay
          totalValue={aggregatedDataTotal}
          nrfRelativeValue={aggregatedDataTotalPerNrf}
          unit={unitsTranslations("KgCo2Eq.short")}
        />
        <div className="h-96">
          <ResourcesPenrtGwpDonutChart
            colors={lifeCycleSubPhasesColorsMapper}
            data={aggregatedData}
            overlayLabelTranslationKey="gwp.labels.overlay"
          />
        </div>
        <ResourcesChartLegendTable data={gwpLegendTableData} unit={unitsTranslations("KgCo2Eq.short")} isPdf={false} />
      </div>
      <div className="mb-16 mt-32 w-full">
        <DummyAccordion faqContent={faqContent} />
      </div>
    </div>
  )
}

export default Gwp
