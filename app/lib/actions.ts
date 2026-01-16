'use server'
 
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// Limitador: 5 intentos por minuto por IP
const limiter = rateLimit({
  interval: 60 * 1000, // 60 segundos
  uniqueTokenPerInterval: 500, // Max 500 usuarios únicos por intervalo
})

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
  const { isRateLimited, remaining } = limiter.check(5, ip)

  if (isRateLimited) {
    return 'Demasiados intentos. Por favor espera un minuto.'
  }

  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas.'
        default:
          return 'Algo salió mal.'
      }
    }
    throw error
  }
}
