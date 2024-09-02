import { DinEnrichedPassportData } from "app/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { ModuleTitle } from "app/pdf-optimized/(components)/layout-elements"
import SideBySideDescriptionListsWithHeadline, { KeyValueTuple } from "../SideBySideDescriptionListsWithHeadline"
const BuildingInformation = ({ dinEnrichedPassportData }: { dinEnrichedPassportData: DinEnrichedPassportData }) => {
  const sealedPropertyAreaProportionAsPercentageStr = `${(
    dinEnrichedPassportData.buildingBaseData.sealedPropertyAreaProportion * 100
  ).toFixed(2)}%`

  const buildingBaseInfoKeyValues: KeyValueTuple[] = [
    { key: "Gebäude/Bauwerk-ID", value: dinEnrichedPassportData.buildingBaseData.buildingStructureId },
    {
      key: "BGF",
      value: dinEnrichedPassportData.buildingBaseData.bgf.toFixed(2),
    },
    { key: "Adresse", value: dinEnrichedPassportData.buildingBaseData.address, numberOfLines: 2 },
    {
      key: "BRI",
      value: dinEnrichedPassportData.buildingBaseData.bri.toFixed(2),
    },
    { key: "Baujahr", value: dinEnrichedPassportData.buildingBaseData.buildingYear },
    { key: "Grundstücksfläche", value: dinEnrichedPassportData.buildingBaseData.plotArea.toFixed(2) },
    {
      key: "Gebäudetyp",
      value:
        dinEnrichedPassportData.buildingBaseData.buildingType + dinEnrichedPassportData.buildingBaseData.buildingType,
      numberOfLines: 3,
    },
    {
      key: "Anteil versiegelte Grundstücksfläche",
      value: sealedPropertyAreaProportionAsPercentageStr,
    },
    { key: "Geschossanzahl des Gebäudes", value: dinEnrichedPassportData.buildingBaseData.numberOfFloors },
    { key: "Gesamtmasse des Gebäudes", value: dinEnrichedPassportData.buildingBaseData.totalBuildingMass.toFixed(0) },
    {
      key: "NRF",
      value: dinEnrichedPassportData.buildingBaseData.nrf.toFixed(2),
    },
    { key: "Datenqualität", value: dinEnrichedPassportData.buildingBaseData.dataQuality },
  ]

  return (
    <div className="text-[7pt]">
      <ModuleTitle title="Gebäudeinfo" />
      <SideBySideDescriptionListsWithHeadline data={buildingBaseInfoKeyValues} />
    </div>
  )
}
export default BuildingInformation
