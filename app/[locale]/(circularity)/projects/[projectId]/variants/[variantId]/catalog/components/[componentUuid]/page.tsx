import Image from "next/image"
import { notFound } from "next/navigation"
import { getFormatter, getTranslations } from "next-intl/server"
import { Heading4 } from "app/(components)/generic/layout-elements"
import errorHandler from "app/(utils)/errorHandler"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "lib/domain-logic/circularity/server-actions/getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { ElcaElementWithComponents, EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import { getAvailableTBaustoffProducts } from "prisma/queries/db"
import HistoryBackButton from "./(components)/HistoryBackButton"
import ComponentLayer from "./(components)/layer-details/ComponentLayer"

const Page = async ({
  params,
}: {
  params: { projectId: string; variantId: string; componentUuid: string; locale: string }
}) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()
    const format = await getFormatter()
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)
    const t = await getTranslations("Circularity.Components")

    await ensureUserAuthorizationToProject(Number(session.user.id), Number(params.projectId))

    const componentData: ElcaElementWithComponents<EnrichedElcaElementComponent> =
      await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(variantId, projectId, params.componentUuid)

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
                    <dt className="text-sm font-medium text-gray-900">{t("name")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {componentData?.element_name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("uuid")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {componentData?.element_uuid}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("costGroup")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {dinGroupLevelNumber}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("numberInstalled")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {format.number(componentData.quantity, { maximumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("referenceUnit")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{componentData.unit}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <Heading4>
          {t("layersHeading")} {componentData.unit}:
        </Heading4>
        <ul>
          {componentData.layers.map((layer, i) => (
            <li key={i}>
              <ComponentLayer
                projectId={projectId}
                variantId={variantId}
                layerData={layer}
                // TODO: check/update logic here (and other places where laufende nummer is used) once we decided about the semantics of it
                layerNumber={layer.layer_position}
                //unitName={componentData.unit}
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
