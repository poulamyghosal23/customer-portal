"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { PackageDetails } from "@/components/package-details"
import { SearchProvider } from "@/contexts/search-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated mock data to include bookingType
const packageData = {
  id: 1,
  title: "Sleek Downtown Office Suite",
  description:
    "Experience productivity in our modern downtown office suite. Perfect for small teams or individual professionals, this space offers a blend of style and functionality in the heart of the city.",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  videos: [
    {
      url: "/placeholder-video.mp4",
      thumbnail: "/placeholder.svg?height=600&width=800",
    },
  ],
  price: 75,
  capacity: 20,
  responseTime: "1 hr",
  bookingType: "instant" as const,
  location: "123 Main St, New York, NY 10001",
  distance: "0.5 mi",
  operatingHours: {
    Monday: "24 hours",
    Tuesday: "24 hours",
    Wednesday: "24 hours",
    Thursday: "24 hours",
    Friday: "24 hours",
    Saturday: "24 hours",
    Sunday: "24 hours",
  },
  rating: 4.8,
  amenities: [
    "High-speed Wi-Fi",
    "Ergonomic chairs",
    "Standing desks",
    "Conference room",
    "Coffee machine",
    "Printing services",
    "Bike storage",
    "Shower facilities",
  ],
  host: {
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=100&width=100",
    responseRate: 98,
    avgResponseTime: "30 minutes",
    isSuperhost: true,
  },
  cancellationPolicy: "Flexible - Free cancellation up to 24 hours before the booking",
  houseRules: [
    "No smoking",
    "No pets",
    "No parties or events",
    "Check-in time is 9AM - 5PM",
    "Checkout by 5PM",
    "Quiet hours 9PM - 7AM",
  ],
}

export default function PackageDetailsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [packageDetails, setPackageDetails] = useState<typeof packageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()

  useEffect(() => {
    try {
      // In a real app, you would fetch the package details here based on the ID
      console.log("Fetching package details for ID:", params.id)
      // For now, we'll just use our mock data
      setPackageDetails(packageData)
      setError(null)
    } catch (err) {
      setError("Failed to load package details")
      console.error("Error loading package:", err)
    }
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
            <PackageDetails package={packageDetails} />
          </main>
        </div>
      </FavoritesProvider>
    </SearchProvider>
  )
}

