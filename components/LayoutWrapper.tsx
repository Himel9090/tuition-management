'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider } from './SidebarContext'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const APP_ROUTES = [
  '/dashboard', '/students', '/payments', '/attendance', '/reports', '/settings',
]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isApp = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))

  if (!isApp) return <>{children}</>

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-slate-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
