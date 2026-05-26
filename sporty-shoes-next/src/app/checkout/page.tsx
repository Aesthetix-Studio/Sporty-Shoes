'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', country: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/" className="btn-primary">Browse products</Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Please sign in to place an order.'); setLoading(false); return }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total, status: 'pending', shipping_address: form })
      .select()
      .single()

    if (orderErr || !order) { setError(orderErr?.message ?? 'Failed to create order.'); setLoading(false); return }

    const { error: itemsErr } = await supabase.from('order_items').insert(
      items.map(i => ({ order_id: order.id, product_id: i.id, quantity: i.quantity, price: i.price }))
    )

    if (itemsErr) { setError(itemsErr.message); setLoading(false); return }

    clear()
    router.push(`/checkout/success?orderId=${order.id}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Shipping Information</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'John Doe' },
                { label: 'Address', key: 'address', placeholder: '123 Main St' },
                { label: 'City', key: 'city', placeholder: 'New York' },
                { label: 'ZIP / Postal Code', key: 'zip', placeholder: '10001' },
                { label: 'Country', key: 'country', placeholder: 'United States' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    required
                    value={form[key as keyof typeof form]}
                    onChange={set(key as keyof typeof form)}
                    placeholder={placeholder}
                    className="input"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? 'Placing order…' : `Place Order · $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="card p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {items.map(i => (
              <div key={i.id} className="flex justify-between">
                <span className="truncate mr-2">{i.name} × {i.quantity}</span>
                <span className="font-medium text-gray-900">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
