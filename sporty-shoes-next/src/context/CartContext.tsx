'use client'

import { createContext, useContext, useEffect, useReducer } from 'react'
import type { Product } from '@/types/database'

export interface CartItem extends Product { quantity: number }

interface CartState { items: CartItem[] }

type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return { items: state.items.map(i => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) }
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] }
    }
    case 'REMOVE': return { items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE': return { items: state.items.map(i => i.id === action.id ? { ...i, quantity: action.quantity } : i) }
    case 'CLEAR': return { items: [] }
    case 'LOAD': return { items: action.items }
    default: return state
  }
}

interface CartContextValue {
  items: CartItem[]
  add: (product: Product) => void
  remove: (id: string) => void
  update: (id: string, quantity: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    const saved = localStorage.getItem('sporty-cart')
    if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
  }, [])

  useEffect(() => {
    localStorage.setItem('sporty-cart', JSON.stringify(state.items))
  }, [state.items])

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      add: (p) => dispatch({ type: 'ADD', product: p }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      update: (id, quantity) => dispatch({ type: 'UPDATE', id, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      total,
      count,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
