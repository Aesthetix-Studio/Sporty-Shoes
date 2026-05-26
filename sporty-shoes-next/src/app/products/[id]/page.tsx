import { createServerSupabaseClient } from '@/lib/supabase-server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) notFound()

  return (
    <div>
      <Link href="/" className="text-sm text-brand-500 hover:underline mb-6 inline-block">← Back to shop</Link>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-brand-500 font-semibold uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{product.category}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-3xl font-bold text-gray-900 mt-6">${product.price.toFixed(2)}</p>
          <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
