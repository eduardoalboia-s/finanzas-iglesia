'use client'

import { forgotPassword } from '@/app/actions/auth-reset'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
    )
}

export default function ForgotPasswordPage() {
    const [msg, setMsg] = useState('')

    async function clientAction(formData: FormData) {
        const res = await forgotPassword(formData)
        if (res?.error) {
            alert(res.error)
        } else if (res?.success) {
            setMsg(res.success)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Recupera tu contraseña</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {msg ? (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Correo enviado</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{msg}</p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="-mx-2 -my-1.5 flex">
                                            <Link href="/login" className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                Volver al inicio de sesión
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form action={clientAction} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="tucorreo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <SubmitButton />
                            </div>

                            <div className="flex items-center justify-center">
                                <Link href="/login" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Volver
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
