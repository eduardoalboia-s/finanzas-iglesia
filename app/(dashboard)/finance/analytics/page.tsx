import { prisma } from '@/lib/prisma'
import { OverviewChart } from '@/components/finance/overview-chart'
import { CategoryChart } from '@/components/finance/category-chart'
import { StatsCards } from '@/components/finance/stats-cards'

export default async function AnalyticsPage() {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // 1. Calcular Saldo Total (Histórico)
    const totalIncomeAgg = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'INCOME' }
    })
    const totalExpenseAgg = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'EXPENSE' }
    })
    const totalBalance = (totalIncomeAgg._sum.amount || 0) - (totalExpenseAgg._sum.amount || 0)

    // 2. Calcular Estadísticas del Mes Actual
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

    const currentMonthTransactions = await prisma.transaction.findMany({
        where: {
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    })

    const monthlyIncome = currentMonthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpense = currentMonthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

    // 3. Calcular Datos para el Gráfico (Últimos 6 meses)
    const chartData = []
    const tithesData = []
    const offeringsData = []
    const constructionIncomeData = []
    const specialData = []
    const corpData = []
    const pastorData = []
    const constructionExpenseData = []
    const opsData = []

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1)
        const monthIndex = d.getMonth()
        const year = d.getFullYear()

        const start = new Date(year, monthIndex, 1)
        const end = new Date(year, monthIndex + 1, 0, 23, 59, 59)

        const txs = await prisma.transaction.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                amount: true,
                type: true,
                category: true
            }
        })

        const income = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
        const expense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)

        // Categorías Ingresos
        const tithes = txs.filter(t => t.category === 'DIEZMO').reduce((s, t) => s + t.amount, 0)
        const offerings = txs.filter(t => t.category === 'OFRENDA_CULTO').reduce((s, t) => s + t.amount, 0)
        const constructionIncome = txs.filter(t => t.category === 'OFRENDA_CONSTRUCCION').reduce((s, t) => s + t.amount, 0)
        const special = txs.filter(t => t.category !== 'DIEZMO' && t.category !== 'OFRENDA_CULTO' && t.category !== 'OFRENDA_CONSTRUCCION' && t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)

        // Categorías Gastos
        const corp = txs.filter(t => t.category === 'REMESA_DIEZMO' || t.category === 'REMESA_OFRENDA').reduce((s, t) => s + t.amount, 0)
        const pastor = txs.filter(t => t.category === 'SUELDO_PASTOR').reduce((s, t) => s + t.amount, 0)
        const constructionExpense = txs.filter(t => t.category === 'GASTOS_CONSTRUCCION').reduce((s, t) => s + t.amount, 0)
        const ops = txs.filter(t => t.type === 'EXPENSE' && t.category !== 'REMESA_DIEZMO' && t.category !== 'REMESA_OFRENDA' && t.category !== 'SUELDO_PASTOR' && t.category !== 'GASTOS_CONSTRUCCION').reduce((s, t) => s + t.amount, 0)

        const monthLabel = months[monthIndex]

        chartData.push({ month: monthLabel, income, expense })
        tithesData.push({ month: monthLabel, amount: tithes })
        offeringsData.push({ month: monthLabel, amount: offerings })
        constructionIncomeData.push({ month: monthLabel, amount: constructionIncome })
        specialData.push({ month: monthLabel, amount: special })
        corpData.push({ month: monthLabel, amount: corp })
        pastorData.push({ month: monthLabel, amount: pastor })
        constructionExpenseData.push({ month: monthLabel, amount: constructionExpense })
        opsData.push({ month: monthLabel, amount: ops })
    }

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Análisis Financiero</h1>
                <p className="text-gray-600">Visualización detallada de ingresos y gastos.</p>
            </div>

            {/* Tarjetas de Resumen */}
            <StatsCards
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
            />

            {/* Gráfico Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <OverviewChart data={chartData} />
                </div>
            </div>

            {/* Gráficos Detallados Ingresos */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle de Ingresos (6 Meses)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CategoryChart title="Diezmos" color="#4f46e5" data={tithesData} />
                    <CategoryChart title="Ofrendas Culto" color="#0891b2" data={offeringsData} />
                    <CategoryChart title="Aportes Construcción" color="#059669" data={constructionIncomeData} />
                    <CategoryChart title="Otros Ingresos" color="#d97706" data={specialData} />
                </div>
            </div>

            {/* Gráficos Detallados Gastos */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle de Gastos (6 Meses)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CategoryChart title="Aporte Corporación" color="#dc2626" data={corpData} />
                    <CategoryChart title="Aporte Pastoral" color="#ea580c" data={pastorData} />
                    <CategoryChart title="Gastos Construcción" color="#7c2d12" data={constructionExpenseData} />
                    <CategoryChart title="Gastos Operacionales" color="#65a30d" data={opsData} />
                </div>
            </div>
        </div>
    )
}
