'use client'

import { useState } from 'react'
import { importMembers } from '@/app/actions/members/import'
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle } from 'lucide-react'

export function ImportMembersDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean, count?: number, errors?: string[] } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await importMembers(formData)
    
    setLoading(false)
    if (res.success) {
      setResult(res)
      // Cerrar modal después de 2s si todo salió perfecto
      if (!res.errors) {
        setTimeout(() => {
          setIsOpen(false)
          setResult(null)
        }, 2000)
      }
    } else {
      alert(res.error)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
        Importar Excel
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Importar Miembros Masivamente</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Selecciona un archivo Excel
                    </span>
                    <input id="file-upload" name="file" type="file" accept=".xlsx, .xls" className="sr-only" required />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">.xlsx o .xls</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p className="font-semibold mb-1">Formato requerido (Columnas):</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Nombre</li>
                  <li>Apellido</li>
                  <li>RUT (ej: 12345678-9 o 12.345.678-9)</li>
                  <li>Email (opcional)</li>
                  <li>Teléfono (opcional)</li>
                </ol>
                <p className="mt-2 text-xs italic text-blue-800">
                  * El sistema formateará automáticamente el RUT con puntos y guión.
                </p>
              </div>

              {result && (
                <div className={`p-4 rounded-md ${result.errors ? 'bg-yellow-50' : 'bg-green-50'}`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {result.errors ? (
                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${result.errors ? 'text-yellow-800' : 'text-green-800'}`}>
                        Proceso finalizado
                      </h3>
                      <div className={`mt-2 text-sm ${result.errors ? 'text-yellow-700' : 'text-green-700'}`}>
                        <p>Se importaron {result.count} miembros exitosamente.</p>
                        {result.errors && (
                          <ul className="list-disc list-inside mt-1">
                            {result.errors.slice(0, 3).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {result.errors.length > 3 && <li>...y {result.errors.length - 3} errores más</li>}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Importando...' : 'Subir Archivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
