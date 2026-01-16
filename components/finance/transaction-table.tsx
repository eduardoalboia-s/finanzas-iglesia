'use client'

import { deleteTransaction } from '@/app/actions/finance'
import { Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { EditTransactionModal } from './edit-transaction-modal'

type Transaction = {
  id: string
  amount: number
  type: string
  category: string
  description: string | null
  date: Date
  attachmentUrl: string | null
  member: {
    firstName: string
    lastName: string
  } | null
}

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

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.')) return

    setIsDeleting(id)
    try {
      const result = await deleteTransaction(id)
      if (!result.success) {
        alert('Error al eliminar: ' + result.error)
      }
    } catch (error) {
      alert('Error al eliminar')
    } finally {
      setIsDeleting(null)
    }
  }

  if (transactions.length === 0) {
    return <p className="text-gray-500 italic">No hay movimientos registrados.</p>
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Adjunto</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((t) => (
              <tr key={t.id} className={isDeleting === t.id ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString('es-CL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    t.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {t.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCategoryLabel(t.category)} 
                  {t.member && <span className="text-gray-500"> - {t.member.firstName} {t.member.lastName}</span>}
                  {t.description && <div className="text-xs text-gray-500">{t.description}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {t.attachmentUrl ? (
                    <a 
                      href={t.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  ${t.amount.toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingTransaction(t)}
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      title="Editar registro"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isDeleting === t.id}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTransaction && (
        <EditTransactionModal 
          transaction={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
        />
      )}
    </>
  )
}
