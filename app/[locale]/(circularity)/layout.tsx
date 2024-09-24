import "styles/global.css"
import { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { twMerge } from "tailwind-merge"
import ClientProviders from "app/(utils)/client-providers"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Circularity Tool",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://circularity-elca.app/",
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
        <ClientProviders>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
