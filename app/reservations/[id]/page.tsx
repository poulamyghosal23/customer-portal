"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Button, ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, MapPin, Calendar, MessageSquare } from "lucide-react"

// Mock data for a reservation
const mockReservation = {
  id: 1,
  spaceName: "Downtown Conference Room",
  image: "/placeholder.svg",
  date: "2025-01-05",
  time: "09:00 AM - 11:00 AM",
  address: "123 Main St, New York, NY 10001",
  houseRules: ["No smoking", "No pets allowed", "Quiet hours from 10 PM to 7 AM", "Clean up after yourself"],
  bookingSummary: {
    spaceCost: 150,
    serviceFee: 30,
    tax: 14.4,
    total: 194.4,
    creditsUsed: 2,
  },
}

export default function ReservationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [reservation, setReservation] = useState(mockReservation)

  useEffect(() => {
    // In a real application, you would fetch the reservation details here
    // using the ID from params.id
    console.log("Fetching reservation details for ID:", params.id)
  }, [params.id])

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header setIsFilterOpen={() => {}} />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-4">
                  <Image
                    src={reservation.image || "/placeholder.svg"}
                    alt={reservation.spaceName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{reservation.spaceName}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    {reservation.date}, {reservation.time}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{reservation.address}</span>
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push(`/messages?reservation=${params.id}`)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Host
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {reservation.houseRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Space Cost</span>
                    <span>${reservation.bookingSummary.spaceCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${reservation.bookingSummary.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${reservation.bookingSummary.tax.toFixed(2)}</span>
                  </div>
                  {reservation.bookingSummary.creditsUsed > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Credits Used</span>
                      <span>-${reservation.bookingSummary.creditsUsed.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${reservation.bookingSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

