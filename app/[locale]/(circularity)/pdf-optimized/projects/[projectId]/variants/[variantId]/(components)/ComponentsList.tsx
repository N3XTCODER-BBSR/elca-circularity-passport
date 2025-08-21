"use client"

import { useTranslations } from "next-intl"
import { formatNumber, formatRoman } from "lib/presentation-logic/formatters"
import { formatUnit } from "lib/presentation-logic/circularity/formatUnit"
import { formatCircularityMetricServer } from "lib/presentation-logic/circularity/formatCircularityMetric"

interface Material {
  name: string
  mass: number
  volume: number
  unit: string
  dismantling: {
    points: number
    class: string
  }
  circularity: {
    points: number
    class: string
  }
}

interface Component {
  name: string
  uuid: string
  costGroup: string
  quantity: number
  referenceUnit: string
  materials: Material[]
}

interface ComponentsListProps {
  components: Component[]
  locale: string
}

export function ComponentsList({ components, locale }: ComponentsListProps) {
  const t = useTranslations("CircularityTool.sections.pdfExport.components")

  return (
    <div className="space-y-6">
      {components.map((component, index) => (
        <div key={index} className="print-avoid-break border border-gray-200 p-4">
          {/* Component name as header */}
          <h3 className="mb-4">{component.name}</h3>

          {/* Properties in 2-column layout */}
          <div className="mb-3 grid grid-cols-2 gap-x-12 gap-y-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-4">
              <div className="font-semibold">{t("uuid")}</div>
              <div>{component.uuid}</div>

              <div className="font-semibold">{t("costGroup")}</div>
              <div>{component.costGroup}</div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-x-4">
              <div className="font-semibold">{t("installedQuantity")}</div>
              <div>{formatNumber(component.quantity, 2)}</div>

              <div className="font-semibold">{t("referenceUnit")}</div>
              <div>{formatUnit(component.referenceUnit)}</div>
            </div>
          </div>

          {/* Materials table */}
          <div className="keep-together mt-4">
            <div className="mb-2 text-right text-sm italic text-gray-600">
              {t("dataPerUnit", { formattedUnit: formatUnit(component.referenceUnit) })}
            </div>
            <table className="w-full">
              <thead className="border-b border-gray-300 text-sm">
                <tr className="text-xs leading-tight">
                  <th className="px-2 pb-2 text-left">{t("tableHeaders.material")}</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right">{t("tableHeaders.volume")}</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right">{t("tableHeaders.weight")}</th>
                  <th className="px-2 pb-2 text-center" colSpan={2}>
                    {t("tableHeaders.dismantlingPotential")}
                  </th>
                  <th className="px-2 pb-2 text-center" colSpan={2}>
                    {t("tableHeaders.circularityPotential")}
                  </th>
                </tr>
                <tr className="text-xs leading-tight text-gray-500">
                  <th className="px-2 pb-2 text-left font-normal"></th>
                  <th className="min-w-[60px] px-2 pb-2 text-right font-normal">{t("tableHeaders.volumeUnit")}</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right font-normal">{t("tableHeaders.weightUnit")}</th>
                  <th className="min-w-[50px] px-2 pb-2 text-right font-normal">{t("tableHeaders.points")}</th>
                  <th className="min-w-[50px] px-2 pb-2 text-left font-normal">{t("tableHeaders.class")}</th>
                  <th className="min-w-[50px] px-2 pb-2 text-right font-normal">{t("tableHeaders.points")}</th>
                  <th className="min-w-[50px] px-2 pb-2 text-left font-normal">{t("tableHeaders.class")}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {component.materials.map((material, mIndex) => (
                  <tr key={mIndex} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{material.name}</td>
                    <td className="py-2 text-right">{formatNumber(material.volume, 3)}</td>
                    <td className="py-2 text-right">{formatNumber(material.mass, 1)}</td>
                    <td className="py-2 text-right">
                      {formatCircularityMetricServer(material.dismantling.points, locale)}
                    </td>
                    <td className="py-2 pl-4">{formatRoman(material.dismantling.class)}</td>
                    <td className="py-2 text-right">
                      {formatCircularityMetricServer(material.circularity.points, locale)}
                    </td>
                    <td className="py-2 pl-4">{material.circularity.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
