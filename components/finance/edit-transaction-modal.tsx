'use client'

import { updateTransaction } from '@/app/actions/finance'
import { useState } from 'react'
import { X } from 'lucide-react'

type Transaction = {
  id: string
  amount: number
  category: string
  description: string | null
  date: Date
}

interface EditModalProps {
  transaction: Transaction
  onClose: () => void
}

const CATEGORIES = [
  { value: 'DIEZMO', label: 'Diezmo' },
  { value: 'OFRENDA_CULTO', label: 'Ofrenda Culto' },
  { value: 'OFRENDA_ESPECIAL', label: 'Ofrenda Especial' },
  { value: 'OFRENDA_CONSTRUCCION', label: 'Ofrenda Construcción' },
  { value: 'DONACION', label: 'Donación' },
  { value: 'ACTIVIDAD', label: 'Actividad' },
  { value: 'REMESA_DIEZMO', label: '10% Diezmo a Corporación' },
  { value: 'REMESA_OFRENDA', label: '10% Ofrenda a Corporación' },
  { value: 'CUOTA_ZONAL', label: 'Cuota Zonal' },
  { value: 'SUELDO_PASTOR', label: 'Aporte Pastoral' },
  { value: 'SERVICIOS_BASICOS', label: 'Servicios Básicos' },
  { value: 'MANTENCION', label: 'Mantención' },
  { value: 'GASTOS_CONSTRUCCION', label: 'Gastos Construcción' },
  { value: 'AYUDA_SOCIAL', label: 'Ayuda Social' },
  { value: 'MINISTERIOS', label: 'Ministerios' },
  { value: 'HONORARIOS', label: 'Honorarios' },
  { value: 'OTROS', label: 'Otros' }
]

export function EditTransactionModal({ transaction, onClose }: EditModalProps) {
  const [amount, setAmount] = useState(transaction.amount)
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description || '')
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await updateTransaction(transaction.id, {
        amount,
        category,
        description,
        date
      })
      
      if (result.success) {
        onClose()
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      alert('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Editar Transacción</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
