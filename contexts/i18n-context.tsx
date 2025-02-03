"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

type Translations = {
  [key: string]: string | Translations
}

type I18nContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: { [key: string]: Translations } = {
  en: {
    header: {
      search: "Search",
      location: "Location",
      messages: "Messages",
      myBookings: "My Bookings",
      paymentMethods: "Payment Methods",
      myTeam: "My Team",
      profile: "Profile",
      helpCenter: "Help Center",
      tools: "Tools",
      becomeAHost: "Become a Host",
      logOut: "Log out",
    },
    homePage: {
      title: "Search Results",
      loadingMore: "Loading more spaces...",
      noMoreSpaces: "No more spaces to load",
    },
    spaceCard: {
      from: "From",
      perHour: "/hr",
      instantBook: "Instant Book",
      requestBooking: "Request Booking",
    },
  },
  // Add other languages here
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en")

  const t = (key: string) => {
    const keys = key.split(".")
    let value: string | Translations = translations[locale]
    for (const k of keys) {
      if (typeof value === "object" && value !== null) {
        value = value[k]
      } else {
        return key // Return the key if translation is not found
      }
    }
    return typeof value === "string" ? value : key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

