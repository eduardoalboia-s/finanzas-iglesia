const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) {
        console.log('No tenant found')
        return
    }

    // Create some events
    await prisma.event.createMany({
        data: [
            {
                title: 'Culto Dominical',
                description: 'Servicio general de adoración y predicación.',
                startTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
                endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
                location: 'Templo Principal',
                tenantId: tenant.id
            },
            {
                title: 'Reunión de Jóvenes',
                description: 'Actividad recreativa y estudio bíblico.',
                startTime: new Date(new Date().setDate(new Date().getDate() + 3)), // In 3 days
                endTime: new Date(new Date().setDate(new Date().getDate() + 3)),
                location: 'Salón Multiuso',
                tenantId: tenant.id
            }
        ]
    })

    console.log('Events seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
