"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { Filters } from "@/components/filters"
import { SpaceCard } from "@/components/space-card"
import { MapView } from "@/components/map-view"
import { SearchProvider, useSearch } from "@/contexts/search-context"
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
import { Space } from "@/interfaces/space"

const nycCenter = { lat: 40.712776, lng: -74.005974 }
const PAGE_SIZE = 20

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return NaN
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 3958.8 
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in miles
  return distance
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`
}

const calculateSpotsLeft = (space: any) => {
  console.log("space ", space)
  if (space.quantityUnlimited) {
    console.log("Unlimited spots left")
    return "Unlimited spots left"
  }
  const spotsLeft = space.quantity - space.usedQuantity
  console.log("spots left: ", spotsLeft)
  return `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`
}

function HomePage() {
  const { t } = useI18n()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { locationSearch } = useSearch()
  const [showMap, setShowMap] = useState(false)
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({})
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const initialLoad = useRef(true)

  const observer = useRef<IntersectionObserver | null>(null)
  // const apiURL = "https://dev-api.devhz.dropdesk.net"
  const apiURL = "http://localhost:4000"

  const fetchSpaces = async (page: number) => {
    setLoading(true)
    try {
      const brandId = 3
      const offset = (page - 1) * PAGE_SIZE
      const response = await fetch(`${apiURL}/space?status=Publish&offset=${offset}&limit=${PAGE_SIZE}&brandId=${brandId}`, { method: 'GET' })
      if (!response.ok) {
        console.error("Failed to load spaces:", response)
      }
      const data = await response.json()
      const spacesArray = data.data.map((space: any) => {
        const lat = space.venue.coordinates.coordinates[1]
        const lng = space.venue.coordinates.coordinates[0]
        const distance = calculateDistance(nycCenter.lat, nycCenter.lng, lat, lng)
        const operatingHours = `${formatTime(space.venue.accessHoursFrom)} - ${formatTime(space.venue.accessHoursTo)}`
        const spotsLeft = calculateSpotsLeft(space)
        const currency = space.venue.currency || 'USD'
        return {
          ...space,
          distance: isNaN(distance) ? 0 : distance,
          operatingHours,
          spotsLeft,
          currency
        }
      })
      setTotalCount(data.total)
      const totalCount = data.total
      setSpaces((prevSpaces) => [...prevSpaces, ...spacesArray])
      setHasMore(spaces.length + spacesArray.length < totalCount)
    } catch (err) {
      console.error("Failed to load spaces:", err)
      setError("Failed to load spaces. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialLoad.current) {
      fetchSpaces(1)
      initialLoad.current = false
    }
  }, [])

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
    const nextPage = Math.ceil(spaces.length / PAGE_SIZE) + 1
    fetchSpaces(nextPage)
  }

  const toggleFavorite = (space: Space) => {
    if (isFavorite(space.id)) {
      removeFavorite(space.id)
    } else {
      addFavorite({
        id: space.id,
        title: space.name,
        location: space.venue,
        image: space.photos[0]?.url || "/placeholder.svg",
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

  const nextImage = (e: React.MouseEvent, space: Space) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndices((prev) => ({
      ...prev,
      [space.id]: (prev[space.id] + 1) % space.photos.length || 0,
    }))
  }

  const previousImage = (e: React.MouseEvent, space: Space) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndices((prev) => ({
      ...prev,
      [space.id]: (prev[space.id] - 1 + space.photos.length) % space.photos.length || 0,
    }))
  }

  const handleSpaceClick = (e: React.MouseEvent, spaceId: number) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    router.push(`/package/${spaceId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header setIsFilterOpen={setIsFilterOpen} showMap={showMap} setShowMap={setShowMap} spaceCount={spaces.length} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: t("homePage.title"), href: "#" },
        ]}
      />
      <main className="flex-1 flex flex-col">
        <SecondaryHeader
          spaceCount={totalCount}
          locationSearch={locationSearch}
          showMap={showMap}
          setShowMap={setShowMap}
        />
        <div className="flex-1 flex flex-col md:flex-row relative">
          {/* Map View */}
          {showMap && (
            <div className="fixed inset-0 z-10">
              <div className="absolute bottom-0 left-0 right-0 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex overflow-x-auto pb-6 space-x-4 scrollbar-hide">
                  {spaces.map((space) => {
                    const currentImageIndex = space.id !== undefined ? currentImageIndices[space.id] || 0 : 0
                    const imageUrl = Array.isArray(space.photos) && space.photos.length > 0 ? space.photos[0].url : "/placeholder.svg"

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
                              src={imageUrl}
                              alt={space.name}
                              layout="fill"
                              objectFit="cover"
                            />
                            {space.photos.length > 1 && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {space.photos.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${
                                      index === currentImageIndex ? "w-2 bg-white" : "w-1.5 bg-white/60"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            {space.photos.length > 1 && (
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
                            {space.instantlyBookable && (
                              <div
                                className={`absolute top-2 right-2 p-1 rounded-full z-10 ${
                                  space.instantlyBookable ? "bg-blue-600" : "bg-white"
                                }`}
                              >
                                {space.instantlyBookable ? (
                                  <Zap className="h-3 w-3 text-white" />
                                ) : (
                                  <Clock className="h-3 w-3 text-blue-600" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`p-2 space-y-0.5`}>
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-gray-900 line-clamp-1">{space.name}</h3>
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

          <div
          className={`
            w-full md:w-[55%] px-6 pb-6 md:pt-6 overflow-auto 
            ${showMap ? "hidden" : "block"}
          `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {spaces.map((space, index) => {
                const isVisible = true
                const distanceText = `${space.distance.toFixed(2)} mi`

                return (
                  <div key={`${space.id}-${index}`} ref={(el) => (cardRefs.current[space.id] = el)} onClick={(e) => handleSpaceClick(e, space.id)}>
                    {isVisible && (
                      <SpaceCard
                        id={space.id}
                        title={space.name}
                        images={space.photos}
                        price={space.price}
                        capacity={space.capacity}
                        bookingType={space.instantlyBookable ? "instant" : "request"}
                        distance={distanceText}
                        operatingHours={space.operatingHours}
                        rating={Number(5)}
                        spotsLeft={space.spotsLeft}
                        currency={space.currency}
                      />
                    )}
                  </div>
                )
              })}
              <div ref={lastSpaceElementRef} />
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

          <div className={`w-full md:w-[45%] ${showMap ? "block" : "hidden md:block"}`}>
            <div className="sticky top-[73px] h-[calc(100vh-73px)]">
              <MapView
                spaces={spaces}
                center={nycCenter}
                onMarkerClick={setSelectedLocation}
                activeSpaceId={selectedSpaceId?.toString() || null}
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

