import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function ShopPage() {
  const supabase = await createClient()
  
  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  const displayProducts = products || []

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat.toLowerCase()}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Price Range</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>Under ₹1,000</li>
              <li>₹1,000 - ₹2,000</li>
              <li>Over ₹2,000</li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="text-sm border rounded-md px-2 py-1 bg-background">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
          
          {displayProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found. Add some in the admin dashboard!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {displayProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted mb-4">
                    {product.images && product.images.length > 0 ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `url('${product.images[0]}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center transition-opacity group-hover:opacity-75">
                        <span className="text-muted-foreground font-medium">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg group-hover:underline underline-offset-4">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                  <p className="font-medium">₹{product.price}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
