import { Sidebar } from '@/components/layout/sidebar'
import { auth } from '@/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={session?.user} />
      <div className="lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
