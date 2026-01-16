import { prisma } from '@/lib/prisma'
import { BudgetTable } from '@/components/finance/budget/budget-table'
import { MonthYearSelector } from '@/components/reports/month-year-selector'

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const resolvedSearchParams = await searchParams
  const now = new Date()
  const currentMonth = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month) : now.getMonth() + 1
  const currentYear = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : now.getFullYear()

  // 1. Obtener Presupuestos definidos
  const budgets = await prisma.budget.findMany({
    where: {
      year: currentYear,
      month: currentMonth
    }
  })

  const budgetsMap = budgets.reduce((acc, b) => {
    acc[b.category] = b.amount
    return acc
  }, {} as Record<string, number>)

  // 2. Obtener Ejecución Real (Gastos)
  const startDate = new Date(currentYear, currentMonth - 1, 1)
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      },
      type: 'EXPENSE'
    }
  })

  const expensesMap = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Control Presupuestario</h1>
        <p className="text-gray-600">Gestión de límites de gasto y seguimiento de ejecución mensual.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Período</label>
          <MonthYearSelector />
        </div>
      </div>

      <BudgetTable 
        month={currentMonth}
        year={currentYear}
        budgets={budgetsMap}
        expenses={expensesMap}
      />
    </div>
  )
}
