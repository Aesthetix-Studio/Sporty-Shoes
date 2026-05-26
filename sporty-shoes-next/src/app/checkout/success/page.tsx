import Link from 'next/link'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">🎉</p>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      {orderId && <p className="text-xs text-gray-400 mb-8">Order ID: {orderId}</p>}
      <Link href="/" className="btn-primary">Continue Shopping</Link>
    </div>
  )
}
