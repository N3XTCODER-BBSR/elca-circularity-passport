import { useFormatter, useTranslations } from "next-intl"

const TotalAndNrfRelativeValuesDisplay = ({
  totalValue,
  nrfRelativeValue,
  unit,
}: {
  totalValue: number
  nrfRelativeValue: number
  unit: string
}) => {
  const t = useTranslations("GenericComponents.TotalAndNrfRelativeValuesDisplay")
  const format = useFormatter()
  return (
    <dl className="mx-auto flex w-full max-w-md justify-between px-4 pb-6 pt-3 sm:px-3">
      <div className="flex w-1/2 flex-col">
        <dt className="text-sm font-semibold leading-6 text-gray-400">{t("areaRelated")}</dt>
        <dd className="mt-1 text-sm">
          {format.number(nrfRelativeValue, { maximumFractionDigits: 2 })} {unit}/m2 NRF
        </dd>
      </div>
      <div className="flex w-1/2 flex-col">
        <dt className="text-sm font-semibold leading-6 text-gray-400">{t("total")}</dt>
        <dd className="mt-1 text-sm">
          {format.number(totalValue, { maximumFractionDigits: 2 })} {unit}
        </dd>
      </div>
    </dl>
  )
}

export default TotalAndNrfRelativeValuesDisplay
