'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { AnnualCertificatePDF } from '@/components/members/certificates/annual-certificate-pdf'
import { FileText } from 'lucide-react'

interface CertificateDownloadButtonProps {
  member: any
  year: number
  totals: any
  church: any
}

export function CertificateDownloadButton({ member, year, totals, church }: CertificateDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={
        <AnnualCertificatePDF 
          member={member} 
          year={year} 
          totals={totals}
          church={church}
        />
      }
      fileName={`Certificado_Donacion_${member.lastName}_${year}.pdf`}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {({ blob, url, loading, error }) => (
        <>
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          {loading ? 'Generando...' : `Certificado ${year}`}
        </>
      )}
    </PDFDownloadLink>
  )
}
