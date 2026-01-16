'use client'

import { createMember } from '@/app/actions/create-member'
import { useRef } from 'react'

export function CreateMemberForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nuevo Miembro</h2>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          await createMember(formData)
          formRef.current?.reset()
          alert('Miembro registrado exitosamente')
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombres</label>
            <input 
              type="text" 
              name="firstName" 
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Juan Andrés"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input 
              type="text" 
              name="lastName" 
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Pérez Soto"
            />
          </div>
        </div>

        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT</label>
          <input 
            type="text" 
            name="rut" 
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="12.345.678-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
            <input 
              type="email" 
              name="email" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="juan@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
            <input 
              type="tel" 
              name="phone" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="+56 9 1234 5678"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección (Opcional)</label>
          <input 
            type="text" 
            name="address" 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Av. Principal 123"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Guardar Miembro
          </button>
        </div>
      </form>
    </div>
  )
}
