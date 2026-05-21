'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

interface AdminLayoutProps {
  children: React.ReactNode
  userRole?: string
}

export function AdminLayout({ children, userRole = 'viewer' }: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#0d2461] text-lg leading-none">UNIÃO<br />BRASIL</span>
            <span className="font-black text-[#f5a623] text-3xl leading-none ml-1">44</span>
            <span className="ml-3 text-gray-400 font-medium text-sm">Painel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← Site</a>
            <LogoutButton />
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
          <Link
            href="/admin"
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              pathname === '/admin'
                ? 'border-[#0d2461] text-[#0d2461]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Contatos
          </Link>
          {userRole === 'admin' && (
            <Link
              href="/admin/users"
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                pathname === '/admin/users'
                  ? 'border-[#0d2461] text-[#0d2461]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Usuários
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
