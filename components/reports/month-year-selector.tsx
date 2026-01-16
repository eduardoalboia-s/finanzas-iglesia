'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function MonthYearSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const selectedMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : currentMonth
  const selectedYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : currentYear

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ]

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleChange = (type: 'month' | 'year', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(type, value)
    router.push(`/reports?${params.toString()}`)
  }

  return (
    <div className="flex space-x-4 mb-6">
      <select
        value={selectedMonth}
        onChange={(e) => handleChange('month', e.target.value)}
        className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => handleChange('year', e.target.value)}
        className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
