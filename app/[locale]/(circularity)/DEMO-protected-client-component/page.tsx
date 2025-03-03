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
"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import UnauthenticatedRedirect from "../(components)/UnauthenticatedRedirect"

type SecretResource = {
  message: string
  user: {
    name: string
    email: string
    image: string
  }
}

const Page = () => {
  const { data: session } = useSession()

  const [secretData, setSecretData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/circularity/secret-resource/`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }
      const parsedResponse = (await response.json()) as SecretResource

      setSecretData(parsedResponse)
    }
    if (session != null) {
      fetchData()
    }
  }, [session])

  return (
    <div className="bg-gray-400">
      <dl>
        <dt className="text-xl font-bold">Secret data</dt>
        <dd>
          {session == null ? (
            <UnauthenticatedRedirect />
          ) : secretData ? (
            <>
              <dl>
                <dt className="font-bold">Message</dt>
                <dd>{secretData.message}</dd>
                <dt className="font-bold">Username</dt>
                <dd>{secretData.user.name}</dd>
                <dt className="font-bold">User Mail</dt>
                <dd>{secretData.user.email}</dd>
                <img src={secretData.user.image} alt={secretData.user.name} width={100} height={100} />
              </dl>
            </>
          ) : (
            "Loading..."
          )}
        </dd>
      </dl>
    </div>
  )
}

export default Page
