import enrichComponentsArrayWithDin276Labels, {
  DinEnrichedPassportData,
} from "app/[locale]/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import passportParser from "app/[locale]/(utils)/data-schema/versions/v1/passportParser"
import { PassportData } from "app/[locale]/(utils)/data-schema/versions/v1/passportSchema"
import prisma from "prisma/prismaClient"

const getPassportData = async (passportId: string): Promise<PassportData | null> => {
  const passportDbRow = await prisma.passport.findUnique({
    where: {
      uuid: passportId,
    },
  })

  if (!passportDbRow) {
    return null
  }

  const passportData: PassportData = passportParser(passportDbRow.passportData)
  return passportData
}

export const getDinEnrichedPassportData = async (passportId: string): Promise<DinEnrichedPassportData | null> => {
  const passportData = await getPassportData(passportId)
  if (passportData == null) {
    return null
  }
  const dinEnrichedBuildingComponents = enrichComponentsArrayWithDin276Labels(passportData?.buildingComponents || [])
  const dinEnrichedPassportData: DinEnrichedPassportData = {
    ...passportData,
    dinEnrichedBuildingComponents: dinEnrichedBuildingComponents,
  }

  return dinEnrichedPassportData
}
