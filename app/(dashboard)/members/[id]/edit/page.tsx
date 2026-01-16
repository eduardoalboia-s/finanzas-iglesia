import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { updateMemberProfile } from '@/app/actions/members/update-profile'

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const member = await prisma.member.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!member) notFound()

  // Helper para formato fecha input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    await updateMemberProfile(member!.id, formData)
    redirect(`/members/${member!.id}`)
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/members/${member.id}`} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar y Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <form action={handleSubmit} className="p-8 space-y-8">
          
          {/* Sección 1: Identidad */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombres</label>
                <input type="text" name="firstName" defaultValue={member.firstName} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <input type="text" name="lastName" defaultValue={member.lastName} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">RUT</label>
                <input type="text" name="rut" defaultValue={member.rut || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <input type="date" name="birthDate" defaultValue={formatDateForInput(member.birthDate)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                <select name="maritalStatus" defaultValue={member.maritalStatus || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Seleccione...</option>
                  <option value="Soltero/a">Soltero/a</option>
                  <option value="Casado/a">Casado/a</option>
                  <option value="Viudo/a">Viudo/a</option>
                  <option value="Divorciado/a">Divorciado/a</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profesión / Oficio</label>
                <input type="text" name="profession" defaultValue={member.profession || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Sección 2: Contacto */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Contacto</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input type="text" name="address" defaultValue={member.address || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input type="tel" name="phone" defaultValue={member.phone || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" defaultValue={member.email || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Sección 3: Eclesiástico */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Vida Eclesiástica</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Conversión</label>
                <input type="date" name="conversionDate" defaultValue={formatDateForInput(member.conversionDate)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Bautismo</label>
                <input type="date" name="baptismDate" defaultValue={formatDateForInput(member.baptismDate)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado Membresía</label>
                <select name="status" defaultValue={member.status} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="ACTIVE">Activo</option>
                  <option value="PASSIVE">Pasivo</option>
                  <option value="DISCIPLINE">Disciplina</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 4: Notas */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Notas Pastorales (Privado)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anotaciones</label>
              <div className="mt-1">
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={member.notes || ''}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Detalles sobre visitas, peticiones de oración, situación familiar..."
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <Link
                href={`/members/${member.id}`}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
