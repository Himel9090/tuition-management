'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { todayISO } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

type StatusOption = Exclude<AttendanceStatus, 'holiday'>

const statusOptions: { value: StatusOption; label: string; icon: typeof CheckCircle2; color: string; bg: string }[] = [
  { value: 'present', label: 'Present', icon: CheckCircle2, color: 'text-success', bg: 'bg-success-50 border-success-100' },
  { value: 'absent', label: 'Absent', icon: XCircle, color: 'text-danger', bg: 'bg-danger-50 border-danger-100' },
  { value: 'late', label: 'Late', icon: Clock, color: 'text-warning', bg: 'bg-warning-50 border-warning-100' },
]

export function AttendanceMarker() {
  const router = useRouter()
  const { students, getAttendanceByDate, addAttendanceBatch } = useStore()
  const { toasts, addToast, dismiss } = useToast()

  const [date, setDate] = useState(todayISO())
  const [subject, setSubject] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeStudents = students.filter((s) => s.status === 'active')
  const existingForDate = getAttendanceByDate(date)

  const [statuses, setStatuses] = useState<Record<string, StatusOption>>(() => {
    const init: Record<string, StatusOption> = {}
    activeStudents.forEach((s) => { init[s.id] = 'present' })
    return init
  })

  function handleDateChange(newDate: string) {
    setDate(newDate)
    const existing = getAttendanceByDate(newDate)
    const updated: Record<string, StatusOption> = {}
    activeStudents.forEach((s) => {
      const found = existing.find((a) => a.studentId === s.id)
      updated[s.id] = (found?.status as StatusOption) ?? 'present'
    })
    setStatuses(updated)
  }

  function setStatus(studentId: string, status: StatusOption) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }))
  }

  function markAll(status: StatusOption) {
    const updated: Record<string, StatusOption> = {}
    activeStudents.forEach((s) => { updated[s.id] = status })
    setStatuses(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const records = activeStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      date,
      status: statuses[s.id] ?? 'present',
    }))
    try {
      await addAttendanceBatch(records)
      addToast(`Attendance for ${date} saved ✓`)
      setTimeout(() => router.push('/attendance'), 1200)
    } catch {
      addToast('Failed to save attendance', 'error')
      setSubmitting(false)
    }
  }

  const presentCount = Object.values(statuses).filter((s) => s === 'present').length
  const absentCount = Object.values(statuses).filter((s) => s === 'absent').length
  const lateCount = Object.values(statuses).filter((s) => s === 'late').length

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/attendance" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Take Attendance</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {/* Date + subject */}
        <div className="card flex flex-wrap items-end gap-4">
          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="form-input w-44"
            />
          </div>
          <div>
            <label className="form-label">Subject (optional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input w-44"
              placeholder="e.g. Math"
            />
          </div>
          {existingForDate.length > 0 && (
            <div className="text-xs text-warning bg-warning-50 border border-warning-100 rounded-lg px-3 py-2">
              Records already exist for this date — submitting will update them
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Mark all:</span>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => markAll(opt.value)}
              className={`px-3 py-1 rounded-lg border text-xs font-medium ${opt.bg} ${opt.color} transition-all hover:opacity-80`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Student list */}
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Students ({activeStudents.length})
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="text-success">✓ {presentCount}</span>
              <span className="text-danger">✗ {absentCount}</span>
              <span className="text-warning">⏱ {lateCount}</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {activeStudents.map((student) => {
              const current = statuses[student.id] ?? 'present'
              return (
                <div key={student.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-400">{student.class}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {statusOptions.map((opt) => {
                      const Icon = opt.icon
                      const active = current === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setStatus(student.id, opt.value)}
                          title={opt.label}
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                            active
                              ? `${opt.bg} ${opt.color} shadow-sm`
                              : 'border-gray-200 text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary bar */}
        {activeStudents.length > 0 && (
          <div className="card bg-gray-50">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Summary:</span>
              <span className="text-success font-medium">{presentCount} present</span>
              <span className="text-danger font-medium">{absentCount} absent</span>
              <span className="text-warning font-medium">{lateCount} late</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting || activeStudents.length === 0} className="btn-primary disabled:opacity-60">
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
          <Link href="/attendance" className="btn-secondary">Cancel</Link>
        </div>
      </form>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
