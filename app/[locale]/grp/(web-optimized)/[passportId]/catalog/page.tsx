import { notFound } from "next/navigation"
import ProjectCatalog from "./components/[componentId]/(components)/ProjectCatalog"
import { getDinEnrichedPassportDataByPassportUuid } from "../../../../../../lib/domain-logic/grp/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportDataByPassportUuid(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }

  return (
    <ProjectCatalog
      passportId={params.passportId}
      projectComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
    />
  )
}

export default Page
