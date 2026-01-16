'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveBudget(category: string, amount: number, month: number, year: number) {
  // Hardcoded tenant for now
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) throw new Error('No tenant found')

  try {
    await prisma.budget.upsert({
      where: {
        tenantId_year_month_category: {
          tenantId: tenant.id,
          year,
          month,
          category
        }
      },
      update: {
        amount
      },
      create: {
        tenantId: tenant.id,
        year,
        month,
        category,
        amount
      }
    })

    revalidatePath('/finance/budgets')
    return { success: true }
  } catch (error) {
    console.error('Error saving budget:', error)
    return { success: false, error: 'Failed to save budget' }
  }
}
