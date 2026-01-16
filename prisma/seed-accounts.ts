import { prisma } from '../lib/prisma'

async function main() {
  console.log('💰 Iniciando configuración de cuentas financieras...')

  // 1. Buscar la iglesia (Tenant)
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    console.error('❌ No se encontró ninguna iglesia. Ejecuta el seed principal primero.')
    return
  }

  // 2. Crear Cuenta "Caja Principal" si no existe
  const existingAccount = await prisma.account.findFirst({
    where: {
      tenantId: tenant.id,
      name: 'Caja Principal'
    }
  })

  if (!existingAccount) {
    await prisma.account.create({
      data: {
        name: 'Caja Principal',
        type: 'CASH',
        currency: 'CLP',
        tenantId: tenant.id
      }
    })
    console.log('✅ Cuenta "Caja Principal" creada exitosamente.')
  } else {
    console.log('ℹ️ La cuenta "Caja Principal" ya existe.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
