"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileQuestion, Users, Gift, Building, Crown, Calendar, Book } from "lucide-react"

const userTools = [
  {
    icon: Download,
    title: "Download Mobile Apps",
    description: "Get our mobile apps for iOS and Android devices",
    href: "https://drop-desk.com/download-app",
  },
  {
    icon: FileQuestion,
    title: "Request a Location/Quote",
    description: "Need a new location? Reach out and our team will find you your perfect space.",
    href: "https://drop-desk.com/request-a-quote",
  },
  {
    icon: Users,
    title: "Upgrade To a Team Plan",
    description: "Offer custom access to your own network of spaces for your team.",
    href: "https://drop-desk.com/platform/hybrid-work-solutions",
  },
  {
    icon: Gift,
    title: "Referral Program",
    description: "Invite friends and earn rewards",
    href: "/referrals",
  },
]

const hostTools = [
  {
    icon: Building,
    title: "List a Space",
    description: "Promote new locations and spaces on the DropDesk Marketplace viewed by thousands.",
    href: "https://drop-desk.com/host",
  },
  {
    icon: Crown,
    title: "Upgrade to Host+",
    description: "Fast-track leads, sales, and conversions with our marketing and e-commerce solutions.",
    href: "https://drop-desk.com/host/plus",
  },
  {
    icon: Calendar,
    title: "Create a Marketplace",
    description: "Create your own booking marketplace for any vertical. Onboard your own Hosts and Users.",
    href: "https://drop-desk.com/platform/marketspaces",
  },
  {
    icon: Book,
    title: "Host Guides",
    description: "Access comprehensive guides and resources for hosts.",
    href: "https://drop-desk.com/host/guides",
  },
]

export default function ToolsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [userName, setUserName] = useState("Graham Beck")
  const [email, setEmail] = useState("Graham@example.com")

  useEffect(() => {
    // Fetch user data from localStorage or an API
    const storedUserName = localStorage.getItem("userName")
    if (storedUserName) setUserName(storedUserName)
  }, [])

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header setIsFilterOpen={setIsFilterOpen} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">Tools</h1>
              <p className="text-gray-600 mt-2">
                {userName}, {email} ·{" "}
                <Link href="/profile" className="text-blue-600 hover:underline">
                  Go to profile
                </Link>
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">For Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {userTools.map((tool) => (
                <Link key={tool.title} href={tool.href} target="_blank" rel="dofollow noopener noreferrer">
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <tool.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                      <p className="text-gray-600 text-sm flex-grow">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">For Hosts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {hostTools.map((tool) => (
                <Link key={tool.title} href={tool.href} target="_blank" rel="dofollow noopener noreferrer">
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <tool.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                      <p className="text-gray-600 text-sm flex-grow">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

