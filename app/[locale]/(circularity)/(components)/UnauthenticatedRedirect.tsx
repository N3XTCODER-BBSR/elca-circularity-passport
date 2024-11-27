import { redirect } from "next/navigation"

export default function UnauthenticatedRedirect() {
  return redirect("/api/auth/signin")
}
