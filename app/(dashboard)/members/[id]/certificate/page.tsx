import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Printer } from 'lucide-react'

export default async function CertificatePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ year?: string }> 
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : new Date().getFullYear() - 1
  const member = await prisma.member.findUnique({
    where: { id: resolvedParams.id },
    include: {
      tenant: true
    }
  })

  if (!member) notFound()

  // Buscar transacciones del año
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      memberId: member.id,
      type: 'INCOME',
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: 'asc' }
  })

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="bg-white min-h-screen p-12 text-black print:p-0 max-w-4xl mx-auto">
      <div className="mb-8 print:hidden flex justify-between items-center">
        <a href={`/members/${member.id}`} className="text-gray-600 hover:text-gray-900">&larr; Volver al perfil</a>
        <PrintButton />
      </div>

      {/* Borde Decorativo */}
      <div className="border-8 border-double border-gray-800 p-12 h-full min-h-[800px] relative">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{member.tenant.name}</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Departamento de Finanzas</p>
          {member.tenant.rut && <p className="text-sm text-gray-500">RUT: {member.tenant.rut}</p>}
        </div>

        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase underline decoration-double decoration-gray-400">Certificado de Donación</h2>
        </div>

        {/* Cuerpo */}
        <div className="space-y-8 text-lg leading-relaxed text-justify">
          <p>
            Por medio del presente, se certifica que el Sr./Sra. <strong>{member.firstName} {member.lastName}</strong>, 
            RUT <strong>{member.rut || '________________'}</strong>, ha contribuido voluntariamente a la labor de nuestra 
            iglesia durante el período comprendido entre el <strong>01 de Enero de {year}</strong> y el <strong>31 de Diciembre de {year}</strong>.
          </p>

          <p>
            El monto total de sus aportes (Diezmos, Ofrendas y Donaciones) registrados en nuestro sistema asciende a la suma de:
          </p>

          <div className="text-center py-8 bg-gray-50 my-8 border border-gray-200 rounded-lg">
            <span className="text-4xl font-bold text-gray-800">${totalAmount.toLocaleString('es-CL')}</span>
            <p className="text-sm text-gray-500 mt-2">(Pesos Chilenos)</p>
          </div>

          <p>
            Se extiende el presente certificado a petición del interesado para los fines que estime conveniente, 
            agradeciendo su fidelidad y compromiso con la obra del Señor.
          </p>
        </div>

        {/* Firmas */}
        <div className="mt-32 grid grid-cols-2 gap-20">
          <div className="text-center">
            <div className="border-t border-black w-4/5 mx-auto mb-2"></div>
            <p className="font-bold">{member.tenant.treasurerName || 'Tesorero General'}</p>
            <p className="text-sm text-gray-600">Tesorero</p>
          </div>
          <div className="text-center">
            <div className="border-t border-black w-4/5 mx-auto mb-2"></div>
            <p className="font-bold">{member.tenant.pastorName || 'Pastor Gobernante'}</p>
            <p className="text-sm text-gray-600">Pastor</p>
          </div>
        </div>

        {/* Fecha Emisión */}
        <div className="absolute bottom-12 left-12 text-sm text-gray-500">
          Emitido el {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </div>
      </div>
    </div>
  )
}

function PrintButton() {
  'use client'
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
    >
      <Printer className="w-4 h-4 mr-2" />
      Imprimir Certificado
    </button>
  )
}
