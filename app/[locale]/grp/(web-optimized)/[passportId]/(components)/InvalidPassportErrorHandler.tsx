"use client"

import { ZodIssue } from "zod"
import { fromZodIssue } from "zod-validation-error"

type InvalidPassportErrorHandlerProps = {
  zodIssues: ZodIssue[]
}

export function InvalidPassportErrorHandler({ zodIssues }: InvalidPassportErrorHandlerProps) {
  return (
    <div className="flex flex-col items-start">
      <p className="text-sm font-medium text-orange-900">Error: Passport could not be queried!</p>
      <ul className="mt-1 text-sm text-gray-500">
        {zodIssues.map((zodIssue, i) => (
          <li className="mb-4" key={i}>
            {fromZodIssue(zodIssue).toString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
