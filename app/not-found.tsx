import Link from 'next/link'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-warning" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-1">Page Not Found</p>
      <p className="text-sm text-gray-400 mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary">
        <Home className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  )
}
