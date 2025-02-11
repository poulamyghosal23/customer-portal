"use client"

import { useEffect, useState, useRef } from "react"
import { Search, X, SlidersHorizontal, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useSearch } from "@/contexts/search-context"

// Mock data for spaces
const mockSpaces = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Space ${i + 1}`,
  type: ["Office", "Coworking", "Meeting Room", "Event Space"][Math.floor(Math.random() * 4)],
  capacity: Math.floor(Math.random() * 50) + 1,
  price: Math.floor(Math.random() * 200) + 50,
  instantBook: Math.random() > 0.5,
}))

interface FiltersProps {
  isOpen: boolean
  onClose: () => void
}

const locationSuggestions = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"]

const spaceAndAmenitySuggestions = [
  "Office Space",
  "Meeting Room",
  "Conference Room",
  "Coworking Space",
  "Private Office",
  "Wi-Fi",
  "Parking",
  "Coffee Machine",
  "Printer",
  "Whiteboard",
]

export function Filters({ isOpen, onClose }: FiltersProps) {
  const { setSpaceSearch, setLocationSearch, selectedTags, addTag, removeTag } = useSearch()
  const [locationQuery, setLocationQuery] = useState("")
  const [spaceQuery, setSpaceQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [isSpaceDropdownOpen, setIsSpaceDropdownOpen] = useState(false)
  const [locationRadius, setLocationRadius] = useState(10)
  const spaceDropdownRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const [filteredCount, setFilteredCount] = useState(mockSpaces.length)

  useEffect(() => {
    const filtered = mockSpaces.filter(
      (space) =>
        (selectedTags.length === 0 || selectedTags.includes(space.type)) &&
        (spaceQuery === "" || space.name.toLowerCase().includes(spaceQuery.toLowerCase())) &&
        space.price >= 0 &&
        space.price <= 200 &&
        space.capacity >= 1 &&
        space.capacity <= 50,
    )
    setFilteredCount(filtered.length)
  }, [selectedTags, spaceQuery, locationRadius])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (spaceDropdownRef.current && !spaceDropdownRef.current.contains(e.target as Node)) {
        setIsSpaceDropdownOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value)
    setLocationSearch(e.target.value)
    setSelectedLocation("")
  }

  const handleLocationSelect = (location: string) => {
    setLocationSearch(location)
    setLocationQuery(location)
    setSelectedLocation(location)
  }

  const handleSpaceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpaceQuery(e.target.value)
    setSpaceSearch(e.target.value)
    setIsSpaceDropdownOpen(true)
  }

  const filteredLocationSuggestions = locationSuggestions.filter((location) =>
    location.toLowerCase().includes(locationQuery.toLowerCase()),
  )

  const filteredSpaceSuggestions = spaceAndAmenitySuggestions.filter((item) =>
    item.toLowerCase().includes(spaceQuery.toLowerCase()),
  )

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      removeTag(tag)
    } else {
      addTag(tag)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedTags.includes(suggestion)) {
      removeTag(suggestion)
    } else {
      addTag(suggestion)
    }
  }

  return (
    <div
      ref={filterRef}
      className={cn(
        "fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="p-6 pb-24">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-50 bg-white rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Location Search */}
          <div className="relative mb-6 mt-8">
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search Locations"
                value={selectedLocation || locationQuery}
                onChange={handleLocationSearch}
                className="w-full rounded-full border border-gray-300 bg-blue-50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {locationQuery && !selectedLocation && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {filteredLocationSuggestions.map((location, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Filters Header */}
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
          </div>

          {/* Space and Amenities Search */}
          <div className="relative mb-6" ref={spaceDropdownRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search for spaces and amenities"
                value={spaceQuery}
                onChange={handleSpaceSearch}
                onFocus={() => setIsSpaceDropdownOpen(true)}
                className="w-full rounded-2xl border-0 bg-gray-50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {isSpaceDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {filteredSpaceSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between",
                      selectedTags.includes(item) && "bg-blue-50",
                    )}
                    onClick={() => handleTagClick(item)}
                  >
                    <span>{item}</span>
                    {selectedTags.includes(item) && <span className="text-blue-600 text-sm">Selected</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTags.map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 rounded-lg bg-gray-100 text-gray-900 border-blue-200"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                <X className="ml-2 h-4 w-4" />
              </Button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">SUGGESTIONS</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Other",
                "Office Space",
                "Meeting Room",
                "Conference Room",
                "Board Room",
                "Storage",
                "Event",
                "Coworking Space",
                "Day Pass",
                "Week Pass",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 rounded-lg",
                    selectedTags.includes(suggestion)
                      ? "bg-gray-100 text-gray-900 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:text-gray-900",
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">VENUE TYPE</h3>
            <Select defaultValue="all">
              <SelectTrigger className="mt-2 h-10 w-full rounded-lg border-gray-300 bg-white">
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="coworking">Coworking</SelectItem>
                <SelectItem value="event">Event Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-700">Only show spaces that are instantly bookable</span>
            <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
          </div>

            {/* <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">CAPACITY</h3>
            <Select defaultValue="any">
              <SelectTrigger className="mt-2 h-10 w-full rounded-lg border-gray-300 bg-white">
              <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1-10">1-10 people</SelectItem>
              <SelectItem value="11-20">11-20 people</SelectItem>
              <SelectItem value="21-50">21-50 people</SelectItem>
              <SelectItem value="50+">50+ people</SelectItem>
              </SelectContent>
            </Select>
            </div> */}

            {/* <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">AVAILABILITY</h3>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2">
              <input type="radio" name="availability" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">24/7</span>
              </label>
              <label className="flex items-center gap-2">
              <input type="radio" name="availability" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Weekdays</span>
              </label>
              <label className="flex items-center gap-2">
              <input
                type="radio"
                name="availability"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="text-sm text-gray-700">Weekends</span>
              </label>
            </div>
            </div> */}

            {/* <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">PRICING</h3>
            <Select defaultValue="any">
              <SelectTrigger className="mt-2 h-10 w-full rounded-lg border-gray-300 bg-white">
              <SelectValue placeholder="Select pricing" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="low">$0-$50</SelectItem>
              <SelectItem value="medium">$51-$200</SelectItem>
              <SelectItem value="high">$201+</SelectItem>
              </SelectContent>
            </Select>
            </div> */}

            {/* <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">LOCATION RADIUS</h3>
            <div className="mt-4">
              <Slider
              defaultValue={[10]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => setLocationRadius(value[0])}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-blue-600 [&_[role=slider]]:shadow-blue-600/50 [&_[role=track]]:bg-blue-600"
              />
              <div className="mt-2 text-center text-sm text-gray-600">{`${locationRadius} miles`}</div>
            </div>
            </div> */}
        </div>
      </div>

      {/* Show Results Button */}
      <div className="sticky bottom-0 w-full p-4 bg-white border-t border-gray-200">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>
          Show {filteredCount} Results
        </Button>
      </div>
    </div>
  )
}

