"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchProvider } from "@/contexts/search-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Banknote, Download } from "lucide-react"
import { CreditCardDisplay } from "@/components/credit-card-display"

// Mock data for invoices
const invoices = [
  { id: 1, date: "2023-06-15", amount: 150.0, status: "New" },
  { id: 2, date: "2023-05-15", amount: 120.0, status: "Paid" },
  { id: 3, date: "2023-04-15", amount: 180.0, status: "Voided" },
  { id: 4, date: "2023-03-15", amount: 140.0, status: "Paid" },
  { id: 5, date: "2023-02-15", amount: 160.0, status: "New" },
]

interface CreditCard {
  id: string
  cardNumber: string
  expirationDate: string
  cardHolder: string
  cvv: string
  isPrimary: boolean
}

export default function PaymentMethodsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("payment-methods")
  const [savedCards, setSavedCards] = useState<CreditCard[]>([])
  const [newCard, setNewCard] = useState<Omit<CreditCard, "id" | "isPrimary">>({
    cardNumber: "",
    expirationDate: "",
    cardHolder: "",
    cvv: "",
  })
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const [bankAccount, setBankAccount] = useState({ accountNumber: "", routingNumber: "" })

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value })
  }

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccount({ ...bankAccount, [e.target.name]: e.target.value })
  }

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCardWithId: CreditCard = {
      ...newCard,
      id: Date.now().toString(),
      isPrimary: savedCards.length === 0, // First card added is primary
    }
    setSavedCards([...savedCards, newCardWithId])
    setNewCard({ cardNumber: "", expirationDate: "", cardHolder: "", cvv: "" })
    setIsCardDialogOpen(false)
  }

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the bank account info to your backend
    console.log("Bank account submitted:", bankAccount)
    setBankAccount({ accountNumber: "", routingNumber: "" })
    setIsBankDialogOpen(false)
  }

  const handleSetPrimary = (cardId: string) => {
    setSavedCards(
      savedCards.map((card) => ({
        ...card,
        isPrimary: card.id === cardId,
      })),
    )
  }

  const handleRemoveCard = (cardId: string) => {
    const cardToRemove = savedCards.find((card) => card.id === cardId)
    if (cardToRemove && !cardToRemove.isPrimary) {
      setSavedCards(savedCards.filter((card) => card.id !== cardId))
    }
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Header setIsFilterOpen={setIsFilterOpen} />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payments</h1>

            <Tabs defaultValue="payment-methods" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="border-b border-gray-200 w-full justify-start h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="payment-methods"
                  className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                    activeTab === "payment-methods" ? "border-blue-600 text-blue-600" : "border-transparent"
                  }`}
                >
                  Payment Methods
                </TabsTrigger>
                <TabsTrigger
                  value="invoices"
                  className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                    activeTab === "invoices" ? "border-blue-600 text-blue-600" : "border-transparent"
                  }`}
                >
                  Invoices
                </TabsTrigger>
                <TabsTrigger
                  value="taxes"
                  className={`px-4 py-2 rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${
                    activeTab === "taxes" ? "border-blue-600 text-blue-600" : "border-transparent"
                  }`}
                >
                  Taxes
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {activeTab === "payment-methods" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Cards</h2>
                    <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Credit Card
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Credit Card</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCardSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              value={newCard.cardNumber}
                              onChange={handleCardInputChange}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="expirationDate">Expiration Date</Label>
                            <Input
                              id="expirationDate"
                              name="expirationDate"
                              value={newCard.expirationDate}
                              onChange={handleCardInputChange}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardHolder">Card Holder Name</Label>
                            <Input
                              id="cardHolder"
                              name="cardHolder"
                              value={newCard.cardHolder}
                              onChange={handleCardInputChange}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={newCard.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Save Card
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    {savedCards.length > 0 ? (
                      <div className="space-y-4">
                        {savedCards.map((card) => (
                          <CreditCardDisplay
                            key={card.id}
                            cardNumber={card.cardNumber}
                            expirationDate={card.expirationDate}
                            cardHolder={card.cardHolder}
                            isPrimary={card.isPrimary}
                            onSetPrimary={() => handleSetPrimary(card.id)}
                            onRemove={() => handleRemoveCard(card.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-600">
                        No credit cards added yet
                      </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Payout Method</h2>
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-6 w-6 text-gray-700" />
                          <div>
                            <h3 className="font-medium text-gray-900">Add a bank account</h3>
                            <p className="text-gray-600 text-sm">
                              Add a bank account to get paid for bookings at your space
                            </p>
                          </div>
                        </div>
                        <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Account</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Bank Account</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleBankSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                  id="accountNumber"
                                  name="accountNumber"
                                  value={bankAccount.accountNumber}
                                  onChange={handleBankInputChange}
                                  placeholder="Enter your account number"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="routingNumber">Routing Number</Label>
                                <Input
                                  id="routingNumber"
                                  name="routingNumber"
                                  value={bankAccount.routingNumber}
                                  onChange={handleBankInputChange}
                                  placeholder="Enter your routing number"
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Save Bank Account
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "invoices" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice History</h2>
                    <div className="shadow overflow-hidden sm:rounded-md">
                      <ul role="list" className="divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                          <li key={invoice.id}>
                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  Invoice for{" "}
                                  {new Date(invoice.date).toLocaleString("default", { month: "long", year: "numeric" })}
                                </p>
                                <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    invoice.status === "Paid"
                                      ? "bg-green-100 text-green-800"
                                      : invoice.status === "New"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {invoice.status}
                                </span>
                                <p className="ml-4 text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</p>
                                <Button variant="ghost" size="sm" className="ml-4">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "taxes" && (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-600">
                    No tax information available
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </SearchProvider>
  )
}

