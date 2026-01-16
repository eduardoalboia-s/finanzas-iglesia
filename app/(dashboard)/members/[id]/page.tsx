import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Edit2, ArrowLeft, Calendar, User, Phone, MapPin, Heart, Book, Briefcase } from 'lucide-react'

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const member = await prisma.member.findUnique({
    where: { id: resolvedParams.id },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  })

  if (!member) notFound()

  // Calcular edad
  const getAge = (date: Date | null) => {
    if (!date) return 'Sin datos'
    const today = new Date()
    const birthDate = new Date(date)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age} años`
  }

  // Formatear fecha
  const formatDate = (date: Date | null) => {
    if (!date) return 'No registrada'
    return new Date(date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/members" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Link>
        <div className="flex space-x-3">
          <Link 
            href={`/members/${member.id}/certificate`}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm"
          >
            <Book className="w-4 h-4 mr-2" />
            Certificado Anual
          </Link>
          <Link 
            href={`/members/${member.id}/edit`}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar Perfil
          </Link>
        </div>
      </div>

      {/* Tarjeta Principal */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
            <div className="bg-white p-1 rounded-full shadow-lg">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold">
                {member.firstName[0]}{member.lastName[0]}
              </div>
            </div>
            <div className="mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                member.status === 'PASSIVE' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
              }`}>
                {member.status === 'ACTIVE' ? 'Activo' : member.status === 'PASSIVE' ? 'Pasivo' : 'Disciplina'}
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">{member.firstName} {member.lastName}</h1>
          <p className="text-gray-500">{member.profession || 'Sin profesión registrada'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center text-gray-700">
                <User className="w-5 h-5 mr-2 text-indigo-500" />
                Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">RUT</p>
                  <p className="font-medium">{member.rut || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado Civil</p>
                  <p className="font-medium">{member.maritalStatus || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha Nacimiento</p>
                  <p className="font-medium">{formatDate(member.birthDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Edad</p>
                  <p className="font-medium">{getAge(member.birthDate)}</p>
                </div>
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                Contacto
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Teléfono</p>
                    <p className="font-medium">{member.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 mr-2 text-gray-400 mt-0.5">@</div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{member.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Dirección</p>
                    <p className="font-medium">{member.address || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Datos Eclesiásticos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center text-gray-700">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Vida Eclesiástica
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Fecha Conversión</p>
                  <p className="font-medium">{formatDate(member.conversionDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha Bautismo</p>
                  <p className="font-medium">{formatDate(member.baptismDate)}</p>
                </div>
              </div>
            </div>

            {/* Notas Pastorales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center text-gray-700">
                <Book className="w-5 h-5 mr-2 text-yellow-500" />
                Notas Pastorales
              </h3>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 text-sm text-gray-700 min-h-[100px]">
                {member.notes ? member.notes : <span className="text-gray-400 italic">Sin notas registradas.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial Financiero Reciente */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Últimos Aportes</h3>
        {member.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {member.transactions.map((tx) => (
                  <tr key={tx.id} className="border-t">
                    <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString('es-CL')}</td>
                    <td className="px-4 py-2">{tx.category}</td>
                    <td className="px-4 py-2 text-right font-medium">${tx.amount.toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay registros financieros recientes.</p>
        )}
      </div>
    </div>
  )
}
