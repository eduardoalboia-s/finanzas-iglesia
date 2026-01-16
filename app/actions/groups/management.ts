'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import { auth } from '@/auth'

export async function createGroup(formData: FormData) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) return { success: false, error: 'El nombre es obligatorio' }

    const group = await prisma.memberGroup.create({
      data: {
        name,
        description,
        tenantId: session.user.tenantId
      }
    })

    await createAuditLog('CREATE', 'MemberGroup', group.id, { name, description })

    revalidatePath('/groups')
    return { success: true, group }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al crear el grupo' }
  }
}

export async function updateGroup(groupId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    await prisma.memberGroup.update({
      where: { id: groupId },
      data: { name, description }
    })

    await createAuditLog('UPDATE', 'MemberGroup', groupId, { name, description })

    revalidatePath(`/groups/${groupId}`)
    revalidatePath('/groups')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar el grupo' }
  }
}

export async function deleteGroup(groupId: string) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    // Verificar si tiene miembros
    const group = await prisma.memberGroup.findUnique({
      where: { id: groupId },
      include: { _count: { select: { members: true } } }
    })

    if (group && group._count.members > 0) {
      // Opcional: Podríamos permitir borrar y desvincular, pero por seguridad avisamos
      // O simplemente desvincularlos automáticamente. Prisma lo hace si es N:M implícito.
      // Pero mejor avisar.
    }

    await prisma.memberGroup.delete({ where: { id: groupId } })
    await createAuditLog('DELETE', 'MemberGroup', groupId, { name: group?.name })

    revalidatePath('/groups')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar el grupo' }
  }
}

export async function addMemberToGroup(groupId: string, memberId: string) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    await prisma.memberGroup.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: memberId }
        }
      }
    })

    revalidatePath(`/groups/${groupId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al agregar miembro' }
  }
}

export async function removeMemberFromGroup(groupId: string, memberId: string) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    await prisma.memberGroup.update({
      where: { id: groupId },
      data: {
        members: {
          disconnect: { id: memberId }
        }
      }
    })

    revalidatePath(`/groups/${groupId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al remover miembro' }
  }
}
