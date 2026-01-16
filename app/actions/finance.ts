'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createAuditLog } from '@/lib/audit'
import { sendEmail, generateReceiptEmailHtml } from '@/lib/email'
import { transactionSchema } from '@/lib/validations/schemas'

async function getTenantAndAccount() {
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) throw new Error('Error de configuración: No hay iglesia.')

  const account = await prisma.account.findFirst({
    where: { tenantId: tenant.id }
  })
  if (!account) throw new Error('Error: No hay cuenta configurada.')

  return { tenant, account }
}

export async function registerIncome(formData: FormData) {
  const { tenant, account } = await getTenantAndAccount()

  const rawAmount = formData.get('amount') as string
  const cleanAmount = rawAmount ? parseInt(rawAmount.replace(/\./g, ''), 10) : 0

  const validation = transactionSchema.safeParse({
    amount: cleanAmount,
    type: 'INCOME',
    category: formData.get('type'),
    description: formData.get('description'),
    memberId: formData.get('memberId'),
    date: formData.get('date')
  })

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  const { amount, category, description, memberId, date: dateStr } = validation.data

  // Si es diezmo, requerimos miembro
  if (category === 'DIEZMO' && !memberId) {
    throw new Error('Para registrar un Diezmo, debe seleccionar un miembro.')
  }

  const date = dateStr ? new Date(dateStr) : new Date()

  // Determinar descripción automática si no viene
  let finalDescription = description
  if (!finalDescription) {
    if (category === 'DIEZMO') finalDescription = 'Diezmo Mensual'
    if (category === 'OFRENDA_CULTO') finalDescription = 'Ofrenda Culto General'
    if (category === 'OFRENDA_ESPECIAL') finalDescription = 'Ofrenda Especial'
  }

  // Obtener último número de recibo para esta iglesia
  const lastTransaction = await prisma.transaction.findFirst({
    where: { account: { tenantId: tenant.id }, receiptNumber: { not: null } },
    orderBy: { receiptNumber: 'desc' }
  })
  const nextReceiptNumber = (lastTransaction?.receiptNumber || 0) + 1

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type: 'INCOME',
      category,
      description: finalDescription,
      date,
      accountId: account.id,
      memberId: memberId || null,
      receiptNumber: nextReceiptNumber
    },
    include: {
      member: true
    }
  })


  await createAuditLog('CREATE', 'Transaction', transaction.id, transaction)

  // Enviar correo si el miembro tiene email
  if (transaction.member && transaction.member.email) {
    const html = generateReceiptEmailHtml(
      `${transaction.member.firstName} ${transaction.member.lastName}`,
      transaction.amount,
      transaction.category,
      transaction.date,
      transaction.receiptNumber || 0
    )
    
    // No esperamos (await) el envío para no bloquear la respuesta UI, 
    // pero en serverless functions a veces es mejor esperar.
    // Aquí lo haremos async sin await para velocidad, o con await si queremos asegurar.
    // Dado que es importante, usaremos await pero capturando error para no fallar el registro.
    await sendEmail({
      to: transaction.member.email,
      subject: `Comprobante de Recepción - ${tenant.name}`,
      html
    })
  }

  revalidatePath('/finance')

  // Retornamos los datos necesarios para generar el PDF en el cliente
  return { 
    success: true, 
    transaction: {
      ...transaction,
      amount: transaction.amount, // Ensure number
      date: transaction.date,
    },
    church: {
      name: tenant.name,
      address: tenant.address,
      rut: tenant.rut,
      logoUrl: tenant.logoUrl
    }
  }
}

// Mantenemos esta función por compatibilidad si es necesaria, o la redirigimos
export async function registerTithe(formData: FormData) {
  formData.append('type', 'DIEZMO')
  return registerIncome(formData)
}

export async function registerExpense(formData: FormData) {
  const { account } = await getTenantAndAccount()

  const rawAmount = formData.get('amount') as string
  const cleanAmount = rawAmount ? parseInt(rawAmount.replace(/\./g, ''), 10) : 0

  const validation = transactionSchema.safeParse({
    amount: cleanAmount,
    type: 'EXPENSE',
    category: formData.get('category'),
    description: formData.get('description'),
    date: formData.get('date')
  })

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  const { amount, category, description, date: dateStr } = validation.data
  const date = dateStr ? new Date(dateStr) : new Date()
  const file = formData.get('voucher') as File | null
  let attachmentUrl = null

  // Procesar archivo si existe
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.name.split('.').pop()
    const filename = `voucher-${uniqueSuffix}.${extension}`
    
    // Guardar en public/uploads/vouchers
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'vouchers')
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    attachmentUrl = `/uploads/vouchers/${filename}`
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type: 'EXPENSE',
      category,
      description,
      date,
      accountId: account.id,
      attachmentUrl
    }
  })

  await createAuditLog('CREATE', 'Transaction', transaction.id, transaction)

  revalidatePath('/finance')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id } })
    if (!tx) throw new Error('Transacción no encontrada')

    await prisma.transaction.delete({
      where: { id }
    })
    
    await createAuditLog('DELETE', 'Transaction', id, tx)

    revalidatePath('/finance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'No se pudo eliminar la transacción' }
  }
}

export async function updateTransaction(
  id: string, 
  data: { 
    amount?: number
    category?: string
    description?: string
    date?: string 
  }
) {
  try {
    const oldTx = await prisma.transaction.findUnique({ where: { id } })
    if (!oldTx) throw new Error('Transacción no encontrada')

    const updateData: any = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const updatedTx = await prisma.transaction.update({
      where: { id },
      data: updateData
    })

    await createAuditLog('UPDATE', 'Transaction', id, {
      old: oldTx,
      new: updatedTx
    })

    revalidatePath('/finance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar' }
  }
}
