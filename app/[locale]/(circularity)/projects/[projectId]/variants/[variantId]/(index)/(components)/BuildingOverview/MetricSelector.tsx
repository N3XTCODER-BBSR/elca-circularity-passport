import { useTranslations } from "next-intl"
import React from "react"
import { twMerge } from "tailwind-merge"
import { MetricType } from "lib/domain-logic/shared/basic-types"

interface MetricSelectorProps {
  selectedMetricType: MetricType
  onMetricTypeChange: (metricType: MetricType) => void
}

const MetricSelector: React.FC<MetricSelectorProps> = ({ selectedMetricType, onMetricTypeChange }) => {
  const t = useTranslations("CircularityTool.sections.overview.metricTypeSelectorOptions")

  // Define the metric options with their display names and values
  const metricOptions: { value: MetricType; label: string }[] = [
    { value: "circularityIndex", label: t("circularityIndex", { fallback: "Circularity Index" }) },
    { value: "eolBuiltPoints", label: t("eolBuiltPoints", { fallback: "End of Life (Built) Points" }) },
    { value: "dismantlingPoints", label: t("dismantlingPoints", { fallback: "Dismantling Points" }) },
  ]

  return (
    <div className="mb-6 flex justify-start">
      <nav aria-label="Metric Selector" className="flex max-w-md flex-1 flex-col">
        <ul className="space-y-1">
          {metricOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => onMetricTypeChange(option.value)}
                type="button"
                className={twMerge(
                  selectedMetricType === option.value
                    ? "bg-gray-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                  "group flex w-full gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
                )}
              >
                <div className="flex w-full items-center gap-x-3">
                  <div className="text-left">{option.label}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default MetricSelector
