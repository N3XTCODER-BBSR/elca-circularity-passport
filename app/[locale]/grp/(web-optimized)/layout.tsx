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
import "styles/global.css"
import { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { twMerge } from "tailwind-merge"
import i18nFormattingOptions from "../(utils)/i18nFormattingOptions"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Building Resource Passport",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://digitalbuildingpassport.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "",
      },
    ],
  },
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body className={twMerge("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider formats={i18nFormattingOptions} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
