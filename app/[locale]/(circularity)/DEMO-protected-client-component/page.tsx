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
