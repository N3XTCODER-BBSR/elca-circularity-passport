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
import Image from "next/image"
import { useTranslations } from "next-intl"

export const NoComponentsMessage = () => {
  const t = useTranslations("CircularityTool.sections.overview.noComponentsState")

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <Image src="/missing_components.svg" width={82} height={93} className="w-20" alt="missing components" />
      <div className="flex flex-col items-center gap-2 text-gray-900">
        <h3 className="text-2xl font-semibold leading-8" data-testid="no-components-message__h3__heading">
          {t("title")}
        </h3>
        <p className="max-w-[44.5rem] text-center text-lg font-normal leading-8">{t("body")}</p>
      </div>
    </div>
  )
}
