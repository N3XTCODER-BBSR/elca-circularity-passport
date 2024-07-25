import { PassportData } from "utils/zod/passportSchema"
import BuildingBaseInformation from "./modules/BuildingBaseInformation"
import Circularity from "./modules/Circularity/Circularity"
import Materials from "./modules/Materials/Materials"
import Resources from "./modules/Resources/Resources"

const Overview = async ({ passportData }: { passportData: PassportData }) => {
  return (
    <>
      <h1 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Ressourcenpass für Gebäude
      </h1>
      <p>
        Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin
      </p>
      <div className="mt-6 border-gray-100">
        <Materials buildingComponents={passportData.buildingComponents} className="mt-16" />
        <Resources
          buildingComponents={passportData.buildingComponents}
          nrf={passportData.buildingBaseData.nrf}
          className="mt-16"
        />
        <Circularity buildingComponents={passportData.buildingComponents} className="mt-16" />
        <BuildingBaseInformation passportData={passportData} className="mt-16" />
      </div>
    </>
  )
}

export default Overview
