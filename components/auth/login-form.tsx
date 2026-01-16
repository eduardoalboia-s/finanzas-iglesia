'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/lib/actions'

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  )

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 text-center">
          Iniciar Sesión
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="correo@iglesia.cl"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="********"
                required
                minLength={6}
              />
            </div>
            <div className="mt-2 text-right">
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            aria-disabled={isPending}
            disabled={isPending}
          >
            {isPending ? 'Iniciando...' : 'Ingresar'}
          </button>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="mt-4 text-center">
          <a href="/register" className="text-sm text-indigo-600 hover:text-indigo-500">
            ¿No tienes cuenta? Regístrate aquí
          </a>
        </div>
      </div>
    </form>
  )
}
