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
"use client"

import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const HistoryBackButton = () => {
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1)
    }
  }, [])

  const handleGoBack = () => {
    window.history.back()
  }

  const t = useTranslations("CircularityTool.sections.catalog")

  if (canGoBack) {
    return (
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-8 py-2 text-sm font-semibold text-blue-900"
        onClick={handleGoBack}
        // href={`/${params.locale}/projects/${params.projectId}/catalog#${componentData?.din_code}`}
      >
        <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
        {t("back")}
      </button>
    )
  }
}

export default HistoryBackButton
