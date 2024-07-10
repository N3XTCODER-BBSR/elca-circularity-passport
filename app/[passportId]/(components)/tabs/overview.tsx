import prisma from "prisma/prismaClient"
import { Passport, PassportSchema } from "utils/zod/passportSchema"
import BuildingBaseInformation from "./modules/BuildingBaseInformation"
import Materials from "./modules/Materials"
import passportParser from "utils/zod/passportParser"

const Overview = async ({ uuid }: { uuid: string }) => {
  const passport = await prisma.passport.findFirst({
    where: {
      uuid: uuid,
    },
  })

  if (passport == null) {
    console.error("Passport not found")
    // TODO: show next.js error page
    return null
  }

  const passportData: Passport = passportParser(passport.passportData)

  return (
    <>
      <h1 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Ressourcenpass für Gebäude
      </h1>
      <p>
        Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin
      </p>
      <div className="mt-6 border-gray-100">
        <Materials buildingComponents={passportData.buildingComponents} />
        <BuildingBaseInformation passportData={passportData} />
      </div>
    </>
  )
}

export default Overview
