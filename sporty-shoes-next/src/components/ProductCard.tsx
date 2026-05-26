'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types/database'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <div className="card group flex flex-col">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 mt-0.5 hover:text-brand-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => add(product)}
            disabled={product.stock === 0}
            className="btn-primary text-sm py-1.5 px-3"
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
