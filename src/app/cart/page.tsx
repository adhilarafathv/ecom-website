'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-2xl p-4 items-center">
              <div className="h-24 w-24 rounded-xl shrink-0 bg-muted relative overflow-hidden">
                {item.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                ) : null}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-semibold hover:underline truncate block">
                  {item.name}
                </Link>
                <div className="text-sm text-muted-foreground mt-1 flex gap-2">
                  <span>Color: {item.color}</span>
                  <span>|</span>
                  <span>Size: {item.size}</span>
                </div>
                <div className="font-medium mt-2">₹{item.price}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg bg-background">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="border rounded-2xl p-6 bg-muted/20 sticky top-24">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">₹{getTotalPrice()}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full h-12 text-base font-medium">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
