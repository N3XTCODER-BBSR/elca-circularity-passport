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
// import { useTranslations } from "next-intl"
// import ResourcesPenrtGwpDonutChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesPenrtGwpDonutChart"
// import { Box } from "app/[locale]/grp/(components)/generic/layout-elements"
// import {
//   ModuleSectionContainer,
//   ModuleSectionMain,
//   ModuleSectionTitle,
//   TextXSLeading4,
// } from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
// import { lifeCycleSubPhasesColorsMapper } from "constants/styleConstants"
// import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
// import { aggregatePenrtData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
// import ResourcesChartLegendTable, { LegendTableDataItem } from "./ResourcesChartLegendTable"

// type PenrtSectionProps = {
//   dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
//   nrf: number
// }

// const PenrtSection = ({ dinEnrichedBuildingComponents, nrf }: PenrtSectionProps) => {
//   const t = useTranslations("Grp.Pdf.sections.overview.module2Resources")
//   const {
//     aggregatedData: aggregatedPenrtData,
//     aggregatedDataTotal: aggregatedPenrtTotal,
//     aggregatedDataTotalPerNrf: aggregatedPenrtTotalPerNrf,
//   } = aggregatePenrtData(dinEnrichedBuildingComponents, nrf)

//   const grayEnergyTotal = aggregatedPenrtData
//     .filter((data) => data.isGray)
//     .map((el) => el.aggregatedValue)
//     .reduce((acc, val) => acc + val, 0)

//   const penrtLegendTableData: LegendTableDataItem[] = aggregatedPenrtData.map((data) => ({
//     color: lifeCycleSubPhasesColorsMapper(data.lifecycleSubphaseId),
//     name: t(`gwpAndPenrt.lifeCycleSubPhases.${data.lifecycleSubphaseId}`),
//     value: data.aggregatedValue,
//     percentage: data.aggregatedValuePercentage,
//     isGray: data.isGray,
//   }))

//   penrtLegendTableData.push({
//     color: "white",
//     name: t("gwpAndPenrt.penrt.grayEnergyTotal"),
//     value: grayEnergyTotal,
//     pattern: "dots",
//   })

//   return (
//     <ModuleSectionContainer>
//       <ModuleSectionTitle title="Graue Energie (PENRT)" />
//       <ModuleSectionMain height={68}>
//         <Box isCol>
//           <Box>
//             <Box height={24}>
//               <ResourcesPenrtGwpDonutChart
//                 colors={lifeCycleSubPhasesColorsMapper}
//                 data={aggregatedPenrtData}
//                 isPdf={true}
//               />
//             </Box>
//             <Box>
//               <div className="m-[4pt] text-[5.76]">
//                 <div className="mb-[4pt]">
//                   <TextXSLeading4 light>Flachenbezogen</TextXSLeading4>
//                   <br />
//                   <TextXSLeading4 semiBold>{aggregatedPenrtTotalPerNrf.toFixed(2)} KwH/m2 NRF</TextXSLeading4>
//                 </div>
//                 <div>
//                   <TextXSLeading4 light>Gesamt</TextXSLeading4>
//                   <br />
//                   <TextXSLeading4>{aggregatedPenrtTotal.toFixed(2)} t CO2-eq</TextXSLeading4>
//                 </div>
//               </div>
//             </Box>
//           </Box>
//           <Box>
//             <ResourcesChartLegendTable data={penrtLegendTableData} unit="KwH" />
//           </Box>
//         </Box>
//       </ModuleSectionMain>
//     </ModuleSectionContainer>
//   )
// }

// export default PenrtSection
