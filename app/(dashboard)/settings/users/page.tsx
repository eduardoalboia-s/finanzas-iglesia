import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { toggleUserStatus, adminResetUserPassword } from '@/app/actions/admin-users'
import { CheckCircle, XCircle, Lock, Shield, ShieldAlert, User as UserIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

// Basic Server Component for the table
export default async function UsersPage() {
  // Verificar que el usuario sea ADMIN
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Usuarios</h1>
        <p className="text-gray-500">Gestiona el acceso y credenciales de los usuarios del sistema.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600 truncate">{user.name || 'Sin Nombre'}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="truncate">{user.email}</span>
                        <span className="mx-2">•</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    {/* Status Toggle */}
                    <div className="flex flex-col items-end">
                      <form action={toggleUserStatus.bind(null, user.id, user.status)}>
                        <button
                          type="submit"
                          className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                        >
                          {user.status === 'APPROVED' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" /> Activo
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" /> Bloqueado
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Password Reset (Simple Form) */}
                    <ResetPasswordForm userId={user.id} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Client Component for the Reset Password Form to handle state/interactivity if needed
// For simplicity in this iteration, we make a small embedded client component or just a server form.
// Let's use a server form with client wrapper in a separate file usually, but for speed here:

import { Button } from '@/components/ui/button' // Assuming this exists or using standard HTML
// We'll trust standard HTML/Tailwind for speed if UI lib is uncertain
function ResetPasswordForm({ userId }: { userId: string }) {
  // This cannot be 'use client' inside a server file easily without splitting. 
  // We will create a robust client component in a separate file in a future Refactor if needed.
  // For now, we'll put a simple details/summary block or similar.

  return (
    <details className="relative">
      <summary className="list-none cursor-pointer flex items-center text-gray-400 hover:text-gray-600">
        <Lock className="w-4 h-4" />
      </summary>
      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Cambiar Contraseña</h4>
        <form action={adminResetUserPassword.bind(null, userId)}>
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            className="w-full text-sm border-gray-300 rounded-md mb-2 p-1 border"
            required
            minLength={6}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-xs py-1.5 rounded hover:bg-indigo-700"
          >
            Actualizar
          </button>
        </form>
      </div>
    </details>
  )
}
