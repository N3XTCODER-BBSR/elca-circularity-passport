import { PaperClipIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { AccordionItemFull } from "app/[locale]/grp/(components)/generic/Accordion/AccordionItem"
import { Material } from "domain-logic/grp/data-schema/versions/v1/passportSchema"

const MaterialInfo = ({ material }: { material: Material }) => {
  const materialValues = [
    { key: "Material-Beschreibung", value: material.materialDescription },
    { key: "Materialgruppen-ID", value: material.materialClassId },
    { key: "Materialgruppen-Beschreibung", value: material.materialClassDescription },
    { key: "Material-UUID", value: material.uuid },
    { key: "Nutzungsdauer", value: `${material.serviceLifeInYears} Jahre` },
    { key: "Versionsnummer Nutzungsdauer-Tabelle", value: material.serviceLifeTableVersion },
    { key: "Ökobaudat-Version", value: material.oekobaudatVersion },
  ]

  const tradeValues = [
    { key: "Leistungs-bereich (LB)", value: material.trade.lbPerformanceRange },
    { key: "Gewerk", value: material.trade.trade },
    { key: "Leistungsverzeichnis (LV) nr.", value: material.trade.lvNumber },
    { key: "Position im LV", value: material.trade.itemInLv },
    { key: "Fläche [m2]", value: material.trade.area },
  ]

  const productValues = [
    { key: "Technische Lebensdauer", value: material.product.technicalServiceLifeInYears },
    { key: "UUID Produkt", value: material.product.uuid },
    { key: "Produktbezeichnung", value: material.product.description },
    { key: "Herstellername", value: material.product.manufacturerName },
    { key: "Nachweisdokument", value: material.product.versionDate },
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
