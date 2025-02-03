export interface Space {
  id: string
  name: string
  price: number | string
  latitude: number
  longitude: number
  distance?: number
  rating?: number
  hours?: string
  availableSpots?: number
}

