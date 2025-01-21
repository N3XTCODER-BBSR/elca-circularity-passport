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
