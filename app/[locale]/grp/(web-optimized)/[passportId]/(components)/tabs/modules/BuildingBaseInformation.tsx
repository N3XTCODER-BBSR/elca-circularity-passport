"use client"

import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/[locale]/grp/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { DinEnrichedPassportData } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

type BuildingBaseInformationProps = {
  passportData: DinEnrichedPassportData
  className?: string // Add className as an optional prop
}

const BuildingBaseInformation: React.FC<BuildingBaseInformationProps> = ({ passportData, className }) => {
  const buildingBaseInfoKeyValues: KeyValueTuple[] = [
    {
      key: "Gebäude/Bauwerk-ID",
      value: Object.entries(passportData.buildingBaseData.buildingStructureId)
        .filter(([_key, value]) => value != null)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; "),
    },
    {
      key: "Coordinates",
      value: `${passportData.buildingBaseData.coordinates.latitude}, ${passportData.buildingBaseData.coordinates.longitude}`,
    },
    { key: "Adresse", value: passportData.buildingBaseData.address },
    { key: "Jahr der Baugenehmigung", value: passportData.buildingBaseData.buildingPermitYear },
    { key: "Jahr der Baufertigstellung", value: passportData.buildingBaseData.buildingCompletionYear },
    { key: "Anzahl der Obergeschosse", value: passportData.buildingBaseData.numberOfUpperFloors },
    { key: "Anzahl der Untergeschosse", value: passportData.buildingBaseData.numberOfBasementFloors },
    {
      key: "NRF",
      value: passportData.buildingBaseData.nrf.toFixed(2),
      tooltip: {
        id: "nrf",
        content: (
          <>
            Unter Netto-Raumfläche (NRF) versteht man die Summe der nutzbaren Grundflächen eines Gebäudes. Zur
            Berechnung wird sie gemäß nebenstehender Tabelle nochmals in Nutzungsgruppen unterteilt in:{" "}
            <ul className="list-disc">
              <li>
                die Nutzungsfläche (NUF) als zum sinngemäßen Gebrauch eines Gebäudes effektiv nutzbare Grundfläche{" "}
              </li>
              <li>
                die Technikfläche (TF), die der zur Unterbringung von zentralen haustechnischen Anlagen dient (z. B.
                Heizung, Maschinenraum für den Aufzug, Raum für Betrieb von Klimaanlagen)
              </li>
              <li>
                die Verkehrsfläche (VF), die dem Zugang zu den Räumen, dem Verkehr innerhalb von Gebäuden oder zum
                Verlassen im Notfall dient.{" "}
              </li>
            </ul>
          </>
        ),
      },
    },
    {
      key: "BGF",
      value: passportData.buildingBaseData.bgf.toFixed(2),
      tooltip: {
        id: "bgf",
        content:
          "Brutto-Grundfläche eines Gebäudes, umfasst alle innerhalb der Gebäudehülle liegenden Flächen, gemessen bis zur Außenfläche der Außenwände.",
      },
    },
    {
      key: "BRI",
      value: passportData.buildingBaseData.bri.toFixed(2),
      tooltip: {
        id: "bri",
        content:
          "Brutto-Rauminhalt und bezieht sich auf das gesamte Volumen eines Gebäudes, einschließlich aller Innenräume und gemessen bis zur äußeren Begrenzung der Außenwände.",
      },
    },
    { key: "Grundstücksfläche", value: passportData.buildingBaseData.plotArea.toFixed(2) },
    { key: "Gesamtmasse des Gebäudes", value: passportData.buildingBaseData.totalBuildingMass.toFixed(0) },
  ]

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Gebaude-Informationen
      </h2>
      <SideBySideDescriptionListsWithHeadline data={buildingBaseInfoKeyValues} />
    </div>
  )
}

export default BuildingBaseInformation
