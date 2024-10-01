import { ModuleTitle } from "app/[locale]/grp/pdf-optimized/(components)/layout-elements"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import SideBySideDescriptionListsWithHeadline, { KeyValueTuple } from "../SideBySideDescriptionListsWithHeadline"

const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const buildingBaseInfoKeyValues: KeyValueTuple[] = [
    {
      key: "Gebäude/Bauwerk-ID",
      // TODO: Rework this (also needs design spec iteration probably)
      value: Object.entries(dinEnrichedPassportData.buildingBaseData.buildingStructureId)
        .filter(([_key, value]) => value != null)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; "),
    },
    {
      key: "Gebäude-/Bauwerkstyp",
      value:
        dinEnrichedPassportData.buildingBaseData.buildingType + dinEnrichedPassportData.buildingBaseData.buildingType,
      numberOfLines: 3,
    },
    { key: "Adresse", value: dinEnrichedPassportData.buildingBaseData.address, numberOfLines: 2 },
    {
      key: "Netto-Raumfläche (m2 NRF)",
      value: dinEnrichedPassportData.buildingBaseData.nrf.toFixed(2),
    },
    {
      key: "Brutto-Grundfläche (m2 BGF)",
      value: dinEnrichedPassportData.buildingBaseData.bgf.toFixed(2),
    },
    {
      key: "Brutto-Rauminhalt (m3 BRI)",
      value: dinEnrichedPassportData.buildingBaseData.bri.toFixed(2),
    },
    { key: "Jahr der Baugenehmigung", value: dinEnrichedPassportData.buildingBaseData.buildingPermitYear },
    { key: "Jahr der Baufertigstellung", value: dinEnrichedPassportData.buildingBaseData.buildingCompletionYear },
    { key: "Anzahl der Obergeschosse", value: dinEnrichedPassportData.buildingBaseData.numberOfUpperFloors },
    { key: "Anzahl der Untergeschosse", value: dinEnrichedPassportData.buildingBaseData.numberOfBasementFloors },
    { key: "Grundstücksfläche (m2)", value: dinEnrichedPassportData.buildingBaseData.plotArea.toFixed(2) },
    // TODO: check and validate (with automatic tests) units and conversions. gesamtmasse should be (t), but seems to be (kg)
    {
      key: "Gesamtmasse des Gebäudes (t)",
      value: dinEnrichedPassportData.buildingBaseData.totalBuildingMass.toFixed(0),
    },
  ]

  return (
    <div className="text-[7pt]">
      <ModuleTitle title="Gebäudeinfo" />
      <SideBySideDescriptionListsWithHeadline data={buildingBaseInfoKeyValues} />
    </div>
  )
}
export default BuildingInformation
