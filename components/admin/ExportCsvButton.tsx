'use client'

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

interface ExportCsvButtonProps {
  contacts: Contact[]
}

export function ExportCsvButton({ contacts }: ExportCsvButtonProps) {
  const handleExport = () => {
    const headers = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Cidade', 'Bairro', 'Sugestão']
    const rows = contacts.map((c) => [
      new Date(c.created_at).toLocaleString('pt-BR'),
      c.full_name,
      c.email,
      c.whatsapp,
      c.city,
      c.neighborhood,
      c.message || '',
    ])

    const escape = (cell: string) =>
      cell.includes(',') || cell.includes('"') || cell.includes('\n')
        ? `"${cell.replace(/"/g, '""')}"`
        : cell

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => escape(String(cell))).join(',')),
    ].join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `contatos-campanha-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
    >
      Exportar CSV ({contacts.length})
    </button>
  )
}
