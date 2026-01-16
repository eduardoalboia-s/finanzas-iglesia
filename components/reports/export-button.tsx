'use client'

import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'

type Transaction = {
  id: string
  amount: number
  type: string
  category: string
  description: string | null
  date: Date
  member: {
    firstName: string
    lastName: string
  } | null
}

export function ExportButton({ 
  transactions, 
  month, 
  year 
}: { 
  transactions: Transaction[]
  month: number
  year: number
}) {
  const handleExport = () => {
    // Formatear datos para Excel
    const data = transactions.map(t => ({
      Fecha: new Date(t.date).toLocaleDateString('es-CL'),
      Tipo: t.type === 'INCOME' ? 'Ingreso' : 'Egreso',
      Categoría: t.category,
      Descripción: t.description || '',
      Miembro: t.member ? `${t.member.firstName} ${t.member.lastName}` : '',
      Monto: t.amount
    }))

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Ajustar ancho de columnas
    const wscols = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Tipo
      { wch: 20 }, // Categoría
      { wch: 30 }, // Descripción
      { wch: 25 }, // Miembro
      { wch: 15 }, // Monto
    ]
    ws['!cols'] = wscols

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, `Reporte ${month}-${year}`)

    // Descargar archivo
    XLSX.writeFile(wb, `Tesorería_Iglesia_${month}-${year}.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Download className="h-4 w-4 mr-2 text-gray-500" />
      Exportar a Excel
    </button>
  )
}
