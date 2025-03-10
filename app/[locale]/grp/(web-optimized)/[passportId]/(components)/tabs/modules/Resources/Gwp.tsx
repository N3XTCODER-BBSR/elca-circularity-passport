/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
// "use client"

// import { useTranslations } from "next-intl"
// import ResourcesPenrtGwpDonutChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPenrtGwpDonutChart"
// import ResourcesChartLegendTable, {
//   LegendTableDataItem,
// } from "app/[locale]/grp/pdf-optimized/[passportId]/ResourcesModule/ResourcesChartLegendTable"
// import { lifeCycleSubPhasesColorsMapper } from "constants/styleConstants"
// import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
// import { aggregateGwpData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
// import DummyAccordion from "../../../DummyAccordion"
// import TotalAndNrfRelativeValuesDisplay from "../components/TotalAndNrfRelativeValuesDisplay"

// type GWPComponentProps = {
//   dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
//   nrf: number
// }

// const Gwp: React.FC<GWPComponentProps> = ({ dinEnrichedBuildingComponents, nrf }) => {
//   const t = useTranslations("Grp.Web.sections.overview.module2Resources")
//   const unitsTranslations = useTranslations("Units")

//   const { aggregatedData, aggregatedDataTotal, aggregatedDataTotalPerNrf, aggregatedDataGrayTotal } = aggregateGwpData(
//     dinEnrichedBuildingComponents,
//     nrf
//   )

//   const gwpLegendTableData: LegendTableDataItem[] = aggregatedData.map((data) => ({
//     color: lifeCycleSubPhasesColorsMapper(data.lifecycleSubphaseId),
//     name: t(`gwpAndPenrt.lifeCycleSubPhases.${data.lifecycleSubphaseId}`),
//     value: data.aggregatedValue,
//     percentage: data.aggregatedValuePercentage,
//     pattern: data.isGray ? "dots" : undefined,
//   }))

//   gwpLegendTableData.push({
//     color: "white",
//     name: t("gwpAndPenrt.gwp.grayEmissionsTotal"),
//     value: aggregatedDataGrayTotal,
//     pattern: "dots",
//   })

//   const faqContent = [
//     {
//       Q: t("gwpAndPenrt.gwp.faq.1.Q"),
//       A: t("gwpAndPenrt.gwp.faq.1.A"),
//     },
//     {
//       Q: t("gwpAndPenrt.gwp.faq.2.Q"),
//       A: t("gwpAndPenrt.gwp.faq.2.A"),
//     },
//   ]
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h4 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
//         {t("gwpAndPenrt.gwp.title")}
//       </h4>
//       <div className="w-full text-center">
//         <TotalAndNrfRelativeValuesDisplay
//           totalValue={aggregatedDataTotal}
//           nrfRelativeValue={aggregatedDataTotalPerNrf}
//           unit={unitsTranslations("KgCo2Eq.short")}
//         />
//         <div className="h-96">
//           <ResourcesPenrtGwpDonutChart
//             colors={lifeCycleSubPhasesColorsMapper}
//             data={aggregatedData}
//             overlayLabelTranslationKey="gwp.labels.overlay"
//           />
//         </div>
//         <ResourcesChartLegendTable data={gwpLegendTableData} unit={unitsTranslations("KgCo2Eq.short")} isPdf={false} />
//       </div>
//       <div className="mb-16 mt-32 w-full">
//         <DummyAccordion faqContent={faqContent} />
//       </div>
//     </div>
//   )
// }

// export default Gwp
