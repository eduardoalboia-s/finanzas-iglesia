'use client'

import { useState } from 'react'
import { removeMemberFromGroup } from '@/app/actions/groups/management'
import { Trash2, User } from 'lucide-react'

type Member = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export function GroupMembersList({ groupId, members }: { groupId: string, members: Member[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleRemove = async (memberId: string) => {
    if (!confirm('¿Estás seguro de quitar a este miembro del grupo?')) return

    setLoadingId(memberId)
    const res = await removeMemberFromGroup(groupId, memberId)
    setLoadingId(null)

    if (!res.success) {
      alert(res.error)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <ul className="divide-y divide-gray-200">
        {members.map((member) => (
          <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-2 mr-4">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                <div className="text-xs text-gray-500 flex space-x-3">
                   {member.email && <span>{member.email}</span>}
                   {member.phone && <span>{member.phone}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemove(member.id)}
              disabled={loadingId === member.id}
              className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
              title="Quitar del grupo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
        {members.length === 0 && (
          <li className="px-6 py-8 text-center text-gray-500 italic">
            Este grupo aún no tiene miembros asignados.
          </li>
        )}
      </ul>
    </div>
  )
}
