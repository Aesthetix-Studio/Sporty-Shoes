import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items, total, shipping_address } = await request.json()

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ user_id: user.id, total, status: 'pending', shipping_address })
    .select()
    .single()

  if (orderErr || !order) return NextResponse.json({ error: orderErr?.message }, { status: 400 })

  const { error: itemsErr } = await supabase.from('order_items').insert(
    items.map((i: { product_id: string; quantity: number; price: number }) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
    }))
  )

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 })
  return NextResponse.json(order, { status: 201 })
}
