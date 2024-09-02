import { PaperClipIcon } from "@heroicons/react/20/solid"
import { Accordion } from "@szhsin/react-accordion"
import _ from "lodash"
import { AccordionItemFull } from "app/(components)/(generic)/Accordion/AccordionItem"
import SideBySideDescriptionListsWithHeadline from "app/(components)/(generic)/SideBySideDescriptionListsWithHeadline"
import { Material } from "app/(utils)/data-schema/versions/v1/passportSchema"

const MaterialInfo = ({ material }: { material: Material }) => {
  const materialValues = [
    { key: "Material - Beschreibung", value: material.materialDescription },
    { key: "Material-Klassen-ID", value: material.classificationNumber },
    { key: "Material-Klassen-Beschreibung", value: material.classification },
    { key: "Material-UUID", value: material.uuid },
    { key: "Material-Datenbank", value: material.materialDatabase },
    { key: "Nutzungs-dauer [a]", value: material.serviceLife },
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
    { key: "Produkt-bezeichnung", value: material.product.description },
    { key: "Hersteller-name", value: material.product.manufacturerName },
    { key: "Nachweis-dokument", value: material.product.versionDate },
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
                {material.product.proofDocumentUrls.map((url, idx) => (
                  <li key={idx} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                      <a
                        href={url}
                        target="_blank"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        rel="noreferrer"
                      >
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{url}</span>
                        </div>
                      </a>
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
