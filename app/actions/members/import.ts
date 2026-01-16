'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import * as XLSX from 'xlsx'
import { revalidatePath } from 'next/cache'

function formatRut(rut: string): string {
  // Limpiar RUT (dejar solo números y K)
  let value = rut.replace(/[^\dKk]/g, '')
  
  if (value.length < 2) return value

  // Separar cuerpo y dígito verificador
  const body = value.slice(0, -1)
  const dv = value.slice(-1).toUpperCase()

  // Formatear cuerpo con puntos
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${formattedBody}-${dv}`
}

export async function importMembers(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) return { success: false, error: 'No se subió ningún archivo' }

  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    let successCount = 0
    let errorCount = 0
    let errors: string[] = []

    // Ignorar encabezado (fila 0)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (row.length === 0) continue

      // Mapeo flexible de columnas (asumiendo orden: Nombre | Apellido | RUT | Email | Teléfono)
      // Ojo: En Excel row[0] es A, row[1] es B...
      const firstName = String(row[0] || '').trim()
      const lastName = String(row[1] || '').trim()
      const rawRut = String(row[2] || '').trim()
      const email = String(row[3] || '').trim()
      const phone = String(row[4] || '').trim()

      if (!firstName || !lastName) {
        errorCount++
        continue
      }

      // Formatear RUT automáticamente
      const formattedRut = rawRut ? formatRut(rawRut) : null

      try {
        // Verificar si ya existe por RUT (si tiene)
        if (formattedRut) {
          const existing = await prisma.member.findFirst({
            where: { 
              rut: formattedRut,
              tenantId: session.user.tenantId
            }
          })
          if (existing) {
            errors.push(`Fila ${i + 1}: RUT ${formattedRut} ya existe`)
            errorCount++
            continue
          }
        }

        await prisma.member.create({
          data: {
            firstName,
            lastName,
            rut: formattedRut,
            email: email || null,
            phone: phone || null,
            tenantId: session.user.tenantId,
            status: 'ACTIVE'
          }
        })
        successCount++
      } catch (error) {
        errorCount++
        errors.push(`Fila ${i + 1}: Error al guardar`)
      }
    }

    revalidatePath('/members')
    return { 
      success: true, 
      count: successCount, 
      errors: errorCount > 0 ? errors : undefined 
    }

  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al procesar el archivo Excel' }
  }
}
