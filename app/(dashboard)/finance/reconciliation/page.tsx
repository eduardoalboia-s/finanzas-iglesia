import { ReconciliationView } from '@/components/finance/reconciliation-view'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ReconciliationPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="p-6 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Conciliación Bancaria
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sube tu cartola bancaria para comparar y validar los movimientos del sistema.
          </p>
        </div>
      </div>

      <ReconciliationView />
    </div>
  )
}
