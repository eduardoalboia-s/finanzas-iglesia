'use server'

import { prisma } from '@/lib/prisma'
import { generatePasswordResetEmailHtml, sendEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
    email: z.string().email('Correo inválido'),
})

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export async function forgotPassword(formData: FormData) {
    const email = formData.get('email') as string

    const validatedFields = forgotPasswordSchema.safeParse({ email })
    if (!validatedFields.success) {
        return { error: 'Correo inválido' }
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        // Por seguridad, no decimos si el usuario existe o no, pero logueamos
        console.log(`Intento de recuperación para correo no existente: ${email}`)
        return { success: 'Si el correo está registrado, recibirás un enlace.' }
    }

    // Generar Token
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600000) // 1 hora

    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry
        }
    })

    // Enviar Correo
    const html = generatePasswordResetEmailHtml(token)
    await sendEmail({
        to: email,
        subject: 'Recuperar Contraseña - IglesiaApp',
        html
    })

    return { success: 'Si el correo está registrado, recibirás un enlace.' }
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    const validatedFields = resetPasswordSchema.safeParse({ token, password, confirmPassword })

    if (!validatedFields.success) {
        if (validatedFields.error.flatten().fieldErrors.confirmPassword) {
            return { error: 'Las contraseñas no coinciden' }
        }
        return { error: 'Datos inválidos' }
    }

    // Buscar usuario con token válido y no expirado
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date()
            }
        }
    })

    if (!user) {
        return { error: 'Enlace inválido o expirado' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    })

    return { success: 'Contraseña actualizada correctamente.' }
}
