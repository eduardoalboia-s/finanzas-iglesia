'use client'

import { useState } from 'react'
import { deleteMember, updateMemberStatus } from '@/app/actions/members/management'
import { Trash2, Edit2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

type Member = {
  id: string
  firstName: string
  lastName: string
  rut: string | null
  email: string | null
  status: string
}

export function MemberList({ members }: { members: Member[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este miembro? Esta acción no se puede deshacer.')) return
    
    setLoadingId(id)
    const result = await deleteMember(id)
    setLoadingId(null)

    if (!result.success) {
      alert(result.error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id)
    const result = await updateMemberStatus(id, newStatus)
    setLoadingId(null)

    if (!result.success) {
      alert(result.error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PASSIVE': return 'bg-gray-100 text-gray-800'
      case 'DISCIPLINE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo'
      case 'PASSIVE': return 'Pasivo'
      case 'DISCIPLINE': return 'Disciplina'
      default: return status
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Miembros ({members.length})</h2>
      </div>
      
      {members.length === 0 ? (
        <div className="p-6 text-center text-gray-500 italic">No hay miembros registrados aún.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className={loadingId === member.id ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                    <div className="text-sm text-gray-500">{member.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.rut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={member.status}
                      onChange={(e) => handleStatusChange(member.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getStatusBadge(member.status)}`}
                      disabled={loadingId === member.id}
                    >
                      <option value="ACTIVE">Activo</option>
                      <option value="PASSIVE">Pasivo</option>
                      <option value="DISCIPLINE">Disciplina</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <a href={`/members/${member.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                      <Edit2 className="w-4 h-4 mr-1" /> Ver
                    </a>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={loadingId === member.id}
                      className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
