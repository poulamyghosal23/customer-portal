"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, ChevronLeft, Flag, MoreVertical, Calendar } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    packageName: "Creative Studio Downtown",
    packageImage: "/placeholder.svg",
    location: "Brooklyn, NY",
    brandName: "Creative Studio",
    user: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Perfect, I'll see you tomorrow at 10 AM!",
    unread: true,
    type: "message",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    packageName: "Modern Conference Center",
    packageImage: "/placeholder.svg",
    location: "Manhattan, NY",
    brandName: "Modern Conference",
    user: {
      name: "David Chen",
      avatar: "/placeholder.svg",
    },
    lastMessage: "What's the maximum capacity for the space?",
    unread: false,
    type: "message",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    packageName: "Booking Confirmed",
    packageImage: "/placeholder.svg",
    location: "",
    user: {
      name: "DropDesk",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Your booking for Creative Studio Downtown has been confirmed for tomorrow at 10 AM.",
    unread: true,
    type: "notification",
    timestamp: "2:31 PM",
  },
  {
    id: 4,
    packageName: "The Workshop Space",
    packageImage: "/placeholder.svg",
    location: "Queens, NY",
    brandName: "The Workshop",
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Thanks for the tour yesterday!",
    unread: false,
    type: "message",
    timestamp: "Tuesday",
  },
  {
    id: 5,
    packageName: "Payment Received",
    packageImage: "/placeholder.svg",
    location: "",
    user: {
      name: "DropDesk",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Payment of $150.00 has been processed for your booking at The Workshop Space.",
    unread: false,
    type: "notification",
    timestamp: "Monday",
  },
]

// Mock conversation data for the first message
const conversation = [
  {
    id: 1,
    sender: {
      name: "You",
      avatar: "/placeholder.svg",
    },
    message: "Hi Sarah, I'd like to book the studio for tomorrow morning. Is 10 AM available?",
    timestamp: "2:15 PM",
  },
  {
    id: 2,
    sender: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
    },
    message: "Hi! Yes, 10 AM works perfectly. The studio will be all set up for you.",
    timestamp: "2:20 PM",
  },
  {
    id: 3,
    sender: {
      name: "You",
      avatar: "/placeholder.svg",
    },
    message: "Great! I'll book it now. Do you have lighting equipment available?",
    timestamp: "2:25 PM",
  },
  {
    id: 4,
    sender: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
    },
    message: "Yes, we have a full lighting kit with softboxes and LED panels. They're included in the booking.",
    timestamp: "2:28 PM",
  },
  {
    id: 5,
    sender: {
      name: "You",
      avatar: "/placeholder.svg",
    },
    message: "Perfect, just booked it. See you tomorrow!",
    timestamp: "2:29 PM",
  },
  {
    id: 6,
    sender: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
    },
    message: "Perfect, I'll see you tomorrow at 10 AM!",
    timestamp: "2:30 PM",
  },
]

const messages = mockMessages

export default function MessagesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [userProfileImage, setUserProfileImage] = useState("/placeholder.svg")
  const router = useRouter()

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage")
    if (storedProfileImage) setUserProfileImage(storedProfileImage)

    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem("profileImage")
      if (updatedProfileImage) setUserProfileImage(updatedProfileImage)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "unread") {
      return matchesSearch && message.unread
    } else if (activeTab === "notifications") {
      return matchesSearch && message.type === "notification"
    }
    return matchesSearch
  })

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col">
        <Header setIsFilterOpen={setIsFilterOpen} />
        <main className={`flex-1 ${isMobile ? "p-3" : "p-6"}`}>
          <div className="max-w-5xl mx-auto">
            {isMobile && selectedMessage && (
              <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-2 pb-1">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMessage(null)}
                  className="mb-4 text-blue-400 hover:text-blue-500 hover:bg-blue-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
            <h1 className={`text-2xl font-semibold text-gray-900 ${isMobile ? "mb-3" : "mb-6"} md:pl-0 pl-8`}>
              {isMobile && selectedMessage ? "" : "Messages"}
            </h1>

            {(!isMobile || !selectedMessage) && (
              <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
                <TabsList className="border-b border-gray-200 w-full justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="all"
                    className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                      activeTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent"
                    }`}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                      activeTab === "unread" ? "border-blue-600 text-blue-600" : "border-transparent"
                    }`}
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                      activeTab === "notifications" ? "border-blue-600 text-blue-600" : "border-transparent"
                    }`}
                  >
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className={`flex flex-col md:flex-row ${isMobile ? "mt-2" : ""}`}>
              {/* Messages List */}
              <div
                className={`w-full md:w-[280px] border-b md:border-b-0 md:border-r border-gray-200 ${
                  selectedMessage ? "hidden md:block" : "block"
                } md:h-[calc(100vh-180px)] md:overflow-y-auto`}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search messages"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <button
                        key={message.id}
                        className={`w-full text-left p-3 md:p-4 hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? "bg-blue-50" : ""
                        } text-base`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex gap-3 md:gap-4 items-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={message.packageImage || "/placeholder.svg"}
                              alt={message.packageName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base md:text-lg truncate">{message.packageName}</h3>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden">
                                <Image
                                  src={message.user.avatar || "/placeholder.svg"}
                                  alt={message.user.name}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-sm md:text-base text-gray-600 truncate">{message.user.name}</p>
                            </div>
                            <p className="text-sm md:text-base text-gray-500 truncate">
                              {message.type === "notification"
                                ? "System Notification"
                                : "Typically responds within 4 hours"}
                            </p>
                          </div>
                          {message.unread && (
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No messages found</div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 flex flex-col md:block ${selectedMessage ? "block" : "hidden md:block"} md:h-[calc(100vh-180px)]`}
              >
                {messages.length > 0 ? (
                  selectedMessage ? (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 p-3 md:p-3 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <Image
                            src={selectedMessage.packageImage || "/placeholder.svg"}
                            alt={selectedMessage.packageName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-medium text-base">{selectedMessage.packageName}</h2>
                          <p className="text-xs text-gray-600">{selectedMessage.location}</p>
                          <p className="text-xs text-gray-500">
                            {selectedMessage.type === "notification"
                              ? "System Notification"
                              : "Typically responds within 4 hours"}
                          </p>
                        </div>
                        {selectedMessage.type === "message" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="ml-auto">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => router.push(`/reservations/${selectedMessage.id}`)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Show Reservation
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => console.log(`Reporting message: ${selectedMessage.id}`)}
                              >
                                <Flag className="mr-2 h-4 w-4 text-red-500" />
                                Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto">
                        {selectedMessage.type === "message" ? (
                          conversation.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex gap-3 mb-4 ${
                                msg.sender.name === "You" ? "justify-end" : "justify-start"
                              }`}
                            >
                              {msg.sender.name !== "You" && (
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src={msg.sender.avatar || "/placeholder.svg"}
                                    alt={msg.sender.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div
                                className={`flex flex-col ${msg.sender.name === "You" ? "items-end" : "items-start"}`}
                              >
                                <span className="text-xs text-gray-500 mb-1">
                                  {msg.sender.name} • {msg.timestamp}
                                </span>
                                <div
                                  className={`px-4 py-2 rounded-lg max-w-md ${
                                    msg.sender.name === "You" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              </div>
                              {msg.sender.name === "You" && (
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src={userProfileImage || "/placeholder.svg"}
                                    alt={msg.sender.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-gray-700">{selectedMessage.lastMessage}</p>
                          </div>
                        )}
                      </div>
                      {selectedMessage.type === "message" && (
                        <div className="p-4 border-t border-gray-200 bg-white w-full md:relative md:bottom-auto sticky bottom-0 left-0 right-0">
                          <div className="flex gap-2 mb-2"></div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 max-w-md">
                            <p>
                              To protect our community, never pay or communicate outside of the DropDesk website or app.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      Select a conversation to view messages
                    </div>
                  )
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Start searching for space to chat with Hosts
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

