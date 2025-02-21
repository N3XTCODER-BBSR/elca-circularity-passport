import { headers } from "next/headers"

export const getRequestId = () => {
  return headers().get("X-Request-ID")
}
