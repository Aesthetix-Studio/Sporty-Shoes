import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = ['All', 'Running', 'Casual', 'Training']

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (category && category !== 'All') query = query.eq('category', category)

  const { data: products } = await query

  return (
    <div>
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 text-white p-10 mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Step Into Performance</h1>
        <p className="text-brand-100 text-lg">Premium sports footwear for every stride.</p>
      </section>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={cat === 'All' ? '/' : `/?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (cat === 'All' && !category) || category === cat
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-500'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Product grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-20">No products found.</p>
      )}
    </div>
  )
}
