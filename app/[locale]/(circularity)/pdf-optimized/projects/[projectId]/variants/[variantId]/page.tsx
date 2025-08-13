"use server"

import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { withServerComponentErrorHandling } from "app/(utils)/errorHandler"
import getDataForPdfExportForProjectVariantId from "app/[locale]/(circularity)/(server-actions)/getDataForPdfExportForProjectVariantId"
import { ensureVariantAccessible } from "app/[locale]/(circularity)/(utils)/ensureAccessible"
import ensureUserIsAuthenticated from "lib/auth/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/auth/ensureAuthorized"
import { DimensionalFieldName } from "lib/domain-logic/circularity/misc/domain-types"
import { getProjectCircularityData } from "lib/domain-logic/circularity/misc/getProjectCircularityData"
import { getProjectById } from "lib/domain-logic/circularity/projects/getProjectById"
import { getVariantById } from "lib/domain-logic/circularity/projects/getProjectVariantById"
import { calculateTotalMetricValuesForProject } from "lib/domain-logic/circularity/utils/calculateTotalMetricValues"
import { dismantlingPotentialClassIdMapping } from "lib/domain-logic/circularity/utils/circularityMappings"
import { validateAndUseOneTimePdfToken } from "lib/auth/pdfTokenAuth"
import { ComponentsList } from "./(components)/ComponentsList"
import { ProjectData } from "./(components)/ProjectData"
import { Results } from "./(components)/Results"
import { Section } from "./(components)/Section"
import {
  calculateBnbCircularityPoints,
  calculateBnbDismantlingPoints,
} from "lib/domain-logic/circularity/utils/calculateBnbPoints"
import { formatNumber, formatProjectAddress } from "lib/presentation-logic/formatters"

async function PdfPage({
  params,
  searchParams,
}: {
  params: { projectId: string; variantId: string }
  searchParams?: { [key: string]: string | string[] }
}) {
  const t = await getTranslations("CircularityTool.sections.pdfExport")
  // --- One-time token validation (query param) ---
  const projectId = Number(params.projectId)
  const variantId = Number(params.variantId)
  let userId: number | null = null
  let session: any = null

  // Extract oneTimeToken from searchParams (server component)
  let oneTimeToken: string | undefined = undefined
  if (searchParams && typeof searchParams === "object") {
    const val = searchParams["oneTimeToken"]
    if (Array.isArray(val)) {
      oneTimeToken = val[0]
    } else if (typeof val === "string") {
      oneTimeToken = val
    }
  }

  if (oneTimeToken) {
    // Validate token: returns userId if valid, else null
    const validatedUserId = await validateAndUseOneTimePdfToken({
      token: oneTimeToken,
      projectId,
      variantId,
    })
    if (validatedUserId) {
      userId = Number(validatedUserId)
    }
  }

  if (!userId) {
    // Fallback to normal session-based authentication
    session = await ensureUserIsAuthenticated()
    userId = Number(session.user.id)
  }
  // --- End one-time token validation ---
  // const session = await ensureUserIsAuthenticated()

  await ensureUserAuthorizationToProject(userId, projectId)
  await ensureVariantAccessible(variantId, projectId)

  // Get project and variant data
  const [project, variant, circularityData, legacyVariantData] = await Promise.all([
    getProjectById(projectId),
    getVariantById(variantId),
    getProjectCircularityData(variantId, projectId),
    getDataForPdfExportForProjectVariantId(variantId, projectId),
  ])

  if (!project || !variant) {
    notFound()
  }

  // Calculate total metric values for the building (weighted by volume)
  const totalMetricValues = calculateTotalMetricValuesForProject(circularityData, "volume" as DimensionalFieldName)

  // Transform data for components list
  const components = circularityData.map((component) => ({
    name: component.element_name,
    uuid: component.element_uuid,
    costGroup: String(component.din_code || ""),
    quantity: component.quantity,
    referenceUnit: component.unit,
    materials: component.layers.map((layer) => ({
      name: layer.process_name || "Unbekanntes Material",
      mass: layer.mass ?? 0,
      volume: layer.volume ?? 0,
      unit: "m³",
      dismantling: {
        points: layer.dismantlingPoints ?? 0,
        class:
          layer.dismantlingPotentialClassId && dismantlingPotentialClassIdMapping[layer.dismantlingPotentialClassId]
            ? String(dismantlingPotentialClassIdMapping[layer.dismantlingPotentialClassId].translationKey)
            : "-",
      },
      circularity: {
        points: layer.eolBuilt?.points ?? 0,
        class: layer.eolBuilt?.className ?? "-",
      },
    })),
  }))

  const currentDate = new Date().toLocaleDateString("de-DE")

  // Get address from legacy DB fields
  let address = ""
  if (legacyVariantData?.data?.project_locations) {
    const loc = legacyVariantData.data.project_locations
    address = formatProjectAddress(loc)
  }

  return (
    <div className="component-catalog-pdf" data-string="footerLabel">
      <div className="header mb-8 bg-gray-100 pt-6 text-gray-900">
        <div className="mx-auto max-w-[200mm] px-[5mm]">
          <h1>{t("title")}</h1>
        </div>
      </div>
      <main className="content mx-auto max-w-[200mm] px-[5mm]">
        <Section title={t("sections.projectData")}>
          <ProjectData
            projectId={params.projectId}
            projectName={project.name}
            address={address}
            bnbNumber={project.bnbNr || ""}
            bnbCoordinator=""
            creationDate={currentDate}
          />
        </Section>

        <Section title={t("sections.components")} subtitle={t("sections.componentsSubtitle")}>
          <ComponentsList components={components} />
        </Section>

        <Section title={t("sections.results")}>
          <div className="text-s mb-6 grid grid-cols-[auto,1fr] gap-x-8 gap-y-2 text-gray-500">
            <div>{t("results.dismantlingPotential")}</div>
            <div>
              {formatNumber(totalMetricValues.dismantlingPoints)} {t("results.points")}
            </div>
            <div>{t("results.circularityPotential")}</div>
            <div>
              {formatNumber(totalMetricValues.eolBuiltPoints)} {t("results.points")}
            </div>
          </div>
          <hr className="my-4" />
          <Results
            dismantlingPoints={totalMetricValues.dismantlingPoints}
            circularityPoints={totalMetricValues.eolBuiltPoints}
            weightedDismantlingPoints={calculateBnbDismantlingPoints(totalMetricValues.dismantlingPoints)}
            weightedCircularityPoints={calculateBnbCircularityPoints(totalMetricValues.eolBuiltPoints)}
          />
        </Section>
      </main>
    </div>
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { projectId: string; variantId: string }
  searchParams?: { [key: string]: string | string[] }
}) {
  return withServerComponentErrorHandling(async () => PdfPage({ params, searchParams }))
}
