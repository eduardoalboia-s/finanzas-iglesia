'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit'
import { auth } from '@/auth'

export async function saveBudget(category: string, amount: number, month: number, year: number) {
  const session = await auth()
  if (!session?.user?.tenantId) return { success: false, error: 'No autorizado' }

  try {
    const tenantId = session.user.tenantId

    // Usamos upsert: si existe lo actualiza, si no, lo crea
    const budget = await prisma.budget.upsert({
      where: {
        tenantId_year_month_category: {
          tenantId,
          year,
          month,
          category
        }
      },
      update: {
        amount
      },
      create: {
        tenantId,
        year,
        month,
        category,
        amount
      }
    })

    await createAuditLog('UPDATE', 'Budget', budget.id, { category, amount, month, year })

    revalidatePath('/finance/budgets')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al guardar el presupuesto' }
  }
}
