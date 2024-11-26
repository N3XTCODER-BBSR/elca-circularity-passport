import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ message: "This is a secret resource", user: session.user })
}
