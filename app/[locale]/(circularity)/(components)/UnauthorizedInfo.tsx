"use client"

import { signIn } from "next-auth/react"

const UnauthorizedInfo = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You are not authorized to view this page.</p>
      <button onClick={() => signIn()}>Please sign in here</button>
    </div>
  )
}
export default UnauthorizedInfo
