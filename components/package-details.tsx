import Image from "next/image"
import { MapPin, Star, Clock, Users, Zap, Share, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageCarousel } from "./image-carousel"
import { useState, useRef, useEffect } from "react"
import { useFavorites } from "@/contexts/favorites-context"
import { MapView } from "./map-view"
import { useRouter } from "next/navigation"
import { Space } from "@/interfaces/space"

interface PackageDetailsProps {
  package: Space
}

export function PackageDetails({ package: pkg }: PackageDetailsProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [isFavorite, setIsFavorite] = useState(favorites.some((fav) => fav.id === pkg.id))
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const now = new Date()
    const currentHour = now.getHours()
    setIsOpen(currentHour >= 9 && currentHour < 17) 
  }, [])

  const media = [
    ...(pkg.photos?.map((photo) => ({ type: "image" as const, url: photo.url })) || []),
    ...(pkg.videos?.map((video) => ({
      type: "video" as const,
      url: video.url,
      thumbnail: video.thumbnail,
    })) || []),
  ]

  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(pkg.id)
    } else {
      addFavorite({
        id: pkg.id,
        title: pkg.name,
        location: pkg.venue.address,
        image: pkg.photos?.[0]?.url || "/placeholder.svg",
        brandName: "Sample Brand",
      })
    }
    setIsFavorite(!isFavorite)
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0)
      setShowRightArrow(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth,
      )
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const venueCoordinates = pkg.venue?.coordinates?.coordinates || [0, 0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12 md:pb-8">
      {/* Blue notification banner removed */}

      {media.length > 0 && (
        <div className="relative">
          <ImageCarousel media={media} title={pkg.name} />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
              onClick={() => console.log("Share clicked")}
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={`bg-white/90 hover:bg-white ${isFavorite ? "text-red-500" : "text-gray-600"}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite()
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">{pkg.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-blue-600 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{pkg.rating} (20 reviews)</span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="ml-1 text-sm text-gray-600">{pkg.distance} away</span>
          </div>
          {isOpen && (
            <div className="flex items-center ml-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Open Now</span>
            </div>
          )}
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 aspect-square rounded-full overflow-hidden">
              <Image src={pkg.host?.image || "/placeholder.svg"} alt={pkg.host?.name || "Host"} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-lg">
                Hosted by <span className="font-medium">{pkg.host?.name}</span>
              </h2>
              <p className="text-sm text-gray-600">Usually responds within {pkg.host?.avgResponseTime}</p>
            </div>
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white">Contact Host</Button>
        </div>
      </section>

      <div className="border-t border-gray-200 my-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About The Space</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{pkg.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {pkg.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="h-9 px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
            <div className="h-[300px] w-full rounded-lg overflow-hidden">
              <MapView
                center={{ lat: venueCoordinates[1], lng: venueCoordinates[0] }}
                locations={[{ lat: venueCoordinates[1], lng: venueCoordinates[0], price: pkg.price }]}
                selectedLocation={{ lat: venueCoordinates[1], lng: venueCoordinates[0], price: pkg.price }}
              />
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About The Venue</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {pkg.venue?.description || "Information about the venue will be displayed here."}
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Packages</h2>
            <div className="relative mt-6">
              {showLeftArrow && (
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-[0] -left-4"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
              )}
              <div
                ref={scrollContainerRef}
                className="flex space-x-4 mb-6 overflow-x-auto scrollbar-hide"
                onScroll={handleScroll}
              >
                {[
                  "All",
                  "Office Space",
                  "Meeting Rooms",
                  "Event Space",
                  "Coworking",
                  "Conference Rooms",
                  "Training Rooms",
                ].map((spaceType) => (
                  <button
                    key={spaceType}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors whitespace-nowrap my-1"
                    onClick={() => console.log(`Selected space type: ${spaceType}`)}
                  >
                    {spaceType}
                  </button>
                ))}
              </div>
              {showRightArrow && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-[0] -right-4"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
            <div className="relative pt-4">
              <div className="flex overflow-x-auto pb-24 md:pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex-shrink-0 w-64 group p-2">
                    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 ease-in-out hover:transform hover:scale-105 group-hover:ring-2 group-hover:ring-blue-200 p-0.5">
                      <div className="rounded-lg overflow-hidden">
                        <div className="relative h-40">
                          <Image
                            src={`/placeholder.svg?height=160&width=256`}
                            alt={`Related Package ${index}`}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="font-medium text-gray-900 line-clamp-1">Related Package {index}</h3>
                          <div className="flex items-center text-gray-600 text-xs gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>0.5 miles away</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            <span>9:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div className="font-medium">From US${50 + index * 10}/hr</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reviews</h2>
            <h3 className="text-lg text-gray-700 mb-4">Reviews for {pkg.name}</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-blue-600 fill-current" />
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">5.0</span>
                <span className="text-gray-600">15 Reviews</span>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                {
                  id: 1,
                  author: "Sarah M.",
                  date: "January 2025",
                  rating: 5,
                  comment:
                    "Amazing space! Perfect for our team meeting. The amenities were exactly what we needed and the host was very accommodating.",
                  avatar: "/placeholder.svg",
                },
                {
                  id: 2,
                  author: "Michael R.",
                  date: "December 2024",
                  rating: 5,
                  comment:
                    "Great location and very professional setup. The space was clean, well-lit, and had excellent WiFi. Would definitely book again!",
                  avatar: "/placeholder.svg",
                },
                {
                  id: 3,
                  author: "Jessica L.",
                  date: "December 2024",
                  rating: 5,
                  comment:
                    "The host was very responsive and the booking process was smooth. The space exceeded our expectations.",
                  avatar: "/placeholder.svg",
                },
              ].map((review) => (
                <div key={review.id} className="border-t border-gray-200 pt-6">
                  <div className="flex items-start gap-4">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{review.author}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-blue-600 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="bg-white border border-blue-200 rounded-lg p-6 sticky top-20 hidden md:block md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold">
                ${pkg.price}
                <span className="text-base font-normal text-gray-500">/hour</span>
              </div>
              <div className="flex items-center text-blue-600">
                {pkg.bookingType === "instant" ? (
                  <>
                    <Zap className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Book Now</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Host Request</span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>Up to {pkg.capacity} people</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>2 hr minimum</span>
              </div>
            </div>
            <Button
              className="w-full mb-4 font-body bg-blue-600 hover:bg-blue-700 text-white hidden md:block"
              onClick={() => router.push("/checkout")}
            >
              {pkg.bookingType === "instant" ? "Book Now" : "Host Request"}
            </Button>
            <p className="text-center text-sm text-gray-500">{pkg.cancellationPolicy}</p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between p-4 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <div className="flex flex-col flex-shrink-0">
          <div className="text-xl font-bold">
            ${pkg.price}
            <span className="text-sm font-normal text-gray-500">/hour</span>
          </div>
          <div className="flex items-center text-blue-600 text-sm">
            {pkg.bookingType === "instant" ? (
              <>
                <Zap className="h-4 w-4 mr-1" />
                <span className="font-medium">Book Now</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-medium">Host Request</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>Up to {pkg.capacity} people</span>
            </div>
            <div className="flex items-center mt-0.5">
              <Clock className="h-3 w-3 mr-1" />
              <span>2 hr minimum</span>
            </div>
          </div>
        </div>
        <Button
          className="font-body bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6 flex-grow ml-4"
          onClick={() => router.push("/checkout")}
        >
          {pkg.bookingType === "instant" ? "Book Now" : "Host Request"}
        </Button>
      </div>
    </div>
  )
}

