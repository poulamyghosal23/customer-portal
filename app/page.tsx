"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { Filters } from "@/components/filters"
import { SpaceCard } from "@/components/space-card"
import { MapView } from "@/components/map-view"
import { SearchProvider } from "@/contexts/search-context"
import { FavoritesProvider, useFavorites } from "@/contexts/favorites-context"
import { Button } from "@/components/ui/button"
import {
  Map,
  List,
  ChevronUp,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Clock,
  Star,
  MapPin,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { SecondaryHeader } from "@/components/secondary-header"
import { useSearch } from "@/contexts/search-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Error } from "@/components/ui/error"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { useI18n } from "@/contexts/i18n-context"
import Image from "next/image"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useRouter } from "next/navigation"

const generateMockSpaces = (count: number) => {
  const mockImages = [
    "/placeholder.svg?height=600&width=800&text=Image1&bg=FF5733",
    "/placeholder.svg?height=600&width=800&text=Image2&bg=33FF57",
    "/placeholder.svg?height=600&width=800&text=Image3&bg=3357FF",
    "/placeholder.svg?height=600&width=800&text=Image4&bg=F333FF",
    "/placeholder.svg?height=600&width=800&text=Image5&bg=FF3333",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Space ${i + 1}`,
    images: [
      mockImages[i % mockImages.length],
      mockImages[(i + 1) % mockImages.length],
      mockImages[(i + 2) % mockImages.length],
    ],
    price: Math.floor(Math.random() * 100) + 50,
    capacity: Math.floor(Math.random() * 30) + 10,
    responseTime: "1 hr",
    bookingType: Math.random() > 0.5 ? "instant" : ("request" as const),
    location: { lat: 40.7128 + Math.random() * 0.1, lng: -74.006 + Math.random() * 0.1, price: 75 },
    distance: `${(Math.random() * 5).toFixed(1)} mi`,
    operatingHours: Math.random() > 0.5 ? "24/7" : "08:00 AM - 10:00 PM",
    rating: (Math.random() * 2 + 3).toFixed(1),
    spotsLeft: Math.floor(Math.random() * 10),
  }))
}

const initialSpaces = generateMockSpaces(20)
const nycCenter = { lat: 40.7128, lng: -74.006 }

function HomePage() {
  const { t } = useI18n()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<(typeof initialSpaces)[0]["location"]>()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { locationSearch } = useSearch()
  const [showMap, setShowMap] = useState(false)
  const [spaces, setSpaces] = useState(initialSpaces)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({})
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const router = useRouter()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastSpaceElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreSpaces()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const loadMoreSpaces = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      try {
        const newSpaces = generateMockSpaces(10)
        setSpaces((prevSpaces) => [...prevSpaces, ...newSpaces])
        setHasMore(spaces.length + newSpaces.length < 100)
      } catch (err) {
        setError("Failed to load more spaces. Please try again.")
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const toggleFavorite = (space: (typeof initialSpaces)[0]) => {
    if (isFavorite(space.id)) {
      removeFavorite(space.id)
    } else {
      addFavorite({
        id: space.id,
        title: space.title,
        location: space.distance,
        image: space.images[0],
        brandName: "Sample Brand",
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showMap) return
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showMap) return
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!showMap || !touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isSwipeDown = distance < -50
    const isSwipeUp = distance > 50

    if (isSwipeDown) {
      setIsMapExpanded(true)
    } else if (isSwipeUp) {
      setIsMapExpanded(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMapExpanded(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextImage = (e: React.MouseEvent, space: (typeof initialSpaces)[0]) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndices((prev) => ({
      ...prev,
      [space.id]: (prev[space.id] + 1) % space.images.length || 0,
    }))
  }

  const previousImage = (e: React.MouseEvent, space: (typeof initialSpaces)[0]) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndices((prev) => ({
      ...prev,
      [space.id]: (prev[space.id] - 1 + space.images.length) % space.images.length || 0,
    }))
  }

  const handleSpaceClick = (e: React.MouseEvent, spaceId: number) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    router.push(`/package/${spaceId}`)
  }

  const observerRef = useRef<IntersectionObserver | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <Header setIsFilterOpen={setIsFilterOpen} showMap={showMap} setShowMap={setShowMap} spaceCount={spaces.length} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: t("homePage.title"), href: "#" },
        ]}
        className="px-6 py-4"
      />
      <main className="flex-1 flex flex-col">
        <SecondaryHeader
          spaceCount={spaces.length}
          locationSearch={locationSearch}
          showMap={showMap}
          setShowMap={setShowMap}
        />
        <div className="flex-1 flex flex-col md:flex-row relative">
          {/* Map View */}
          {showMap && (
            <div className="fixed inset-0 z-10">
              <div className="absolute top-[73px] left-0 right-0 bottom-0">
                <MapView
                  center={nycCenter}
                  locations={spaces.map((space) => space.location)}
                  selectedLocation={selectedLocation}
                  onMarkerClick={setSelectedLocation}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex overflow-x-auto pb-6 space-x-4 scrollbar-hide">
                  {spaces.map((space) => {
                    const currentImageIndex = currentImageIndices[space.id] || 0

                    return (
                      <div
                        key={space.id}
                        className={`flex-shrink-0 cursor-pointer w-44 p-2`}
                        onClick={(e) => handleSpaceClick(e, space.id)}
                      >
                        <div
                          className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] ${
                            selectedSpaceId === space.id ? "ring-2 ring-blue-200" : "hover:ring-2 hover:ring-blue-200"
                          }`}
                        >
                          <div className={`relative aspect-[3/2]`}>
                            <Image
                              src={space.images[currentImageIndex] || "/placeholder.svg"}
                              alt={space.title}
                              layout="fill"
                              objectFit="cover"
                            />
                            {space.images.length > 1 && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {space.images.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${
                                      index === currentImageIndex ? "w-2 bg-white" : "w-1.5 bg-white/60"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            {space.images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    previousImage(e, space)
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white z-20"
                                  aria-label="Previous image"
                                >
                                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    nextImage(e, space)
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white z-20"
                                  aria-label="Next image"
                                >
                                  <ChevronRight className="h-4 w-4 text-gray-700" />
                                </button>
                              </>
                            )}
                            {space.bookingType && (
                              <div
                                className={`absolute top-2 right-2 p-1 rounded-full z-10 ${
                                  space.bookingType === "instant" ? "bg-blue-600" : "bg-white"
                                }`}
                              >
                                {space.bookingType === "instant" ? (
                                  <Zap className="h-3 w-3 text-white" />
                                ) : (
                                  <Clock className="h-3 w-3 text-blue-600" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`p-2 space-y-0.5`}>
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-gray-900 line-clamp-1">{space.title}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-blue-600 fill-current" />
                                <span className="text-sm text-gray-600">{space.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{space.distance}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{space.operatingHours}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="font-medium">From ${space.price}/hr</div>
                              {space.spotsLeft !== undefined && space.spotsLeft <= 3 && (
                                <span className="text-xs font-medium text-orange-600">
                                  Only {space.spotsLeft} spot{space.spotsLeft !== 1 ? "s" : ""} left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Regular Grid View */}
          <div
            className={`
              w-full md:w-[55%] px-6 pb-6 md:pt-6 overflow-auto 
              ${showMap ? "hidden" : "block"}
            `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {spaces.map((space, index) => {
                const cardRef = useRef<HTMLDivElement>(null)
                const isVisible = useIntersectionObserver({
                  target: cardRef,
                  threshold: 0.1,
                })

                return (
                  <div key={space.id} ref={cardRef} onClick={(e) => handleSpaceClick(e, space.id)}>
                    {isVisible && (
                      <SpaceCard
                        id={space.id}
                        title={space.title}
                        images={space.images}
                        price={space.price}
                        capacity={space.capacity}
                        responseTime={space.responseTime}
                        bookingType={space.bookingType}
                        isFavorite={isFavorite(space.id)}
                        onFavorite={() => toggleFavorite(space)}
                        distance={space.distance}
                        operatingHours={space.operatingHours}
                        rating={Number(space.rating)}
                        spotsLeft={space.spotsLeft}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}
            {loading && <p className="text-center mt-4">{t("homePage.loadingMore")}</p>}
            {!hasMore && <p className="text-center mt-4">{t("homePage.noMoreSpaces")}</p>}
            {error && <Error message={error} />}
          </div>

          {/* Desktop Map */}
          <div className={`w-full md:w-[45%] ${showMap ? "block" : "hidden md:block"}`}>
            <div className="sticky top-[73px] h-[calc(100vh-73px)]">
              <MapView
                center={nycCenter}
                locations={spaces.map((space) => space.location)}
                selectedLocation={selectedLocation}
                onMarkerClick={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </main>
      <Filters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}

export default function Page() {
  return (
    <SearchProvider>
      <FavoritesProvider>
        <HomePage />
      </FavoritesProvider>
    </SearchProvider>
  )
}

