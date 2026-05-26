'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, remove, update, total, count } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some shoes to get started.</p>
        <Link href="/" className="btn-primary">Browse products</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Your Cart ({count} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-500 font-semibold uppercase">{item.brand}</p>
                <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => item.quantity > 1 ? update(item.id, item.quantity - 1) : remove(item.id)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-500 hover:text-brand-500 transition-colors"
                  >−</button>
                  <span className="font-medium w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => update(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-500 hover:text-brand-500 transition-colors"
                  >+</button>
                  <button onClick={() => remove(item.id)} className="ml-auto text-sm text-red-400 hover:text-red-600 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-bold text-gray-900 self-center">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center block mt-6">
            Proceed to Checkout
          </Link>
          <Link href="/" className="btn-outline w-full text-center block mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
