import { prisma } from '@/lib/prisma'
import { Users, Calendar as CalendarIcon, MapPin, Building } from 'lucide-react'

export default async function DashboardPage() {
  // 1. Cargar Datos de la Iglesia (Tenant)
  const tenant = await prisma.tenant.findFirst({
    include: {
      _count: {
        select: {
          members: true,
          memberGroups: true
        }
      }
    }
  })

  // 2. Cargar Próximos Eventos
  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date()
      }
    },
    orderBy: {
      startTime: 'asc'
    },
    take: 5
  })

  if (!tenant) {
    return <div>No se encontró información de la iglesia.</div>
  }

  return (
    <div className="p-6 space-y-8">
      {/* Encabezado con Información de la Iglesia */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          {/* Logo Placeholder */}
          <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            {tenant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tenant.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Building className="w-16 h-16" />
            )}
          </div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{tenant.name}</h1>
          <div className="flex items-center justify-center md:justify-start text-gray-600 gap-2">
            <Users className="w-5 h-5" />
            <span className="text-lg font-medium">Pastor: {tenant.pastorName || 'No asignado'}</span>
          </div>
          {tenant.address && (
            <div className="flex items-center justify-center md:justify-start text-gray-500 gap-2">
              <MapPin className="w-4 h-4" />
              <span>{tenant.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Miembros Activos</p>
              <p className="text-3xl font-bold text-gray-900">{tenant._count.members}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Grupos / Ministerios</p>
              <p className="text-3xl font-bold text-gray-900">{tenant._count.memberGroups}</p>
            </div>
          </div>
        </div>

        {/* Placeholder para alguna otra estadística o acceso rápido */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
          <p className="text-gray-400 italic">Más estadísticas pronto...</p>
        </div>
      </div>

      {/* Calendario de Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Próximos Eventos
            </h2>
            {/* Aquí podría ir un botón para agregar evento */}
          </div>
          <div className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay eventos programados próximamente.
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(event.startTime).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {event.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Espacio para otra sección, quizás noticias o devocional */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Bienvenido a su Panel de Administración</h2>
          <p className="text-indigo-100 mb-6">
            Aquí podrá gestionar toda la información de su congregación de manera centralizada.
            Utilice el menú lateral para acceder a las secciones de membresía y finanzas.
          </p>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="font-medium">Versículo del día</p>
            <p className="italic mt-2">"Todo lo que hacéis, hacedlo de corazón, como para el Señor y no para los hombres." - Colosenses 3:23</p>
          </div>
        </div>
      </div>
    </div>
  )
}
