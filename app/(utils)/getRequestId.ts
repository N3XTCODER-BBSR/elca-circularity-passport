import { headers } from "next/headers"

export const getRequestId = () => {
  if (process.env.NODE_ENV === "test") {
    return "test-request-id"
  }

  return headers().get("X-Request-ID")
}
