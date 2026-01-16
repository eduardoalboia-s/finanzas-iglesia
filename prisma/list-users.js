const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: {
        select: { name: true }
      }
    }
  })

  console.log('--- USUARIOS REGISTRADOS ---')
  users.forEach(u => {
    console.log(`Email: ${u.email}`)
    console.log(`Nombre: ${u.name}`)
    console.log(`Rol: ${u.role}`)
    console.log(`Estado: ${u.status}`)
    console.log(`Iglesia: ${u.tenant ? u.tenant.name : 'Sin iglesia'}`)
    console.log('-------------------------')
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
