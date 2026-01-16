'use client'

import { useState } from 'react'
import { saveBudget } from '@/app/actions/finance/budgets'
import { useRouter } from 'next/navigation'

interface BudgetTableProps {
  month: number
  year: number
  budgets: Record<string, number>
  expenses: Record<string, number>
}

const CATEGORIES = [
  { id: 'REMESA_DIEZMO', label: '10% Diezmo a Corporación' },
  { id: 'REMESA_OFRENDA', label: '10% Ofrenda a Corporación' },
  { id: 'CUOTA_ZONAL', label: 'Cuota Zonal' },
  { id: 'SUELDO_PASTOR', label: 'Aporte Pastoral' },
  { id: 'SERVICIOS_BASICOS', label: 'Servicios Básicos' },
  { id: 'MANTENCION', label: 'Mantención' },
  { id: 'GASTOS_CONSTRUCCION', label: 'Construcción / Reparaciones' },
  { id: 'AYUDA_SOCIAL', label: 'Ayuda Social' },
  { id: 'MINISTERIOS', label: 'Ministerios' },
  { id: 'HONORARIOS', label: 'Honorarios' },
  { id: 'OTROS', label: 'Otros' }
]

export function BudgetTable({ month, year, budgets, expenses }: BudgetTableProps) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [tempAmount, setTempAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleEdit = (category: string, currentAmount: number) => {
    setEditing(category)
    setTempAmount(currentAmount.toString())
  }

  const handleSave = async (category: string) => {
    setLoading(true)
    const amount = parseInt(tempAmount) || 0
    await saveBudget(category, amount, month, year)
    setEditing(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ejecutado (Real)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">% Uso</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {CATEGORIES.map((cat) => {
            const budget = budgets[cat.id] || 0
            const executed = expenses[cat.id] || 0
            const difference = budget - executed
            const percentage = budget > 0 ? (executed / budget) * 100 : 0
            
            return (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cat.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {editing === cat.id ? (
                    <input
                      type="number"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                      className="w-24 text-right border border-gray-300 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                    />
                  ) : (
                    `$${budget.toLocaleString('es-CL')}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  ${executed.toLocaleString('es-CL')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${difference.toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`} 
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs mt-1">{percentage.toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editing === cat.id ? (
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleSave(cat.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-900"
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={() => setEditing(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEdit(cat.id, budget)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
