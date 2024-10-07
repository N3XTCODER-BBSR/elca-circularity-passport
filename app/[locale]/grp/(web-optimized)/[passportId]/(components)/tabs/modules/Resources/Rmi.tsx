"use client"

import { useTranslations } from "next-intl"
import ResourcesRmiPieChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesRmiPieChart"
import ResourcesChartLegendTable, {
  LegendTableDataItem,
} from "app/[locale]/grp/pdf-optimized/[passportId]/ResourcesModule/ResourcesChartLegendTable"
import { rmiColorsMapper } from "constants/styleConstants"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateRmiData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"
import DummyAccordion from "../../../DummyAccordion"

type RMIComponentProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
}

const RMI: React.FC<RMIComponentProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
  const t = useTranslations("Grp.Web.sections.overview.module2Resources")
  const unitsTranslations = useTranslations("Units")

  const aggregatedDataRmiRenewable = aggregateRmiData(dinEnrichedBuildingComponents, "renewable", nrf)
  const aggregatedDataRmi = aggregateRmiData(dinEnrichedBuildingComponents, "all", nrf)

  const rmiLegendTableData: LegendTableDataItem[] = aggregatedDataRmi.aggregatedByByResourceTypeWithPercentage.map(
    (data) => ({
      color: rmiColorsMapper(data.resourceTypeName),
      name: t(`rmi.names.${data.resourceTypeName}`),
      value: data.aggregatedValue,
      percentage: data.percentageValue,
    })
  )

  const faqContent = [
    {
      Q: t("rmi.faq.1.Q"),
      A: t("rmi.faq.1.A"),
    },
    {
      Q: t("rmi.faq.2.Q"),
      A: t("rmi.faq.2.A"),
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("rmi.title")}
      </h4>
      <div className="w-full text-center">
        <TotalAndNrfRelativeValuesDisplay
          totalValue={aggregatedDataRmiRenewable.aggregatedDataTotal}
          nrfRelativeValue={aggregatedDataRmiRenewable.aggregatedDataTotalPerNrf2m}
          unit={unitsTranslations("Tons.short")}
        />
        <div className="h-96">
          <ResourcesRmiPieChart
            data={aggregatedDataRmi.aggregatedByByResourceTypeWithPercentage}
            colors={rmiColorsMapper}
          />
        </div>
        <ResourcesChartLegendTable data={rmiLegendTableData} unit={unitsTranslations("Tons.short")} isPdf={false} />
      </div>
      <div className="mb-16 mt-32 w-full">
        <DummyAccordion faqContent={faqContent} />
      </div>
    </div>
  )
}

export default RMI
