import { ArrowUp, ArrowDown, Wallet } from 'lucide-react'

interface StatsCardsProps {
  totalBalance: number
  monthlyIncome: number
  monthlyExpense: number
}

export function StatsCards({ totalBalance, monthlyIncome, monthlyExpense }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Saldo Total */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Saldo Actual</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalBalance.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
           <span className="text-sm text-gray-500">Balance general de cuentas</span>
        </div>
      </div>

      {/* Ingresos Mes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ingresos (Este Mes)</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+${monthlyIncome.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <ArrowUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
           <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
             + Diezmos y Ofrendas
           </span>
        </div>
      </div>

      {/* Gastos Mes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Gastos (Este Mes)</p>
            <p className="text-2xl font-bold text-red-600 mt-1">-${monthlyExpense.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <ArrowDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="mt-4">
           <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
             - Operativos y Remesas
           </span>
        </div>
      </div>
    </div>
  )
}
