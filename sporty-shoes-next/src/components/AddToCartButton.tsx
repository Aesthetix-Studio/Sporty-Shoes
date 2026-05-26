'use client'

import { useCart } from '@/context/CartContext'
import type { Product } from '@/types/database'

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <button
      onClick={() => add(product)}
      disabled={product.stock === 0}
      className="btn-primary w-full text-base py-3"
    >
      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
