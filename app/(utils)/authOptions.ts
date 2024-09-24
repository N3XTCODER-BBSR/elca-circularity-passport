import md5 from "apache-md5"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { query } from "lib/elca-legacy-db"

const validatePassword = (plainPassword: string, hashedPassword: string) =>
  md5(plainPassword, hashedPassword) === hashedPassword

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Authorizing user...")
        if (!credentials) {
          return null
        }

        // Fetch the user from the legacy PostgreSQL database
        const result = await query(
          `SELECT id, auth_name, auth_key AS hashed_password 
            FROM public.users 
            WHERE auth_name = $1 
            LIMIT 1`,
          [credentials.username]
        )

        if (result.rows.length === 0) {
          console.error("No user found.")
          return null // No user found
        }

        if (result.rows.length > 1) {
          console.error(`Multiple users found with username ${credentials.username}`)
          return null
        }

        const userFromDb = result.rows[0]

        if (userFromDb?.hashed_password === null) {
          // TODO: improve logging details
          console.error("User has no password!")
          return null
        }

        const passwordValid = validatePassword(credentials.password, userFromDb.hashed_password)

        if (passwordValid) {
          console.log("Password is valid!")
        } else {
          console.log("Password is invalid.")
        }

        if (passwordValid) {
          // If the password is valid, return the user object
          console.log("User authorized!")
          return {
            id: userFromDb.id,
            auth_name: userFromDb.auth_name,
          }
        } else {
          console.error("Invalid password.")
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign-in, add custom properties to the token
        token.id = user.id
        token.auth_name = user.auth_name
      }
      return token
    },
    async session({ session, token }) {
      // Add custom properties to the session from the token
      if (token) {
        session.user.id = token.id as string
        session.user.auth_name = token.auth_name as string
      }
      return session
    },
  },
}

export default authOptions
