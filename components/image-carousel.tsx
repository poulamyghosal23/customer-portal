"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Share, Grid, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Media {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface ImageCarouselProps {
  media: Media[]
  title: string
}

export function ImageCarousel({ media, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Prioritize video if it's the first item
  const sortedMedia = [...media].sort((a, b) => {
    if (a.type === "video" && b.type === "image") return -1
    if (a.type === "image" && b.type === "video") return 1
    return 0
  })

  const handlePrevious = () => {
    setFullscreenIndex((prevIndex) => (prevIndex === 0 ? sortedMedia.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setFullscreenIndex((prevIndex) => (prevIndex === sortedMedia.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <>
      <div className="md:grid md:grid-cols-[1.5fr,1fr] md:gap-2">
        {/* Main Image/Video */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          {sortedMedia[currentIndex].type === "video" ? (
            <div className="relative h-full bg-gray-100">
              <Image
                src={sortedMedia[currentIndex].thumbnail || sortedMedia[currentIndex].url}
                alt={`${title} - Media ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/75"
                  onClick={() => {
                    console.log("Play video:", sortedMedia[currentIndex].url)
                  }}
                >
                  <Play className="h-8 w-8 text-white" fill="white" />
                </Button>
              </div>
            </div>
          ) : (
            <Image
              src={sortedMedia[currentIndex].url || "/placeholder.svg"}
              alt={`${title} - Media ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
          )}
          {/* Mobile-only navigation arrows */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? sortedMedia.length - 1 : prevIndex - 1))}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex === sortedMedia.length - 1 ? 0 : prevIndex + 1))}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </Button>
          </div>
          {/* Mobile-only View All button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-xs font-normal md:hidden"
            onClick={(e) => {
              e.stopPropagation()
              setShowFullscreen(true)
              setFullscreenIndex(currentIndex)
            }}
          >
            <Grid className="h-3 w-3 mr-1" />
            View All
          </Button>
        </div>

        {/* Desktop-only Masonry Grid Thumbnails */}
        <div className="hidden md:grid grid-cols-2 gap-2 h-full">
          {/* Top Row - Single Image */}
          {sortedMedia[1] && (
            <div
              className={`relative aspect-[4/3] col-span-2 overflow-hidden rounded-lg cursor-pointer transition-all ${
                1 === currentIndex ? "ring-2 ring-blue-600" : "hover:opacity-80"
              }`}
              onClick={() => handleThumbnailClick(1)}
            >
              <Image
                src={
                  sortedMedia[1].type === "video" ? sortedMedia[1].thumbnail || sortedMedia[1].url : sortedMedia[1].url
                }
                alt={`${title} - Thumbnail 2`}
                fill
                className="object-cover"
              />
              {sortedMedia[1].type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              )}
            </div>
          )}

          {/* Bottom Row - Two Images */}
          {sortedMedia[2] && (
            <div
              className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all ${
                2 === currentIndex ? "ring-2 ring-blue-600" : "hover:opacity-80"
              }`}
              onClick={() => handleThumbnailClick(2)}
            >
              <Image
                src={
                  sortedMedia[2].type === "video" ? sortedMedia[2].thumbnail || sortedMedia[2].url : sortedMedia[2].url
                }
                alt={`${title} - Thumbnail 3`}
                fill
                className="object-cover"
              />
              {sortedMedia[2].type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              )}
            </div>
          )}

          {sortedMedia[3] && (
            <div
              className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all ${
                3 === currentIndex ? "ring-2 ring-blue-600" : "hover:opacity-80"
              }`}
              onClick={() => handleThumbnailClick(3)}
            >
              <Image
                src={
                  sortedMedia[3].type === "video" ? sortedMedia[3].thumbnail || sortedMedia[3].url : sortedMedia[3].url
                }
                alt={`${title} - Thumbnail 4`}
                fill
                className="object-cover"
              />
              {sortedMedia[3].type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-xs font-normal"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFullscreen(true)
                  setFullscreenIndex(3)
                }}
              >
                <Grid className="h-3 w-3 mr-1" />
                View All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Gallery Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFullscreen(false)}
                className="text-black bg-white hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-7xl mx-auto">
                {sortedMedia[fullscreenIndex].type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={sortedMedia[fullscreenIndex].thumbnail || sortedMedia[fullscreenIndex].url}
                        alt={`${title} - Fullscreen ${fullscreenIndex + 1}`}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/75"
                          onClick={() => {
                            console.log("Play video:", sortedMedia[fullscreenIndex].url)
                          }}
                        >
                          <Play className="h-8 w-8 text-white" fill="white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={sortedMedia[fullscreenIndex].url || "/placeholder.svg"}
                        alt={`${title} - Fullscreen ${fullscreenIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full shadow-md"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8 text-black" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8 text-black" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

