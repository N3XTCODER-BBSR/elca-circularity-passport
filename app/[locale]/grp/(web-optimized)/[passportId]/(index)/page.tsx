import { notFound } from "next/navigation"
import Overview from "../(components)/tabs/overview"
import { getDinEnrichedPassportDataByPassportUuid } from "../../../../../../lib/domain-logic/grp/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportDataByPassportUuid(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }
  return <Overview dinEnrichedPassportData={dinEnrichedPassportData} />
}
export default Page
