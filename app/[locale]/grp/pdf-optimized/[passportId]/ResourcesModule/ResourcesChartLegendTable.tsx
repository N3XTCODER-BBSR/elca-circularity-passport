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
  isPdf: boolean
}) => {
  return (
    <div className={`overflow-x-auto ${isPdf ? "text-[6pt]" : "text-[1rem]"}`}>
      <table className="min-w-full">
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap border-b border-gray-300 py-[1mm]">
                <div className="flex items-center">
                  <div
                    className={`mr-2 ${isPdf ? "size-[3mm]" : "size-[2rem]"}`}
                    style={{ backgroundColor: item.color }}
                  >
                    {" "}
                    {item.pattern === "dots" && <DottedBackground />}
                  </div>
                  <span className="text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap border-b border-gray-300 px-[3mm] py-[1mm] text-gray-900">
                {item.value.toFixed(2)} {unit}
              </td>
              <td className="whitespace-nowrap border-b  border-gray-300 px-[3mm] py-[1mm] font-bold text-gray-900">
                {item.percentage != null && `${item.percentage.toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResourcesChartLegendTable
