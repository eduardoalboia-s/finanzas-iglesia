'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import { auth } from '@/auth'

export async function createAsset(formData: FormData) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const serialNumber = formData.get('serialNumber') as string
    const cost = formData.get('cost') ? parseInt(formData.get('cost') as string) : null
    const currentValue = formData.get('currentValue') ? parseInt(formData.get('currentValue') as string) : null
    const acquisitionDate = formData.get('acquisitionDate') as string
    const responsibleId = formData.get('responsibleId') as string
    const status = formData.get('status') as string

    if (!name || !category) return { success: false, error: 'Nombre y Categoría son obligatorios' }

    const asset = await prisma.asset.create({
      data: {
        name,
        description,
        category,
        location,
        serialNumber,
        cost,
        currentValue,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        responsibleId: responsibleId || null,
        status: status || 'ACTIVE',
        tenantId: session.user.tenantId
      }
    })

    await createAuditLog('CREATE', 'Asset', asset.id, { name, category })

    revalidatePath('/inventory')
    return { success: true, asset }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al registrar activo' }
  }
}

export async function updateAsset(assetId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const serialNumber = formData.get('serialNumber') as string
    const cost = formData.get('cost') ? parseInt(formData.get('cost') as string) : null
    const currentValue = formData.get('currentValue') ? parseInt(formData.get('currentValue') as string) : null
    const acquisitionDate = formData.get('acquisitionDate') as string
    const responsibleId = formData.get('responsibleId') as string
    const status = formData.get('status') as string

    await prisma.asset.update({
      where: { id: assetId },
      data: {
        name,
        description,
        category,
        location,
        serialNumber,
        cost,
        currentValue,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        responsibleId: responsibleId || null,
        status
      }
    })

    await createAuditLog('UPDATE', 'Asset', assetId, { name })

    revalidatePath(`/inventory/${assetId}`)
    revalidatePath('/inventory')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar activo' }
  }
}

export async function deleteAsset(assetId: string) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    await prisma.asset.delete({ where: { id: assetId } })
    await createAuditLog('DELETE', 'Asset', assetId, {})

    revalidatePath('/inventory')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar activo' }
  }
}
