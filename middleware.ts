import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  /*
//      * Match all request paths except for the ones starting with:
//      * public assets/api routes/_next
//      */
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
}
