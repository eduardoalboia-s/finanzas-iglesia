import { CreateMemberForm } from '@/components/members/create-member-form'
import { ImportMembersDialog } from '@/components/members/import-members-dialog'
import { MemberList } from '@/components/members/member-list'
import { prisma } from '@/lib/prisma'

export default async function MembersPage() {
  // Obtener la lista de miembros de la base de datos
  const members = await prisma.member.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Miembros</h1>
          <p className="text-gray-600">Administra el directorio de la iglesia y sus datos de contacto.</p>
        </div>
        <div>
          <ImportMembersDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-1">
          <CreateMemberForm />
        </div>

        {/* Columna Derecha: Lista de Miembros */}
        <div className="lg:col-span-2">
          <MemberList members={members} />
        </div>
      </div>
    </div>
  )
}
