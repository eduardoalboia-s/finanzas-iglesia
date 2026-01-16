const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@iglesia.cl'
  const password = 'adminpassword123'
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Buscar si existe o crear
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED'
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      // Asignamos al primer tenant que encontremos para que no de error, 
      // aunque el super admin podría no tener tenant en un sistema multi-tenant real más complejo
      tenantId: (await prisma.tenant.findFirst()).id 
    }
  })

  console.log(`Usuario Admin creado/actualizado: ${user.email} / ${password}`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
