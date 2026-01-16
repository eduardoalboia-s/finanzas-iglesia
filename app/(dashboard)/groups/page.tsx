import { prisma } from '@/lib/prisma'
import { CreateGroupDialog } from '@/components/groups/create-group-dialog'
import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'

export default async function GroupsPage() {
  const groups = await prisma.memberGroup.findMany({
    include: {
      _count: {
        select: { members: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Grupos y Ministerios</h1>
          <p className="text-gray-600">Organiza a la congregación en equipos de trabajo.</p>
        </div>
        <CreateGroupDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link 
            key={group.id} 
            href={`/groups/${group.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {group._count.members} miembros
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                {group.description || 'Sin descripción'}
              </p>
              <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                Gestionar Equipo <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
        
        {groups.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay grupos creados</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando el primer ministerio de tu iglesia.</p>
          </div>
        )}
      </div>
    </div>
  )
}
