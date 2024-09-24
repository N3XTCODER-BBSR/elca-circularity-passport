// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    auth_name: string
  }

  interface Session {
    user: {
      id: string
      auth_name: string
    }
  }

  interface JWT {
    id: string
    auth_name: string
  }
}
