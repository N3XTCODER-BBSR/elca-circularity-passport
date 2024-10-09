import { Prisma } from "@prisma/client"
import { PassportData, PassportDataSchema } from "./passportSchema"

export const passportParser = (passportDataJson: Prisma.JsonValue) => {
  let jsonObj
  if (typeof passportDataJson === "string") {
    try {
      jsonObj = JSON.parse(passportDataJson)
    } catch (e) {
      throw e
    }
  } else {
    jsonObj = passportDataJson
  }

  const passportDataParsingResult = PassportDataSchema.safeParse(jsonObj)
  if (passportDataParsingResult.error) {
    console.error("Error parsing passport data", passportDataParsingResult.error)
    console.error("issues", passportDataParsingResult.error.issues)
    // TODO: show next.js error page
    throw new Error("Error parsing passport data")
  }

  const passportData: PassportData = passportDataParsingResult.data

  return passportData
}

export default passportParser
