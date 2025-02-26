import { NextResponse } from "next/server"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"

export async function GET() {
  const healthResponse = {
    server: "ok",
    databases: {
      legacyDb: "ok",
      newDb: "ok",
    },
  }

  try {
    await legacyDbDalInstance.healthCheck()
  } catch (error) {
    healthResponse.databases.legacyDb = "error"
  }

  try {
    await dbDalInstance.healthCheck()
  } catch (error) {
    healthResponse.databases.newDb = "error"
  }

  const status = healthResponse.databases.legacyDb === "ok" && healthResponse.databases.newDb === "ok" ? 200 : 500

  return NextResponse.json(healthResponse, { status })
}
