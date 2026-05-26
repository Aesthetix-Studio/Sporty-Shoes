'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const { count } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-500 tracking-tight">
          👟 Sporty Shoes
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors">
            Shop
          </Link>

          <Link href="/cart" className="relative text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors">
                Admin
              </Link>
              <button onClick={signOut} className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
