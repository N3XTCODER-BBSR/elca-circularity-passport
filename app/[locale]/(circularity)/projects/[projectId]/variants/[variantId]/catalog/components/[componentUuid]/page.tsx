import _ from "lodash"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getFormatter, getTranslations } from "next-intl/server"
import { Heading3, Heading4 } from "app/(components)/generic/layout-elements"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import { getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId } from "lib/domain-logic/circularity/misc/getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId"
import { preloadCircularityData } from "lib/domain-logic/circularity/misc/preloadCircularityData"
import { ElcaElementWithComponents, EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToElementByUuid } from "lib/ensureAuthorized"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import HistoryBackButton from "./(components)/HistoryBackButton"
import ComponentLayer from "./(components)/layer-details/ComponentLayer"

const Page = async ({
  params,
}: {
  params: { projectId: string; variantId: string; componentUuid: string; locale: string }
}) => {
  return withServerComponentErrorHandling(async () => {
    const session = await ensureUserIsAuthenticated()
    const format = await getFormatter()
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)
    const componentUuid = params.componentUuid
    const userId = Number(session.user.id)
    const t = await getTranslations("Circularity.Components")

    await ensureUserAuthorizationToElementByUuid(userId, componentUuid)

    const ProductsList = ({ products }: { products: EnrichedElcaElementComponent[] }) => (
      <ul>
        {products.map((product, i) => (
          <li key={i}>
            <ComponentLayer
              projectId={projectId}
              variantId={variantId}
              layerData={product}
              // TODO: check/update logic here (and other places where laufende nummer is used) once we decided about the semantics of it
              layerNumber={product.layer_position}
              //unitName={componentData.unit}
              tBaustoffProducts={availableTBaustoffProductIdAndNames}
            />
          </li>
        ))}
      </ul>
    )

    const elementBaseData = await legacyDbDalInstance.getElcaVariantElementBaseDataByUuid(
      componentUuid,
      variantId,
      projectId
    )

    const projectComponents = await legacyDbDalInstance.getElcaVariantComponentsByInstanceId(
      componentUuid,
      variantId,
      projectId
    )
    const preloadedData = await preloadCircularityData(projectComponents)

    const componentData: ElcaElementWithComponents<EnrichedElcaElementComponent> =
      await getElcaElementDetailsAndComponentsByComponentInstanceIdAndUserId(
        elementBaseData,
        projectComponents,
        preloadedData.excludedProductIdsSet,
        preloadedData.userEnrichedMap,
        preloadedData.tBaustoffMappingEntriesMap,
        preloadedData.tBaustoffProductMap,
        preloadedData.productMassMap
      )

    const [layers, nonLayers] = _.partition(componentData.layers, (layer) => layer.is_layer)

    if (componentData == null) {
      notFound()
    }

    const dinGroupLevelNumber = Math.floor(componentData.din_code / 100) * 100

    const availableTBaustoffProducts = await dbDalInstance.getAvailableTBaustoffProducts()
    const availableTBaustoffProductIdAndNames = availableTBaustoffProducts.map((el) => ({
      id: `${el.id}`,
      value: el.name,
    }))

    return (
      <div>
        <HistoryBackButton />
        <h1 className="mt-12 text-2xl font-semibold leading-6">{componentData.element_name}</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full py-4 md:w-1/3">
            {" "}
            <Image src="/component_placeholder_lg.png" alt={componentData?.element_name} width={400} height={400} />
          </div>
          <div className="w-full md:w-2/3 md:p-4">
            <div className="overflow-hidden">
              <div className="border border-gray-200">
                <dl>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("name")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {componentData.element_name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("uuid")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {componentData.element_uuid}
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
                    <dd
                      className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      data-testid="component-page-overview__dd__number-installed"
                    >
                      {format.number(componentData.quantity, { maximumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">{t("referenceUnit")}</dt>
                    <dd
                      className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      data-testid="component-page-overview__dd__ref-unit"
                    >
                      {componentData.unit}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12 flex flex-col gap-2">
          <Heading3>
            {t("buildingMaterialsHeading")} {componentData.unit}
          </Heading3>
          {layers.length < 1 && nonLayers.length < 1 && (
            <span className="text-sm font-medium text-gray-900">{t("noBuildingMaterials")}</span>
          )}
          {layers.length > 0 && (
            <div className="mb-12 flex flex-col gap-2">
              <Heading4>{t("layersHeading")}</Heading4>
              <ProductsList products={layers} />
            </div>
          )}
          {nonLayers.length > 0 && (
            <div className="mb-12 flex flex-col gap-2">
              <Heading4>{t("nonLayersHeading")}</Heading4>
              <ProductsList products={nonLayers} />
            </div>
          )}
        </div>
      </div>
    )
  })
}
export default Page
