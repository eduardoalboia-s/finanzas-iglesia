const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to database...')
    try {
        const users = await prisma.user.findMany()
        console.log(`\nFound ${users.length} users in database:`)

        for (const u of users) {
            console.log(`- ID: ${u.id}`)
            console.log(`  Email: ${u.email}`)
            console.log(`  Role: ${u.role}`)
            console.log(`  Status: ${u.status}`)

            if (u.email === 'admin@iglesia.cl') {
                const match = await bcrypt.compare('adminpassword123', u.password)
                console.log(`  > Password 'adminpassword123' match: ${match}`)
            }
            console.log('---')
        }

        if (users.length === 0) {
            console.log('No users found. Creating admin...')
            const hash = await bcrypt.hash('adminpassword123', 10)
            // Ensure a tenant exists first
            let tenant = await prisma.tenant.findFirst()
            if (!tenant) {
                console.log('Creating default tenant...')
                tenant = await prisma.tenant.create({
                    data: {
                        name: 'Iglesia Demo',
                        address: 'Demo Address'
                    }
                })
            }

            await prisma.user.create({
                data: {
                    email: 'admin@iglesia.cl',
                    password: hash,
                    role: 'ADMIN',
                    status: 'APPROVED',
                    name: 'Admin User',
                    tenantId: tenant.id
                }
            })
            console.log('Admin user created.')
        }

    } catch (e) {
        console.error('Error:', e)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
