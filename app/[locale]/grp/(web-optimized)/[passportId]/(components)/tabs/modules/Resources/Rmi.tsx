"use client"

import { useTranslations } from "next-intl"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { aggregateRmiData } from "domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"
import ResourcesRmiPieChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesRmiPieChart"
import ResourcesChartLegendTable, {
  LegendTableDataItem,
} from "app/[locale]/grp/pdf-optimized/[passportId]/ResourcesModule/ResourcesChartLegendTable"
import { rmiColorsMapper } from "constants/styleConstants"

type RMIComponentProps = {
  dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
  nrf: number
}

const RMI: React.FC<RMIComponentProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
  const t = useTranslations("Grp.Web.sections.overview.module2Resources")
  const unitsTranslations = useTranslations("Units")

  const aggregatedDataRmiRenewable = aggregateRmiData(dinEnrichedBuildingComponents, "renewable", nrf)
  const aggregatedDataRmi = aggregateRmiData(dinEnrichedBuildingComponents, "all", nrf)

  const rmiLegendTableData: LegendTableDataItem[] = aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage.map(
    (data) => ({
      color: rmiColorsMapper(data.resourceTypeName),
      name: t(`rmi.names.${data.resourceTypeName}`),
      value: data.aggregatedValue,
      percentage: data.percentageValue,
    })
  )

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
            data={aggregatedDataRmi.aggretatedByByResourceTypeWithPercentage}
            colors={rmiColorsMapper}
          />
        </div>
        <ResourcesChartLegendTable data={rmiLegendTableData} unit={unitsTranslations("Tons.short")} />
      </div>
    </div>
  )
}

export default RMI
