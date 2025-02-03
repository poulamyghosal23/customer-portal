"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import type { DateRange } from "@/types"
import { CalendarIcon, Download, Search, MapPin, Clock, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFavorites } from "@/contexts/favorites-context"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const bookings = [
  {
    id: 1,
    spaceName: "Downtown Conference Room",
    image: "/placeholder.svg",
    date: "2025-01-05",
    time: "09:00 AM - 11:00 AM",
    venue: "DropDesk Downtown",
    status: "Confirmed",
    price: 150.0,
    creditsUsed: 2,
    host: {
      name: "Host Name 1",
      image: "/placeholder.svg",
    },
  },
  {
    id: 2,
    spaceName: "Creative Studio",
    image: "/placeholder.svg",
    date: "2025-01-12",
    time: "02:00 PM - 06:00 PM",
    venue: "DropDesk Creative Hub",
    status: "Cancelled",
    price: 250.0,
    host: {
      name: "Host Name 2",
      image: "/placeholder.svg",
    },
  },
  {
    id: 3,
    spaceName: "Coworking Space",
    image: "/placeholder.svg",
    date: "2025-01-15",
    time: "10:00 AM - 04:00 PM",
    venue: "DropDesk Coworking Center",
    status: "Completed",
    price: 180.0,
    host: {
      name: "Host Name 3",
      image: "/placeholder.svg",
    },
  },
  {
    id: 4,
    spaceName: "Meeting Room A",
    image: "/placeholder.svg",
    date: "2025-01-18",
    time: "11:00 AM - 01:00 PM",
    venue: "DropDesk Business Center",
    status: "Confirmed",
    price: 120.0,
    host: {
      name: "Host Name 4",
      image: "/placeholder.svg",
    },
  },
  {
    id: 5,
    spaceName: "Executive Suite",
    image: "/placeholder.svg",
    date: "2025-01-22",
    time: "09:00 AM - 05:00 PM",
    venue: "DropDesk Premium",
    status: "Confirmed",
    price: 300.0,
    host: {
      name: "Host Name 5",
      image: "/placeholder.svg",
    },
  },
  {
    id: 6,
    spaceName: "Brainstorming Room",
    image: "/placeholder.svg",
    date: "2025-02-03",
    time: "01:00 PM - 03:00 PM",
    venue: "DropDesk Innovation Center",
    status: "Confirmed",
    price: 100.0,
    host: {
      name: "Host Name 6",
      image: "/placeholder.svg",
    },
  },
  {
    id: 7,
    spaceName: "Podcast Studio",
    image: "/placeholder.svg",
    date: "2025-02-10",
    time: "10:00 AM - 12:00 PM",
    venue: "DropDesk Media Hub",
    status: "Cancelled",
    price: 200.0,
    host: {
      name: "Host Name 7",
      image: "/placeholder.svg",
    },
  },
  {
    id: 8,
    spaceName: "Rooftop Event Space",
    image: "/placeholder.svg",
    date: "2025-02-15",
    time: "06:00 PM - 10:00 PM",
    venue: "DropDesk Skyline",
    status: "Confirmed",
    price: 500.0,
    host: {
      name: "Host Name 8",
      image: "/placeholder.svg",
    },
  },
  {
    id: 9,
    spaceName: "Private Office",
    image: "/placeholder.svg",
    date: "2025-02-20",
    time: "09:00 AM - 05:00 PM",
    venue: "DropDesk Executive Center",
    status: "Completed",
    price: 250.0,
    host: {
      name: "Host Name 9",
      image: "/placeholder.svg",
    },
  },
  {
    id: 10,
    spaceName: "Training Room",
    image: "/placeholder.svg",
    date: "2025-03-01",
    time: "10:00 AM - 04:00 PM",
    venue: "DropDesk Learning Center",
    status: "Confirmed",
    price: 350.0,
    host: {
      name: "Host Name 10",
      image: "/placeholder.svg",
    },
  },
  {
    id: 11,
    spaceName: "Virtual Office",
    image: "/placeholder.svg",
    date: "2025-03-05",
    time: "All Day",
    venue: "DropDesk Virtual",
    status: "Confirmed",
    price: 50.0,
    host: {
      name: "Host Name 11",
      image: "/placeholder.svg",
    },
  },
  {
    id: 12,
    spaceName: "Wellness Room",
    image: "/placeholder.svg",
    date: "2025-03-10",
    time: "02:00 PM - 04:00 PM",
    venue: "DropDesk Wellness Center",
    status: "Cancelled",
    price: 80.0,
    host: {
      name: "Host Name 12",
      image: "/placeholder.svg",
    },
  },
  {
    id: 13,
    spaceName: "Photography Studio",
    image: "/placeholder.svg",
    date: "2025-03-15",
    time: "11:00 AM - 03:00 PM",
    venue: "DropDesk Creative Hub",
    status: "Confirmed",
    price: 280.0,
    host: {
      name: "Host Name 13",
      image: "/placeholder.svg",
    },
  },
  {
    id: 14,
    spaceName: "Maker Space",
    image: "/placeholder.svg",
    date: "2025-03-20",
    time: "10:00 AM - 06:00 PM",
    venue: "DropDesk Innovation Lab",
    status: "Completed",
    price: 400.0,
    host: {
      name: "Host Name 14",
      image: "/placeholder.svg",
    },
  },
  {
    id: 15,
    spaceName: "Quiet Zone Desk",
    image: "/placeholder.svg",
    date: "2025-03-25",
    time: "09:00 AM - 05:00 PM",
    venue: "DropDesk Focus Center",
    status: "Confirmed",
    price: 75.0,
    creditsUsed: 1,
    host: {
      name: "Host Name 15",
      image: "/placeholder.svg",
    },
  },
]

function MyBookingsContent() {
  const { favorites } = useFavorites()
  const router = useRouter()
  const mockFavorites = [
    ...favorites,
    { id: 101, title: "Cozy Downtown Loft", location: "New York, NY", image: "/placeholder.svg" },
    { id: 102, title: "Spacious Conference Room", location: "Los Angeles, CA", image: "/placeholder.svg" },
    { id: 103, title: "Modern Art Studio", location: "Chicago, IL", image: "/placeholder.svg" },
    { id: 104, title: "Rooftop Event Space", location: "Miami, FL", image: "/placeholder.svg" },
    { id: 105, title: "Quiet Reading Nook", location: "Boston, MA", image: "/placeholder.svg" },
    { id: 106, title: "High-Tech Presentation Room", location: "San Francisco, CA", image: "/placeholder.svg" },
    { id: 107, title: "Zen Meditation Space", location: "Seattle, WA", image: "/placeholder.svg" },
    { id: 108, title: "Industrial Photo Studio", location: "Portland, OR", image: "/placeholder.svg" },
  ]
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [searchQuery, setSearchQuery] = useState("")

  const filterBookings = (bookings: typeof bookings, query: string, dateRange?: DateRange) => {
    const filteredBookings = bookings.filter((booking) => {
      const matchesQuery =
        booking.spaceName.toLowerCase().includes(query.toLowerCase()) ||
        booking.venue.toLowerCase().includes(query.toLowerCase()) ||
        booking.host.name.toLowerCase().includes(query.toLowerCase())

      if (dateRange?.from && dateRange?.to) {
        const bookingDate = new Date(booking.date)
        return matchesQuery && bookingDate >= dateRange.from && bookingDate <= dateRange.to
      }

      return matchesQuery
    })

    return filteredBookings.reduce(
      (acc, booking) => {
        const year = new Date(booking.date).getFullYear()
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(booking)
        return acc
      },
      {} as Record<number, typeof bookings>,
    )
  }

  const handleViewReservation = (bookingId: number) => {
    router.push(`/reservations/${bookingId}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header setIsFilterOpen={setIsFilterOpen} />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Bookings</h1>
          <div className="mb-6 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Book Again</h2>
            <div className="flex overflow-x-auto pb-2 -mx-6 px-6 space-x-4 scrollbar-hide">
              {mockFavorites.map((favorite) => (
                <div key={favorite.id} className="flex-shrink-0 p-2">
                  <Button
                    variant="outline"
                    className="h-auto w-40 p-0 overflow-hidden flex flex-col items-start hover:ring-2 hover:ring-blue-200 transition-all duration-300"
                    onClick={() => router.push(`/package/${favorite.id}`)}
                  >
                    <div className="w-full h-24 relative">
                      <Image
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-2 text-left w-full">
                      <p className="text-sm font-medium truncate max-w-full">{favorite.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-full">{favorite.location}</p>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2" />
                Export Bookings
              </Button>
              <DateRangePicker date={dateRange} onDateChange={setDateRange}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                      </>
                    ) : (
                      dateRange.from.toLocaleDateString()
                    )
                  ) : (
                    "Filter by Date"
                  )}
                </Button>
              </DateRangePicker>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {Object.entries(filterBookings(bookings, searchQuery, dateRange))
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, yearBookings]) => (
                <div key={year}>
                  <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">{year}</div>
                  <ul role="list" className="divide-y divide-gray-200">
                    {yearBookings.map((booking) => (
                      <li key={booking.id}>
                        <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center relative">
                          <div className="flex-shrink-0 h-20 w-20 mr-4 mb-4 sm:mb-0">
                            <Image
                              src={booking.image || "/placeholder.svg"}
                              alt={booking.spaceName}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{booking.spaceName}</h3>
                            <div className="flex items-center mb-1">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={booking.host.image} alt={booking.host.name} />
                                <AvatarFallback>{booking.host.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{booking.host.name}</span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center mb-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="sm:hidden">
                                {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                ,{booking.time}
                              </span>
                              <span className="hidden sm:inline">
                                {new Date(booking.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })},{" "}
                                {booking.time}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.venue}
                            </p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto pr-12">
                            <div className="flex items-center mb-2 sm:mb-1">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : booking.status === "Cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              {booking.creditsUsed > 0 ? (
                                <span className="text-blue-600">{booking.creditsUsed} credits used</span>
                              ) : (
                                <span className="hidden sm:inline">No credits used</span>
                              )}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">${booking.price.toFixed(2)}</p>
                          </div>
                          <div className="absolute top-0 bottom-0 right-4 flex items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewReservation(booking.id)}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  Show Reservation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MyBookingsPage() {
  return (
    <SearchProvider>
      <MyBookingsContent />
    </SearchProvider>
  )
}

