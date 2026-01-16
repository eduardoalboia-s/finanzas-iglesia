import { prisma } from '@/lib/prisma'
import { MonthYearSelector } from '@/components/reports/month-year-selector'
import { ExportButton } from '@/components/reports/export-button'
import Link from 'next/link'
import { Printer } from 'lucide-react'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const resolvedSearchParams = await searchParams
  const now = new Date()
  const currentMonth = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month) : now.getMonth() + 1
  const currentYear = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : now.getFullYear()

  // Calcular rango de fechas para el mes seleccionado
  const startDate = new Date(currentYear, currentMonth - 1, 1)
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59)

  // Obtener transacciones del mes
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      member: {
        select: { firstName: true, lastName: true }
      }
    }
  })

  // Calcular Totales
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Agrupar por Categoría (Ingresos)
  const incomeByCategory = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  // Agrupar por Categoría (Egresos)
  const expenseByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  // Helper para etiquetas
  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      'REMESA_DIEZMO': '10% Diezmo a Corporación',
      'REMESA_OFRENDA': '10% Ofrenda a Corporación',
      'SUELDO_PASTOR': 'Aporte Pastoral',
      'CUOTA_ZONAL': 'Cuota Zonal',
      'DIEZMO': 'Diezmo',
      'OFRENDA_CULTO': 'Ofrenda Culto',
      'OFRENDA_CONSTRUCCION': 'Ofrenda Construcción',
      'OFRENDA_ESPECIAL': 'Ofrenda Especial',
      'DONACION': 'Donación',
      'ACTIVIDAD': 'Actividad',
      'SERVICIOS_BASICOS': 'Servicios Básicos',
      'MANTENCION': 'Mantención',
      'GASTOS_CONSTRUCCION': 'Gastos Construcción',
      'AYUDA_SOCIAL': 'Ayuda Social',
      'MINISTERIOS': 'Ministerios',
      'HONORARIOS': 'Honorarios',
      'OTROS': 'Otros'
    }
    return map[category] || category
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reportes Mensuales</h1>
        <p className="text-gray-600">Resumen financiero detallado por período.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Período</label>
          <MonthYearSelector />
        </div>
        <div>
          <Link 
            href={`/reports/print?month=${currentMonth}&year=${currentYear}`}
            target="_blank"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          >
            <Printer className="h-4 w-4 mr-2 text-gray-500" />
            Ver Versión Impresa
          </Link>
          <ExportButton transactions={transactions} month={currentMonth} year={currentYear} />
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Ingresos ({currentMonth}/{currentYear})</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">${totalIncome.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Gastos ({currentMonth}/{currentYear})</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">${totalExpense.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Balance Mensual</h3>
          <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            ${balance.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detalle de Ingresos */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-100">
            <h3 className="font-semibold text-green-800">Desglose de Ingresos</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <tr key={category}>
                  <td className="px-6 py-4 text-sm text-gray-900">{getCategoryLabel(category)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-right">${amount.toLocaleString('es-CL')}</td>
                </tr>
              ))}
              {Object.keys(incomeByCategory).length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                    No hay ingresos registrados este mes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detalle de Gastos */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <h3 className="font-semibold text-red-800">Desglose de Gastos</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(expenseByCategory).map(([category, amount]) => (
                <tr key={category}>
                  <td className="px-6 py-4 text-sm text-gray-900">{getCategoryLabel(category)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-right">${amount.toLocaleString('es-CL')}</td>
                </tr>
              ))}
              {Object.keys(expenseByCategory).length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center italic">
                    No hay gastos registrados este mes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
