'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function updateChurchSettings(formData: FormData) {
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) throw new Error('Error: No hay iglesia configurada.')

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const rut = formData.get('rut') as string
  const pastorName = formData.get('pastorName') as string
  const treasurerName = formData.get('treasurerName') as string
  const ministriesStr = formData.get('ministries') as string
  const logoFile = formData.get('logo') as File | null

  if (!name) throw new Error('El nombre de la iglesia es obligatorio.')

  // Procesar Logo si existe
  let logoUrl = undefined
  if (logoFile && logoFile.size > 0) {
    const bytes = await logoFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = logoFile.name.split('.').pop()
    const filename = `logo-${uniqueSuffix}.${extension}`
    
    // Guardar en public/uploads/logos
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'logos')
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    logoUrl = `/uploads/logos/${filename}`
  }

  // Validar y limpiar JSON de ministerios
  let ministries = null
  try {
    if (ministriesStr) {
      // Intentar parsear para validar, pero guardamos como string
      const parsed = JSON.parse(ministriesStr)
      if (!Array.isArray(parsed)) throw new Error('Formato inválido')
      ministries = ministriesStr
    }
  } catch (e) {
    // Si falla, asumimos que es una lista separada por comas
    const list = ministriesStr.split(',').map(m => m.trim()).filter(Boolean)
    ministries = JSON.stringify(list)
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      name,
      address,
      phone,
      email,
      rut,
      pastorName,
      treasurerName,
      ministries,
      ...(logoUrl && { logoUrl }) // Solo actualizar si hay nuevo logo
    }
  })

  revalidatePath('/settings')
  return { success: true }
}
