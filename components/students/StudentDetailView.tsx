'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, MapPin, BookOpen, Calendar,
  CreditCard, CalendarCheck, Edit, Trash2, AlertTriangle,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDateEn, MONTHS } from '@/lib/utils'
import type { StudentStatus, PaymentStatus, AttendanceStatus } from '@/types'

const statusLabel: Record<StudentStatus, string> = { active: 'Active', inactive: 'Inactive', graduated: 'Graduated' }
const statusVariant: Record<StudentStatus, 'success' | 'danger' | 'gray'> = { active: 'success', inactive: 'danger', graduated: 'gray' }
const payLabel: Record<PaymentStatus, string> = { paid: 'Paid', unpaid: 'Unpaid', partial: 'Partial' }
const payVariant: Record<PaymentStatus, 'success' | 'danger' | 'warning'> = { paid: 'success', unpaid: 'danger', partial: 'warning' }
const attLabel: Record<AttendanceStatus, string> = { present: 'Present', absent: 'Absent', late: 'Late', holiday: 'Holiday' }
const attVariant: Record<AttendanceStatus, 'success' | 'danger' | 'warning' | 'gray'> = { present: 'success', absent: 'danger', late: 'warning', holiday: 'gray' }

export function StudentDetailView({ id }: { id: string }) {
  const router = useRouter()
  const { getStudent, getStudentPayments, getStudentAttendance, deleteStudent } = useStore()
  const { toasts, addToast, dismiss } = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const student = getStudent(id)
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-warning mb-3" />
        <p className="text-lg font-semibold text-gray-900">Student not found</p>
        <Link href="/students" className="btn-primary mt-4">Back to List</Link>
      </div>
    )
  }

  const studentPayments = getStudentPayments(id).sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`))
  const studentAttendance = getStudentAttendance(id)
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length
  const attendanceRate = studentAttendance.length ? Math.round((presentCount / studentAttendance.length) * 100) : 0
  const totalPaid = studentPayments.reduce((s, p) => s + p.paidAmount, 0)
  const totalDue = studentPayments.reduce((s, p) => s + p.dueAmount, 0)

  async function handleDelete() {
    try {
      await deleteStudent(id)
      addToast('Student deleted', 'error')
      setTimeout(() => router.push('/students'), 1200)
    } catch {
      addToast('Failed to delete student', 'error')
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/students" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-xs text-gray-400">{student.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/students/${id}/edit`} className="btn-secondary text-sm">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
          {confirmDelete ? (
            <div className="flex items-center gap-2 bg-danger-50 border border-danger-100 rounded-lg px-3 py-1.5">
              <span className="text-xs text-danger font-medium">Confirm?</span>
              <button onClick={handleDelete} className="text-xs font-semibold text-danger hover:text-danger-700">Yes</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700">No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="btn-danger text-sm">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="card">
          <div className="flex flex-col items-center text-center mb-5">
            <Avatar name={student.name} size="lg" className="w-16 h-16 text-xl mb-3" />
            <h2 className="font-bold text-gray-900 text-lg">{student.name}</h2>
            <p className="text-sm text-gray-400 mb-2">{student.id}</p>
            <Badge variant={statusVariant[student.status]}>{statusLabel[student.status]}</Badge>
          </div>

          <div className="space-y-3 text-sm">
            <InfoRow icon={<Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />} label="Phone" value={student.phone} />
            <InfoRow icon={<MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />} label="Address" value={student.address || '—'} />
            <InfoRow
              icon={<BookOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
              label="Class & Subjects"
              value={student.class}
              sub={student.subject.join(', ')}
            />
            <InfoRow icon={<Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />} label="Enrolled" value={formatDateEn(student.enrollDate)} />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Monthly Fee</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(student.monthlyFee)}</p>
          </div>

          {student.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{student.notes}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Guardian */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Guardian Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Name</p>
                <p className="font-medium text-gray-700">{student.guardianName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                <p className="font-medium text-gray-700">{student.guardianPhone}</p>
              </div>
            </div>
          </div>

          {/* Financial summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card text-center bg-success-50 border-success-100">
              <CreditCard className="w-5 h-5 text-success mx-auto mb-1.5" />
              <p className="text-lg font-bold text-success-700">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-success-600">Total Paid</p>
            </div>
            <div className="card text-center bg-danger-50 border-danger-100">
              <CreditCard className="w-5 h-5 text-danger mx-auto mb-1.5" />
              <p className="text-lg font-bold text-danger-700">{formatCurrency(totalDue)}</p>
              <p className="text-xs text-danger-600">Outstanding</p>
            </div>
            <div className="card text-center bg-primary-50 border-primary-100">
              <CalendarCheck className="w-5 h-5 text-primary mx-auto mb-1.5" />
              <p className="text-lg font-bold text-primary">{attendanceRate}%</p>
              <p className="text-xs text-primary-600">Attendance</p>
            </div>
          </div>

          {/* Payment history */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Payment History
              <Link href={`/payments/new?studentId=${id}`} className="text-xs text-primary hover:underline">
                + New Payment
              </Link>
            </h3>
            {studentPayments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No payment records</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="table-header">Month/Year</th>
                      <th className="table-header">Fee</th>
                      <th className="table-header">Paid</th>
                      <th className="table-header">Due</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPayments.map((p) => (
                      <tr key={p.id} className="table-row">
                        <td className="table-cell font-medium">{MONTHS[parseInt(p.month) - 1]} {p.year}</td>
                        <td className="table-cell">{formatCurrency(p.amount)}</td>
                        <td className="table-cell text-success font-medium">{formatCurrency(p.paidAmount)}</td>
                        <td className="table-cell text-danger font-medium">{p.dueAmount > 0 ? formatCurrency(p.dueAmount) : '—'}</td>
                        <td className="table-cell"><Badge variant={payVariant[p.status]}>{payLabel[p.status]}</Badge></td>
                        <td className="table-cell text-gray-400 text-xs">{p.paidDate ? formatDateEn(p.paidDate) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attendance history */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Attendance</h3>
            {studentAttendance.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No records found</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {studentAttendance.slice(0, 12).map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-500">{formatDateEn(a.date)}</span>
                    <Badge variant={attVariant[a.status]}>{attLabel[a.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

function InfoRow({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 text-gray-600">
      {icon}
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="font-medium">{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  )
}
