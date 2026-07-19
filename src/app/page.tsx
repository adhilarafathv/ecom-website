import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: newArrivals } = await supabase
    .from('products')
    .select('id, name, slug, price, category, images')
    .order('created_at', { ascending: false })
    .limit(4)
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full bg-muted overflow-hidden flex items-center justify-center">
        {/* We would use next/image here in a real scenario with a real image URL */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')" }}
        />
        
        <div className="relative z-20 text-center text-white space-y-4 px-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Redefine Your Style
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-xl mx-auto font-medium">
            Discover our latest collection of premium, oversized comfort wear. Minimalist designs for the modern individual.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-white text-black hover:bg-white/90">
                Shop New Arrivals
              </Button>
            </Link>
            <Link href="/shop?category=bestsellers">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 text-white border-white hover:bg-white/20">
                View Best Sellers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by Category</h2>
          <Link href="/shop" className="text-sm font-medium hover:underline underline-offset-4">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          {[
            { name: 'Oversized Tees', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Premium Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=1974&auto=format&fit=crop' },
          ].map((category) => (
            <Link key={category.name} href={`/shop?category=${category.name.toLowerCase()}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/5] bg-muted">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">New Arrivals</h2>
            <Link href="/shop" className="text-sm font-medium hover:underline underline-offset-4">
              Shop Now
            </Link>
          </div>
          {newArrivals && newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {newArrivals.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted mb-3">
                    {product.images && product.images.length > 0 ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${product.images[0]}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg group-hover:underline underline-offset-4 line-clamp-1">{product.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-1">{product.category}</p>
                  <p className="font-medium text-sm sm:text-base">₹{product.price}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No products yet. Add some in the admin dashboard!</p>
              <Link href="/shop" className="mt-4 inline-block text-sm font-medium hover:underline underline-offset-4">Browse Shop →</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
