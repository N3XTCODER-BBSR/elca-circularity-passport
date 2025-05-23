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
import { useFormatter } from "next-intl"
import React from "react"

export type LegendTableDataItem = {
  color: string
  name: string
  value: number
  percentage?: number
  pattern?: string
}

const DottedBackground: React.FC = () => {
  const style = {
    backgroundImage: `
      radial-gradient(circle, rgba(0, 0, 0, 0.5) 1px, transparent 1px),
      radial-gradient(circle, rgba(0, 0, 0, 0.5) 1px, transparent 1px)
    `,
    backgroundSize: "10px 8px",
    backgroundPosition: "0 0, 5px 5px",
    width: "100%",
    height: "100%",
  } as React.CSSProperties

  return <div style={style}></div>
}

const ResourcesChartLegendTable = ({
  data,
  unit,
  isPdf = true,
}: {
  data: LegendTableDataItem[]
  unit: string
  isPdf?: boolean
}) => {
  const shorten = (str: string, length: number) => (str.length > length ? str.slice(0, 13) + ".." : str)
  const format = useFormatter()
  return (
    <div className={`overflow-x-auto ${isPdf ? "text-[6pt]" : "text-[1rem]"}`}>
      <table className="min-w-full">
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap border-b border-gray-300 py-[1mm]">
                <div className="flex items-center">
                  <div className={`mr-2 ${isPdf ? "size-[3mm]" : "size-8"}`} style={{ backgroundColor: item.color }}>
                    {" "}
                    {item.pattern === "dots" && <DottedBackground />}
                  </div>
                  <span className="text-gray-900">{shorten(item.name, 18)}</span>
                </div>
              </td>
              <td className="whitespace-nowrap border-b border-gray-300 px-[3mm] py-[1mm] text-gray-900">
                {`${format.number(item.value, { maximumFractionDigits: 2 })} ${unit}`}
              </td>
              <td className="whitespace-nowrap border-b  border-gray-300 px-[3mm] py-[1mm] font-bold text-gray-900">
                {item.percentage != null && `${format.number(item.percentage, { maximumFractionDigits: 2 })}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResourcesChartLegendTable
