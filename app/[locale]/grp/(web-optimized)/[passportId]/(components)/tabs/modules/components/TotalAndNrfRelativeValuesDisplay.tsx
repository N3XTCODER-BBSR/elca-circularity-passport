const TotalAndNrfRelativeValuesDisplay = ({
  totalValue,
  nrfRelativeValue,
  unit,
}: {
  totalValue: number
  nrfRelativeValue: number
  unit: string
}) => (
  <dl className="mx-auto flex w-full max-w-md justify-between px-4 pb-6 pt-3 sm:px-3">
    <div className="flex w-1/2 flex-col">
      <dt className="text-sm font-semibold leading-6 text-gray-400">Flächenbezogen</dt>
      <dd className="mt-1 text-sm">
        {nrfRelativeValue.toFixed(2)} {unit}/m2 NRF
      </dd>
    </div>
    <div className="flex w-1/2 flex-col">
      <dt className="text-sm font-semibold leading-6 text-gray-400">Gesamt</dt>
      <dd className="mt-1 text-sm">
        {totalValue.toFixed(2)} {unit}
      </dd>
    </div>
  </dl>
)

export default TotalAndNrfRelativeValuesDisplay
