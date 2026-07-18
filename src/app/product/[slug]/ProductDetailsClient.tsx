'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { Check } from 'lucide-react'

export default function ProductDetailsClient({ product }: { product: any }) {
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size'
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default'

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: mainImage || undefined,
    })
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Product Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden relative">
             {mainImage ? (
               <div 
                 className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url('${mainImage}')` }}
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No Image Available</div>
             )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-muted rounded-xl overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-2xl font-medium mb-6">₹{product.price}</p>
          
          <div className="prose prose-sm text-muted-foreground mb-8 whitespace-pre-wrap">
            <p>{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Color</span>
                <span className="text-sm text-muted-foreground">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'} ring-1 ring-border flex items-center justify-center`}
                    style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f8f8f8' : color.toLowerCase() }}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Size</span>
                <button className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border text-sm font-medium transition-colors ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-foreground/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-muted transition-colors rounded-l-lg"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 hover:bg-muted transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>
            <Button 
              size="lg" 
              className="flex-1 h-auto py-3 text-base"
              onClick={handleAddToCart}
              disabled={added || product.stock === 0}
            >
              {added ? (
                <><Check className="mr-2 h-5 w-5" /> Added to Cart</>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </Button>
          </div>

          {/* Accordions / Info */}
          <div className="border-t pt-6 space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Shipping</span>
              <span className="text-muted-foreground">Free over ₹2000</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Returns</span>
              <span className="text-muted-foreground">7 Days Return Policy</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
