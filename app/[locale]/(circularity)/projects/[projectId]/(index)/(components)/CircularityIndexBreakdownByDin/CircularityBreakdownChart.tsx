// ChartAndBreadCrumpComponent.tsx
"use client"
import React, { useState } from "react"
import { ResponsiveBar } from "@nivo/bar"
import { transformCircularityDataAndDinHierachyToChartTree } from "./transformCircularityDataAndDinHierachyToChartTree"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { getWeightByProductId } from "lib/domain-logic/circularity/server-actions/getWeightByProductId"

export type ChartDataLeaf = {
  isLeaf: true
  metricValue: number
  dimensionalValue: number
  label: string
  resourceId: string
}

export type ChartDataInternalNode = {
  isLeaf: false
  metricValue: number
  dimensionalValue: number
  label: string
  children: ChartDataNode[]
}

export type ChartDataNode = ChartDataLeaf | ChartDataInternalNode

export type ChartAndBreadCrumpComponentProps = {
  rootChartDataNode: ChartDataNode
  leafClickHandler: (resourceId: string) => void
  title: string
  labelTotalDimensionalValue: string
  unitNameTotalDimensionalValue: string
}

const ChartAndBreadCrumpComponent: React.FC<ChartAndBreadCrumpComponentProps> = ({
  rootChartDataNode,
  leafClickHandler,
  title,
  labelTotalDimensionalValue,
  unitNameTotalDimensionalValue,
}) => {
  const [path, setPath] = useState<ChartDataNode[]>([rootChartDataNode])

  // TODO: consider to add proper logic checks so that this
  // exclamation mark is actually safe to use
  // e.g. by ensuring that the path is never empty
  const currentNode = path[path.length - 1]!

  const breadcrumb = path.map((node, idx) => ({
    node,
    isLast: idx === path.length - 1,
  }))

  const goUpToLevel = (level: number) => {
    setPath((prev) => prev.slice(0, level + 1))
  }

  const handleBarLabelClick = (childLabel: string) => {
    if (currentNode.isLeaf) return // No action if already a leaf

    const childNode = currentNode.children.find((c) => c.label === childLabel)
    if (!childNode) return

    if (childNode.isLeaf) {
      // Leaf: call the handler
      leafClickHandler(childNode.resourceId)
    } else {
      // Internal node: drill down
      setPath((prev) => [...prev, childNode])
    }
  }

  const chartData = !currentNode.isLeaf
    ? currentNode.children.map((child) => ({
        identifier: child.label,
        datum: child.metricValue,
      }))
    : []

  return (
    <div className="flex w-full flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title}</h2>
      <div className="mt-2">
        {`${labelTotalDimensionalValue}: `}
        {currentNode.dimensionalValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        {unitNameTotalDimensionalValue}
      </div>
      <div className="mt-4 px-8 py-4">{currentNode.label}</div>

      <div className="mb-4">
        {breadcrumb.length > 1 &&
          breadcrumb.map((b, idx) =>
            b.isLast ? (
              <span key={idx} className="text-sm text-gray-600">
                {b.node.label}
              </span>
            ) : (
              <React.Fragment key={idx}>
                <button className="text-sm text-gray-600 underline" onClick={() => goUpToLevel(idx)}>
                  {b.node.label}
                </button>
                {" > "}
              </React.Fragment>
            )
          )}
      </div>

      {!currentNode.isLeaf && (
        <div className="mx-8 mb-64 h-[200px] w-full">
          <ResponsiveBar
            data={chartData}
            keys={["datum"]}
            indexBy="identifier"
            margin={{ top: 20, right: 20, bottom: 20, left: 120 }}
            layout="horizontal"
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            colors={(datum) => mapDatumToColor(datum.data.datum)}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              renderTick: (tick) => {
                const handleClick = () => handleBarLabelClick(tick.value)
                return (
                  <g transform={`translate(${tick.x},${tick.y})`} onClick={handleClick} style={{ cursor: "pointer" }}>
                    <text x={-60} y={5} textAnchor="middle" fontSize="0.8rem" fill="#000">
                      {tick.value}
                    </text>
                  </g>
                )
              },
            }}
            animate={false}
            role="application"
          />
        </div>
      )}
    </div>
  )
}

function mapDatumToColor(value: number): string {
  // Just a generic color scale:
  if (value > 60) return "#008000"
  if (value >= 40) return "#00FF00"
  if (value >= 20) return "#FFFF00"
  return "#FF0000"
}

/** Example usage with a sample tree data **/

// Let's create a tree with 3 levels total, and 17 elements altogether.
// Structure:
// root (internal)
//   - child1 (internal) -> 5 leaf children
//   - child2 (internal) -> 4 leaf children
//   - child3 (internal) -> 4 leaf children
//
// Counting: 1(root) + 3(internals) + (5+4+4)=13 leaves = 17 nodes total.

// const sampleRoot: ChartDataInternalNode = {
//   isLeaf: false,
//   label: "Foo Test Project",
//   metricValue: 80,
//   dimensionalValue: 3000,
//   children: [
//     {
//       isLeaf: false,
//       label: "Category A",
//       metricValue: 50,
//       dimensionalValue: 1000,
//       children: [
//         {
//           isLeaf: true,
//           label: "A1",
//           metricValue: 10,
//           dimensionalValue: 200,
//           resourceId: "res-a1",
//         },
//         {
//           isLeaf: true,
//           label: "A2",
//           metricValue: 15,
//           dimensionalValue: 300,
//           resourceId: "res-a2",
//         },
//         {
//           isLeaf: true,
//           label: "A3",
//           metricValue: 5,
//           dimensionalValue: 100,
//           resourceId: "res-a3",
//         },
//         {
//           isLeaf: true,
//           label: "A4",
//           metricValue: 12,
//           dimensionalValue: 250,
//           resourceId: "res-a4",
//         },
//         {
//           isLeaf: true,
//           label: "A5",
//           metricValue: 8,
//           dimensionalValue: 150,
//           resourceId: "res-a5",
//         },
//       ],
//     },
//     {
//       isLeaf: false,
//       label: "Category B",
//       metricValue: 30,
//       dimensionalValue: 900,
//       children: [
//         {
//           isLeaf: true,
//           label: "B1",
//           metricValue: 5,
//           dimensionalValue: 200,
//           resourceId: "res-b1",
//         },
//         {
//           isLeaf: true,
//           label: "B2",
//           metricValue: 10,
//           dimensionalValue: 300,
//           resourceId: "res-b2",
//         },
//         {
//           isLeaf: true,
//           label: "B3",
//           metricValue: 8,
//           dimensionalValue: 250,
//           resourceId: "res-b3",
//         },
//         {
//           isLeaf: true,
//           label: "B4",
//           metricValue: 7,
//           dimensionalValue: 150,
//           resourceId: "res-b4",
//         },
//       ],
//     },
//     {
//       isLeaf: false,
//       label: "Category C",
//       metricValue: 40,
//       dimensionalValue: 1100,
//       children: [
//         {
//           isLeaf: true,
//           label: "C1",
//           metricValue: 15,
//           dimensionalValue: 300,
//           resourceId: "res-c1",
//         },
//         {
//           isLeaf: true,
//           label: "C2",
//           metricValue: 10,
//           dimensionalValue: 300,
//           resourceId: "res-c2",
//         },
//         {
//           isLeaf: true,
//           label: "C3",
//           metricValue: 5,
//           dimensionalValue: 200,
//           resourceId: "res-c3",
//         },
//         {
//           isLeaf: true,
//           label: "C4",
//           metricValue: 10,
//           dimensionalValue: 300,
//           resourceId: "res-c4",
//         },
//       ],
//     },
//   ],
// }

// Example leaf click handler
function exampleLeafClickHandler(resourceId: string) {
  alert(`Leaf clicked: ${resourceId}`)
}

type CircularityBreakdownChartProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  projectName: string
}
// Example usage in a page or parent component
export default async function CircularityBreakdownChart(props: CircularityBreakdownChartProps) {
  const chartData = await transformCircularityDataAndDinHierachyToChartTree(
    props.circularityData,
    getWeightByProductId,
    props.projectName
  )
  return (
    <ChartAndBreadCrumpComponent
      rootChartDataNode={chartData}
      leafClickHandler={exampleLeafClickHandler}
      title="Zirkularitätsindex DIN 276"
      labelTotalDimensionalValue="Total mass"
      unitNameTotalDimensionalValue="kg"
    />
  )
}

// "use client"

// import React from "react"
// import { useRouter } from "next/navigation"
// import CircularityIndexBarChartBreakdown from "../CircularityIndexBarChartBreakdown"
// import { useDinBreakdownData } from "./useDinBreakdownData"
// import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
// import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"

// export type ChartDatum = {
//   datum: number
//   identifier: string
//   label: string
// }

// export type BreadCrumbEntry = {
//   label: string
//   identifier: string
//   level: number
// }

// export type CircularityIndexBreakdownByDinProps = {
//   projectId: number
//   projectName: string
//   circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
//   margin: { top: number; right: number; bottom: number; left: number }
// }

// /**
//  * This component is domain-logic agnostic. It only cares about:
//  * - Displaying breadcrumbs
//  * - Displaying a chart
//  * - Handling user interactions (chart label clicks, breadcrumb navigation)
//  *
//  * The domain logic (e.g. DIN hierarchy, circularity calculations) is handled outside,
//  * in the `useDinBreakdownData` hook. This component just uses the returned data.
//  */
// const CircularityIndexBreakdownByDin = ({
//   projectId,
//   projectName,
//   circularityData,
//   margin,
// }: CircularityIndexBreakdownByDinProps) => {
//   const router = useRouter()

//   const {
//     chartData,
//     breadCrumbs,
//     totalWeight,
//     currentTitle,
//     handleChartLabelClick,
//     handleBreadCrumbClick,
//     isLeafLevel,
//     getDetailLinkForLeaf,
//   } = useDinBreakdownData({ projectId, projectName, circularityData })

//   const onChartLabelClick = (label: string) => {
//     if (isLeafLevel) {
//       const detailLink = getDetailLinkForLeaf(label)
//       if (detailLink) router.push(detailLink)
//     } else {
//       handleChartLabelClick(label)
//     }
//   }

//   return (
//     <>
//       <div className="flex flex-col items-center">
//         {/* chartData: {JSON.stringify(chartData)} */}
//         <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex DIN 276</h2>
//         <div>
//           Total mass:{" "}
//           {totalWeight.toLocaleString("de-DE", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}{" "}
//           kg
//         </div>
//         <div className="mt-4 px-8 py-4">{currentTitle}</div>
//       </div>

//       <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
//         {breadCrumbs.map((entry, idx) =>
//           idx === breadCrumbs.length - 1 ? (
//             <span key={entry.identifier} className="text-gray500 text-sm">
//               {entry.label}
//             </span>
//           ) : (
//             <React.Fragment key={entry.identifier}>
//               <button
//                 className="text-gray500 text-sm"
//                 onClick={() => handleBreadCrumbClick(entry.level, entry.identifier)}
//               >
//                 {entry.label}
//               </button>
//               {" > "}
//             </React.Fragment>
//           )
//         )}
//         <div className="mx-8 mb-64 h-[200px]">
//           <CircularityIndexBarChartBreakdown
//             data={chartData.map(({ datum, identifier }) => ({ datum, identifier }))}
//             margin={margin}
//             clickHandler={onChartLabelClick}
//           />
//         </div>
//       </div>
//     </>
//   )
// }

// export default CircularityIndexBreakdownByDin
