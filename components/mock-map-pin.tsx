import { cn } from "@/lib/utils"

interface MockMapPinProps {
  price: number
  isActive?: boolean
}

export function MockMapPin({ price, isActive }: MockMapPinProps) {
  return (
    <div
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2",
        "transition-all duration-200 ease-in-out",
        isActive ? "z-20 scale-110" : "z-10 hover:scale-105",
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
    </div>
  )
}

