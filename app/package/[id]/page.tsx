"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { PackageDetails } from "@/components/package-details"
import { SearchProvider } from "@/contexts/search-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Space } from "@/interfaces/space"

const apiURL = "http://localhost:4000"

export default function PackageDetailsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [packageDetails, setPackageDetails] = useState<Space | null>(null)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`${apiURL}/space/${params.id}`, { method: 'GET' })
        if (!response.ok) {
          throw new Error("Failed to load package details")
        }
        const data = await response.json().then((data) => data.data)
        console.log("Package details:", data)
        const amenities = data.amenities?.map((item: any) => item.amenity.name) || []
        console.log("amenities:", amenities)
        console.log("Currency: ",data.venue.currency)
        setPackageDetails({ ...data, amenities })
        setError(null)
      } catch (err) {
        setError("Failed to load package details")
        console.error("Error loading package:", err)
      }
    }

    fetchPackageDetails()
  }, [params.id])

  if (error) {
    return (
      <SearchProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col">
            <Header setIsFilterOpen={setIsFilterOpen} />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
                <p className="text-gray-600">{error}</p>
              </div>
            </main>
          </div>
        </FavoritesProvider>
      </SearchProvider>
    )
  }

  if (!packageDetails) {
    return (
      <SearchProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col">
            <Header setIsFilterOpen={setIsFilterOpen} />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto text-center">
                <div className="animate-pulse">
                  <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 mx-auto"></div>
                  <div className="h-96 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 mx-auto"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
            </main>
          </div>
        </FavoritesProvider>
      </SearchProvider>
    )
  }

  return (
    <SearchProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col">
          <Header setIsFilterOpen={setIsFilterOpen} />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="mb-4 text-blue-400 hover:text-blue-500 hover:bg-blue-50"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            {console.log("Package description:", packageDetails?.description)}
            <PackageDetails package={packageDetails} description={packageDetails?.description} />
          </main>
        </div>
      </FavoritesProvider>
    </SearchProvider>
  )
}

