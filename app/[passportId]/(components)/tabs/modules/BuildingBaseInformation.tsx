"use client"

import Tooltip from "components/Tooltip"
import { PassportData } from "utils/zod/passportSchema"

type BuildingBaseInformationProps = {
  passportData: PassportData
  className?: string // Add className as an optional prop
}

const BuildingBaseInformation: React.FC<BuildingBaseInformationProps> = ({ passportData, className }) => {
  const sealedPropertyAreaProportionAsPercentageStr = `${(
    passportData.buildingBaseData.sealedPropertyAreaProportion * 100
  ).toFixed(2)}%`

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Gebaude-Informationen
      </h2>
      <dl className="divide-y divide-gray-100">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 lg:border-r-2">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gebäude/Bauwerk-ID:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingStructureId}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Adresse:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.address}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Baujahr:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingYear}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gebäudetyp:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.buildingType}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Geschossanzahl des Gebäudes:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.numberOfFloors}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="flex text-sm font-bold leading-6 text-gray-900">
                <Tooltip id="#nrf">
                  Unter Netto-Raumfläche (NRF) versteht man die Summe der nutzbaren Grundflächen eines Gebäudes. Zur
                  Berechnung wird sie gemäß nebenstehender Tabelle nochmals in Nutzungsgruppen unterteilt in:{" "}
                  <ul className="list-disc">
                    <li>
                      die Nutzungsfläche (NUF) als zum sinngemäßen Gebrauch eines Gebäudes effektiv nutzbare Grundfläche{" "}
                    </li>
                    <li>
                      die Technikfläche (TF), die der zur Unterbringung von zentralen haustechnischen Anlagen dient (z.
                      B. Heizung, Maschinenraum für den Aufzug, Raum für Betrieb von Klimaanlagen)
                    </li>
                    <li>
                      die Verkehrsfläche (VF), die dem Zugang zu den Räumen, dem Verkehr innerhalb von Gebäuden oder zum
                      Verlassen im Notfall dient.{" "}
                    </li>
                  </ul>
                </Tooltip>
                NRF:
              </dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.nrf} m²
              </dd>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="flex text-sm font-bold leading-6 text-gray-900">
                <Tooltip id="bgf">
                  Brutto-Grundfläche eines Gebäudes, umfasst alle innerhalb der Gebäudehülle liegenden Flächen, gemessen
                  bis zur Außenfläche der Außenwände.
                </Tooltip>
                BGF:
              </dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.bgf} m²
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="flex text-sm font-bold leading-6 text-gray-900">
                <Tooltip id="bri">
                  Brutto-Rauminhalt und bezieht sich auf das gesamte Volumen eines Gebäudes, einschließlich aller
                  Innenräume und gemessen bis zur äußeren Begrenzung der Außenwände.
                </Tooltip>
                BRI:
              </dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.bri} m³
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Grundstücksfläche:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData.buildingBaseData.plotArea} m²
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="flex text-sm font-bold leading-6 text-gray-900">
                {" "}
                <Tooltip id="spap">
                  Anteil versiegelte Grundstücksfläche: Der prozentuale Anteil der Grundstücksfläche, die durch bauliche
                  Maßnahmen wie Gebäude, Straßen oder Parkplätze bedeckt ist und damit Wasser und natürliche Abflüsse
                  behindert.
                </Tooltip>
                Anteil versiegelte Grundstücksfläche:
              </dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {sealedPropertyAreaProportionAsPercentageStr}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Gesamtmasse des Gebäudes:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.totalBuildingMass}t
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
              <dt className="text-sm font-bold leading-6 text-gray-900">Datenqualität:</dt>
              <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                {passportData?.buildingBaseData.dataQuality}
              </dd>
            </div>
          </div>
        </div>
      </dl>
    </div>
  )
}

export default BuildingBaseInformation
