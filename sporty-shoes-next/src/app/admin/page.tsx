'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Product, Order } from '@/types/database'
import Link from 'next/link'

const EMPTY_FORM = { name: '', brand: '', category: 'Running', price: '', image_url: '', description: '', stock: '' }

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const loadData = async () => {
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    setProducts(p ?? [])
    setOrders(o ?? [])
  }

  useEffect(() => { loadData() }, [])

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image_url: form.image_url,
      description: form.description,
    }
    let err
    if (editId) {
      const res = await supabase.from('products').update(payload).eq('id', editId)
      err = res.error
    } else {
      const res = await supabase.from('products').insert(payload)
      err = res.error
    }
    setLoading(false)
    if (err) { setError(err.message); return }
    setForm(EMPTY_FORM)
    setEditId(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  const handleEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ name: p.name, brand: p.brand, category: p.category, price: String(p.price), image_url: p.image_url, description: p.description, stock: String(p.stock) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Admin Panel</h1>
        <Link href="/" className="text-sm text-brand-500 hover:underline">← Back to shop</Link>
      </div>

      <div className="flex gap-2 mb-8">
        {(['products', 'orders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
            {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">{error}</p>}
            <form onSubmit={handleSave} className="space-y-3">
              {([
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Brand', key: 'brand', type: 'text' },
                { label: 'Price', key: 'price', type: 'number' },
                { label: 'Stock', key: 'stock', type: 'number' },
                { label: 'Image URL', key: 'image_url', type: 'url' },
              ] as const).map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} required value={form[key]} onChange={set(key)} className="input text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={set('category')} className="input text-sm">
                  {['Running', 'Casual', 'Training'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={2} className="input text-sm resize-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm py-2">
                  {loading ? 'Saving…' : editId ? 'Update' : 'Add Product'}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM) }} className="btn-outline text-sm py-2 px-3">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {products.map(p => (
              <div key={p.id} className="card flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.brand} · {p.category} · ${p.price} · {p.stock} in stock</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(p)} className="text-xs btn-outline py-1 px-3">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 border border-red-200 hover:bg-red-50 font-medium py-1 px-3 rounded-xl transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-gray-500 text-center py-12">No orders yet.</p>}
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} · ${order.total.toFixed(2)}</p>
                  {order.shipping_address && typeof order.shipping_address === 'object' && !Array.isArray(order.shipping_address) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {(order.shipping_address as Record<string, string>).name} · {(order.shipping_address as Record<string, string>).city}
                    </p>
                  )}
                </div>
                <select
                  value={order.status}
                  onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {['pending', 'confirmed', 'shipped', 'delivered'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
