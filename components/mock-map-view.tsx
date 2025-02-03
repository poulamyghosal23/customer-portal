import { useState } from "react"
import { MockMapPin } from "./mock-map-pin"

interface Space {
  id: string
  price: number
  x: number
  y: number
}

const mockSpaces: Space[] = [
  { id: "1", price: 98, x: 20, y: 20 },
  { id: "2", price: 54, x: 60, y: 30 },
  { id: "3", price: 86, x: 65, y: 35 },
  { id: "4", price: 47, x: 40, y: 50 },
  { id: "5", price: 65, x: 15, y: 70 },
  { id: "6", price: 59, x: 10, y: 85 },
  { id: "7", price: 60, x: 70, y: 80 },
  { id: "8", price: 100, x: 75, y: 85 },
  { id: "9", price: 80, x: 80, y: 85 },
  { id: "10", price: 104, x: 50, y: 95 },
]

export function MockMapView() {
  const [activePin, setActivePin] = useState<string | null>(null)

  return (
    <div className="relative w-full h-96 bg-gray-100 overflow-hidden rounded-lg shadow-inner">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Simplified map background */}
        <rect x="0" y="0" width="100" height="100" fill="#e5e7eb" />
        <path d="M20,20 Q50,50 80,80" stroke="#d1d5db" strokeWidth="0.5" fill="none" />
        <path d="M80,20 Q50,50 20,80" stroke="#d1d5db" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="30" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="0.5" />
      </svg>
      {mockSpaces.map((space) => (
        <div
          key={space.id}
          style={{ left: `${space.x}%`, top: `${space.y}%` }}
          className="absolute"
          onMouseEnter={() => setActivePin(space.id)}
          onMouseLeave={() => setActivePin(null)}
        >
          <MockMapPin price={space.price} isActive={activePin === space.id} />
        </div>
      ))}
    </div>
  )
}

