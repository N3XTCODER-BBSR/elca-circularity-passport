import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { NextRequest } from "next/server"

const intlMiddleware = createMiddleware(routing)

const middleware = (request: NextRequest) => {
  const response = intlMiddleware(request)

  const requestId = crypto.randomUUID()

  response.headers.set("X-Request-ID", requestId)

  return response
}

export const config = {
  /*
//      * Match all request paths except for the ones starting with:
//      * public assets/api routes/_next
//      */
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
}

export default middleware
