"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserPlus, ArrowLeft, Download, Check, X, MapPin, Clock, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { CalendarIcon } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import type { DateRange } from "@/types"

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Mock data for teams
const teamsData = [
  { id: 1, name: "Marketing Team", memberCount: 5 },
  { id: 2, name: "Design Team", memberCount: 3 },
  { id: 3, name: "Development Team", memberCount: 8 },
  { id: 4, name: "Sales Team", memberCount: 6 },
  { id: 5, name: "Customer Support Team", memberCount: 4 },
  { id: 6, name: "Human Resources Team", memberCount: 3 },
  { id: 7, name: "Finance Team", memberCount: 4 },
  { id: 8, name: "Product Management Team", memberCount: 5 },
]

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    avatar: "/placeholder.svg",
    memberType: "Full-time",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Member",
    avatar: "/placeholder.svg",
    memberType: "Part-time",
    status: "Away",
    joinDate: "2023-03-22",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Member",
    avatar: "/placeholder.svg",
    memberType: "Contractor",
    status: "Active",
    joinDate: "2023-05-10",
  },
]

// Updated mock data for team activity with January 2025 dates
const teamActivity = [
  {
    id: 1,
    packageImage: "/placeholder.svg",
    packageName: "Downtown Conference Room",
    bookedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Downtown",
    reservationTime: "2025-01-05 09:00 AM - 11:00 AM",
    invoiceStatus: "Paid",
    reservationStatus: "Confirmed",
    creditsUsed: 2,
    price: 150.0,
  },
  {
    id: 2,
    packageImage: "/placeholder.svg",
    packageName: "Creative Studio",
    bookedBy: {
      name: "Jane Smith",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Creative Hub",
    reservationTime: "2025-01-12 02:00 PM - 06:00 PM",
    invoiceStatus: "Pending",
    reservationStatus: "Cancelled",
    creditsUsed: 0,
    price: 250.0,
  },
  {
    id: 3,
    packageImage: "/placeholder.svg",
    packageName: "Coworking Space",
    bookedBy: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Coworking Center",
    reservationTime: "2025-01-15 10:00 AM - 04:00 PM",
    invoiceStatus: "Paid",
    reservationStatus: "Completed",
    creditsUsed: 3,
    price: 180.0,
  },
  {
    id: 4,
    packageImage: "/placeholder.svg",
    packageName: "Meeting Room A",
    bookedBy: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Business Center",
    reservationTime: "2025-01-18 11:00 AM - 01:00 PM",
    invoiceStatus: "Paid",
    reservationStatus: "Confirmed",
    creditsUsed: 1,
    price: 120.0,
  },
  {
    id: 5,
    packageImage: "/placeholder.svg",
    packageName: "Executive Suite",
    bookedBy: {
      name: "David Brown",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Premium",
    reservationTime: "2025-01-22 09:00 AM - 05:00 PM",
    invoiceStatus: "Pending",
    reservationStatus: "Confirmed",
    creditsUsed: 4,
    price: 300.0,
  },
  {
    id: 6,
    packageImage: "/placeholder.svg",
    packageName: "Workshop Space",
    bookedBy: {
      name: "Emily Davis",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Events",
    reservationTime: "2025-01-25 01:00 PM - 06:00 PM",
    invoiceStatus: "Paid",
    reservationStatus: "Confirmed",
    creditsUsed: 5,
    price: 275.0,
  },
  {
    id: 7,
    packageImage: "/placeholder.svg",
    packageName: "Private Office",
    bookedBy: {
      name: "Michael Lee",
      avatar: "/placeholder.svg",
    },
    venue: "DropDesk Corporate",
    reservationTime: "2025-01-28 08:00 AM - 06:00 PM",
    invoiceStatus: "Paid",
    reservationStatus: "Confirmed",
    creditsUsed: 2,
    price: 200.0,
  },
]

const filterTeamActivities = (activities: typeof teamActivity, query: string, dateRange?: DateRange) => {
  const filteredActivities = activities.filter((activity) => {
    const matchesQuery =
      activity.packageName.toLowerCase().includes(query.toLowerCase()) ||
      activity.bookedBy.name.toLowerCase().includes(query.toLowerCase()) ||
      activity.venue.toLowerCase().includes(query.toLowerCase())

    if (dateRange?.from && dateRange?.to) {
      const activityDate = new Date(activity.reservationTime.split(" ")[0])
      return matchesQuery && activityDate >= dateRange.from && activityDate <= dateRange.to
    }

    return matchesQuery
  })

  return filteredActivities.reduce(
    (acc, activity) => {
      const year = new Date(activity.reservationTime.split(" ")[0]).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(activity)
      return acc
    },
    {} as Record<number, typeof teamActivity>,
  )
}

export default function MyTeamPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState("")
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [managingTeam, setManagingTeam] = useState<(typeof teamsData)[0] | null>(null)
  const [teamSearchQuery, setTeamSearchQuery] = useState("")
  const [activitySearchQuery, setActivitySearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const handleInviteSubmit = () => {
    // Here you would handle the invitation logic
    console.log("Inviting to team:", selectedTeam)
    console.log("Inviting emails:", inviteEmails)
    setIsInviteDialogOpen(false)
    setSelectedTeam("")
    setInviteEmails([])
  }

  const handleManageTeam = (team: (typeof teamsData)[0]) => {
    setManagingTeam(team)
  }

  const handleExportActivities = () => {
    console.log("Exporting team activities...")
    // Implement the export logic here
  }

  const filterTeamMembers = (members: typeof teamMembers, query: string) => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const filterTeams = (teams: typeof teamsData, query: string) => {
    return teams.filter((team) => team.name.toLowerCase().includes(query.toLowerCase()))
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header setIsFilterOpen={setIsFilterOpen} />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {managingTeam ? (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setManagingTeam(null)}
                  className="mb-4 text-blue-400 hover:text-blue-500 hover:bg-blue-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Teams
                </Button>
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">{managingTeam.name}</h1>
                <Tabs defaultValue="members">
                  <TabsList>
                    <TabsTrigger value="members">Team Members</TabsTrigger>
                    <TabsTrigger value="activity">Team Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="members">
                    <div className="mt-4">
                      <div className="mb-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              placeholder="Search members..."
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value)
                                // Force re-render
                                setManagingTeam({ ...managingTeam! })
                              }}
                              className="pl-9 rounded-full w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                            />
                          </div>
                          <div className="flex flex-row space-y-0 space-x-2 justify-center">
                            <Button
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export Members
                            </Button>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                              onClick={() => setIsInviteDialogOpen(true)}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invite Members
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                          {filterTeamMembers(teamMembers, searchQuery).map((member) => (
                            <li key={member.id}>
                              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 mr-4">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                    <div className="flex items-center mt-2">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          member.role === "Admin"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {member.role}
                                      </span>
                                      <span className="text-sm text-gray-500 ml-4">
                                        Joined {new Date(member.joinDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => console.log(`Delete user: ${member.name}`)}>
                                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </li>
                          ))}
                          {filterTeamMembers(teamMembers, searchQuery).length === 0 && (
                            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                              No members found matching your search.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity">
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Team Activity</h2>
                      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Search activities..."
                            value={activitySearchQuery}
                            onChange={(e) => setActivitySearchQuery(e.target.value)}
                            className="pl-9 rounded-full w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={handleExportActivities}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Activities
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
                        {Object.entries(filterTeamActivities(teamActivity, activitySearchQuery, dateRange))
                          .sort(([a], [b]) => Number(b) - Number(a))
                          .map(([year, activities]) => (
                            <div key={year}>
                              <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">{year}</div>
                              <ul role="list" className="divide-y divide-gray-200">
                                {activities.map((activity) => (
                                  <li key={activity.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                      <div className="flex flex-col sm:flex-row sm:items-center w-full">
                                        <div className="flex-shrink-0 h-20 w-20 mr-4 mb-4 sm:mb-0">
                                          <Image
                                            src={activity.packageImage || "/placeholder.svg"}
                                            alt={activity.packageName}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            {activity.packageName}
                                          </h3>
                                          <div className="flex items-center mb-1">
                                            <Avatar className="h-6 w-6 mr-2">
                                              <AvatarImage
                                                src={activity.bookedBy.avatar}
                                                alt={activity.bookedBy.name}
                                              />
                                              <AvatarFallback>{activity.bookedBy.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm text-gray-500">Booked by {activity.bookedBy.name}</p>
                                          </div>
                                          <p className="text-sm text-gray-500 flex items-center mb-1">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {new Date(activity.reservationTime.split(" ")[0]).toLocaleDateString(
                                              "en-US",
                                              { month: "short", day: "numeric" },
                                            )}
                                            ,{" "}
                                            {`${activity.reservationTime.split(" ")[1]} ${activity.reservationTime.split(" ")[2]} - ${activity.reservationTime.split(" ")[3]} ${activity.reservationTime.split(" ")[4]}`.replace(
                                              " - ",
                                              " - ",
                                            )}
                                          </p>
                                          <p className="text-sm text-gray-500 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {activity.venue}
                                          </p>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto">
                                          <div className="flex items-center mb-2 sm:mb-1">
                                            <span
                                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                activity.invoiceStatus === "Paid"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                              }`}
                                            >
                                              {activity.invoiceStatus}
                                            </span>
                                            <span
                                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                activity.reservationStatus === "Confirmed"
                                                  ? "bg-blue-100 text-blue-800"
                                                  : activity.reservationStatus === "Cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                              }`}
                                            >
                                              {activity.reservationStatus}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-500 mb-1">
                                            {activity.creditsUsed > 0 ? (
                                              <span className="text-blue-600">{activity.creditsUsed} credits used</span>
                                            ) : (
                                              <span className="hidden sm:inline">No credits used</span>
                                            )}
                                          </p>
                                          <p className="text-lg font-semibold text-gray-900">
                                            ${activity.price.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Teams</h1>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-64 order-first md:order-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search teams..."
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                        className="pl-9 rounded-full w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 focus-visible:outline-none"
                      />
                    </div>
                    <div className="flex w-full md:w-auto space-x-2 justify-between md:justify-start">
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-grow md:flex-grow-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Members
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-grow md:flex-grow-0"
                        onClick={() => setIsInviteDialogOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                      {filterTeams(teamsData, teamSearchQuery).map((team) => (
                        <li key={team.id}>
                          <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                              <p className="text-sm text-gray-500">{team.memberCount} members</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleManageTeam(team)}>View Team</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="team" className="text-right">
                Team
              </label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing Team</SelectItem>
                  <SelectItem value="design">Design Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emails" className="text-right">
                Emails
              </label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {inviteEmails.map((email, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      {email}
                      <button
                        onClick={() => setInviteEmails(inviteEmails.filter((_, i) => i !== index))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  id="emails"
                  placeholder="Enter email addresses (comma-separated) and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const newEmails = e.currentTarget.value
                        .split(",")
                        .map((email) => email.trim())
                        .filter((email) => email !== "" && isValidEmail(email))
                      const validNewEmails = newEmails.filter((email) => !inviteEmails.includes(email))
                      if (validNewEmails.length > 0) {
                        setInviteEmails([...inviteEmails, ...validNewEmails])
                        e.currentTarget.value = "" // Clear the input after adding emails
                      }
                    }
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter valid email addresses separated by commas. Press Enter to add.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleInviteSubmit}>
              Send Invitations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SearchProvider>
  )
}

