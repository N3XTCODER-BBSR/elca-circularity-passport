import enrichComponentsArrayWithDin276Labels, {
  DinEnrichedPassportData,
} from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import passportParser from "lib/domain-logic/grp/data-schema/versions/v1/passportParser"
import { PassportData } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
import { dbDalInstance } from "prisma/queries/dalSingletons"

const getPassportDataByPassportUuid = async (passportUuid: string): Promise<PassportData | null> => {
  const passportDbRow = await dbDalInstance.getPassportByUuid(passportUuid)

  if (!passportDbRow) {
    return null
  }

  const passportData: PassportData = passportParser(passportDbRow.passportData)
  return passportData
}

export const getDinEnrichedPassportDataByPassportUuid = async (
  passportUuid: string
): Promise<DinEnrichedPassportData | null> => {
  const passportData = await getPassportDataByPassportUuid(passportUuid)
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

export const getAllPassportsData = async (): Promise<PassportData[]> => {
  const passports = await dbDalInstance.getAllPassports()

  const passportsData = passports.map((passport) => passportParser(passport.passportData))
  return passportsData
}
