import { prisma } from '@/lib/prisma'
import { CreateAssetDialog } from '@/components/inventory/create-asset-dialog'
import { Package, MapPin, User, AlertCircle } from 'lucide-react'

export default async function InventoryPage() {
  const assets = await prisma.asset.findMany({
    include: {
      responsible: {
        select: { firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const members = await prisma.member.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: 'asc' }
  })

  const totalValue = assets.reduce((sum, asset) => sum + (asset.cost || 0), 0)
  const totalCount = assets.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Activo</span>
      case 'DAMAGED': return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Dañado</span>
      case 'LOST': return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Perdido</span>
      case 'SOLD': return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Vendido</span>
      case 'DISCARDED': return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Baja</span>
      default: return status
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventario y Activos</h1>
          <p className="text-gray-600">Control de bienes, muebles y equipos de la iglesia.</p>
        </div>
        <CreateAssetDialog members={members} />
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total de Activos</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount} items</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Valor Total Estimado</p>
          <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Ubicaciones</p>
          <p className="text-2xl font-bold text-indigo-600">{new Set(assets.map(a => a.location)).size} lugares</p>
        </div>
      </div>

      {/* Lista de Activos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Inventario vacío</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza registrando los bienes de la iglesia.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría / Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Compra</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-500">{asset.serialNumber ? `S/N: ${asset.serialNumber}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.category}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {asset.location || 'Sin ubicación'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(asset.cost || 0).toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.responsible ? (
                        <div className="flex items-center text-sm text-gray-700">
                          <User className="w-3 h-3 mr-1 text-gray-400" />
                          {asset.responsible.firstName} {asset.responsible.lastName}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sin asignar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
