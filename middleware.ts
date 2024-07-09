import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ":").split(":")

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    })
  }

  // TODO: Feel free to remove this block
  if (request.headers?.get("host")?.includes("next-enterprise.vercel.app")) {
    return NextResponse.redirect("https://blazity.com/open-source/nextjs-enterprise-boilerplate", { status: 301 })
  }
}

function isAuthenticated(req: NextRequest) {
  const authheader = req.headers.get("authorization") || req.headers.get("Authorization")

  if (!authheader) {
    return false
  }

  const auth = Buffer.from(authheader.split(" ")[1]!, "base64").toString().split(":")
  const user = auth[0]
  const pass = auth[1]

  if (user === AUTH_USER && pass === AUTH_PASS) {
    return true
  } else {
    return false
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
