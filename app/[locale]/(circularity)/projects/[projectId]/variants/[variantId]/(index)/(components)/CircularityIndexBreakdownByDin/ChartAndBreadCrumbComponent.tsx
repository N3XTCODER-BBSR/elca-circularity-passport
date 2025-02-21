// ChartAndBreadCrumbComponent.tsx
"use client"
import { ResponsiveBar } from "@nivo/bar"
import { useFormatter } from "next-intl"
import React, { useState } from "react"
import { circularityBarCharColorMapping } from "constants/styleConstants"

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

export type ChartAndBreadCrumbComponentProps = {
  rootChartDataNode: ChartDataNode
  leafClickHandler: (resourceId: string) => void
  title: string
  labelTotalDimensionalValue: string
  unitNameTotalDimensionalValue: string
}

function standardAxisProps() {
  return {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legendPosition: "middle" as const,
    legendOffset: 32,
    truncateTickAt: 0,
  }
}

function customAxisLeftProps(clickHandler: (label: string) => void) {
  return {
    ...standardAxisProps(),
    renderTick: (tick: any) => {
      const handleClick = () => {
        clickHandler(tick.value)
      }

      return (
        <g transform={`translate(${tick.x},${tick.y})`} onClick={handleClick} style={{ cursor: "pointer" }}>
          <text x={-60} y={5} textAnchor="middle" fontWeight={"regular"} fontSize="0.8rem" fill="#000">
            {tick.value}
          </text>
        </g>
      )
    },
  }
}

export const ChartAndBreadCrumbComponent: React.FC<ChartAndBreadCrumbComponentProps> = ({
  rootChartDataNode,
  leafClickHandler,
  title,
  labelTotalDimensionalValue,
  unitNameTotalDimensionalValue,
}) => {
  const [path, setPath] = useState<ChartDataNode[]>([rootChartDataNode])
  const format = useFormatter()

  // TODO (M): consider to add proper logic checks so that this
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
    ? currentNode.children?.map((child) => ({
        identifier: child.label,
        datum: child.metricValue,
      }))
    : []

  const margin = { top: 20, right: 50, bottom: 30, left: 180 }

  const identifiers = new Set(chartData.map((d) => d["datum"]))
  const length = identifiers.size

  return (
    <div className="mx-8 my-24 h-[370px]">
      <div className="flex flex-col items-center">
        {" "}
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title}</h2>
        <div className="mt-2">
          {`${labelTotalDimensionalValue}: `}
          {format.number(currentNode.dimensionalValue, { maximumFractionDigits: 2 })} {unitNameTotalDimensionalValue}
        </div>
        <div className="mt-4 px-8 py-4">{currentNode.label}</div>
      </div>

      <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
        {" "}
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
      <div className="mx-8 mb-64 h-[200px]">
        <div style={{ height: `${length * 2.25 + 5.5}rem` }} className="w-full">
          <ResponsiveBar
            data={chartData}
            keys={["datum"]}
            indexBy="identifier"
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: "0.8rem",
                  },
                },
              },
            }}
            margin={margin}
            colors={(datum) => circularityBarCharColorMapping(datum.data.datum)}
            padding={0.2}
            groupMode="grouped"
            layout="horizontal"
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            minValue={-60}
            maxValue={140}
            axisTop={null}
            tooltipLabel={(d) => d.data.identifier}
            tooltip={(d) => (
              <div
                style={{
                  background: "white",
                  padding: "9px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <b>{d.data.identifier}</b>:{" "}
                {format.number(d.data.datum, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
              </div>
            )}
            axisRight={null}
            axisBottom={standardAxisProps()}
            axisLeft={customAxisLeftProps(handleBarLabelClick)}
            totalsOffset={9}
            animate={false}
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
            role="application"
          />
        </div>
      </div>
    </div>
  )
}
