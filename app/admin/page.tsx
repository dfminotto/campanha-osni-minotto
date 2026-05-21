'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DashboardCards } from '@/components/admin/DashboardCards'
import { ContactFilters, FilterState } from '@/components/admin/ContactFilters'
import { ExportCsvButton } from '@/components/admin/ExportCsvButton'

interface Contact {
  id: string
  full_name: string
  email: string
  whatsapp: string
  city: string
  neighborhood: string
  message: string | null
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [userRole, setUserRole] = useState('viewer')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    city: '',
    neighborhood: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile) setUserRole(profile.role)

      try {
        const res = await fetch('/api/admin/contacts')
        if (!res.ok) { setError('Erro ao carregar contatos'); return }
        const { data } = await res.json()
        setContacts(data || [])
      } catch {
        setError('Erro ao carregar contatos')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [router])

  const filteredContacts = contacts.filter((c) => {
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase()
      if (!c.full_name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
    }
    if (filters.city && c.city !== filters.city) return false
    if (filters.neighborhood && c.neighborhood !== filters.neighborhood) return false
    return true
  })

  const cities = [...new Set(contacts.map((c) => c.city))].sort()
  const neighborhoods = [...new Set(contacts.map((c) => c.neighborhood))].sort()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentCount = contacts.filter((c) => new Date(c.created_at) >= sevenDaysAgo).length

  const neighborhoodCounts = contacts.reduce((acc, c) => {
    acc[c.neighborhood] = (acc[c.neighborhood] || 0) + 1; return acc
  }, {} as Record<string, number>)
  const topNeighborhood = Object.entries(neighborhoodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || ''

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <AdminLayout userRole={userRole}>
      <DashboardCards
        totalContacts={contacts.length}
        recentCount={recentCount}
        topNeighborhood={topNeighborhood}
      />

      <ContactFilters
        filters={filters}
        setFilters={setFilters}
        cities={cities}
        neighborhoods={neighborhoods}
      />

      <div className="mb-6 flex justify-end">
        <ExportCsvButton contacts={filteredContacts} />
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Carregando contatos...</div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded mb-6">{error}</div>
      )}

      {!isLoading && !error && filteredContacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">Nenhum contato encontrado</div>
      )}

      {!isLoading && !error && filteredContacts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Data', 'Nome', 'E-mail', 'WhatsApp', 'Cidade', 'Bairro', 'Sugestão'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.full_name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.email}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.whatsapp}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.city}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contact.neighborhood}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {contact.message || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-5 py-3 flex items-center justify-between border-t border-gray-200 text-sm">
              <p className="text-gray-500">
                Página {currentPage} de {totalPages} · {filteredContacts.length} contatos
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border text-sm ${
                      page === currentPage
                        ? 'bg-[#0d2461] text-white border-[#0d2461]'
                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
