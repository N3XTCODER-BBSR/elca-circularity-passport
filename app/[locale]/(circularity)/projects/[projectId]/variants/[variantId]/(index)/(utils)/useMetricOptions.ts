import { useTranslations } from "next-intl"
import { MetricType } from "lib/domain-logic/circularity/misc/domain-types"

/**
 * Custom hook that provides metric options with translated labels
 *
 * Returns an array of metric options that can be used for selection UI components.
 * Each option contains a value (MetricType) and a translated label.
 *
 * @returns {Array<{value: MetricType, label: string}>} Array of metric options with values and translated labels
 */
export const useMetricOptions = (): { value: MetricType; label: string }[] => {
  const t = useTranslations("CircularityTool.sections.overview.metricTypeSelectorOptions")
  return [
    { value: "circularityIndex", label: t("circularityIndex", { fallback: "Circularity Index" }) },
    { value: "eolBuiltPoints", label: t("eolBuiltPoints", { fallback: "End of Life (Built) Points" }) },
    { value: "dismantlingPoints", label: t("dismantlingPoints", { fallback: "Dismantling Points" }) },
  ]
}
