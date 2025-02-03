"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSMSSignIn, setIsSMSSignIn] = useState(false)
  const [countryCode, setCountryCode] = useState("+1")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSMSSignIn) {
      const phoneInput = document.getElementById("phone") as HTMLInputElement
      console.log("Login attempted with phone:", countryCode + phoneInput.value)
    } else {
      console.log("Login attempted with:", email, password)
    }
  }

  const handleGoogleSSO = () => {
    // Handle Google SSO logic here
    console.log("Google SSO initiated")
  }

  const handleSMSSignIn = () => {
    setIsSMSSignIn(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropdesk-spaces_logo-final_full-color-E8rdJv6o5bGCuP8b8OeSyT5lIXhRBn.png"
              alt="DropDesk Spaces"
              width={180}
              height={54}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900">Login or Sign Up To Create a New Account</h2>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSMSSignIn ? (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <select
                        className="w-20 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        {/* Add more country codes as needed */}
                      </select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="flex-1 rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {isSMSSignIn ? "Send SMS Code" : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="Create a password" required />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm your password" required />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleGoogleSSO}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant={isSMSSignIn ? "default" : "outline"}
                onClick={() => setIsSMSSignIn(!isSMSSignIn)}
                className={isSMSSignIn ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {isSMSSignIn ? "Use Email" : "SMS"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

