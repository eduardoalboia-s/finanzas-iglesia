import { FinanceManager } from '@/components/finance/finance-manager'
import { prisma } from '@/lib/prisma'
import { TransactionTable } from '@/components/finance/transaction-table'
import { CorporationRemittanceWidget } from '@/components/finance/remittance/remittance-widget'
import Link from 'next/link'
import { FileSpreadsheet, BarChart3 } from 'lucide-react'

export default async function FinancePage() {
  // 1. Cargar miembros para el selector
  const members = await prisma.member.findMany({
    orderBy: { lastName: 'asc' },
    select: { id: true, firstName: true, lastName: true, rut: true }
  })

  // 2. Cargar últimos movimientos
  const transactions = await prisma.transaction.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      member: {
        select: { firstName: true, lastName: true }
      }
    }
  })

  // 3. Calcular Totales (Balance)
  const incomeAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: 'INCOME' }
  })
  const expenseAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: 'EXPENSE' }
  })

  const totalIncome = incomeAgg._sum.amount || 0
  const totalExpense = expenseAgg._sum.amount || 0
  const balance = totalIncome - totalExpense

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tesorería</h1>
          <div className="flex items-center space-x-3 text-gray-600">
            <p>Registro de Diezmos, Ofrendas y Gastos.</p>
            <span className="text-gray-300">|</span>
            <Link href="/finance/reconciliation" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              Conciliación Bancaria
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/finance/analytics" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              <BarChart3 className="w-4 h-4 mr-1" />
              Ver Análisis
            </Link>
          </div>
        </div>

        {/* Widget de Remesa a Corporación */}
        <div className="w-full md:w-auto">
          <CorporationRemittanceWidget />
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Ingresos Totales</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">${totalIncome.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Gastos Totales</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">${totalExpense.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Saldo Actual</h3>
          <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            ${balance.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Gestor de Formularios (Ingreso/Gasto) */}
        <div className="lg:col-span-1">
          <FinanceManager members={members} />
        </div>

        {/* Columna Derecha: Historial */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimos Movimientos</h2>
            <TransactionTable transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
