import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Test: Can we read products?
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    return NextResponse.json({
      success: !productsError,
      error: productsError ? productsError.message : null,
      productsCount: products?.length ?? 0,
      firstProduct: products?.[0] ?? null,
      allProducts: products ?? []
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: String(err)
    }, { status: 500 })
  }
}
