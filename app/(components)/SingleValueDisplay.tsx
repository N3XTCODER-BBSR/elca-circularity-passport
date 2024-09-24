const SingleValueDisplay = ({ headline, label, value }: { headline: string; label: string; value: number }) => (
  <div className="my-12">
    <h3 className="mb-4 text-lg font-semibold leading-6 text-gray-900">{headline}</h3>
    <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
      <dt className="text-sm font-bold leading-6 text-gray-900">{label}</dt>
      <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">{value}</dd>
    </div>
  </div>
)

export default SingleValueDisplay
