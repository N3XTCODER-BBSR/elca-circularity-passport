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
"use client"

import { ResponsiveBar } from "@nivo/bar"

export type MaterialsBarChartDatum = {
  groupName: string
  groupId: string
  aggregatedMass: number
  aggregatedMassPercentage: number
  identifier: string
}

type MaterialsBarChartProps = {
  data: MaterialsBarChartDatum[]
  labelFormatter?: (data: MaterialsBarChartDatum) => string
  isPdf?: boolean
}

const replaceWhiteSpaceWithLineBreak = (label: string) => label?.replace(/\s+/g, "\n")

const MaterialsBarChart = ({ data, labelFormatter, isPdf = false }: MaterialsBarChartProps) => {
  const pdfMargins = { top: 0, right: 20, bottom: 20, left: 100 }
  const webMargins = { top: 0, right: 150, bottom: 50, left: 300 }

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: isPdf ? "5pt" : "10pt",
              fontWeight: "light",
            },
          },
        },
      }}
      totalsOffset={isPdf ? 9 : 0}
      animate={!isPdf}
      enableGridX={false}
      enableGridY={false}
      keys={["aggregatedMassPercentage"]}
      indexBy={"identifier"}
      isInteractive={!isPdf}
      margin={isPdf ? pdfMargins : webMargins}
      padding={isPdf ? 0.4 : 0.2}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "category10" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      minValue={0}
      maxValue="auto"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: isPdf ? -6 : 5,
        format: (value) => `${value} %`,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
        format: replaceWhiteSpaceWithLineBreak,
      }}
      tooltip={({ data }) => (
        <div
          style={{
            padding: "5px 10px",
            background: "white",
            border: "1px solid #ccc",
          }}
        >
          <strong>{data.identifier}</strong>
          <br />
          {labelFormatter != null ? labelFormatter(data) : null}
        </div>
      )}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={"white"}
      role="application"
    />
  )
}

export default MaterialsBarChart
