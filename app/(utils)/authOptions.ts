import md5 from "apache-md5"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prismaLegacy } from "prisma/prismaClient"

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
          console.error("No credentials provided.")
          return null
        }

        const usersFromDb = await prismaLegacy.users.findMany({
          where: {
            auth_name: credentials.username,
          },
          select: {
            id: true,
            auth_name: true,
            auth_key: true,
          },
        })

        if (usersFromDb.length === 0) {
          console.error("No user found.")
          return null // No user found
        }

        if (usersFromDb.length > 1) {
          console.error(`Multiple users found with username ${credentials.username}`)
          return null
        }

        const userFromDb = {
          id: String(usersFromDb[0]!.id),
          auth_name: usersFromDb[0]!.auth_name,
          hashed_password: usersFromDb[0]!.auth_key,
        }

        if (userFromDb?.hashed_password === null) {
          // TODO: improve logging details
          console.error("User has no password!")
          return null
        }

        const passwordIsValid = validatePassword(credentials.password, userFromDb.hashed_password)

        if (passwordIsValid) {
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
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("jwt token :>> ", token)
      // console.log("jwt user :>> ", user)
      if (user) {
        // Initial sign-in, add custom properties to the token
        token.id = user.id
        token.auth_name = user.auth_name
      }
      return token
    },
    async session({ session, token }) {
      // console.log("session token :>> ", token)
      // console.log("session session :>> ", session)
      // Add custom properties to the session from the token
      if (token) {
        session.user.id = token.id as string
        session.user.auth_name = token.auth_name as string
      }
      return session
    },
  },
  theme: {
    logo: "/elca_circularity_index_heading.png",
  },
}

export default authOptions
