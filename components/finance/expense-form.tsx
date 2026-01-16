'use client'

import { registerExpense } from '@/app/actions/finance'
import { useRef } from 'react'

export function ExpenseForm({ defaultCategory, defaultAmount, defaultDescription }: { 
  defaultCategory?: string, 
  defaultAmount?: number,
  defaultDescription?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-red-700">Registrar Gasto</h2>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          try {
            await registerExpense(formData)
            formRef.current?.reset()
            alert('Gasto registrado exitosamente')
          } catch (error) {
            alert('Error al registrar: ' + error)
          }
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select 
            name="category" 
            required
            defaultValue={defaultCategory || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Seleccione categoría...</option>
            <option value="REMESA_DIEZMO">10% Diezmo a Corporación</option>
            <option value="REMESA_OFRENDA">10% Ofrenda a Corporación</option>
            <option value="CUOTA_ZONAL">Cuota Zonal</option>
            <option value="SUELDO_PASTOR">Aporte Pastoral (90% Diezmos)</option>
            <option value="SERVICIOS_BASICOS">Servicios Básicos (Luz, Agua)</option>
            <option value="MANTENCION">Mantención</option>
            <option value="AYUDA_SOCIAL">Ayuda Social</option>
            <option value="MINISTERIOS">Ministerios</option>
            <option value="GASTOS_CONSTRUCCION">Gastos Construcción/Reparaciones</option>
            <option value="HONORARIOS">Honorarios/Sueldos</option>
            <option value="OTROS">Otros</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <input 
            type="text" 
            name="description" 
            required
            defaultValue={defaultDescription || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Pago factura Luz Enero"
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
              defaultValue={defaultAmount || ""}
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-red-500 focus:ring-red-500 sm:text-sm py-2 border"
              placeholder="45000"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="voucher" className="block text-sm font-medium text-gray-700">Comprobante / Voucher (Opcional)</label>
          <input 
            type="file" 
            name="voucher" 
            accept="image/*,.pdf"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Registrar Egreso
          </button>
        </div>
      </form>
    </div>
  )
}
