'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function toggleUserStatus(userId: string, currentStatus: string) {
    // Verificar autorización
    const session = await auth()

    if (!session?.user) {
        return { error: 'No autorizado. Debes iniciar sesión.' }
    }

    if (session.user.role !== 'ADMIN') {
        return { error: 'No autorizado. Solo los administradores pueden modificar usuarios.' }
    }

    const newStatus = currentStatus === 'APPROVED' ? 'REJECTED' : 'APPROVED'

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus }
        })
        revalidatePath('/settings/users')
        return { success: `Usuario ${newStatus === 'APPROVED' ? 'habilitado' : 'deshabilitado'} correctamente.` }
    } catch (error) {
        console.error('Error toggling user status:', error)
        return { error: 'Error al actualizar el estado del usuario.' }
    }
}

export async function adminResetUserPassword(userId: string, formData: FormData) {
    // Verificar autorización
    const session = await auth()

    if (!session?.user) {
        return { error: 'No autorizado. Debes iniciar sesión.' }
    }

    if (session.user.role !== 'ADMIN') {
        return { error: 'No autorizado. Solo los administradores pueden cambiar contraseñas.' }
    }

    const password = formData.get('password') as string
    if (!password || password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })
        revalidatePath('/settings/users')
        return { success: 'Contraseña actualizada correctamente.' }
    } catch (error) {
        console.error('Error reseting user password:', error)
        return { error: 'Error al actualizar la contraseña.' }
    }
}
