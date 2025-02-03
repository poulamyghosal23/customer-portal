import { OverlayView } from "@react-google-maps/api"
import { cn } from "@/lib/utils"

interface MapMarkerProps {
  price: number
  position: google.maps.LatLngLiteral
  onClick?: () => void
  isActive?: boolean
}

export function MapMarker({ price, position, onClick, isActive }: MapMarkerProps) {
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <button
        onClick={onClick}
        className={cn(
          "transform-gpu transition-transform duration-200 ease-in-out",
          "hover:scale-110 hover:z-10",
          isActive ? "z-20 scale-110" : "z-0",
        )}
      >
        <div
          className={cn(
            "px-3 py-1.5 rounded-full shadow-md",
            "bg-white text-black",
            "flex items-center justify-center",
            "border border-gray-200",
            "font-medium text-sm",
            isActive ? "ring-2 ring-blue-500" : "",
          )}
        >
          ${price}
        </div>
      </button>
    </OverlayView>
  )
}

