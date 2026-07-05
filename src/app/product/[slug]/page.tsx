import { createClient } from '@/lib/supabase/server'
import ProductDetailsClient from './ProductDetailsClient'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // params.slug is awaited in Next.js 15
  const { slug } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !product) {
    console.error('Error fetching product:', error)
    notFound()
  }

  return <ProductDetailsClient product={product} />
}
