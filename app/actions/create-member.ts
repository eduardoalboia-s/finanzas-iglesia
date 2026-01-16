'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMember(formData: FormData) {
  // En un escenario real, obtenemos el tenantId de la sesión del usuario.
  // Para este MVP, buscamos el primer tenant disponible (creado por el seed).
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) throw new Error('No se encontró ninguna iglesia configurada.')

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const rut = formData.get('rut') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  // Validación básica
  if (!firstName || !lastName || !rut) {
    throw new Error('Nombre, Apellido y RUT son obligatorios')
  }

  // Crear el miembro en la BD
  await prisma.member.create({
    data: {
      firstName,
      lastName,
      rut,
      email,
      phone,
      address,
      tenantId: tenant.id, // Asignación automática al tenant
    },
  })

  // Revalidar la caché de la página de miembros para mostrar el nuevo registro
  revalidatePath('/members')
  
  // Opcional: Redirigir o retornar éxito
  return { success: true }
}

export async function updateMember(id: string, formData: FormData) {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const rut = formData.get('rut') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const status = formData.get('status') as string

  if (!firstName || !lastName || !rut) {
    throw new Error('Nombre, Apellido y RUT son obligatorios')
  }

  await prisma.member.update({
    where: { id },
    data: {
      firstName,
      lastName,
      rut,
      email,
      phone,
      address,
      status: status as any
    }
  })

  revalidatePath(`/members/${id}`)
  revalidatePath('/members')
  return { success: true }
}
