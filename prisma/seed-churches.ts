import { prisma } from '../lib/prisma'

const CHURCHES = [
  { name: 'Iglesia Metodista Pentecostal de Chile - Vitacura', address: 'Av. Vitacura 1234, Vitacura' },
  { name: 'Iglesia Evangélica Corporación Vitacura en Renca', address: 'José Miguel Infante 4581, Renca' },
  { name: 'Iglesia Presbiteriana de Chile - La Trinidad', address: 'Av. Las Condes 5678, Las Condes' },
  { name: 'Iglesia Bautista El Salvador', address: 'Av. Providencia 9012, Providencia' },
  { name: 'Iglesia Alianza Cristiana y Misionera - Santiago', address: 'Av. Vicuña Mackenna 3456, Santiago' },
  { name: 'Iglesia Pentecostal de Chile - Maipú', address: 'Av. Pajaritos 7890, Maipú' },
  { name: 'Iglesia Metodista de Chile - Primera Iglesia', address: 'Agustinas 123, Santiago' },
  { name: 'Iglesia Anglicana de Chile - El Redentor', address: 'Av. Holanda 456, Providencia' },
  { name: 'Iglesia Luterana en Chile - El Buen Pastor', address: 'Av. Lota 2345, Providencia' },
  { name: 'Iglesia Adventista del Séptimo Día - Central', address: 'Av. Portugal 678, Santiago' }
]

async function main() {
  console.log('Seeding churches...')

  for (const churchData of CHURCHES) {
    await prisma.tenant.create({
      data: {
        name: churchData.name,
        address: churchData.address,
        rut: '65.000.000-K', // Placeholder RUT
        logoUrl: '/globe.svg', // Default logo
        ministries: JSON.stringify(['Jóvenes', 'Damas', 'Varones', 'Escuela Dominical'])
      }
    })
  }

  console.log('Churches seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
