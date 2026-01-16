'use client'

import { registerIncome } from '@/app/actions/finance'
import { useRef, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ReceiptPDF } from './receipt-pdf'
import QRCode from 'qrcode'

type Member = {
  id: string
  firstName: string
  lastName: string
  rut: string | null
}

export function TitheForm({ members }: { members: Member[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [incomeType, setIncomeType] = useState('DIEZMO')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsProcessing(true)
    try {
      const result = await registerIncome(formData)
      
      if (result.success && result.transaction) {
        // Generar QR
        const qrDataUrl = await QRCode.toDataURL(`RECIBO:${result.transaction.receiptNumber}|MONTO:${result.transaction.amount}|FECHA:${new Date(result.transaction.date).toISOString().split('T')[0]}`)
        
        // Generar PDF
        const blob = await pdf(
          <ReceiptPDF 
            transaction={result.transaction} 
            church={result.church} 
            qrDataUrl={qrDataUrl}
          />
        ).toBlob()
        
        // Descargar PDF
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `recibo-${result.transaction.receiptNumber}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        formRef.current?.reset()
        setIncomeType('DIEZMO')
        alert('Ingreso registrado. El recibo se descargará automáticamente.')
      }
    } catch (error) {
      alert('Error al registrar: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrar Ingreso</h2>
      
      <form 
        ref={formRef}
        action={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Ingreso</label>
          <select 
            name="type" 
            required
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="DIEZMO">Diezmo (Requiere Miembro)</option>
            <option value="OFRENDA_CULTO">Ofrenda Culto General (Anónimo)</option>
            <option value="OFRENDA_ESPECIAL">Ofrenda Especial / Con Nombre</option>
            <option value="OFRENDA_CONSTRUCCION">Aporte para Construcción</option>
            <option value="DONACION">Donación Externa</option>
            <option value="ACTIVIDAD">Ingreso por Actividad/Evento</option>
          </select>
        </div>

        {incomeType === 'DIEZMO' || incomeType === 'OFRENDA_ESPECIAL' || incomeType === 'OFRENDA_CONSTRUCCION' ? (
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
              Miembro {incomeType === 'DIEZMO' ? '(Obligatorio)' : '(Opcional)'}
            </label>
            <select 
              name="memberId" 
              required={incomeType === 'DIEZMO'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Seleccione un hermano...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.rut})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
          <input 
            type="text" 
            name="description" 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder={incomeType === 'DIEZMO' ? 'Diezmo Mensual' : 'Ofrenda Domingo...'}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto (CLP)</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              required
              min="1"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 border"
              placeholder="10000"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">CLP</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
          <input 
            type="date" 
            name="date" 
            defaultValue={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full text-white px-4 py-2 rounded-md transition-colors ${
              isProcessing 
                ? 'bg-green-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
          >
            {isProcessing ? 'Procesando...' : 'Registrar e Imprimir Recibo'}
          </button>
        </div>
      </form>
    </div>
  )
}
