'use server'

import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { auth } from '@/auth'

export type BankTransaction = {
  date: string
  description: string
  amount: number
  reference?: string
  match?: {
    id: string
    date: Date
    description: string | null
    amount: number
    isReconciled: boolean
  } | null
}

export async function processBankStatement(formData: FormData) {
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

    // Asumimos estructura simple: Fecha | Descripción | Monto (o Cargo/Abono)
    // Esto debería ser configurable, pero para MVP detectaremos columnas
    
    // Simplificación: Buscamos filas que parezcan transacciones
    const transactions: BankTransaction[] = []
    
    // Ignoramos header, empezamos row 1
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (row.length < 2) continue

      // Intentar parsear fecha (Excel date serial o string)
      let dateStr = ''
      if (typeof row[0] === 'number') {
        // Excel serial date
        const date = new Date(Math.round((row[0] - 25569) * 86400 * 1000))
        dateStr = date.toISOString().split('T')[0]
      } else {
        dateStr = String(row[0])
      }

      const description = String(row[1])
      
      // Monto: a veces viene en dos columnas (Cargo, Abono) o en una con signo
      let amount = 0
      if (typeof row[2] === 'number') {
        amount = row[2]
      } else if (typeof row[3] === 'number') { // Caso columna Abono separada
        amount = row[3]
      }

      if (amount !== 0) {
        transactions.push({
          date: dateStr,
          description,
          amount,
          reference: String(i)
        })
      }
    }

    // Buscar coincidencias en BD
    const systemTransactions = await prisma.transaction.findMany({
      where: {
        account: {
          tenantId: session.user.tenantId
        },
        isReconciled: false // Solo buscar en no conciliadas
      },
      select: {
        id: true,
        date: true,
        description: true,
        amount: true,
        isReconciled: true
      }
    })

    // Algoritmo simple de matching
    const results = transactions.map(bankTx => {
      const bankDate = new Date(bankTx.date)
      
      const match = systemTransactions.find(sysTx => {
        // Coincidencia de monto exacto
        if (sysTx.amount !== bankTx.amount) return false
        
        // Coincidencia de fecha (+/- 2 días de tolerancia)
        const diffTime = Math.abs(sysTx.date.getTime() - bankDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
        
        return diffDays <= 2
      })

      return {
        ...bankTx,
        match: match || null
      }
    })

    return { success: true, data: results }

  } catch (error) {
    console.error(error)
    return { success: false, error: 'Error al procesar el archivo' }
  }
}

export async function reconcileTransaction(transactionId: string, bankDate: string) {
  try {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        isReconciled: true,
        reconciledDate: new Date(bankDate)
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al conciliar' }
  }
}
