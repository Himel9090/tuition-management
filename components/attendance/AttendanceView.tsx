'use client'

import Link from 'next/link'
import { ClipboardList, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/lib/store'
import { formatDateEn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

const statusConfig: Record<AttendanceStatus, {
  label: string
  variant: 'success' | 'danger' | 'warning' | 'gray'
  icon: typeof CheckCircle2
  iconClass: string
}> = {
  present: { label: 'Present', variant: 'success', icon: CheckCircle2, iconClass: 'text-success' },
  absent: { label: 'Absent', variant: 'danger', icon: XCircle, iconClass: 'text-danger' },
  late: { label: 'Late', variant: 'warning', icon: Clock, iconClass: 'text-warning' },
  holiday: { label: 'Holiday', variant: 'gray', icon: Calendar, iconClass: 'text-gray-400' },
}

export function AttendanceView() {
  const { getAttendanceDates, getAttendanceByDate, students } = useStore()
  const dates = getAttendanceDates()
  const activeCount = students.filter((s) => s.status === 'active').length

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = getAttendanceByDate(today)
  const presentToday = todayRecords.filter((a) => a.status === 'present').length
  const absentToday = todayRecords.filter((a) => a.status === 'absent').length
  const lateToday = todayRecords.filter((a) => a.status === 'late').length

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Student attendance records"
        action={
          <Link href="/attendance/mark" className="btn-primary">
            <ClipboardList className="w-4 h-4" />
            Take Attendance
          </Link>
        }
      />

      {/* Today's stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="card text-center bg-success-50 border-success-100">
          <p className="text-2xl font-bold text-success">{presentToday}</p>
          <p className="text-xs text-success-700 mt-1">Present</p>
        </div>
        <div className="card text-center bg-danger-50 border-danger-100">
          <p className="text-2xl font-bold text-danger">{absentToday}</p>
          <p className="text-xs text-danger-700 mt-1">Absent</p>
        </div>
        <div className="card text-center bg-warning-50 border-warning-100">
          <p className="text-2xl font-bold text-warning">{lateToday}</p>
          <p className="text-xs text-warning-700 mt-1">Late</p>
        </div>
      </div>

      {/* Records by date */}
      {dates.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="w-12 h-12 text-gray-200 mb-3" />
          <p className="text-gray-400">No attendance records yet</p>
          <Link href="/attendance/mark" className="btn-primary mt-4">Take Attendance</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {dates.map((date) => {
            const records = getAttendanceByDate(date)
            const present = records.filter((r) => r.status === 'present').length
            const rate = activeCount > 0 ? Math.round((present / activeCount) * 100) : 0
            return (
              <div key={date} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDateEn(date)}
                    <span className="text-xs text-gray-400 font-normal">({records.length} students)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{rate}% present</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="table-header">Student</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Subject</th>
                        <th className="table-header">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((att) => {
                        const cfg = statusConfig[att.status]
                        const Icon = cfg.icon
                        return (
                          <tr key={att.id} className="table-row">
                            <td className="table-cell font-medium">{att.studentName}</td>
                            <td className="table-cell">
                              <div className="flex items-center gap-1.5">
                                <Icon className={`w-3.5 h-3.5 ${cfg.iconClass}`} />
                                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                              </div>
                            </td>
                            <td className="table-cell text-gray-400">{att.subject ?? '—'}</td>
                            <td className="table-cell text-gray-400">{att.notes ?? '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
