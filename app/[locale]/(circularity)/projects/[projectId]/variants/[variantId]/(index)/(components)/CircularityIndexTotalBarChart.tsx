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
import { ResponsiveBar } from "@nivo/bar"
import { useFormatter } from "next-intl"
import { MetricType } from "lib/domain-logic/circularity/misc/domain-types"
import { circularityMetricBarChartColorMapping } from "lib/domain-logic/shared/styleConstants"

const CircularityIndexTotalBarChart = ({
  circularityTotalIndexPoints,
  metricType,
  margin,
}: {
  circularityTotalIndexPoints: number
  margin: { top: number; right: number; bottom: number; left: number }
  metricType: MetricType
}) => {
  const format = useFormatter()

  return (
    <>
      <ResponsiveBar
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: "0.8rem",
              },
            },
          },
        }}
        data={[{ datum: circularityTotalIndexPoints, identifier: "Gesamt" }]}
        indexBy="identifier"
        margin={margin}
        keys={["datum"]}
        colors={(datum) => circularityMetricBarChartColorMapping(datum.data.datum, metricType)}
        padding={0.2}
        groupMode="grouped"
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        minValue={-60}
        maxValue={140}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
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
        totalsOffset={9}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        role="application"
      />
    </>
  )
}

export default CircularityIndexTotalBarChart
