'use client'

import { useState } from 'react'
import { processBankStatement, reconcileTransaction, type BankTransaction } from '@/app/actions/finance/reconciliation'
import { Upload, Check, AlertCircle, FileSpreadsheet } from 'lucide-react'

export function ReconciliationView() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BankTransaction[] | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    const response = await processBankStatement(formData)
    setLoading(false)

    if (response.success && response.data) {
      setResults(response.data)
    } else {
      alert(response.error || 'Error al procesar')
    }
  }

  const handleReconcile = async (sysId: string, bankDate: string) => {
    const res = await reconcileTransaction(sysId, bankDate)
    if (res.success) {
      // Actualizar UI localmente
      setResults(prev => prev?.map(item => {
        if (item.match?.id === sysId) {
          return { ...item, match: { ...item.match!, isReconciled: true } }
        }
        return item
      }) || null)
    } else {
      alert('Error al conciliar')
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Cargar Cartola Bancaria (Excel)</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Analizar
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Formato esperado: Columna A (Fecha), Columna B (Descripción), Columna C (Monto)
        </p>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Resultados de Conciliación</h3>
            <span className="text-sm text-gray-500">{results.length} movimientos encontrados</span>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banco</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sistema (Coincidencia)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((item, idx) => (
                  <tr key={idx} className={item.match ? 'bg-green-50' : ''}>
                    {/* Lado Banco */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{item.date}</div>
                      <div className="font-medium">{item.description}</div>
                      <div className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        ${item.amount.toLocaleString()}
                      </div>
                    </td>

                    {/* Lado Sistema */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.match ? (
                        <div>
                          <div>{new Date(item.match.date).toLocaleDateString()}</div>
                          <div>{item.match.description}</div>
                          <div className="font-medium">${item.match.amount.toLocaleString()}</div>
                          {item.match.isReconciled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Ya conciliado
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-yellow-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          No encontrado en sistema
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.match && !item.match.isReconciled && (
                        <button
                          onClick={() => handleReconcile(item.match!.id, item.date)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Conciliar
                        </button>
                      )}
                      {!item.match && (
                        <button className="text-gray-400 hover:text-gray-600 cursor-not-allowed">
                          Crear (Próximamente)
                        </button>
                      )}
                      {item.match?.isReconciled && (
                        <span className="text-green-600 flex items-center justify-end">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
