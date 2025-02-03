import { CreditCard, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreditCardDisplayProps {
  cardNumber: string
  expirationDate: string
  cardHolder: string
  isPrimary: boolean
  onSetPrimary: () => void
  onRemove: () => void
}

export function CreditCardDisplay({ 
  cardNumber, 
  expirationDate, 
  cardHolder, 
  isPrimary,
  onSetPrimary,
  onRemove
}: CreditCardDisplayProps) {
  const lastFourDigits = cardNumber.slice(-4)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <CreditCard className="h-8 w-8 text-blue-600 mr-4" />
        <div>
          <div className="flex items-center">
            <p className="font-medium text-gray-900">•••• •••• •••• {lastFourDigits}</p>
            {isPrimary && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Expires {expirationDate}</p>
          <p className="text-sm text-gray-500">{cardHolder}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {!isPrimary && (
          <Button variant="outline" size="sm" onClick={onSetPrimary}>
            Set as Primary
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onRemove} disabled={isPrimary}>
          Remove
        </Button>
      </div>
    </div>
  )
}

