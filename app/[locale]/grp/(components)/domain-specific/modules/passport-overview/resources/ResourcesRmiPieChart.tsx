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

// import { ResponsivePie } from "@nivo/pie"
// import { useTranslations } from "next-intl"
// import CustomTooltip from "app/(components)/generic/CustomToolTip"
// import { MaterialResourceTypeNames } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"

// type Datum = {
//   resourceTypeName: MaterialResourceTypeNames
//   aggregatedValue: number
//   percentageValue: number
// }

// type Colors = (resourceTypeName: MaterialResourceTypeNames) => string

// type ResourcesPieChartProps = {
//   data: Array<Datum>
//   colors?: Colors
//   isPdf?: boolean
// }

// type ComputedDatum = {
//   id: string
//   label: string
//   arcLinkLabel: string
//   value: number
//   color: string
// }

// const ResourcesRmiPieChart = ({ data, colors = () => "", isPdf = false }: ResourcesPieChartProps) => {
//   const rmiTranslations = useTranslations("Grp.Web.sections.overview.module2Resources.rmi")

//   const cornerRadius = isPdf ? 0 : 3
//   const padAngle = isPdf ? 0 : 0.7
//   const margins = isPdf ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 20, right: 20, bottom: 40, left: 20 }

//   return (
//     <ResponsivePie
//       data={data.map((d) => {
//         const label = rmiTranslations("labels.overlay", {
//           aggregatedValue: d.aggregatedValue,
//           percentageValue: d.percentageValue / 100,
//         })
//         const computedDatum: ComputedDatum = {
//           id: d.resourceTypeName,
//           label,
//           arcLinkLabel: rmiTranslations(`names.${d.resourceTypeName}`),
//           value: d.aggregatedValue,
//           color: colors(d.resourceTypeName),
//         }
//         return computedDatum
//       })}
//       margin={margins}
//       innerRadius={0}
//       padAngle={padAngle}
//       cornerRadius={cornerRadius}
//       activeOuterRadiusOffset={8}
//       colors={(datum) => datum.data.color}
//       borderColor={{
//         from: "color",
//         modifiers: [["darker", 0.2]],
//       }}
//       enableArcLabels={false}
//       arcLinkLabel={(datum) => {
//         return datum.data.arcLinkLabel
//       }}
//       arcLinkLabelsSkipAngle={10}
//       arcLinkLabelsTextColor="#333333"
//       arcLinkLabelsThickness={2}
//       tooltip={(pieTooltipProps) => <CustomTooltip value={pieTooltipProps.datum.data.label} />}
//       enableArcLinkLabels={!isPdf}
//       isInteractive={!isPdf}
//       animate={!isPdf}
//     />
//   )
// }

// export default ResourcesRmiPieChart
