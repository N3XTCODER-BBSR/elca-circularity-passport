import "styles/global.css"
import { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { twMerge } from "tailwind-merge"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  )
}
