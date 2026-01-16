'use client'

import { resetPassword } from '@/app/actions/auth-reset'
import { useState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Actualizando...' : 'Cambiar Contraseña'}
        </button>
    )
}

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')

    async function clientAction(formData: FormData) {
        if (!token) return
        formData.append('token', token)

        const res = await resetPassword(formData)
        if (res?.error) {
            setError(res.error)
        } else if (res?.success) {
            setMsg(res.success)
        }
    }

    if (!token) {
        return (
            <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-red-600">Enlace inválido. Falta el token.</p>
                <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">Ir al Login</Link>
            </div>
        )
    }

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {msg ? (
                <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Contraseña Actualizada</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>{msg}</p>
                            </div>
                            <div className="mt-4">
                                <Link href="/login" className="text-sm font-medium text-green-800 hover:underline">
                                    Iniciar Sesión ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form action={clientAction} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" university-block text-sm font-medium text-gray-700>
                            Nueva Contraseña
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="******"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" university-block text-sm font-medium text-gray-700>
                            Confirmar Contraseña
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                university-required
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    <div>
                        <SubmitButton />
                    </div>

                    <div className="flex items-center justify-center">
                        <Link href="/login" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Cancelar
                        </Link>
                    </div>
                </form>
            )}
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Nueva Contraseña</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense fallback={<div className="text-center py-4">Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
