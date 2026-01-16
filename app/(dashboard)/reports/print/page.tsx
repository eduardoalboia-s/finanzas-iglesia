import { prisma } from '@/lib/prisma'
import { Printer } from 'lucide-react'

export default async function PrintReportPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const resolvedSearchParams = await searchParams
  const now = new Date()
  const currentMonth = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month) : now.getMonth() + 1
  const currentYear = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : now.getFullYear()

  const startDate = new Date(currentYear, currentMonth - 1, 1)
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' }
  })

  // Cálculos
  const income = transactions.filter(t => t.type === 'INCOME')
  const expense = transactions.filter(t => t.type === 'EXPENSE')
  
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  // Agrupar para resumen
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

  const incomeByCategory = income.reduce((acc, t) => {
    const label = getCategoryLabel(t.category)
    acc[label] = (acc[label] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const expenseByCategory = expense.reduce((acc, t) => {
    const label = getCategoryLabel(t.category)
    acc[label] = (acc[label] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('es-CL', { month: 'long' })

  return (
    <div className="bg-white min-h-screen p-8 text-black print:p-0">
      {/* Botón Imprimir (visible solo en pantalla) */}
      <div className="mb-8 print:hidden flex justify-end">
        <PrintButton />
      </div>

      {/* Encabezado Oficial */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase">Iglesia Evangélica Corporación Vitacura</h1>
        <h2 className="text-xl font-semibold mt-2">Informe de Tesorería</h2>
        <p className="text-gray-600 mt-1 capitalize">{monthName} {currentYear}</p>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-2">1. Resumen General</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-1">Total Ingresos del Período:</td>
              <td className="text-right font-semibold text-green-700">+ ${totalIncome.toLocaleString('es-CL')}</td>
            </tr>
            <tr>
              <td className="py-1">Total Gastos del Período:</td>
              <td className="text-right font-semibold text-red-700">- ${totalExpense.toLocaleString('es-CL')}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-bold">Saldo del Mes:</td>
              <td className={`text-right font-bold py-2 ${balance >= 0 ? 'text-black' : 'text-red-600'}`}>
                ${balance.toLocaleString('es-CL')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detalle Ingresos */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-2">2. Detalle de Ingresos</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-2 border">Categoría</th>
              <th className="text-right py-2 px-2 border">Monto</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(incomeByCategory).map(([cat, amount]) => (
              <tr key={cat}>
                <td className="py-1 px-2 border">{cat}</td>
                <td className="text-right py-1 px-2 border">${amount.toLocaleString('es-CL')}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <td className="py-2 px-2 border text-right">TOTAL INGRESOS</td>
              <td className="text-right py-2 px-2 border">${totalIncome.toLocaleString('es-CL')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detalle Gastos */}
      <div className="mb-8">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-2">3. Detalle de Gastos</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-2 border">Categoría</th>
              <th className="text-right py-2 px-2 border">Monto</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(expenseByCategory).map(([cat, amount]) => (
              <tr key={cat}>
                <td className="py-1 px-2 border">{cat}</td>
                <td className="text-right py-1 px-2 border">${amount.toLocaleString('es-CL')}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <td className="py-2 px-2 border text-right">TOTAL GASTOS</td>
              <td className="text-right py-2 px-2 border">${totalExpense.toLocaleString('es-CL')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Firmas */}
      <div className="mt-20 pt-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="border-t border-black w-3/4 mx-auto mb-2"></div>
            <p className="font-semibold">Pastor</p>
          </div>
          <div>
            <div className="border-t border-black w-3/4 mx-auto mb-2"></div>
            <p className="font-semibold">Secretario</p>
          </div>
          <div>
            <div className="border-t border-black w-3/4 mx-auto mb-2"></div>
            <p className="font-semibold">Tesorero</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        Generado el {new Date().toLocaleDateString('es-CL')} a las {new Date().toLocaleTimeString('es-CL')} por el sistema IglesiaApp.
      </div>

      {/* Script de impresión simple */}
    </div>
  )
}

function PrintButton() {
  'use client'
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
    >
      <Printer className="w-4 h-4 mr-2" />
      Imprimir Reporte
    </button>
  )
}
