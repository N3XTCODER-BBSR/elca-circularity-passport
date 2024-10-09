import { PaperClipIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { AccordionItemFull } from "app/[locale]/grp/(components)/generic/Accordion/AccordionItem"
import { Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { useTranslations } from "next-intl"
const MaterialInfo = ({ material }: { material: Material }) => {
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.material")
  const materialValues = [
    { key: t("materialDescription"), value: material.materialDescription },
    { key: t("materialClassId"), value: material.materialClassId },
    { key: t("materialClassDescription"), value: material.materialClassDescription },
    { key: t("uuidMaterial"), value: material.uuid },
    { key: t("serviceLife"), value: `${material.serviceLifeInYears} Jahre` },
    { key: t("versionNumberServiceLife"), value: material.serviceLifeTableVersion },
    { key: t("oekobaudatVersion"), value: material.oekobaudatVersion },
  ]

  const tradeValues = [
    { key: t("lbPerformanceRange"), value: material.trade.lbPerformanceRange },
    { key: t("materialDescription"), value: material.trade.trade },
    { key: t("lvNumber"), value: material.trade.lvNumber },
    { key: t("itemInLv"), value: material.trade.itemInLv },
    { key: `${t("area")} [m2]`, value: material.trade.area },
  ]

  const productValues = [
    { key: t("technicalServiceLife"), value: material.product.technicalServiceLifeInYears },
    { key: t("uuidProduct"), value: material.product.uuid },
    { key: t("productDescription"), value: material.product.description },
    { key: t("manufacturerName"), value: material.product.manufacturerName },
    { key: t("proofDocument"), value: material.product.versionDate },
  ]

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline="Material" data={materialValues} />
      <Accordion transition transitionTimeout={200}>
        <AccordionItemFull header="Gewerk">
          <SideBySideDescriptionListsWithHeadline data={tradeValues} />
        </AccordionItemFull>
      </Accordion>
      <Accordion transition transitionTimeout={200}>
        <AccordionItemFull header="Produkt">
          <SideBySideDescriptionListsWithHeadline data={productValues} />
          <div className="px-4 sm:col-span-2 sm:px-0">
            <dd className="mt-2 text-sm text-gray-900">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {material.product.proofDocuments.map((document, idx) => (
                  <li key={idx} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                      <a
                        href={document.url}
                        target="_blank"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        rel="noreferrer"
                      >
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{document.url} </span>
                        </div>
                      </a>
                      &nbsp;({document.versionDate})
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </AccordionItemFull>
      </Accordion>
    </div>
  )
}

export default MaterialInfo
