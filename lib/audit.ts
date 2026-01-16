import { prisma } from '@/lib/prisma'

export async function createAuditLog(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: string,
  entityId: string,
  details: object,
  userId?: string
) {
  // Si no se provee userId, buscamos el usuario por defecto (Tesorero)
  let finalUserId = userId
  if (!finalUserId) {
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'tesorero@iglesia.cl' }
    })
    
    if (defaultUser) {
      finalUserId = defaultUser.id
    } else {
      // Si no existe, lo creamos on-the-fly (solo para dev/MVP)
      const tenant = await prisma.tenant.findFirst()
      if (tenant) {
        const newUser = await prisma.user.create({
          data: {
            email: 'tesorero@iglesia.cl',
            name: 'Tesorero Principal',
            password: 'placeholder',
            role: 'TREASURER',
            tenantId: tenant.id
          }
        })
        finalUserId = newUser.id
      }
    }
  }

  if (!finalUserId) {
    console.warn('AuditLog omitted: No user found to attribute action.')
    return
  }

  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      details: JSON.stringify(details),
      userId: finalUserId
    }
  })
}
