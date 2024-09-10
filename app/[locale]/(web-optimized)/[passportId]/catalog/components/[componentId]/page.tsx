import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDinEnrichedPassportData } from "app/[locale]/(web-optimized)/[passportId]/(utils)/getPassportData"
import ComponentLayer from "./component-layer"

const Page = async ({ params }: { params: { passportId: string; componentId: string } }) => {
  const passportData = await getDinEnrichedPassportData(params.passportId)

  const component = passportData?.dinEnrichedBuildingComponents?.find(
    (component) => component.uuid === params.componentId
  )

  if (component == null) {
    notFound()
  }

  return (
    <div>
      <Link
        className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-8 py-2 text-sm font-semibold text-blue-900"
        href={`/${params.passportId}/catalog#${component.dinComponentLevelNumber}`}
      >
        <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
        Zurück
      </Link>

      <h1 className="mt-12 text-2xl font-semibold leading-6">{component.name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full py-4 md:w-1/3">
          {" "}
          <Image src="/component_placeholder_lg.png" alt={component.name} width={400} height={400} />
        </div>
        <div className="w-full md:w-2/3 md:p-4">
          <div className="overflow-hidden">
            <div className="border border-gray-200">
              <dl className="">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Komponenten-Name</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{component.name}</dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">UUID</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{component.uuid}</dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Kostengruppe DIN276</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {component.dinGroupLevelNumber}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {component.layers.map((layer, i) => (
          <li key={i}>
            <ComponentLayer layerData={layer} layerNumber={i + 1} />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Page
