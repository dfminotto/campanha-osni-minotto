'use client'

import { Dispatch, SetStateAction } from 'react'

export interface FilterState {
  searchText: string
  city: string
  neighborhood: string
}

interface ContactFiltersProps {
  filters: FilterState
  setFilters: Dispatch<SetStateAction<FilterState>>
  cities: string[]
  neighborhoods: string[]
}

export function ContactFilters({ filters, setFilters, cities, neighborhoods }: ContactFiltersProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={filters.searchText}
          onChange={(e) => handleChange('searchText', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d2461] text-sm"
        />
        <select
          value={filters.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d2461] text-sm"
        >
          <option value="">Todas as cidades</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        <select
          value={filters.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d2461] text-sm"
        >
          <option value="">Todos os bairros</option>
          {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  )
}
