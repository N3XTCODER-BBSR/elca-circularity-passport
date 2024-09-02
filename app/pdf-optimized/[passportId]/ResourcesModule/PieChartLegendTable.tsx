import React from "react"

type DataItem = {
  color: string
  name: string
  value: number
  percentage: number
}

const PieChartLegendTable = ({ data }: { data: DataItem[] }) => {
  return (
    <div className="overflow-x-auto text-[6pt]">
      <table className="min-w-full">
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap border-b border-gray-300 py-[1mm]">
                <div className="flex items-center">
                  <div className="mr-2 size-[3mm]" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap border-b border-gray-300 px-[3mm] py-[1mm] text-gray-900">
                {item.value.toFixed(2)} t CO2-eq
              </td>
              <td className="whitespace-nowrap border-b  border-gray-300 px-[3mm] py-[1mm] font-bold text-gray-900">
                {item.percentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PieChartLegendTable
