'use client'

import Link from 'next/link'
import {
  Users, CreditCard, CalendarCheck, TrendingUp,
  AlertCircle, CheckCircle2, Clock, Plus,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDateEn, todayISO, MONTHS, currentMonth, currentYear } from '@/lib/utils'

export function DashboardView() {
  const { students, payments, getAttendanceByDate } = useStore()

  const today = todayISO()
  const cm = currentMonth()
  const cy = currentYear()

  const activeStudents = students.filter((s) => s.status === 'active')
  const thisMonthPayments = payments.filter((p) => p.month === cm && p.year === cy)
  const totalCollection = thisMonthPayments.reduce((s, p) => s + p.paidAmount, 0)
  const totalDue = thisMonthPayments.reduce((s, p) => s + p.dueAmount, 0)
  const monthlyTarget = activeStudents.reduce((s, st) => s + st.monthlyFee, 0)
  const collectionPct = monthlyTarget > 0 ? Math.round((totalCollection / monthlyTarget) * 100) : 0

  const todayAttendance = getAttendanceByDate(today)
  const todayPresent = todayAttendance.filter((a) => a.status === 'present').length

  const recentPayments = [...payments]
    .sort((a, b) => (b.paidDate ?? '').localeCompare(a.paidDate ?? ''))
    .slice(0, 5)

  const unpaidStudents = thisMonthPayments.filter((p) => p.status === 'unpaid' || p.status === 'partial')

  const monthLabel = MONTHS[parseInt(cm) - 1]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`${monthLabel} ${cy} — Overview`} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle={`${activeStudents.length} active`}
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary-50"
        />
        <StatCard
          title="Monthly Collection"
          value={formatCurrency(totalCollection)}
          subtitle={`${collectionPct}% of target`}
          icon={CreditCard}
          iconColor="text-success"
          iconBg="bg-success-50"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(totalDue)}
          subtitle={`${unpaidStudents.length} students`}
          icon={AlertCircle}
          iconColor="text-warning"
          iconBg="bg-warning-50"
        />
        <StatCard
          title="Today's Attendance"
          value={todayAttendance.length > 0 ? `${todayPresent}/${activeStudents.length}` : '—'}
          subtitle={todayAttendance.length > 0 ? "Today's class" : 'Not taken yet'}
          icon={CalendarCheck}
          iconColor="text-primary"
          iconBg="bg-primary-50"
        />
      </div>

      {/* Progress bar */}
      <div className="card mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">{monthLabel} collection progress</span>
          <span className="text-gray-500">
            {formatCurrency(totalCollection)} / {formatCurrency(monthlyTarget)}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(collectionPct, 100)}%`,
              background: collectionPct >= 80 ? '#10B981' : collectionPct >= 50 ? '#F59E0B' : '#EF4444',
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{collectionPct}% complete</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent payments */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Payments</h2>
            <Link href="/payments" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">Student</th>
                  <th className="table-header">Month</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No records found</td></tr>
                ) : (
                  recentPayments.map((p) => (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell font-medium">{p.studentName}</td>
                      <td className="table-cell text-gray-500">{MONTHS[parseInt(p.month) - 1]}</td>
                      <td className="table-cell font-semibold">{formatCurrency(p.amount)}</td>
                      <td className="table-cell">
                        {p.status === 'paid' && <Badge variant="success">Paid</Badge>}
                        {p.status === 'unpaid' && <Badge variant="danger">Unpaid</Badge>}
                        {p.status === 'partial' && <Badge variant="warning">Partial</Badge>}
                      </td>
                      <td className="table-cell text-gray-400 text-xs">
                        {p.paidDate ? formatDateEn(p.paidDate) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's attendance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Today&apos;s Attendance</h2>
            <Link href="/attendance" className="text-xs text-primary hover:underline">View all →</Link>
          </div>

          {todayAttendance.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 mb-3">Attendance not taken yet</p>
              <Link href="/attendance/mark" className="btn-primary text-sm">
                <CalendarCheck className="w-4 h-4" />
                Take Now
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayAttendance.map((att) => (
                <div key={att.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    {att.status === 'present' && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                    {att.status === 'absent' && <AlertCircle className="w-4 h-4 text-danger shrink-0" />}
                    {att.status === 'late' && <Clock className="w-4 h-4 text-warning shrink-0" />}
                    <span className="text-sm text-gray-700">{att.studentName}</span>
                  </div>
                  {att.status === 'present' && <Badge variant="success">Present</Badge>}
                  {att.status === 'absent' && <Badge variant="danger">Absent</Badge>}
                  {att.status === 'late' && <Badge variant="warning">Late</Badge>}
                </div>
              ))}
            </div>
          )}

          {todayAttendance.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Attendance rate</span>
                <span className="font-medium text-gray-700">{todayPresent}/{activeStudents.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${activeStudents.length > 0 ? Math.round((todayPresent / activeStudents.length) * 100) : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { label: 'Add Student', href: '/students/new', icon: Users, color: 'text-primary', bg: 'bg-primary-50' },
          { label: 'Record Payment', href: '/payments/new', icon: CreditCard, color: 'text-success', bg: 'bg-success-50' },
          { label: 'Mark Attendance', href: '/attendance/mark', icon: CalendarCheck, color: 'text-warning', bg: 'bg-warning-50' },
          { label: 'View Reports', href: '/reports', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary-50' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="card flex flex-col items-center justify-center gap-2 py-5 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
