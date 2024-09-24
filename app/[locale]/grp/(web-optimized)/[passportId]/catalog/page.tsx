import { notFound } from "next/navigation"
import ProjectCatalog from "./components/[componentId]/(components)/ProjectCatalog"
import { getDinEnrichedPassportData } from "../../../(utils)/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportData(params.passportId)

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
