/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import md5 from "apache-md5"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { findUsersByAuthName } from "lib/domain-logic/users/findUsersByAuthName"

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

        const usersFromDb = await findUsersByAuthName(credentials.username)

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
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  session: {
    strategy: "jwt", // jwt is default value
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.auth_name = user.auth_name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.auth_name = token.auth_name as string
      }
      return session
    },
    async redirect() {
      if (!process.env.NEXTAUTH_URL) {
        return "/"
      }
      return process.env.NEXTAUTH_URL
    },
  },
  theme: {
    logo: "/elca_circularity_index_heading.png",
  },
}

export default authOptions
