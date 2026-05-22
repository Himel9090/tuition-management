'use client'

import { BarChart3, TrendingUp, Users, CreditCard, CalendarCheck, Download } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useStore } from '@/lib/store'
import { formatCurrency, MONTHS, todayISO } from '@/lib/utils'

export default function ReportsPage() {
  const { students, payments, getAttendanceByDate } = useStore()

  const activeStudents = students.filter((s) => s.status === 'active')
  const today = todayISO()
  const todayRecords = getAttendanceByDate(today)
  const presentToday = todayRecords.filter((a) => a.status === 'present').length

  const totalRevenue = payments.reduce((s, p) => s + p.paidAmount, 0)
  const pendingDue = payments.reduce((s, p) => s + p.dueAmount, 0)

  // Monthly revenue grouped
  const monthlyMap: Record<string, number> = {}
  payments.forEach((p) => {
    const key = `${p.year}-${p.month}`
    monthlyMap[key] = (monthlyMap[key] ?? 0) + p.paidAmount
  })
  const monthlyRevenue = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-5)
    .map(([key, amount]) => {
      const [year, month] = key.split('-')
      return { label: `${MONTHS[parseInt(month) - 1]} ${year}`, amount }
    })
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount), 1)

  // Subject distribution
  const subjectMap: Record<string, number> = {}
  activeStudents.forEach((s) => {
    s.subject.forEach((sub) => {
      subjectMap[sub] = (subjectMap[sub] ?? 0) + 1
    })
  })
  const subjectStats = Object.entries(subjectMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Overall statistics"
        action={
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Students', value: activeStudents.length, icon: Users, color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Total Collected', value: formatCurrency(totalRevenue), icon: CreditCard, color: 'text-success', bg: 'bg-success-50' },
          { label: 'Total Outstanding', value: formatCurrency(pendingDue), icon: TrendingUp, color: 'text-danger', bg: 'bg-danger-50' },
          { label: 'Present Today', value: `${presentToday} students`, icon: CalendarCheck, color: 'text-warning', bg: 'bg-warning-50' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly revenue */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Monthly Revenue
          </h2>
          {monthlyRevenue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No payment records</p>
          ) : (
            <div className="space-y-3">
              {monthlyRevenue.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 w-32 truncate">{item.label}</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject distribution */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Students by Subject
          </h2>
          {subjectStats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {subjectStats.map(([subject, count]) => (
                <div key={subject}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{subject}</span>
                    <span className="font-semibold text-gray-800">{count} students</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: `${(count / activeStudents.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment status */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Status Summary</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Paid', count: payments.filter((p) => p.status === 'paid').length, color: 'bg-success' },
              { label: 'Unpaid', count: payments.filter((p) => p.status === 'unpaid').length, color: 'bg-danger' },
              { label: 'Partial', count: payments.filter((p) => p.status === 'partial').length, color: 'bg-warning' },
            ].map((item) => (
              <div key={item.label} className={`${item.color} rounded-xl p-4 text-center text-white`}>
                <p className="text-3xl font-bold">{item.count}</p>
                <p className="text-xs opacity-80 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student status */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Student Status Summary</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active', count: students.filter((s) => s.status === 'active').length, color: 'bg-success' },
              { label: 'Inactive', count: students.filter((s) => s.status === 'inactive').length, color: 'bg-gray-400' },
              { label: 'Graduated', count: students.filter((s) => s.status === 'graduated').length, color: 'bg-primary' },
            ].map((item) => (
              <div key={item.label} className={`${item.color} rounded-xl p-4 text-center text-white`}>
                <p className="text-3xl font-bold">{item.count}</p>
                <p className="text-xs opacity-80 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
