import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories']

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const { category, sort } = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase.from('products').select('*')

  // Apply category filter
  if (category && category !== 'all') {
    query = query.ilike('category', category)
  }

  // Apply sort
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      // Featured first, then newest
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
  }

  const displayProducts = products || []
  const activeCategory = category || 'all'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">

        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => {
                const catValue = cat.toLowerCase()
                const isActive = activeCategory === catValue
                return (
                  <li key={cat}>
                    <Link
                      href={`/shop?category=${catValue}${sort ? `&sort=${sort}` : ''}`}
                      className={`transition-colors ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Price Range</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link
                  href={`/shop?${category && category !== 'all' ? `category=${category}&` : ''}sort=price_asc`}
                  className={`transition-colors hover:text-foreground ${sort === 'price_asc' ? 'font-semibold text-foreground' : ''}`}
                >
                  Price: Low to High
                </Link>
              </li>
              <li>
                <Link
                  href={`/shop?${category && category !== 'all' ? `category=${category}&` : ''}sort=price_desc`}
                  className={`transition-colors hover:text-foreground ${sort === 'price_desc' ? 'font-semibold text-foreground' : ''}`}
                >
                  Price: High to Low
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {category && category !== 'all'
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : 'All Products'}
              <span className="text-base font-normal text-muted-foreground ml-2">
                ({displayProducts.length})
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                defaultValue={sort || 'featured'}
                className="text-sm border rounded-md px-2 py-1 bg-background"
                onChange={undefined}
                // This is a server component — sort changes via URL. The select is for display.
                // Use the sidebar price links or navigate with JS below.
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {displayProducts.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-lg font-medium">No products found.</p>
              {category && category !== 'all' ? (
                <Link href="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
                  Clear filter
                </Link>
              ) : (
                <p className="text-sm mt-2">Add some products in the admin dashboard!</p>
              )}
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
