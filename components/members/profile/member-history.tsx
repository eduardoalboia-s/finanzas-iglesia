import { prisma } from '@/lib/prisma'

type Transaction = {
  id: string
  date: Date
  amount: number
  category: string
  description: string | null
}

export async function MemberHistory({ memberId }: { memberId: string }) {
  const transactions = await prisma.transaction.findMany({
    where: { 
      memberId: memberId,
      type: 'INCOME' // Solo mostramos lo que ha aportado
    },
    orderBy: { date: 'desc' }
  })

  const totalContribution = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Historial de Aportes</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Histórico</p>
          <p className="text-lg font-bold text-green-600">${totalContribution.toLocaleString('es-CL')}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500 italic">
          No hay registros financieros para este miembro.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${t.amount.toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
