'use server'

import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { signOut as nextAuthSignOut } from '@/auth'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations/schemas'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// Limitador: 3 registros por hora por IP (para evitar spam masivo)
const registerLimiter = rateLimit({
  interval: 60 * 60 * 1000, 
  uniqueTokenPerInterval: 100,
})

export async function signOut() {
  await nextAuthSignOut()
}

export async function registerUser(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
  const { isRateLimited } = registerLimiter.check(3, ip)

  if (isRateLimited) {
    return { success: false, error: 'Demasiados intentos de registro. Intente más tarde.' }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validation = registerSchema.safeParse(rawData)

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { name, email, password, rut } = validation.data
  const phone = formData.get('phone') as string
  const tenantId = formData.get('tenantId') as string

  if (!tenantId) {
    return { success: false, error: 'Iglesia no seleccionada' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: 'El correo electrónico ya está registrado' }
    }

    // Hashear contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rut,
        phone,
        tenantId,
        role: 'DONOR', // Rol por defecto
        status: 'PENDING' // Estado pendiente de aprobación
      }
    })

    await createAuditLog('CREATE', 'UserRegistration', newUser.id, { 
      name: newUser.name, 
      email: newUser.email, 
      tenantId: newUser.tenantId 
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Error al procesar el registro' }
  }
}
