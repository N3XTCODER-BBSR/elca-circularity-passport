import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "app/(utils)/authOptions"
import UnauthorizedInfo from "app/[locale]/(circularity)/(components)/UnauthorizedInfo"
import ComponentLayer from "./(components)/component-layer"
import { DataResult, fetchProjectDataCachedDuringRequest } from "../../../(utils)/data-fetcher"

const Page = async ({ params }: { params: { projectId: string; componentUuid: string; locale: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <UnauthorizedInfo />
  }

  const dataResult: DataResult = await fetchProjectDataCachedDuringRequest(params.projectId, session.user.id)

  if (!dataResult) {
    notFound()
    //   return <div>Projects with this ID not found for the current user.</div>
  }

  const componentData = dataResult.projectComponents.find((el) => el.element_uuid === params.componentUuid)

  if (componentData == null) {
    notFound()
  }

  // TODO: consider to make din_code a number from the beginning (e.g. when introducing zod also for the Circularity tool)
  const dinGroupLevelNumber = Math.floor(parseInt(componentData.din_code) / 100) * 100

  return (
    <div>
      <Link
        className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-8 py-2 text-sm font-semibold text-blue-900"
        href={`/${params.locale}/projects/${params.projectId}/catalog#${componentData?.din_code}`}
      >
        <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
        Zurück
      </Link>

      <h1 className="mt-12 text-2xl font-semibold leading-6">{componentData?.element_name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full py-4 md:w-1/3">
          {" "}
          <Image src="/component_placeholder_lg.png" alt={componentData?.element_name} width={400} height={400} />
        </div>
        <div className="w-full md:w-2/3 md:p-4">
          <div className="overflow-hidden">
            <div className="border border-gray-200">
              <dl className="">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Komponenten-Name</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {componentData?.element_name}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">UUID</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {componentData?.element_uuid}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Kostengruppe DIN276</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{dinGroupLevelNumber}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {/* layers: {JSON.stringify(componentData.layers, null, 2)} */}
        {componentData.layers.map((layer, i) => (
          <li key={i}>
            <ComponentLayer layerData={layer} layerNumber={i + 1} unitName={componentData.unit} />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Page
