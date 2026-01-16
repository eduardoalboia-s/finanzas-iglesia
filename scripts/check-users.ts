import { prisma } from '@/lib/prisma'

async function checkUsers() {
  const users = await prisma.user.findMany()
  console.log('Users:', users)
}

checkUsers()
