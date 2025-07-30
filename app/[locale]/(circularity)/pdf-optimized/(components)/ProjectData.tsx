import { getTranslations } from "next-intl/server"
import { ModuleTitle } from "./layout-elements"
import { KeyValueTuple } from "app/[locale]/grp/pdf-optimized/SideBySideDescriptionListsWithHeadline"
import SideBySideDescriptionListsWithHeadline from "app/[locale]/grp/pdf-optimized/SideBySideDescriptionListsWithHeadline"

type ProjectDataProps = {
  projectId: string
  address: {
    city: string
    postalCode: string
    street: string
    houseNumber: string
  }
  bnbNumber: string
  bnbCoordinator: string
}

const ProjectData = async ({ projectId, address, bnbNumber, bnbCoordinator }: ProjectDataProps) => {
  const t = await getTranslations("ProjectPdf.projectData")

  const projectDataKeyValues: KeyValueTuple[] = [
    {
      key: t("projectId"),
      value: projectId,
    },
    {
      key: t("address"),
      value: `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`,
      numberOfLines: 2,
    },
    {
      key: t("bnbNumber"),
      value: bnbNumber,
    },
    {
      key: t("bnbCoordinator"),
      value: bnbCoordinator,
    },
    {
      key: t("reportDate"),
      value: new Date().toLocaleDateString("de-DE"),
    },
  ]

  return (
    <div className="text-[7pt]">
      <ModuleTitle title={t("title")} />
      <SideBySideDescriptionListsWithHeadline data={projectDataKeyValues} />
    </div>
  )
}

export default ProjectData
