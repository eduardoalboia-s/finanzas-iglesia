import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true } // Traemos info del tenant si se necesita
    })
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          
          if (!user) return null

          // Verificar si el usuario está aprobado
          if (user.status !== 'APPROVED') {
            console.log(`Intento de login de usuario no aprobado: ${email}`)
            return null
          }

          // Verificar contraseña
          // NOTA: Para usuarios antiguos sin hash (creados en pruebas), podríamos necesitar un fallback
          // o forzar reseteo. Por ahora asumimos que new users usan bcrypt.
          // Si la password en BD no empieza con $2, asumimos texto plano (solo para dev transition)
          let passwordsMatch = false
          if (user.password.startsWith('$2')) {
             passwordsMatch = await bcrypt.compare(password, user.password)
          } else {
             passwordsMatch = password === user.password
          }

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              tenantId: user.tenantId
            }
          }
        }
        
        console.log('Invalid credentials')
        return null
      },
    }),
  ],
})
