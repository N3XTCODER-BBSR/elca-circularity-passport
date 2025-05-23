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

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFormatter, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "react-hot-toast" // or whichever toast lib you prefer
import { twMerge } from "tailwind-merge"

import { ZodIssue } from "zod"
import { fromZodIssue } from "zod-validation-error"
import { createPassportForProjectVariantId } from "app/[locale]/(circularity)/(server-actions)/createPassportForProjectVariantId"
import { PassportMetadata } from "prisma/queries/db"

type ProjectPassportsProps = {
  passportsMetadata: PassportMetadata[]
  projectVariantId: number
  projectId: number
}

export default function ProjectPassports({ passportsMetadata, projectVariantId, projectId }: ProjectPassportsProps) {
  const projectPassportTranslations = useTranslations("CircularityTool.sections.passportsForProject")
  const t = useTranslations()
  const format = useFormatter()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const onCreatePassportClick = async () => {
    setIsLoading(true)
    const generatePassportResponse = await createPassportForProjectVariantId(projectVariantId, projectId)
    setIsLoading(false)
    if (generatePassportResponse.success) {
      router.refresh()
      toast.success("Passport successfully generated!")
    } else if (generatePassportResponse.errorI18nKey === "errors.validation") {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } pointer-events-auto flex w-full max-w-2xl rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
        >
          <div className="w-0 flex-1 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-orange-900">Error: Passport could not be generated!</p>
                <ul className="mt-1 text-sm text-gray-500">
                  {(generatePassportResponse.details as ZodIssue[]).map((zodIssue, i) => (
                    <li className="mb-4" key={i}>
                      {fromZodIssue(zodIssue).toString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ))
    } else {
      toast.error(t(generatePassportResponse.errorI18nKey))
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{projectPassportTranslations("title")}</h3>
      <table className="min-w-full divide-y rounded-3xl border-2 border-gray-200 ">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-900">
              {projectPassportTranslations("passIssueDate")}
            </th>
            <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-900">
              {projectPassportTranslations("passUuid")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {passportsMetadata.map((passportInstanceMetadata) => (
            <tr key={passportInstanceMetadata.uuid}>
              <td className="max-w-96 whitespace-normal break-words p-3 py-5 text-left text-sm text-gray-500">
                <Link href={`/grp/${passportInstanceMetadata.uuid}`} className="text-gray-900">
                  {format.dateTime(passportInstanceMetadata.issueDate, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </Link>
              </td>
              <td className="whitespace-nowrap p-3 py-5 text-sm text-gray-500">
                <span className={twMerge("inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium")}>
                  <Link href={`/grp/${passportInstanceMetadata.uuid}`} data-testid={`project-passports__passport-link`}>
                    #{passportInstanceMetadata.uuid}
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onCreatePassportClick}
        type="button"
        data-testid="project-passports__create-passport-button"
        className={twMerge(
          `h-8 rounded-md bg-indigo-100 px-2.5 text-sm font-semibold text-indigo-700 shadow-sm 
          hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
          focus-visible:outline-indigo-200`,
          isLoading ? "cursor-not-allowed opacity-70" : ""
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="size-4 animate-spin text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>{projectPassportTranslations("creatingPassport")}</span>
          </div>
        ) : (
          projectPassportTranslations("createPassport")
        )}
      </button>
    </div>
  )
}
