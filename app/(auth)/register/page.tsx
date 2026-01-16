import { prisma } from '@/lib/prisma'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
  const churches = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registro de Nuevo Usuario
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Corporación Vitacura - Zona Metropolitana
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm churches={churches} />
        </div>
      </div>
    </div>
  )
}
