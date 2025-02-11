"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  User,
  LogOut,
  Mail,
  Bell,
  Grid,
  CreditCard,
  Calendar,
  HelpCircle,
  FileText,
  MessageSquare,
  Folder,
  Map,
  List,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSearch } from "@/contexts/search-context"

interface HeaderProps {
  setIsFilterOpen: (isOpen: boolean) => void
  showMap: boolean
  setShowMap: (show: boolean) => void
  spaceCount: number
}

export function Header({ setIsFilterOpen, showMap, setShowMap, spaceCount }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { spaceSearch, locationSearch, selectedTags } = useSearch()
  const router = useRouter()
  const pathname = usePathname()
  const [profileImage, setProfileImage] = useState("/placeholder.svg")
  const [userName, setUserName] = useState("")
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(true)


  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage")
    const storedUserName = localStorage.getItem("userName")
    if (storedProfileImage) setProfileImage(storedProfileImage)
    if (storedUserName) setUserName(storedUserName)

    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem("profileImage")
      const updatedName = localStorage.getItem("userName")
      if (updatedProfileImage) setProfileImage(updatedProfileImage)
      if (updatedName) setUserName(updatedName)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    setUnreadNotifications(Math.floor(Math.random() * 10))
  }, [])

  const handleSearchClick = () => {
    setIsSearchFocused(true)
    if (pathname !== "/") {
      router.push("/")
    } else {
      setIsFilterOpen(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // Add any additional logout logic here (e.g., clearing local storage, etc.)
  }

  return (
    <header className="flex flex-col items-center px-2 py-2 md:px-4 md:py-4 border-b border-gray-200 md:flex-row md:justify-between sticky top-0 bg-white z-50">
      <div className="w-full flex flex-col items-center md:w-auto md:flex-row">
        <Link href="/" className="mb-2 md:mb-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropdesk-spaces_logo-final_full-color-E8rdJv6o5bGCuP8b8OeSyT5lIXhRBn.png"
            alt="DropDesk Spaces"
            width={180}
            height={54}
            className="h-10 w-auto cursor-pointer font-sans"
            priority
          />
        </Link>
        <div className="w-full md:hidden mt-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full border border-blue-200">
            <button
              onClick={handleSearchClick}
              className="flex-1 h-12 flex items-center pl-4 overflow-x-auto whitespace-nowrap scrollbar-hide"
              aria-label="Open search"
            >
              <Search className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
              <div className="flex items-center space-x-1">
                {spaceSearch || selectedTags.length > 0 ? (
                  <>
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                    {spaceSearch && <span className="text-gray-700 whitespace-nowrap">{spaceSearch}</span>}
                  </>
                ) : (
                  <span className="text-gray-500">Search DropDesk</span>
                )}
              </div>
            </button>
            {pathname === "/" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMap(!showMap)}
                className="h-12 w-12 rounded-full hover:bg-gray-200 flex-shrink-0"
                aria-label={showMap ? "Show list view" : "Show map view"}
              >
                {showMap ? <List className="h-5 w-5" /> : <Map className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-4">
        <div
          className={cn(
            "relative flex items-center shadow-sm rounded-full border border-blue-200",
            isSearchFocused ? "ring-1 ring-blue-200" : "",
          )}
        >
          <button
            onClick={handleSearchClick}
            className="h-12 w-44 flex-shrink-0 rounded-l-full bg-white px-4 text-sm text-left text-gray-500 focus:outline-none hover:bg-gray-50 transition-colors duration-200 overflow-hidden border-0"
            aria-label="Open search"
          >
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
              {spaceSearch || selectedTags.length > 0 ? (
                <div className="flex items-center space-x-1">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {spaceSearch && <span className="text-gray-700 whitespace-nowrap">{spaceSearch}</span>}
                </div>
              ) : (
                "All"
              )}
            </div>
          </button>
          <button
            onClick={handleSearchClick}
            className="h-12 flex-1 bg-white px-3 text-sm text-left text-gray-500 focus:outline-none hover:bg-gray-50 transition-colors duration-200 truncate border-0"
            aria-label="Open location search"
          >
            {locationSearch}
          </button>
          <button
            onClick={handleSearchClick}
            className="flex h-12 items-center justify-center w-12 rounded-full bg-white text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            aria-label="Open advanced filters"
          >
            <Search className="h-5 w-5 text-blue-500" />
          </button>
        </div>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{userName}</span>
                <div className="flex items-center gap-2 relative">
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-[40px] h-[40px]"
                  />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </div>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/messages")}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Messages</span>
                {unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/my-bookings")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>My Bookings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/payment-methods")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payment Methods</span>
              </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => router.push("/my-team")}>
                <Users className="mr-2 h-4 w-4" />
                <span>My Team</span>
                </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open("https://drop-desk.com/help-center/", "_blank")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => router.push("/tools")}>
                <Grid className="mr-2 h-4 w-4" />
                <span>Tools</span>
                </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open("https://drop-desk.com/host", "_blank")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Become a Host</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          </div>
        )}
      </div>

      {/* Mobile layout - updated */}
      <div className="md:hidden absolute top-4 right-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 relative">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-[26px] h-[26px]"
                />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/messages")}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Messages</span>
                {unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/my-bookings")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>My Bookings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/payment-methods")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payment Methods</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/my-team")}>
                <Users className="mr-2 h-4 w-4" />
                <span>My Team</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open("https://drop-desk.com/help-center/", "_blank")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="md:hidden" onClick={() => router.push("/tools")}>
                <Grid className="mr-2 h-4 w-4" />
                <span>Tools</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="md:hidden"
                onClick={() => window.open("https://drop-desk.com/host", "_blank")}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Become a Host</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

