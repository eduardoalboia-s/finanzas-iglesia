'use client'

import { deleteUser, approveUser, updateUserRole } from '@/app/actions/settings/users'
import { Trash2, User, CheckCircle, Pencil } from 'lucide-react'
import { useState } from 'react'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  status: string
  tenant: {
    name: string
  } | null
  createdAt: Date
}

export function UserList({ users }: { users: User[] }) {
  const [editingUser, setEditingUser] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    
    const result = await deleteUser(id)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleApprove = async (id: string) => {
    const result = await approveUser(id)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleRoleChange = async (id: string, newRole: string) => {
    const result = await updateUserRole(id, newRole)
    if (result.success) {
      setEditingUser(null)
    } else {
      alert(result.error)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'PASTOR': return 'bg-blue-100 text-blue-800'
      case 'TREASURER': return 'bg-green-100 text-green-800'
      case 'AUDITOR': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Super Admin'
      case 'PASTOR': return 'Pastor'
      case 'TREASURER': return 'Tesorero'
      case 'AUDITOR': return 'Auditor'
      case 'DONOR': return 'Donador'
      default: return role
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </span>
                </div>
                <div className="ml-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-indigo-600 truncate">{user.name || 'Sin nombre'}</div>
                    {user.status === 'PENDING' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 mr-2">{user.email}</span>
                    
                    {editingUser === user.id ? (
                      <select 
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        onBlur={() => setEditingUser(null)}
                        className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                      >
                        <option value="TREASURER">Tesorero</option>
                        <option value="PASTOR">Pastor</option>
                        <option value="AUDITOR">Auditor</option>
                        <option value="ADMIN">Super Admin</option>
                        <option value="DONOR">Donador</option>
                      </select>
                    ) : (
                      <button 
                        onClick={() => setEditingUser(user.id)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)} hover:opacity-80 transition-opacity items-center space-x-1`}
                        title="Click para cambiar rol"
                      >
                        <span>{getRoleLabel(user.role)}</span>
                        <Pencil className="w-3 h-3 ml-1 opacity-50" />
                      </button>
                    )}

                    {user.tenant && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({user.tenant.name})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.status === 'PENDING' && (
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="text-green-600 hover:text-green-900 p-1"
                    title="Aprobar usuario"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Eliminar usuario"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <li className="px-4 py-4 text-center text-gray-500">No hay usuarios registrados.</li>
        )}
      </ul>
    </div>
  )
}
