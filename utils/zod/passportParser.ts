import { Prisma } from "@prisma/client"
import { Passport, PassportSchema } from "./passportSchema"

const passportParser = (passportDataJson: Prisma.JsonValue) => {
  let jsonObj
  if (typeof passportDataJson === "string") {
    try {
      jsonObj = JSON.parse(passportDataJson)
    } catch (e) {
      console.error("Invalid JSON string", e)
      throw new Error("Invalid JSON string")
    }
  } else {
    jsonObj = passportDataJson
  }

  const passportDataParsingResult = PassportSchema.safeParse(jsonObj)
  if (passportDataParsingResult.error) {
    console.error("Error parsing passport data", passportDataParsingResult.error)
    // TODO: show next.js error page
    throw new Error("Error parsing passport data")
  }

  const passportData: Passport = passportDataParsingResult.data

  return passportData
}

export default passportParser
