// components/admin/LogoutButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
    >
      {isLoading ? 'Saindo...' : 'Sair'}
    </button>
  )
}

// components/admin/AdminLayout.tsx
'use client'

import Link from 'next/link'
import { LogoutButton } from './LogoutButton'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  userRole?: string
}

export function AdminLayout({ children, userRole = 'viewer' }: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Painel da Campanha</h1>
          <LogoutButton />
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <Link
              href="/admin"
              className={`px-3 py-2 font-medium ${
                pathname === '/admin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contatos
            </Link>
            {userRole === 'admin' && (
              <Link
                href="/admin/users"
                className={`px-3 py-2 font-medium ${
                  pathname === '/admin/users'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Usuários
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

// components/admin/DashboardCards.tsx
interface DashboardCardsProps {
  totalContacts: number
  totalVolunteers: number
  topNeighborhood: string
  topProblem: string
}

export function DashboardCards({
  totalContacts,
  totalVolunteers,
  topNeighborhood,
  topProblem,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Total de Contatos</div>
        <div className="text-3xl font-bold text-blue-600 mt-2">
          {totalContacts}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Total de Voluntários</div>
        <div className="text-3xl font-bold text-green-600 mt-2">
          {totalVolunteers}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Bairro com Mais Contatos</div>
        <div className="text-lg font-bold text-gray-900 mt-2 truncate">
          {topNeighborhood || '-'}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Principal Problema</div>
        <div className="text-lg font-bold text-gray-900 mt-2 truncate">
          {topProblem || '-'}
        </div>
      </div>
    </div>
  )
}

// components/admin/ContactFilters.tsx
'use client'

import { Dispatch, SetStateAction } from 'react'

interface FilterState {
  searchText: string
  city: string
  neighborhood: string
  participationType: string
  mainProblem: string
}

interface ContactFiltersProps {
  filters: FilterState
  setFilters: Dispatch<SetStateAction<FilterState>>
  cities: string[]
  neighborhoods: string[]
  participationTypes: string[]
  mainProblems: string[]
}

export function ContactFilters({
  filters,
  setFilters,
  cities,
  neighborhoods,
  participationTypes,
  mainProblems,
}: ContactFiltersProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Buscar por nome, e-mail..."
          value={filters.searchText}
          onChange={(e) => handleChange('searchText', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filters.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as cidades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={filters.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os bairros</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>

        <select
          value={filters.participationType}
          onChange={(e) => handleChange('participationType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os tipos</option>
          {participationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.mainProblem}
          onChange={(e) => handleChange('mainProblem', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os problemas</option>
          {mainProblems.map((problem) => (
            <option key={problem} value={problem}>
              {problem}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// components/admin/ExportCsvButton.tsx
'use client'

import { Contact } from '@/types/contact'

interface ExportCsvButtonProps {
  contacts: Contact[]
}

export function ExportCsvButton({ contacts }: ExportCsvButtonProps) {
  const handleExport = () => {
    // Prepare CSV content
    const headers = [
      'Data',
      'Nome',
      'E-mail',
      'WhatsApp',
      'Cidade',
      'Bairro',
      'Tipo de participação',
      'Principal problema',
      'Mensagem',
    ]

    const rows = contacts.map((contact) => [
      new Date(contact.created_at).toLocaleString('pt-BR'),
      contact.full_name,
      contact.email,
      contact.whatsapp,
      contact.city,
      contact.neighborhood,
      contact.participation_type,
      contact.main_problem,
      contact.message || '',
    ])

    // Create CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(',')
      ),
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'contatos-campanha.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
    >
      Exportar CSV ({contacts.length} contatos)
    </button>
  )
}
