import { prisma } from '../lib/prisma'

async function main() {
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    console.log('No tenant found, please run seed.ts first')
    return
  }

  const user = await prisma.user.upsert({
    where: { email: 'tesorero@iglesia.cl' },
    update: {},
    create: {
      email: 'tesorero@iglesia.cl',
      name: 'Tesorero Principal',
      password: 'hashed_password_placeholder', // En producción usar bcrypt
      role: 'TREASURER',
      tenantId: tenant.id
    }
  })

  console.log('Default user created:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
