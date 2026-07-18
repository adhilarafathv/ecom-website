'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prevent accessing checkout with empty cart
  if (items.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/cart')
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const total = getTotalPrice()

      // Generate order ID client-side to avoid needing a SELECT RLS policy
      const orderId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
          })

      // 1. Insert Order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_name: formData.fullName,
          phone: formData.phone,
          address: formData.address + (formData.landmark ? `, Landmark: ${formData.landmark}` : ''),
          notes: formData.notes,
          total: total,
          status: 'Pending',
        })

      if (orderError) throw orderError

      // 2. Insert Order Items
      const orderItemsToInsert = items.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.size,
        selected_color: item.color,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)

      if (itemsError) throw itemsError

      // 3. Format WhatsApp Message
      const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918111937217'
      const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://store.com'

      const itemsList = items.map((item, index) => {
        return `${index + 1}. \nProduct: ${item.name}\nLink: ${BASE_URL}/product/${item.slug}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nPrice: ₹${item.price}`
      }).join('\n\n')

      const message = `🛍️ *New Order (#${orderId})*\n\n*Customer:*\n${formData.fullName}\n\n*Phone:*\n${formData.phone}\n\n*Address:*\n${formData.address}\n${formData.landmark ? `Landmark: ${formData.landmark}\n` : ''}\n*Items:*\n\n${itemsList}\n\n---\n*Grand Total:*\n₹${total}\n\n${formData.notes ? `*Notes:*\n${formData.notes}` : ''}`

      const encodedMessage = encodeURIComponent(message)
      
      // 4. Open WhatsApp
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')

      // 5. Clear cart and redirect
      clearCart()
      router.push('/')
    } catch (error: any) {
      console.error('Error placing order:', error)
      const errorMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error))
      alert(`There was an error placing your order: ${errorMsg}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="bg-muted/30 border rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" required type="tel" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="House/Flat No., Building, Street, Area, City, Pincode" className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Near City Mall" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any specific instructions for delivery?" />
          </div>

          <div className="border-t pt-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-lg">Total Amount</span>
              <span className="font-bold text-2xl">₹{getTotalPrice()}</span>
            </div>
            
            <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : 'Place Order via WhatsApp'}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              By clicking place order, you will be redirected to WhatsApp to complete your purchase.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
