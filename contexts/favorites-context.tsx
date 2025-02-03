"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface Space {
  id: number
  title: string
  location: string
  image: string
  brandName: string
}

interface FavoritesContextType {
  favorites: Space[]
  addFavorite: (space: Space) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Space[]>([
    {
      id: 101,
      title: "Sunny Downtown Studio",
      location: "New York, NY",
      image: "/placeholder.svg",
      brandName: "Urban Oasis Spaces",
    },
    {
      id: 102,
      title: "Quiet Mountain Retreat",
      location: "Denver, CO",
      image: "/placeholder.svg",
      brandName: "Mountain View Workspaces",
    },
    {
      id: 103,
      title: "Beachfront Workspace",
      location: "Miami, FL",
      image: "/placeholder.svg",
      brandName: "Coastal Coworking",
    },
  ])

  const addFavorite = (space: Space) => {
    setFavorites((prev) => [...prev, space])
  }

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((space) => space.id !== id))
  }

  const isFavorite = (id: number) => {
    return favorites.some((space) => space.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

