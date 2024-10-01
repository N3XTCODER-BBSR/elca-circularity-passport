import { redirect } from "next/navigation"

export default async function UnauthorizedRedirect() {
  redirect("/api/auth/signin")
  return null
}
