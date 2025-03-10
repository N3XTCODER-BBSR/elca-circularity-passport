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
// import ResourcesRmiPieChart from "app/[locale]/grp/(components)/domain-specific/modules/passport-overview/resources/ResourcesRmiPieChart"
// import { Box } from "app/[locale]/grp/(components)/generic/layout-elements"
// import {
//   ModuleSectionContainer,
//   ModuleSectionMain,
//   ModuleSectionTitle,
//   TextXSLeading4,
// } from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
// import { rmiColorsMapper } from "constants/styleConstants"
// import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
// import { aggregateRmiData } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"
// import ResourcesChartLegendTable from "./ResourcesChartLegendTable"

// type RmiSectionProps = {
//   dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
//   nrf: number
//   className?: string // Add className as an optional prop
// }

// const RmiSection = ({ dinEnrichedBuildingComponents, nrf }: RmiSectionProps) => {
//   const rmiTranslations = useTranslations("Grp.Pdf.sections.overview.module2Resources.rmi")

//   const aggregatedDataRmiRenewable = aggregateRmiData(
//     dinEnrichedBuildingComponents,
//     // TODO: extract these to a constant into domain-logic
//     "renewable",
//     nrf
//   )

//   const aggregatedDataRmiNonRenewable = aggregateRmiData(
//     dinEnrichedBuildingComponents,
//     // TODO: extract these to a constant into domain-logic
//     "nonRenewable",
//     nrf
//   )

//   const aggregatedDataRmi = aggregateRmiData(
//     dinEnrichedBuildingComponents,
//     // TODO: extract these to a constant into domain-logic (and just merge the two arrays already defined on top for this one here)
//     "all",
//     nrf
//   )

//   const legendTableData = aggregatedDataRmi.aggregatedByByResourceTypeWithPercentage.map((data) => ({
//     color: rmiColorsMapper(data.resourceTypeName),
//     name: rmiTranslations(`names.${data.resourceTypeName}`),
//     value: data.aggregatedValue,
//     percentage: data.percentageValue,
//   }))

//   return (
//     <ModuleSectionContainer>
//       <ModuleSectionTitle title="Rohstoff-einsatz (RMI)" />
//       <ModuleSectionMain height={68}>
//         <Box isCol>
//           <Box>
//             <Box height={24}>
//               <ResourcesRmiPieChart
//                 colors={rmiColorsMapper}
//                 data={aggregatedDataRmi.aggregatedByByResourceTypeWithPercentage}
//                 isPdf={true}
//               />
//             </Box>
//             <Box>
//               <div className="m-[4pt] text-[5.76]">
//                 <div className="mb-[4pt]">
//                   <TextXSLeading4 light>Flachenbezogen</TextXSLeading4>
//                   <br />
//                   <TextXSLeading4 semiBold>
//                     {aggregatedDataRmi.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
//                   </TextXSLeading4>
//                 </div>
//                 <div>
//                   <TextXSLeading4 light>Gesamt</TextXSLeading4>
//                   <br />
//                   <TextXSLeading4>{aggregatedDataRmi.aggregatedDataTotal} t</TextXSLeading4>
//                 </div>
//               </div>
//             </Box>
//           </Box>
//           <Box>
//             <ResourcesChartLegendTable data={legendTableData} unit="t" />
//           </Box>
//           <Box>
//             <table className="mt-[2mm] min-w-full overflow-x-auto bg-gray-50 text-[6pt]">
//               <tbody>
//                 <tr>
//                   <td className="whitespace-nowrap py-[1mm]">
//                     <div className="flex items-center">
//                       <span className="font-bold text-gray-900">Erneuerbar</span>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
//                     {aggregatedDataRmiRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
//                   </td>
//                   <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
//                     {aggregatedDataRmiRenewable.aggregatedDataTotal.toFixed(2)} t
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="whitespace-nowrap py-[1mm]">
//                     <div className="flex items-center">
//                       <span className="font-bold text-gray-900">Nicht erneuerbar</span>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
//                     {aggregatedDataRmiNonRenewable.aggregatedDataTotalPerNrf2m.toFixed(2)} t / m2 NRF
//                   </td>
//                   <td className="whitespace-nowrap px-[3mm] py-[1mm] text-gray-900">
//                     {aggregatedDataRmiNonRenewable.aggregatedDataTotal.toFixed(2)} t
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </Box>
//         </Box>
//       </ModuleSectionMain>
//     </ModuleSectionContainer>
//   )
// }

// export default RmiSection
