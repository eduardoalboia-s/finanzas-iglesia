'use client'

import { useState } from 'react'
import { TitheForm } from './tithe-form'
import { ExpenseForm } from './expense-form'

type Member = {
  id: string
  firstName: string
  lastName: string
  rut: string | null
}

export function FinanceManager({ members }: { members: Member[] }) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')

  return (
    <div>
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'income'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ingresos (Diezmos)
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'expense'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Egresos (Gastos)
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeTab === 'income' ? (
          <TitheForm members={members} />
        ) : (
          <ExpenseForm />
        )}
      </div>
    </div>
  )
}
