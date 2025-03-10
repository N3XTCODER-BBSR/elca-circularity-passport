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
import { AccordionItemProps, AccordionItem as Item } from "@szhsin/react-accordion"
import Image from "next/image"

interface CustomAccordionItemProps extends Omit<AccordionItemProps, "header"> {
  header: React.ReactNode
  rest?: any
}

export const AccordionItem: React.FC<CustomAccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        <b>{header}</b>
        <Image
          src="/chevron-down.svg"
          width={24}
          height={24}
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
          alt="Chevron"
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) => `flex w-full p-4 text-left hover:bg-slate-100 ${isEnter && "bg-slate-200"}`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-4" }}
  />
)

export const AccordionItemFull: React.FC<CustomAccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <Image
          src="/chevron-down.svg"
          width={24}
          height={24}
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
          alt="Chevron"
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full pt-4 pb-4 font-semibold text-left text-lg leading-6 text-gray-900 hover:bg-slate-100 ${
          isEnter && ""
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "mt-4" }}
  />
)

export const AccordionItemFullSimple: React.FC<CustomAccordionItemProps & { testId: string }> = ({
  header,
  testId,
  ...rest
}) => {
  const buttonTestId = testId ? `accordion__button__${testId}` : undefined

  return (
    <Item
      {...rest}
      header={({ state: { isEnter } }) => (
        <>
          {header}
          <Image
            src="/chevron-down.svg"
            width={24}
            height={24}
            className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
            alt="Chevron"
          />
        </>
      )}
      buttonProps={{
        className: ({ isEnter }) =>
          `flex w-full mt-4 min-height-8 max-height-8 font-semibold text-left text-lg leading-6 text-gray-900 hover:bg-slate-100 ${
            isEnter && ""
          }`,
        "data-testid": buttonTestId,
      }}
      contentProps={{
        className: "transition-height duration-200 ease-out",
      }}
      panelProps={{ className: "mt-4" }}
    />
  )
}
