"use client"

import { useState, useCallback, useEffect } from "react"
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api"
import { cn } from "@/lib/utils"
import type { Space } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, Clock, Zap, MapPin } from "lucide-react"

interface MapViewProps {
  spaces?: Space[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (space: Space) => void
  activeSpaceId?: string | null
}

const containerStyle = {
  width: "100%",
  height: "100%",
}

function PackagePreview({ space }: { space: Space }) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % (space.images?.length || 1))
  }

  const previousImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + (space.images?.length || 1)) % (space.images?.length || 1))
  }

  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden cursor-pointer w-[200px]"
      onClick={() => router.push(`/package/${space.id}`)}
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={space.images?.[currentImageIndex] || space.image || "/placeholder.svg"}
          alt={space.name}
          fill
          className="object-cover"
        />
        {space.images?.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white z-20"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white z-20"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-blue-600 fill-current" />
          <span className="text-xs font-medium text-gray-700">{space.rating?.toFixed(1)}</span>
        </div>
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
      <div className="bg-white p-3 space-y-1">
        <h3 className="font-medium text-gray-900 line-clamp-1">{space.name}</h3>
        <div className="flex items-center text-gray-600 text-xs gap-1">
          <MapPin className="h-4 w-4" />
          <span>{space.distance} away</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs gap-1">
          <Clock className="h-3 w-3" />
          <span>{space.hours || "9:00 AM - 5:00 PM"}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="font-medium">${space.price}/hr</div>
          {space.availableSpots !== undefined && space.availableSpots <= 3 && (
            <span className="text-xs font-medium text-red-500">
              {space.availableSpots} spot{space.availableSpots !== 1 ? "s" : ""} left!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function PriceMarker({
  space,
  isActive,
  onClick,
  showPreview,
}: { space: Space; isActive?: boolean; onClick: () => void; showPreview: boolean }) {
  return (
    <div
      className={cn(
        "transform-gpu transition-transform duration-200 ease-in-out cursor-pointer",
        "hover:scale-110 hover:z-10",
        isActive ? "z-20 scale-110" : "z-0",
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-full shadow-md",
          "bg-blue-600 text-white",
          "flex items-center justify-center",
          "border border-blue-700",
          "font-medium text-sm",
          "shadow-lg",
          isActive ? "ring-2 ring-blue-300" : "",
        )}
        style={{
          minWidth: "60px",
          height: "32px",
        }}
        onClick={onClick}
      >
        ${space.price}
      </div>
      {showPreview && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden md:block z-30">
          <PackagePreview space={space} />
        </div>
      )}
    </div>
  )
}

// Mock spaces data for New York
const mockSpaces = [
  {
    id: "1",
    name: "Midtown Studio",
    price: 145,
    latitude: 40.7549,
    longitude: -73.984,
    location: "Midtown, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.5,
    distance: "0.5 miles",
    hours: "9:00 AM - 5:00 PM",
    bookingType: "instant",
    availableSpots: 2,
  },
  {
    id: "2",
    name: "SoHo Space",
    price: 165,
    latitude: 40.7233,
    longitude: -74.003,
    location: "SoHo, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.2,
    distance: "1.2 miles",
    hours: "10:00 AM - 6:00 PM",
    bookingType: "request",
    availableSpots: 1,
  },
  {
    id: "3",
    name: "Chelsea Office",
    price: 128,
    latitude: 40.7466,
    longitude: -74.0012,
    location: "Chelsea, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.8,
    distance: "0.8 miles",
    hours: "9:00 AM - 5:00 PM",
    bookingType: "instant",
    availableSpots: 5,
  },
  {
    id: "4",
    name: "East Village Desk",
    price: 98,
    latitude: 40.7264,
    longitude: -73.9818,
    location: "East Village, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4,
    distance: "1.5 miles",
    hours: "10:00 AM - 6:00 PM",
    bookingType: "request",
    availableSpots: 0,
  },
  {
    id: "5",
    name: "Financial District Hub",
    price: 175,
    latitude: 40.7075,
    longitude: -74.0021,
    location: "Financial District, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.6,
    distance: "2 miles",
    hours: "9:00 AM - 5:00 PM",
    bookingType: "instant",
    availableSpots: 3,
  },
  {
    id: "6",
    name: "Upper West Side Studio",
    price: 135,
    latitude: 40.787,
    longitude: -73.9754,
    location: "Upper West Side, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.3,
    distance: "2.5 miles",
    hours: "9:00 AM - 5:00 PM",
    bookingType: "request",
    availableSpots: 1,
  },
  {
    id: "7",
    name: "Tribeca Office",
    price: 185,
    latitude: 40.7195,
    longitude: -74.0089,
    location: "Tribeca, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.9,
    distance: "1 mile",
    hours: "9:00 AM - 5:00 PM",
    bookingType: "instant",
    availableSpots: 4,
  },
  {
    id: "8",
    name: "Greenwich Village Space",
    price: 155,
    latitude: 40.7339,
    longitude: -73.9976,
    location: "Greenwich Village, NY",
    image: "/placeholder.svg",
    images: [],
    rating: 4.7,
    distance: "1.8 miles",
    hours: "10:00 AM - 6:00 PM",
    bookingType: "instant",
    availableSpots: 2,
  },
]

export function MapView({
  spaces = mockSpaces,
  center = { lat: 40.7128, lng: -74.006 }, // New York coordinates
  zoom = 13,
  onMarkerClick,
  activeSpaceId,
}: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [clickedMarker, setClickedMarker] = useState<string | null>(null)

  useEffect(() => {
    if (map) {
      const listener = map.addListener("click", () => {
        if (clickedMarker) {
          setClickedMarker(null)
        }
      })

      return () => {
        google.maps.event.removeListener(listener)
      }
    }
  }, [map, clickedMarker])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)

    map.addListener("click", () => {
      if (clickedMarker) {
        setClickedMarker(null)
      }
    })
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [map])

  if (!isLoaded) return <div>Loading...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        fullscreenControl: false,
        zoomControl: true,
        clickableIcons: false,
        styles: [], // Remove all custom styles to keep the map bright
      }}
    >
      {spaces.map((space) => (
        <OverlayView
          key={space.id}
          position={{ lat: space.latitude, lng: space.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <PriceMarker
            space={space}
            isActive={activeSpaceId === space.id || clickedMarker === space.id}
            onClick={(e) => {
              e.stopPropagation()
              onMarkerClick?.(space)
              setClickedMarker(clickedMarker === space.id ? null : space.id)

              // Add mobile scroll behavior
              if (window.innerWidth < 768) {
                const spaceCard = document.getElementById(`space-${space.id}`)
                if (spaceCard) {
                  spaceCard.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              }
            }}
            showPreview={clickedMarker === space.id}
          />
        </OverlayView>
      ))}
    </GoogleMap>
  )
}

