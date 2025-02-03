"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Camera, X, User, Mail, Phone, Globe, Bell } from "lucide-react"
import Image from "next/image"

// Mock data for reviews
const reviews = [
  {
    id: 1,
    author: "Sarah M.",
    date: "January 2025",
    rating: 5,
    comment: "Graham was an excellent host! The space was clean and exactly as described.",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    author: "Michael R.",
    date: "December 2024",
    rating: 5,
    comment: "Great communication and flexible with check-in times. Would book again.",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    author: "Jessica L.",
    date: "December 2024",
    rating: 5,
    comment: "The host was very responsive and the booking process was smooth. The space exceeded our expectations.",
    avatar: "/placeholder.svg",
  },
]

export default function ProfilePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg")
  const [name, setName] = useState("Graham Beck")
  const [email, setEmail] = useState("graham@example.com")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [notifications, setNotifications] = useState({
    new_space_alerts: true,
    price_changes: true,
    messages: false,
  })
  const [averageRating, setAverageRating] = useState(5.0)
  const [reviewCount, setReviewCount] = useState(15)

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage")
    const storedName = localStorage.getItem("userName")
    if (storedProfileImage) setProfileImage(storedProfileImage)
    if (storedName) setName(storedName)

    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem("profileImage")
      const updatedName = localStorage.getItem("userName")
      if (updatedProfileImage) setProfileImage(updatedProfileImage)
      if (updatedName) setName(updatedName)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string
        setProfileImage(imageDataUrl)
        localStorage.setItem("profileImage", imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setProfileImage("/placeholder.svg")
    localStorage.removeItem("profileImage")
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    localStorage.setItem("userName", event.target.value)
  }

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const handleSave = () => {
    if (profileImage !== "/placeholder.svg") {
      localStorage.setItem("profileImage", profileImage)
    }
    localStorage.setItem("userName", name)
    console.log("Profile saved:", { name, email, phone, bio, interests, notifications })
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header setIsFilterOpen={setIsFilterOpen} />
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {profileImage !== "/placeholder.svg" && (
                      <button
                        onClick={removeProfileImage}
                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-5 w-5 text-blue-600 fill-current" />
                    <span className="ml-1 font-semibold">
                      {averageRating.toFixed(1)}{" "}
                      <span className="text-sm font-normal text-gray-500">({reviewCount} reviews)</span>
                    </span>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-700">Memberships:</p>
                    <p className="text-sm text-blue-600">Premium Plan</p>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-700">DropDesk Credits:</p>
                    <p className="text-lg font-semibold text-blue-600">250</p>
                  </div>
                </CardContent>
                <Separator className="my-4" />
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Coworking", "Office Space", "Meeting Rooms", "Event Spaces", "Networking"].map((interest) => (
                      <Button
                        key={interest}
                        variant={interests.includes(interest) ? "default" : "outline"}
                        onClick={() => handleInterestToggle(interest)}
                        className={`rounded-full ${
                          interests.includes(interest) ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                        }`}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <User className="h-5 w-5 text-gray-500" />
                      <div className="flex-grow">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={handleNameChange}
                          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div className="flex-grow">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div className="flex-grow">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <div className="flex-grow">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="reviews" className="mt-6">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-6 w-6 text-blue-600 fill-current" />
                        ))}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold">5.0</span>
                        <span className="text-gray-600">15 Reviews</span>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-t border-gray-200 pt-6">
                          <div className="flex items-start gap-4">
                            <Image
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.author}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{review.author}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-blue-600 fill-current" />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["New Space Alerts", "Price Changes", "Messages"].map((notificationType) => (
                        <div key={notificationType} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <Label htmlFor={`notification-${notificationType}`}>{notificationType}</Label>
                          </div>
                          <Switch
                            id={`notification-${notificationType}`}
                            checked={
                              notifications[
                                notificationType.toLowerCase().replace(" ", "_") as keyof typeof notifications
                              ]
                            }
                            onCheckedChange={() =>
                              handleNotificationToggle(
                                notificationType.toLowerCase().replace(" ", "_") as keyof typeof notifications,
                              )
                            }
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white hidden md:block">
                Save Changes
              </Button>
            </div>

            {/* Sticky mobile nav */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

