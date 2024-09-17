import "styles/print.global.css"

import { Inter as FontSans } from "next/font/google"
import { Metadata } from "next/types"
import { twMerge } from "tailwind-merge"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge("font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  )
}
