import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // A list of all locales that are supported
  // TODO: not a big issue, but we could extract out all supported locales into a config file
  // and then use that here, as well as in the language switcher Dropdown
  // (app/[locale]/(web-optimized)/[passportId]/(components)/NavBar/Dropdown.tsx)
  locales: ["de", "en", "es"],

  // Used when no locale matches
  defaultLocale: "de",
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
