/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { Accordion } from "@szhsin/react-accordion"
import { useTranslations } from "next-intl"
import { AccordionItemFull } from "app/(components)/generic/AccordionItem"
import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { Material } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
const MaterialInfo = ({ material }: { material: Material }) => {
  const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.material")
  const materialValues = [
    { key: t("materialDescription"), value: material.genericMaterial.name },
    { key: t("materialClassId"), value: material.genericMaterial.classId },
    {
      key: t("materialClassDescription"),
      value: material.genericMaterial.classDescription,
      testId: "material-class-description",
    },
    { key: t("uuidMaterial"), value: material.genericMaterial.uuid },
    { key: t("serviceLife"), value: `${material.serviceLifeInYears} Jahre` },
    { key: t("versionNumberServiceLife"), value: material.serviceLifeTableVersion },
    { key: t("oekobaudatVersion"), value: material.genericMaterial.oekobaudatDbVersion },
  ]

  const tradeValues = [
    { key: t("lbPerformanceRange"), value: material.trade.lbPerformanceRange },
    { key: t("materialDescription"), value: material.trade.trade },
    { key: t("lvNumber"), value: material.trade.lvNumber },
    { key: t("itemInLv"), value: material.trade.itemInLv },
    // { key: `${t("area")} [m2]`, value: material.trade. },
  ]

  // const productValues = [
  //   // { key: t("technicalServiceLife"), value: material.product.technicalServiceLifeInYears },
  //   // { key: t("uuidProduct"), value: material.product.uuid },
  //   // { key: t("productDescription"), value: material.product.description },
  //   // { key: t("manufacturerName"), value: material.product.manufacturerName },
  //   // { key: t("proofDocument"), value: material.product.versionDate },
  // ]

  return (
    <div>
      <SideBySideDescriptionListsWithHeadline headline="Material" data={materialValues} />
      <Accordion transition transitionTimeout={200}>
        <AccordionItemFull header="Gewerk">
          <SideBySideDescriptionListsWithHeadline data={tradeValues} />
        </AccordionItemFull>
      </Accordion>
      {/* <Accordion transition transitionTimeout={200}>
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
      </Accordion> */}
    </div>
  )
}

export default MaterialInfo
