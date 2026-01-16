import { prisma } from '@/lib/prisma'
import { AlertCircle } from 'lucide-react'

// Categorías que generan deuda
const INCOME_TITHE = 'DIEZMO'
const INCOME_OFFERING = 'OFRENDA_CULTO'

// Categorías que descuentan deuda
const REMITTANCE_TITHE = 'REMESA_DIEZMO'
const REMITTANCE_OFFERING = 'REMESA_OFRENDA'
const SALARY_PASTOR = 'SUELDO_PASTOR'
const LEGACY_REMITTANCE = 'DIEZMO_CORPORACION' // Por si acaso

async function getBalance(incomeCategory: string, expenseCategories: string[], percentage: number) {
  // 1. Total Ingresos de esa categoría
  const incomeAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      type: 'INCOME',
      category: incomeCategory
    }
  })
  const totalIncome = incomeAgg._sum.amount || 0
  const expected = Math.round(totalIncome * percentage)

  // 2. Total Pagos realizados para esa deuda
  const remittanceAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      type: 'EXPENSE',
      category: { in: expenseCategories }
    }
  })
  const paid = remittanceAgg._sum.amount || 0
  
  return {
    expected,
    paid,
    pending: expected - paid
  }
}

export async function CorporationRemittanceWidget() {
  const titheBalance = await getBalance(INCOME_TITHE, [REMITTANCE_TITHE, LEGACY_REMITTANCE], 0.10)
  const offeringBalance = await getBalance(INCOME_OFFERING, [REMITTANCE_OFFERING], 0.10)
  const pastorBalance = await getBalance(INCOME_TITHE, [SALARY_PASTOR], 0.90)

  // Si todas están saldadas
  if (titheBalance.pending <= 0 && offeringBalance.pending <= 0 && pastorBalance.pending <= 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center shadow-sm">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <span className="text-green-600 font-bold text-xl">✓</span>
        </div>
        <div>
          <h3 className="text-green-800 font-medium">Al día</h3>
          <p className="text-green-600 text-sm">Corporación y Pastor pagados.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full md:min-w-[400px]">
      {/* Alerta Diezmos Corporación (10%) */}
      {titheBalance.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <div className="shrink-0 mt-1">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                Pendiente: 10% Diezmo a Corporación
              </h3>
              <div className="mt-2 flex justify-between items-end">
                <div>
                   <p className="text-xs text-amber-600">Total a Pagar</p>
                   <p className="text-2xl font-bold text-amber-900">${titheBalance.pending.toLocaleString('es-CL')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-amber-500 mb-1">Use categoría:</p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    10% Diezmo a Corporación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta Ofrendas Corporación (10%) */}
      {offeringBalance.pending > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <div className="shrink-0 mt-1">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide">
                Pendiente: 10% Ofrenda a Corporación
              </h3>
              <div className="mt-2 flex justify-between items-end">
                <div>
                   <p className="text-xs text-orange-600">Total a Pagar</p>
                   <p className="text-2xl font-bold text-orange-900">${offeringBalance.pending.toLocaleString('es-CL')}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-orange-500 mb-1">Use categoría:</p>
                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    10% Ofrenda a Corporación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta Aporte Económico Pastor (90%) */}
      {pastorBalance.pending > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <div className="shrink-0 mt-1">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                Pendiente: Aporte Pastoral (90%)
              </h3>
              <div className="mt-2 flex justify-between items-end">
                <div>
                   <p className="text-xs text-blue-600">Total a Entregar</p>
                   <p className="text-2xl font-bold text-blue-900">${pastorBalance.pending.toLocaleString('es-CL')}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-blue-500 mb-1">Use categoría:</p>
                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Aporte Pastoral (90% Diezmos)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
