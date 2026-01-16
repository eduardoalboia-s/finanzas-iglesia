import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Settings } from 'lucide-react'
import { AddMemberDialog } from '@/components/groups/add-member-dialog'
import { GroupMembersList } from '@/components/groups/group-members-list'

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const group = await prisma.memberGroup.findUnique({
    where: { id: resolvedParams.id },
    include: {
      members: {
        orderBy: { lastName: 'asc' }
      }
    }
  })

  if (!group) notFound()

  // Obtener todos los miembros activos para el selector
  const allMembers = await prisma.member.findMany({
    where: { 
      tenantId: group.tenantId,
      status: 'ACTIVE'
    },
    select: { id: true, firstName: true, lastName: true }
  })

  // Filtrar miembros que NO están en el grupo
  const existingMemberIds = new Set(group.members.map(m => m.id))
  const availableMembers = allMembers.filter(m => !existingMemberIds.has(m.id))

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/groups" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Grupos
        </Link>
        {/* Futuro: Botón editar grupo */}
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {group.members.length} miembros
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl">{group.description || 'Sin descripción'}</p>
        </div>
        
        <div className="flex-shrink-0">
          <AddMemberDialog groupId={group.id} availableMembers={availableMembers} />
        </div>
      </div>

      {/* Lista de Miembros */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-500" />
          Integrantes del Equipo
        </h2>
        
        <GroupMembersList groupId={group.id} members={group.members} />
      </div>
    </div>
  )
}
