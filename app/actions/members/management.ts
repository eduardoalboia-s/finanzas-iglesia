'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import { auth } from '@/auth'

export async function deleteMember(memberId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'No autorizado' }

  try {
    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) return { success: false, error: 'Miembro no encontrado' }

    // Verificar si tiene transacciones asociadas (para no romper integridad)
    const transactionCount = await prisma.transaction.count({
      where: { memberId }
    })

    if (transactionCount > 0) {
      return { 
        success: false, 
        error: 'No se puede eliminar porque tiene movimientos financieros asociados. Intenta cambiar su estado a PASIVO.' 
      }
    }

    await prisma.member.delete({ where: { id: memberId } })
    await createAuditLog('DELETE', 'Member', memberId, member)

    revalidatePath('/members')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar miembro' }
  }
}

export async function updateMemberStatus(memberId: string, status: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'No autorizado' }

  try {
    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) return { success: false, error: 'Miembro no encontrado' }

    await prisma.member.update({
      where: { id: memberId },
      data: { status }
    })

    await createAuditLog('UPDATE', 'MemberStatus', memberId, { old: member.status, new: status })

    revalidatePath('/members')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar estado' }
  }
}
