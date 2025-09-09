"use client"

import { useTranslations } from "next-intl"
import {
  calculateBnbCircularityPoints,
  calculateBnbDismantlingPoints,
} from "lib/domain-logic/circularity/utils/calculateBnbPoints"
import { useCircularityFormatter } from "lib/presentation-logic/circularity/formatCircularityMetric"

interface ResultsProps {
  dismantlingPoints: number
  circularityPoints: number
  weightedDismantlingPoints: number
  weightedCircularityPoints: number
  locale: string
}

export function Results({ weightedDismantlingPoints, weightedCircularityPoints }: ResultsProps) {
  const t = useTranslations("CircularityTool.sections.pdfExport.results")
  const { formatCircularityMetric } = useCircularityFormatter()

  const erreichteRuckbauPunkte = calculateBnbDismantlingPoints(weightedDismantlingPoints)
  const erreichteZirkularitaetPunkte = calculateBnbCircularityPoints(weightedCircularityPoints)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-4 text-sm">
        <div className="font-semibold">{t("achievedDismantlingPoints")}</div>
        <div>
          {formatCircularityMetric(erreichteRuckbauPunkte)} {t("points")}
        </div>

        <div className="font-semibold">{t("achievedCircularityPoints")}</div>
        <div>
          {formatCircularityMetric(erreichteZirkularitaetPunkte)} {t("points")}
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
