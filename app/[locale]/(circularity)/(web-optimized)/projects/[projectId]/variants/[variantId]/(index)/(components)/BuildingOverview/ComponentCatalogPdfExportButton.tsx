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

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { twMerge } from "tailwind-merge"
import { toast } from "react-hot-toast"

type ComponentCatalogPdfExportButtonProps = {
  projectId: number
  variantId: number
}

type PdfExportApiResponse = {
  documentUrl?: string
  error?: string
}

export default function ComponentCatalogPdfExportButton({
  projectId,
  variantId,
}: ComponentCatalogPdfExportButtonProps) {
  const t = useTranslations("CircularityTool.sections.overview.materialExport")
  const [isLoading, setIsLoading] = useState(false)

  const handleExportPdf = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/circularity/pdf-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, variantId }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch PDF export")
      }

      const data = (await response.json()) as PdfExportApiResponse

      if (data.documentUrl) {
        window.open(data.documentUrl, "_blank") // Open the PDF URL in a new tab
        toast.success("PDF successfully generated!")
      } else {
        console.error("No documentUrl found in the API response")
        toast.error("Failed to generate PDF: No document URL received")
      }
    } catch (error) {
      console.error("Error during PDF export:", error)
      toast.error("Failed to generate PDF.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={twMerge(
        "h-8 rounded-md bg-bbsr-blue-700 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-bbsr-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbsr-blue-500",
        isLoading ? "cursor-not-allowed opacity-70" : ""
      )}
      onClick={handleExportPdf}
      disabled={isLoading}
    >
      {t("exportComponentCatalogToPdf")}
    </button>
  )
}
