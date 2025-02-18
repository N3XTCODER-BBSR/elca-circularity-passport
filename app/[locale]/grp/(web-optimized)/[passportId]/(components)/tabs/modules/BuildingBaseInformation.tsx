"use client"

import { useFormatter, useTranslations } from "next-intl"
import SideBySideDescriptionListsWithHeadline, {
  KeyValueTuple,
} from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

type BuildingBaseInformationProps = {
  passportData: DinEnrichedPassportData
  className?: string // Add className as an optional prop
}

const BuildingBaseInformation: React.FC<BuildingBaseInformationProps> = ({ passportData, className }) => {
  const t = useTranslations("Grp.Web.sections.overview.buildingBaseInformation")
  const format = useFormatter()

  const buildingBaseInfoKeyValues: KeyValueTuple[] = [
    {
      key: t("buildingId"),
      value: Object.entries(passportData.buildingBaseData.buildingStructureId)
        .filter(([_key, value]) => value != null)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; "),
    },
    {
      key: t("coordinates"),
      value: `${passportData.buildingBaseData.coordinates.latitude}, ${passportData.buildingBaseData.coordinates.longitude}`,
    },
    { key: t("address"), value: passportData.buildingBaseData.address },
    { key: t("yearOfBuildingPermit"), value: passportData.buildingBaseData.buildingPermitYear },
    { key: t("yearOfCompletion"), value: passportData.buildingBaseData.buildingCompletionYear },
    { key: t("numberOfAboveGroundFloors"), value: passportData.buildingBaseData.numberOfUpperFloors },
    { key: t("numberOfUndergroundFloors"), value: passportData.buildingBaseData.numberOfBasementFloors },
    {
      key: t("netFloorArea.abbreviation"),
      value: format.number(passportData.buildingBaseData.nrf, { maximumFractionDigits: 2 }) + " m2",
      testId: "nrf",
      tooltip: {
        id: "nrf",
        content: (
          <>
            {t("netFloorArea.description.intro")}{" "}
            <ul className="list-disc">
              <li>{t("netFloorArea.description.point1")} </li>
              <li>{t("netFloorArea.description.point2")}</li>
              <li>{t("netFloorArea.description.point3")} </li>
            </ul>
          </>
        ),
      },
    },
    {
      key: t("grossFloorArea.abbreviation"),
      value: format.number(passportData.buildingBaseData.bgf, { maximumFractionDigits: 2 }) + " m2",
      tooltip: {
        id: "bgf",
        content: t("grossFloorArea.description"),
      },
    },
    {
      key: t("grossVolume.abbreviation"),
      value: format.number(passportData.buildingBaseData.bri, { maximumFractionDigits: 2 }) + " m3",
      tooltip: {
        id: "bri",
        content: t("grossVolume.description"),
      },
    },
    {
      key: t("plotArea"),
      value: format.number(passportData.buildingBaseData.plotArea, { maximumFractionDigits: 2 }) + " m2",
    },
    {
      key: t("totalBuildingMass"),
      value: format.number(passportData.buildingBaseData.totalBuildingMass, { maximumFractionDigits: 1 }) + " kg",
      testId: "total-building-mass",
    },
  ]

  return (
    <div className={className}>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        {t("title")}
      </h2>
      <SideBySideDescriptionListsWithHeadline data={buildingBaseInfoKeyValues} />
    </div>
  )
}

export default BuildingBaseInformation
