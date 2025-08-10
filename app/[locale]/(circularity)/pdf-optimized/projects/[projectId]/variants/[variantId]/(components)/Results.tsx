"use client"

import { useTranslations } from "next-intl"
import {
  calculateBnbDismantlingPoints,
  calculateBnbCircularityPoints,
} from "lib/domain-logic/circularity/utils/calculateBnbPoints"

interface ResultsProps {
  dismantlingPoints: number
  circularityPoints: number
  weightedDismantlingPoints: number
  weightedCircularityPoints: number
}

export function Results({
  dismantlingPoints,
  circularityPoints,
  weightedDismantlingPoints,
  weightedCircularityPoints,
}: ResultsProps) {
  const t = useTranslations("CircularityTool.sections.pdfExport.results")
  const formatNumber = (value: number, digits: number) =>
    new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits }).format(value)

  const erreichteRuckbauPunkte = calculateBnbDismantlingPoints(weightedDismantlingPoints)
  const erreichteZirkularitaetPunkte = calculateBnbCircularityPoints(weightedCircularityPoints)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-4 text-sm">
        <div className="font-semibold">{t("achievedDismantlingPoints")}</div>
        <div>
          {formatNumber(erreichteRuckbauPunkte, 0)} {t("points")}
        </div>

        <div className="font-semibold">{t("achievedCircularityPoints")}</div>
        <div>
          {formatNumber(erreichteZirkularitaetPunkte, 0)} {t("points")}
        </div>

        <div className="font-semibold">
          {t("inventoryReference")}
          {/* <span className="ml-1 text-gray-500">{t("inventoryReferenceNote")}</span> */}
        </div>
        <div className="relative">
          <div className="h-8 border-b-2 border-dashed border-gray-400">
            {/* Empty space for handwritten filename */}
          </div>
          <div className="absolute -bottom-4 right-0 text-[10px] italic text-gray-500">{t("filenamePlaceholder")}</div>
        </div>
      </div>
    </div>
  )
}
