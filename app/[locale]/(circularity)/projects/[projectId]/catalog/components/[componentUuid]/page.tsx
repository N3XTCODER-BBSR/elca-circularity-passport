import Image from "next/image"
import { notFound } from "next/navigation"
import errorHandler from "app/(utils)/errorHandler"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "lib/domain-logic/circularity/server-actions/getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { ElcaElementWithComponents, EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getAvailableTBaustoffProducts } from "prisma/queries/db"
import HistoryBackButton from "./(components)/HistoryBackButton"
import ComponentLayer from "./(components)/layer-details/ComponentLayer"

const Page = async ({ params }: { params: { projectId: string; componentUuid: string; locale: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(params.projectId))

    const componentData: ElcaElementWithComponents<EnrichedElcaElementComponent> =
      await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(params.componentUuid, session.user.id)

    // // TODO: check this - probably better to check for array length?
    // if (!projectComponents) {
    //   notFound()
    // }

    // TODO:
    // 1. check why we do the find. Should be enough to just use projectComponents[0]?
    // 2. consider to (even if we then discard our db performance optimziation) really fetch data that are on
    //   a) component level and
    //   b) product level
    // in different queries (or at least hide it more upstream; the frontend layer should not have to know that it needs to get
    // the data from the first element of the array)
    // const componentData = projectComponents.find((el) => el.element_uuid === params.componentUuid)

    if (componentData == null) {
      notFound()
    }

    const dinGroupLevelNumber = Math.floor(componentData.din_code / 100) * 100

    const availableTBaustoffProducts = (await getAvailableTBaustoffProducts()).map((el) => ({
      id: `${el.id}`,
      value: el.name,
    }))

    return (
      <div>
        <HistoryBackButton />
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
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {dinGroupLevelNumber}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <ul>
          {componentData.layers.map((layer, i) => (
            <li key={i}>
              <ComponentLayer
                layerData={layer}
                layerNumber={i + 1}
                unitName={componentData.unit}
                tBaustoffProducts={availableTBaustoffProducts}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  })
}
export default Page
