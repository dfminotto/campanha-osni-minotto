interface DashboardCardsProps {
  totalContacts: number
  topNeighborhood: string
  recentCount: number
}

export function DashboardCards({ totalContacts, topNeighborhood, recentCount }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Total de Contatos</div>
        <div className="text-3xl font-bold text-[#0d2461] mt-2">{totalContacts}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Últimos 7 dias</div>
        <div className="text-3xl font-bold text-green-600 mt-2">{recentCount}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium">Bairro com Mais Contatos</div>
        <div className="text-lg font-bold text-gray-900 mt-2 truncate">{topNeighborhood || '—'}</div>
      </div>
    </div>
  )
}
