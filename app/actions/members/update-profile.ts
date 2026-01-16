'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function updateMemberProfile(memberId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'No autorizado' }

  try {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const rut = formData.get('rut') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const profession = formData.get('profession') as string
    const maritalStatus = formData.get('maritalStatus') as string
    const birthDate = formData.get('birthDate') as string
    const conversionDate = formData.get('conversionDate') as string
    const baptismDate = formData.get('baptismDate') as string
    const notes = formData.get('notes') as string
    const status = formData.get('status') as string

    await prisma.member.update({
      where: { id: memberId },
      data: {
        firstName,
        lastName,
        rut,
        email,
        phone,
        address,
        profession,
        maritalStatus,
        birthDate: birthDate ? new Date(birthDate) : null,
        conversionDate: conversionDate ? new Date(conversionDate) : null,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
        notes,
        status
      }
    })

    await createAuditLog('UPDATE', 'MemberProfile', memberId, { firstName, lastName })

    revalidatePath(`/members/${memberId}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al actualizar el perfil' }
  }
}
