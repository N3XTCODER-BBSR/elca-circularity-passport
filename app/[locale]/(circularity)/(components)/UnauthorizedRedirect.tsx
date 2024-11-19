import { redirect } from "next/navigation"

export default async function UnauthorizedRedirect() {
  return redirect("/api/auth/signin")
}
