import { MapPin, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SecondaryHeaderProps {
  spaceCount: number
  locationSearch: string
  showMap: boolean
  setShowMap: (show: boolean) => void
}

export function SecondaryHeader({ spaceCount, locationSearch, showMap, setShowMap }: SecondaryHeaderProps) {
  if (showMap) return null

  return (
    <div className="hidden md:flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-700">
          {spaceCount} video studio spaces near {locationSearch}
        </span>
      </div>
    </div>
  )
}

