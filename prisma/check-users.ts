import { prisma } from '@/lib/prisma'

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
    console.log(`Iglesia: ${u.tenant?.name}`)
    console.log('-------------------------')
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
