import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SessionProviderWrapper } from "@/components/session-provider"
import "./globals.css"
import RecyclingChatbot from "@/components/chatbot"

export const metadata: Metadata = {
  title: "EcoQuiz - Aprende Reciclaje",
  description: "Aplicación educativa de reciclaje con quizzes interactivos",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#4caf50",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <Suspense fallback={null}>{children}</Suspense>
        </SessionProviderWrapper>
        <Analytics />
        <RecyclingChatbot />
      </body>
    </html>
  )
}
