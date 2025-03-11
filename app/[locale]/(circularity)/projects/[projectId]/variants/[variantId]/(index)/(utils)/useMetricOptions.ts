import { useTranslations } from "next-intl"
import { MetricType } from "lib/domain-logic/shared/basic-types"

export const useMetricOptions = (): { value: MetricType; label: string }[] => {
  const t = useTranslations("CircularityTool.sections.overview.metricTypeSelectorOptions")
  return [
    { value: "circularityIndex", label: t("circularityIndex", { fallback: "Circularity Index" }) },
    { value: "eolBuiltPoints", label: t("eolBuiltPoints", { fallback: "End of Life (Built) Points" }) },
    { value: "dismantlingPoints", label: t("dismantlingPoints", { fallback: "Dismantling Points" }) },
  ]
}
