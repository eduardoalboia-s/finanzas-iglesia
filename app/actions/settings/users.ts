'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import bcrypt from 'bcryptjs'

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!name || !email || !password || !role) {
    return { success: false, error: 'Todos los campos son obligatorios' }
  }

  // Obtener el tenant actual (en un sistema real esto vendría de la sesión)
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) return { success: false, error: 'No se encontró la configuración de la iglesia' }

  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: 'El correo electrónico ya está registrado' }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        tenantId: tenant.id,
        status: 'APPROVED' // Usuarios creados por admin nacen aprobados
      }
    })

    await createAuditLog('CREATE', 'User', newUser.id, { name: newUser.name, email: newUser.email, role: newUser.role })

    revalidatePath('/settings/users')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al crear el usuario' }
  }
}

export async function approveUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: 'Usuario no encontrado' }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'APPROVED' }
    })

    await createAuditLog('UPDATE', 'UserStatus', userId, { old: 'PENDING', new: 'APPROVED' })

    revalidatePath('/settings/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al aprobar usuario' }
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: 'Usuario no encontrado' }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    await createAuditLog('UPDATE', 'UserRole', userId, { old: user.role, new: newRole })

    revalidatePath('/settings/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar rol' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: 'Usuario no encontrado' }

    // Evitar borrar al último usuario o a uno mismo (si tuviéramos sesión)
    const userCount = await prisma.user.count()
    if (userCount <= 1) {
      return { success: false, error: 'No se puede eliminar el último usuario del sistema' }
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    await createAuditLog('DELETE', 'User', userId, user)

    revalidatePath('/settings/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar usuario' }
  }
}
