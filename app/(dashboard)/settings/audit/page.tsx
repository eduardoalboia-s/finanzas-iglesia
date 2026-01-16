import { prisma } from '@/lib/prisma'
import { AuditLogTable } from '@/components/settings/audit-log-table'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 100 // Limit to last 100 logs for performance
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Historial de Auditoría</h1>
          <p className="text-gray-600">Registro de seguridad de todas las operaciones críticas.</p>
        </div>
      </div>

      <AuditLogTable logs={logs} />
    </div>
  )
}
