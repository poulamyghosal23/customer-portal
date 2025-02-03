"use client"

interface PriceMarkerProps {
  price: number
  isSelected?: boolean
}

export function PriceMarker({ price, isSelected = false }: PriceMarkerProps) {
  return (
    <div
      className={`
      flex flex-col items-center
      ${isSelected ? "scale-110" : "scale-100"}
    `}
    >
      <div
        className={`
        px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap
        flex flex-col items-center gap-1
        ${isSelected ? "bg-blue-500 text-white shadow-lg" : "bg-white text-blue-600 shadow-md"}
      `}
      >
        <span>10 Packages</span>
        <span className="text-xs font-normal">15 mi away</span>
      </div>
      <div
        className={`
        w-2 h-2 rotate-45 transform translate-y-[-4px]
        ${isSelected ? "bg-blue-500" : "bg-white"}
      `}
      />
    </div>
  )
}

