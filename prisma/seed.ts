import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Crear Iglesia Demo
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Iglesia Evangélica Demo',
      address: 'Calle Ficticia 123, Santiago',
      rut: '65.432.100-K',
    },
  })
  console.log(`✅ Iglesia creada: ${tenant.name} (${tenant.id})`)

  // 2. Crear Tesorero
  const user = await prisma.user.create({
    data: {
      email: 'tesorero@iglesia.cl',
      password: 'hashed_password_123', // En prod usar bcrypt
      name: 'Juan Pérez',
      role: 'TREASURER',
      tenantId: tenant.id,
    },
  })
  console.log(`✅ Usuario creado: ${user.email}`)

  console.log('🚀 Seed completado exitosamente')
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
