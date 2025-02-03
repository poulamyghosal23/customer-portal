'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SearchContextType {
  spaceSearch: string
  locationSearch: string
  selectedTags: string[]
  setSpaceSearch: (search: string) => void
  setLocationSearch: (location: string) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [spaceSearch, setSpaceSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('Long Beach, NY')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const addTag = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag])
  }

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <SearchContext.Provider value={{
      spaceSearch,
      locationSearch,
      selectedTags,
      setSpaceSearch,
      setLocationSearch,
      addTag,
      removeTag
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

