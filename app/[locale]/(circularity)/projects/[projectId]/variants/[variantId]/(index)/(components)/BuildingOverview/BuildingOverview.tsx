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
import { getTranslations } from "next-intl/server"
import { FC } from "react"
import { CtaButton } from "app/(components)/generic/CtaButton"
import { NoComponentsMessage } from "app/(components)/NoComponentsMessage"
import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/misc/getProjectCircularityIndex"
import { DimensionalFieldName } from "lib/domain-logic/shared/basic-types"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import CircularityData from "./CircularityData"
import { ProcessCategory } from "../CircularityIndexBreakdownByMaterialType/CircularityIndexBreakdownByMaterialType"
import MaterialCsvExportButton from "../CircularityIndexBreakdownByMaterialType/MaterialCsvExport/MaterialCsvExportButton"

const MissingDataMessage: FC<{ catalogPath: string }> = async ({ catalogPath }) => {
  const t = await getTranslations("CircularityTool.sections.overview")

  return (
    <div className="mx-64 flex-col items-center text-center">
      <Image
        src="/missing-circularity-data-icon.svg"
        width={24}
        height={24}
        className="mb-6 inline-block size-28"
        alt={"missing-circularity-data"}
      />
      <h3 className="mx-2 mb-8 text-2xl font-semibold" data-testid="building-overview-empty-state__h3__heading">
        {t("emptyState.title")}
      </h3>
      <div className="mb-8">{t("emptyState.body")}</div>
      <CtaButton href={catalogPath} text={t("emptyState.cta")} />
    </div>
  )
}

type BuildingOverviewProps = {
  projectId: number
  projectName: string
  variantId: number
}

const BuildingOverview = async ({ projectId, projectName, variantId }: BuildingOverviewProps) => {
  const dimensionalFieldName: DimensionalFieldName = "volume"
  const circularityData = await getProjectCircularityIndexData(variantId, projectId)
  const processCategories: ProcessCategory[] = await legacyDbDalInstance.getAllProcessCategories()

  const isCircularityIndexMissingForAnyProduct = circularityData.some((component) =>
    component.layers.some((layer) => layer.circularityIndex == null)
  )

  const isVolumeMissingForAnyProduct = circularityData.some((component) =>
    component.layers.some((layer) => layer.volume === null)
  )

  const noBuildingComponents = circularityData.length === 0

  const catalogPath = `/projects/${projectId}/variants/${variantId}/catalog`
  const t = await getTranslations("CircularityTool.sections.overview")

  const renderBody = () => {
    if (noBuildingComponents) {
      return <NoComponentsMessage />
    }
    if (isCircularityIndexMissingForAnyProduct || isVolumeMissingForAnyProduct) {
      return <MissingDataMessage catalogPath={catalogPath} />
    }
    return (
      <CircularityData
        circularityData={circularityData}
        projectName={projectName}
        catalogPath={catalogPath}
        dimensionalFieldName={dimensionalFieldName}
        processCategories={processCategories}
      />
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-l max-w-xl font-bold leading-none tracking-tight dark:text-white lg:text-3xl">
            {t("title")}
          </h1>
          <MaterialCsvExportButton
            catalogPath={catalogPath}
            projectName={projectName}
            processCategories={processCategories}
            circularityData={circularityData}
          />
        </div>
        <h2 className="max-w-[50%]">
          <span className="text-2xl">{projectName}</span>
        </h2>
      </div>
      {renderBody()}
    </>
  )
}

export default BuildingOverview
