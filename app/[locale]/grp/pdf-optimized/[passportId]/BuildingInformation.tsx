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
import { ModuleTitle } from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import SideBySideDescriptionListsWithHeadline, { KeyValueTuple } from "../SideBySideDescriptionListsWithHeadline"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const buildingBaseInfoKeyValues: KeyValueTuple[] = [
    {
      key: "Gebäude/Bauwerk-ID",
      // TODO (M): Rework this (also needs design spec iteration probably)
      value: Object.entries(dinEnrichedPassportData.buildingBaseData.buildingStructureId)
        .filter(([_key, value]) => value != null)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; "),
    },
    {
      key: "Gebäude-/Bauwerkstyp", // TODO: i18n
      value:
        dinEnrichedPassportData.buildingBaseData.buildingType + dinEnrichedPassportData.buildingBaseData.buildingType,
      numberOfLines: 3,
    },
    {
      key: "Adresse", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.address,
      numberOfLines: 2,
    },
    {
      key: "Netto-Raumfläche (m2 NRF)", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.nrf.toFixed(2),
    },
    {
      key: "Brutto-Grundfläche (m2 BGF)", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.bgf.toFixed(2),
    },
    {
      key: "Brutto-Rauminhalt (m3 BRI)", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.bri.toFixed(2),
    },
    {
      key: "Jahr der Baugenehmigung", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.buildingPermitYear,
    },
    {
      key: "Jahr der Baufertigstellung", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.buildingCompletionYear,
    },
    {
      key: "Anzahl der Obergeschosse", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.numberOfUpperFloors,
    },
    {
      key: "Anzahl der Untergeschosse", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.numberOfBasementFloors,
    },
    {
      key: "Grundstücksfläche (m2)", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.plotArea.toFixed(2),
    },
    // TODO (L): check and validate (with automatic tests) units and conversions. gesamtmasse should be (t), but seems to be (kg)
    {
      key: "Gesamtmasse des Gebäudes (t)", // TODO: i18n
      value: dinEnrichedPassportData.buildingBaseData.totalBuildingMass.toFixed(0),
    },
  ]

  return (
    <div className="text-[7pt]">
      {/* TODO: i18n */}
      <ModuleTitle title="Gebäudeinfo" />
      <SideBySideDescriptionListsWithHeadline data={buildingBaseInfoKeyValues} />
    </div>
  )
}
export default BuildingInformation
