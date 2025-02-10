"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Zap, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/contexts/i18n-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { FormattedNumber, IntlProvider } from "react-intl"

interface SpaceCardProps {
  readonly id: number
  readonly title: string
  readonly images: readonly string[]
  readonly price: number
  readonly capacity: number
  readonly instantBook?: boolean
  readonly distance: string
  readonly operatingHours: string
  readonly rating: number
  readonly bookingType: "instant" | "request"
  readonly spotsLeft?: number
  readonly currency: string
}

export function SpaceCard({
  id,
  title,
  images,
  price,
  capacity,
  distance,
  operatingHours,
  rating,
  bookingType,
  spotsLeft,
  currency,
}: SpaceCardProps) {
  const { t } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver({
    target: cardRef,
    threshold: 0.1,
  })

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <IntlProvider locale="en">
      <Link href={`/package/${id}`} className="block">
        <div
          ref={cardRef}
          className="group cursor-pointer space-y-2 transition-all duration-300 ease-in-out overflow-visible hover:transform hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-[4/3] relative overflow-hidden rounded-xl ring-blue-200 group-hover:ring-2">
            <Image
              src={isVisible ? images[currentImageIndex] || "/placeholder.svg" : "/placeholder.svg"}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white ${isHovered ? "opacity-100" : "opacity-0"}`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/90 shadow-lg transition-opacity hover:bg-white ${isHovered ? "opacity-100" : "opacity-0"}`}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "w-2 bg-white" : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-blue-600 fill-current" />
              <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
            {bookingType && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute top-2 right-2 p-1 rounded-full z-10 ${
                        bookingType === "instant" ? "bg-blue-600" : "bg-white"
                      }`}
                    >
                      {bookingType === "instant" ? (
                        <Zap className="h-3 w-3 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={5} className="z-50">
                    <p>{bookingType === "instant" ? "Book Space Instantly" : "Request To Book"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
            </div>

            <div className="flex items-center text-gray-600 text-xs gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance} away</span>
            </div>

            <div className="flex items-center text-gray-600 text-xs gap-1">
              <Clock className="h-3 w-3" />
              <span>{operatingHours}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="font-medium">
                <FormattedNumber value={price} style="currency" currency={currency} />/hr
              </div>
              <span className="text-xs font-medium text-orange-600">{spotsLeft}</span>
            </div>
          </div>
        </div>
      </Link>
    </IntlProvider>
  )
}

