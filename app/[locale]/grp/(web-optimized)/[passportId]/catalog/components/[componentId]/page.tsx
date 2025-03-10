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
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getDinEnrichedPassportDataByPassportUuid } from "lib/domain-logic/grp/getPassportData"
import ComponentLayer from "./component-layer"

const Page = async ({ params }: { params: { passportId: string; componentId: string; locale: string } }) => {
  const passportData = await getDinEnrichedPassportDataByPassportUuid(params.passportId)
  const t = await getTranslations("Grp.Web.sections.detailPage.component")
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
        href={`/${params.locale}/grp/${params.passportId}/catalog#${component.dinComponentLevelNumber}`}
      >
        <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
        {t("back")}
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
                  <dt className="text-sm font-medium text-gray-900">{t("componentName")}</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{component.name}</dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">{t("uuid")}</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{component.uuid}</dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">{t("costGroup")}</dt>
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
        {component.materials.map((layer, i) => (
          <li key={i}>
            <ComponentLayer layerData={layer} layerNumber={layer.layerIndex} />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Page
