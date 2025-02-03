import "@/styles/globals.css"
import { Urbanist, Chivo } from "next/font/google"
import { Footer } from "@/components/footer"
import { SearchProvider } from "@/contexts/search-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { I18nProvider } from "@/contexts/i18n-context"

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-chivo",
  display: "swap",
  weight: ["400", "700"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${urbanist.variable} ${chivo.variable} font-sans`}>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <SearchProvider>
            <FavoritesProvider>
              {children}
              <Footer />
            </FavoritesProvider>
          </SearchProvider>
        </I18nProvider>
      </body>
    </html>
  )
}



import './globals.css'