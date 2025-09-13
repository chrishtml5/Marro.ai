import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Marro - The AI Client OS",
  description: "One place for clients to onboard, track progress, approve work, and see results.",
  generator: "v0.app",
  icons: {
    icon: "/images/marro-logo.png",
    shortcut: "/images/marro-logo.png",
    apple: "/images/marro-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`}>
      <head>
        <link rel="preload" href="/images/marro-logo.png" as="image" />
        <link rel="preload" href="/images/marro-logo-black.png" as="image" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
