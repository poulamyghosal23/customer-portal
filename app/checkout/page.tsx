"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, CreditCard, Info, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Mock data for the space being booked
const spaceData = {
  id: 1,
  name: "Creative Studio Downtown",
  image: "/placeholder.svg",
  price: 75,
  duration: 2,
}

// Mock data for saved cards
const savedCards = [
  { id: 1, last4: "4242", brand: "Visa", expiry: "12/24" },
  { id: 2, last4: "1234", brand: "Mastercard", expiry: "06/25" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("saved-card")
  const [selectedCard, setSelectedCard] = useState<number | string>(savedCards[0].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [availableCredits, setAvailableCredits] = useState(2) // Mock available credits
  const [appliedCredits, setAppliedCredits] = useState(0)
  const [showBillingAddress, setShowBillingAddress] = useState(false)
  const [showSpecialNotes, setShowSpecialNotes] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  })

  useEffect(() => {
    // Automatically apply available credits
    const maxCreditsToApply = Math.min(availableCredits, spaceData.price * spaceData.duration)
    setAppliedCredits(maxCreditsToApply)
  }, [availableCredits])

  useEffect(() => {
    // Show billing address if:
    // 1. A payment method other than saved-card is selected, or
    // 2. "Add a new card" is selected when saved-card is the payment method
    setShowBillingAddress(
      selectedPaymentMethod !== "saved-card" || (selectedPaymentMethod === "saved-card" && selectedCard === "new"),
    )
  }, [selectedPaymentMethod, selectedCard])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/my-bookings")
    }, 2000)
  }

  const totalBeforeCredits = spaceData.price * spaceData.duration + 30 + 2.59
  const totalAfterCredits = totalBeforeCredits - appliedCredits

  const renderBillingAddressFields = () => {
    switch (selectedPaymentMethod) {
      case "link":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                placeholder="Enter your phone number"
              />
            </div>
          </>
        )
      case "apple-pay":
      case "google-pay":
        return (
          <p className="text-sm text-gray-600">
            Billing information will be retrieved from your{" "}
            {selectedPaymentMethod === "apple-pay" ? "Apple Pay" : "Google Pay"} account.
          </p>
        )
      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger className="border-gray-200 focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  className="focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                />
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header setIsFilterOpen={() => {}} showMap={false} setShowMap={() => {}} spaceCount={0} />
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-blue-400 hover:text-blue-500 hover:bg-blue-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Package Details
            </Button>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment Section */}
              <div className="space-y-6 hidden md:block">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                    <CardDescription>Choose your preferred payment method for this booking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} aria-label="Payment form">
                      <div className="space-y-6">
                        <div>
                          <RadioGroup
                            defaultValue="saved-card"
                            onValueChange={setSelectedPaymentMethod}
                            className="space-y-4"
                            role="group"
                            aria-labelledby="payment-method-label"
                          >
                            <div id="payment-method-label" className="sr-only">
                              Select Payment Method
                            </div>
                            <RadioGroupItem value="saved-card" id="saved-card" className="peer sr-only" />
                            <Label
                              htmlFor="saved-card"
                              className="flex flex-col space-y-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-200 [&:has([data-state=checked])]:border-blue-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium">Use Card on File</span>
                                </div>
                                <Select
                                  value={selectedCard.toString()}
                                  onValueChange={(value) => setSelectedCard(value)}
                                  aria-label="Select a saved card"
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a card" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {savedCards.map((card) => (
                                      <SelectItem key={card.id} value={card.id.toString()}>
                                        {card.brand} ending in {card.last4}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="new">Add a new card</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </Label>
                            <RadioGroupItem value="other-method" id="other-method" className="peer sr-only" />
                            <Label
                              htmlFor="other-method"
                              className="flex flex-col space-y-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-200 [&:has([data-state=checked])]:border-blue-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium">Other payment methods</span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPaymentMethod("apple-pay")}
                                    className={selectedPaymentMethod === "apple-pay" ? "bg-blue-100" : ""}
                                  >
                                    <Image src="/apple-pay-logo.svg" alt="Apple Pay" width={40} height={24} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPaymentMethod("google-pay")}
                                    className={selectedPaymentMethod === "google-pay" ? "bg-blue-100" : ""}
                                  >
                                    <Image src="/google-pay-logo.svg" alt="Google Pay" width={40} height={24} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPaymentMethod("link")}
                                    className={selectedPaymentMethod === "link" ? "bg-blue-100" : ""}
                                  >
                                    <Image src="/link-logo.svg" alt="Link" width={40} height={24} />
                                  </Button>
                                </div>
                              </div>
                            </Label>
                          </RadioGroup>
                        </div>

                        {selectedPaymentMethod === "saved-card" && selectedCard === "new" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input id="card-number" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Name on Card</Label>
                              <Input id="name" placeholder="John Doe" />
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {showBillingAddress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                      <CardDescription>Enter the billing address associated with your payment method</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">{renderBillingAddressFields()}</CardContent>
                  </Card>
                )}
              </div>

              {/* Summary Section */}
              <div className="space-y-6">
                <Card className="relative">
                  <CardHeader>
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={spaceData.image || "/placeholder.svg"}
                        alt={spaceData.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{spaceData.name}</h3>
                        <p className="text-sm text-gray-500">
                          {spaceData.duration} hours @ ${spaceData.price}/hour
                        </p>
                      </div>
                      <span className="font-medium">${spaceData.price * spaceData.duration}.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Service fee</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Service fee helps us operate the platform</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span>$30.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estimated tax</span>
                      <span>$2.59</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Subtotal</span>
                      <span>${totalBeforeCredits.toFixed(2)}</span>
                    </div>
                    {appliedCredits > 0 && (
                      <div className="flex justify-between items-center text-blue-600">
                        <span className="text-sm">Applied Credits ({appliedCredits} credits)</span>
                        <span>-${appliedCredits.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Total</span>
                      <span>${totalAfterCredits.toFixed(2)}</span>
                    </div>
                    {appliedCredits > 0 && (
                      <p className="text-sm text-blue-600">{appliedCredits} credits applied to this booking</p>
                    )}
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="special-notes" className="text-sm font-medium">
                          Special Notes
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSpecialNotes(!showSpecialNotes)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {showSpecialNotes ? "Hide" : "Add"}
                        </Button>
                      </div>
                      {showSpecialNotes && (
                        <Textarea
                          id="special-notes"
                          placeholder="Enter any special requests or notes here..."
                          className="w-full min-h-[100px] rounded-md border border-gray-200 focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200 p-3"
                          aria-label="Special notes for your booking"
                        />
                      )}
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="coupon-code" className="text-sm font-medium">
                          Coupon Code
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCoupon(!showCoupon)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {showCoupon ? "Hide" : "Add"}
                        </Button>
                      </div>
                      {showCoupon && (
                        <div className="flex space-x-2">
                          <Input
                            id="coupon-code"
                            placeholder="Enter coupon code"
                            className="flex-grow focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:border-blue-200"
                          />
                          <Button variant="outline">Apply</Button>
                        </div>
                      )}
                    </div>
                    <div className="md:hidden space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Visa ending in 4242</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPaymentMethod("other-method")
                            setIsCardDialogOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Change
                        </Button>
                        <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Payment Method</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <RadioGroup
                                value={selectedPaymentMethod}
                                onValueChange={(value) => {
                                  setSelectedPaymentMethod(value)
                                  if (value === "saved-card") {
                                    setSelectedCard(savedCards[0].id)
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="saved-card" id="saved-card-mobile" />
                                  <Label htmlFor="saved-card-mobile">Use Card on File</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="new-card" id="new-card-mobile" />
                                  <Label htmlFor="new-card-mobile">Add New Card</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="other-method" id="other-method-mobile" />
                                  <Label htmlFor="other-method-mobile">Other Payment Methods</Label>
                                </div>
                              </RadioGroup>
                              {selectedPaymentMethod === "saved-card" && (
                                <Select
                                  value={selectedCard.toString()}
                                  onValueChange={(value) => setSelectedCard(value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a card" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {savedCards.map((card) => (
                                      <SelectItem key={card.id} value={card.id.toString()}>
                                        {card.brand} ending in {card.last4}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {selectedPaymentMethod === "new-card" && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                      id="card-number"
                                      placeholder="1234 5678 9012 3456"
                                      value={newCardDetails.cardNumber}
                                      onChange={(e) =>
                                        setNewCardDetails({ ...newCardDetails, cardNumber: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="expiry">Expiry Date</Label>
                                      <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        value={newCardDetails.expiryDate}
                                        onChange={(e) =>
                                          setNewCardDetails({ ...newCardDetails, expiryDate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="cvv">CVV</Label>
                                      <Input
                                        id="cvv"
                                        placeholder="123"
                                        value={newCardDetails.cvv}
                                        onChange={(e) => setNewCardDetails({ ...newCardDetails, cvv: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="name">Name on Card</Label>
                                    <Input
                                      id="name"
                                      placeholder="John Doe"
                                      value={newCardDetails.name}
                                      onChange={(e) => setNewCardDetails({ ...newCardDetails, name: e.target.value })}
                                    />
                                  </div>
                                </div>
                              )}
                              {selectedPaymentMethod === "other-method" && (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPaymentMethod("apple-pay")}
                                  >
                                    <Image src="/apple-pay-logo.svg" alt="Apple Pay" width={40} height={24} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPaymentMethod("google-pay")}
                                  >
                                    <Image src="/google-pay-logo.svg" alt="Google Pay" width={40} height={24} />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedPaymentMethod("link")}>
                                    <Image src="/link-logo.svg" alt="Link" width={40} height={24} />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button onClick={() => setIsCardDialogOpen(false)}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <CardFooter className="flex-col space-y-4">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 hidden md:block"
                        disabled={isProcessing}
                        onClick={handlePaymentSubmit}
                      >
                        {isProcessing ? "Processing..." : `Confirm and Pay $${totalAfterCredits.toFixed(2)}`}
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4" />
                        <span>Payments are secure and encrypted</span>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-2">
                        <p>Cancellation Policy: Free cancellation up to 24 hours before your booking.</p>
                        <p>After that, the booking amount is non-refundable.</p>
                      </div>
                    </CardFooter>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Sticky "Confirm and Pay" button for mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isProcessing}
              onClick={handlePaymentSubmit}
            >
              {isProcessing ? "Processing..." : `Confirm and Pay $${totalAfterCredits.toFixed(2)}`}
            </Button>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

