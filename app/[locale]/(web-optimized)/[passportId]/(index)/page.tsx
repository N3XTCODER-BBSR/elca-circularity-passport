import { notFound } from "next/navigation"
import Overview from "../(components)/tabs/overview"
import { getDinEnrichedPassportData } from "../(utils)/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportData(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }
  return <Overview dinEnrichedPassportData={dinEnrichedPassportData} />
}
export default Page
