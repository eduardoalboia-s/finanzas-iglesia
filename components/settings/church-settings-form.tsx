'use client'

import { updateChurchSettings } from '@/app/actions/settings/church-settings'
import { useRef } from 'react'

type Church = {
  name: string
  address: string | null
  phone: string | null
  email: string | null
  rut: string | null
  pastorName: string | null
  treasurerName: string | null
  ministries: string | null
  logoUrl: string | null
}

export function ChurchSettingsForm({ church }: { church: Church }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        try {
          await updateChurchSettings(formData)
          alert('Configuración actualizada exitosamente')
        } catch (error) {
          alert('Error al actualizar: ' + error)
        }
      }}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Información General</h2>
        
        {/* Logo Upload */}
        <div className="mt-4 flex items-center space-x-6">
          <div className="shrink-0">
            {church.logoUrl ? (
              <img
                className="h-24 w-24 object-cover rounded-full border border-gray-200"
                src={church.logoUrl}
                alt="Logo actual"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                Sin Logo
              </div>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Elegir logo</span>
            <input 
              type="file" 
              name="logo"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            <span className="text-xs text-gray-500 mt-1 block">Recomendado: PNG o JPG cuadrado (500x500px)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Iglesia</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={church.name}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RUT (Persona Jurídica)</label>
            <input 
              type="text" 
              name="rut" 
              defaultValue={church.rut || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección Física</label>
            <input 
              type="text" 
              name="address" 
              defaultValue={church.address || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input 
              type="text" 
              name="phone" 
              defaultValue={church.phone || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={church.email || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Autoridades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pastor Principal</label>
            <input 
              type="text" 
              name="pastorName" 
              defaultValue={church.pastorName || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tesorero General</label>
            <input 
              type="text" 
              name="treasurerName" 
              defaultValue={church.treasurerName || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Estructura</h2>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Ministerios / Departamentos (Separados por coma)
          </label>
          <p className="text-xs text-gray-500 mb-2">Ej: Jóvenes, Damas, Escuela Dominical, Alabanza</p>
          <textarea 
            name="ministries" 
            rows={3}
            defaultValue={church.ministries ? JSON.parse(church.ministries).join(', ') : ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}
