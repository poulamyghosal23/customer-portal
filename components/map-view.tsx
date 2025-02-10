"use client"

import { useState, useCallback, useEffect } from "react"
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api"
import { cn } from "@/lib/utils"
import type { Space } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Star, Clock, Zap, MapPin } from "lucide-react"

interface MapViewProps {
  readonly spaces: Space[]
  readonly center?: { lat: number; lng: number }
  readonly zoom?: number
  readonly onMarkerClick?: (space: Space) => void
  readonly activeSpaceId?: string | null
}

const containerStyle = {
  width: "100%",
  height: "100%",
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return NaN
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 3958.8 // Radius of the Earth in miles
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

function PackagePreview({ space, center }: { readonly space: Space, readonly center: { lat: number, lng: number } }) {
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

  const distance = calculateDistance(center.lat, center.lng, space.venue.coordinates.coordinates[1], space.venue.coordinates.coordinates[0])

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
          <span>{distance.toFixed(2)} miles away</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs gap-1">
          <Clock className="h-3 w-3" />
          <span>{space.operatingHours ?? "9:00 AM - 5:00 PM"}</span>
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
  center,
}: { space: Space; isActive?: boolean; onClick: () => void; showPreview: boolean, center: { lat: number, lng: number } }) {
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
        {space.bookingType === "instant" ? (
          <Zap className="h-3 w-3 text-white ml-1" />
        ) : (
          <Clock className="h-3 w-3 text-white ml-1" />
        )}
      </div>
      {showPreview && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden md:block z-30">
          <PackagePreview space={space} center={center} />
        </div>
      )}
    </div>
  )
}

export function MapView({
  spaces = [],
  center = { lat: 40.712776, lng: -74.005974 },
  zoom = 13,
  onMarkerClick,
  activeSpaceId,
}: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCJCpoarISphEvZfjnnUEBhgYDZcaIcARQ",
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
        styles: [],
      }}
    >
      {spaces.map((space) => (
        <OverlayView
          key={space.id}
          position={{ lat: space.venue.coordinates.coordinates[1], lng: space.venue.coordinates.coordinates[0] }}
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
            center={center}
          />
        </OverlayView>
      ))}
    </GoogleMap>
  )
}

