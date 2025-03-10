/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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
