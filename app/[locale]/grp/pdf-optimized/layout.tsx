import "styles/print.global.css"

import { Inter as FontSans } from "next/font/google"
import { Metadata } from "next/types"
import { twMerge } from "tailwind-merge"
import { NextIntlClientProvider } from "next-intl"
import i18nFormattingOptions from "../(utils)/i18nFormattingOptions"
import { getMessages } from "next-intl/server"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "PDF View - Building Resource Passport",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()
  return (
    <html lang="en">
      <body className={twMerge("font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider formats={i18nFormattingOptions} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
