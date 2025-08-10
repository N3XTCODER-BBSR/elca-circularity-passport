"use client"

import { useTranslations } from "next-intl"

interface ProjectDataProps {
  projectId: string
  address: string
  bnbNumber: string
  bnbCoordinator: string
  creationDate: string
  projectName: string
}

export function ProjectData({
  projectId,
  address,
  bnbNumber,
  bnbCoordinator,
  creationDate,
  projectName,
}: ProjectDataProps) {
  const t = useTranslations("CircularityTool.sections.pdfExport.projectData")

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-2">
      <div className="font-semibold">{t("projectName")}</div>
      <div>{projectName}</div>

      <div className="font-semibold">{t("projectId")}</div>
      <div>{projectId}</div>

      <div className="font-semibold">{t("address")}</div>
      <div>{address}</div>

      <div className="font-semibold">{t("bnbNumber")}</div>
      <div>{bnbNumber}</div>

      <div className="font-semibold">{t("bnbCoordinator")}</div>
      <div>{bnbCoordinator}</div>

      <div className="font-semibold">{t("creationDate")}</div>
      <div>{creationDate}</div>
    </div>
  )
}
