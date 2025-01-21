import { notFound } from "next/navigation"
import { getDinEnrichedPassportDataByPassportUuid } from "lib/domain-logic/grp/getPassportData"
import Overview from "../(components)/tabs/overview"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportDataByPassportUuid(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }
  return <Overview dinEnrichedPassportData={dinEnrichedPassportData} />
}
export default Page
