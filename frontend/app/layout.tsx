import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast";

import { AIAssistant } from "@/components/ai-assistant"
import { AuthHydrationProvider } from "@/components/auth-hydration-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "SMF Jewels",
  description: "Discover exquisite handcrafted jewelry pieces. Premium diamonds, gold, and precious stones.",
  icons: {
    icon: "/butterfly.png", 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange=
        {false}>
        
         <AuthHydrationProvider>
           {children}
          <AIAssistant />
          <Toaster />
          
          </AuthHydrationProvider> 
        </ThemeProvider>
      </body>
    </html>
  )
}
