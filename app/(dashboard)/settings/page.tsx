import { ChurchSettingsForm } from '@/components/settings/church-settings-form'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ShieldAlert, Users } from 'lucide-react'

export default async function SettingsPage() {
  const church = await prisma.tenant.findFirst()

  if (!church) {
    return <div>Error: No se encontró la configuración de la iglesia.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuración de la Iglesia</h1>
        <p className="text-gray-600">
          Administra la información general, autoridades y estructura de la congregación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            Usuarios y Roles
          </h2>
          <p className="text-sm text-gray-600 mb-4 h-10">
            Gestiona quién tiene acceso al sistema y sus niveles de permiso (Pastor, Tesorero, Auditor).
          </p>
          <Link 
            href="/settings/users" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Gestionar Usuarios
          </Link>
        </div>

        {/* Tarjeta de Seguridad y Auditoría */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-indigo-600" />
            Seguridad y Auditoría
          </h2>
          <p className="text-sm text-gray-600 mb-4 h-10">
            Revisa el historial de cambios y operaciones críticas realizadas en el sistema.
          </p>
          <Link 
            href="/settings/audit" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ver Historial de Auditoría
          </Link>
        </div>
      </div>

      <ChurchSettingsForm church={church} />
    </div>
  )
}
