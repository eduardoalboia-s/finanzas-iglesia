'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Member = {
  id: string
  firstName: string
  lastName: string
  rut: string | null
  email: string | null
  phone: string | null
  address: string | null
  status: string
}

export function MemberProfile({ member }: { member: Member }) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleUpdate = async (formData: FormData) => {
    try {
      const { updateMember } = await import('@/app/actions/create-member')
      const result = await updateMember(member.id, formData)
      if (result.success) {
        setIsEditing(false)
        alert('Miembro actualizado exitosamente')
      }
    } catch (error) {
      alert('Error al actualizar: ' + error)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Editar Información</h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
        
        <form action={handleUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input 
                type="text" 
                name="firstName" 
                defaultValue={member.firstName}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input 
                type="text" 
                name="lastName" 
                defaultValue={member.lastName}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">RUT</label>
              <input 
                type="text" 
                name="rut" 
                defaultValue={member.rut || ''}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                name="status" 
                defaultValue={member.status}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={member.email || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input 
                type="text" 
                name="phone" 
                defaultValue={member.phone || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input 
                type="text" 
                name="address" 
                defaultValue={member.address || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
            <p className="mt-1 text-lg text-gray-900">{member.firstName} {member.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">RUT / Identificación</label>
            <p className="mt-1 text-lg text-gray-900">{member.rut || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Estado</label>
            <span className={`mt-1 inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
              member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {member.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{member.email || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Teléfono</label>
            <p className="mt-1 text-lg text-gray-900">{member.phone || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Dirección</label>
            <p className="mt-1 text-lg text-gray-900">{member.address || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
