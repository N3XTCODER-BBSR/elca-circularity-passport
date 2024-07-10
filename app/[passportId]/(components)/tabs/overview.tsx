import prisma from "prisma/prismaClient"
import { Passport, PassportSchema } from "utils/zod/passportSchema"
import Materials from "./modules/Materials"
import BuildingBaseInformation from "./modules/BuildingBaseInformation"

const Overview = async ({ uuid }: { uuid: string }) => {
  const passport = await prisma.passport.findFirst({
    where: {
      uuid: uuid
    },
  })

  if (passport == null) {
    console.error("Passport not found")
    // TODO: show next.js error page
    return null
  }

  let jsonObj
  if (typeof passport?.passportData === "string") {
    try {
      jsonObj = JSON.parse(passport.passportData)
    } catch (e) {
      console.error("Invalid JSON string", e)
    }
  } else {
    jsonObj = passport?.passportData
  }

  const passportDataParsingResult = PassportSchema.safeParse(jsonObj)
  if (passportDataParsingResult.error) {
    console.error("Error parsing passport data", passportDataParsingResult.error)
    // TODO: show next.js error page
    return null
  }

  const passportData: Passport = passportDataParsingResult.data

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
