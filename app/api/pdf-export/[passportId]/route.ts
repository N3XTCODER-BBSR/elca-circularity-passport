import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { passportId: string } }) {
  const { passportId } = params

  //   const url = `https://${process.env.NEXT_PUBLIC_DOPPIO_PRINT_HOST}/pdf-optimized/${passportId}`
  const hostname = req.headers.get("host")
  const url = `https://${hostname}/pdf-optimized/${passportId}`

  const response = await fetch("https://api.doppio.sh/v1/render/pdf/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DOPPIO_API_KEY}`,
      //   "ngrok-skip-browser-warning": "foo",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: {
        pdf: {
          printBackground: true,
          preferCSSPageSize: true,
        },
        goto: {
          url,
          options: {
            waitUntil: ["networkidle2"],
          },
        },
      },
    }),
  })

  const data = await response.json()

  return NextResponse.json(data)
}
