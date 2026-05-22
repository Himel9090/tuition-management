'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { MONTHS, currentMonth, currentYear, todayISO, formatCurrency } from '@/lib/utils'
import type { PaymentStatus, PaymentMethod } from '@/types'

export function PaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { students, addPayment, getStudentPayments } = useStore()
  const { toasts, addToast, dismiss } = useToast()

  const preselectedId = searchParams.get('studentId') ?? ''

  const [form, setForm] = useState({
    studentId: preselectedId,
    month: currentMonth(),
    year: String(currentYear()),
    amount: '',
    paidAmount: '',
    method: 'cash' as PaymentMethod,
    paidDate: todayISO(),
    notes: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const activeStudents = students.filter((s) => s.status === 'active')

  useEffect(() => {
    if (form.studentId) {
      const student = students.find((s) => s.id === form.studentId)
      if (student) {
        setForm((prev) => ({ ...prev, amount: String(student.monthlyFee) }))
      }
    }
  }, [form.studentId, students])

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const paidNum = parseFloat(form.paidAmount) || 0
  const totalNum = parseFloat(form.amount) || 0
  const dueNum = Math.max(0, totalNum - paidNum)
  const autoStatus: PaymentStatus =
    paidNum === 0 ? 'unpaid' : paidNum >= totalNum ? 'paid' : 'partial'

  const existingPayments = form.studentId
    ? getStudentPayments(form.studentId).filter(
        (p) => p.month === form.month && p.year === Number(form.year)
      )
    : []
  const hasExisting = existingPayments.length > 0

  function validate() {
    const errs: Partial<Record<keyof typeof form, string>> = {}
    if (!form.studentId) errs.studentId = 'Please select a student'
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Fee amount is required'
    if (!form.paidAmount) errs.paidAmount = 'Paid amount is required'
    if (!form.paidDate) errs.paidDate = 'Date is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    const student = students.find((s) => s.id === form.studentId)!

    try {
      await addPayment({
        studentId: form.studentId,
        studentName: student.name,
        amount: totalNum,
        paidAmount: paidNum,
        dueAmount: dueNum,
        month: form.month,
        year: Number(form.year),
        status: autoStatus,
        method: paidNum > 0 ? form.method : undefined,
        paidDate: paidNum > 0 ? form.paidDate : undefined,
        dueDate: `${form.year}-${form.month}-10`,
      })
      addToast('Payment saved successfully ✓')
      setTimeout(() => router.push('/payments'), 1200)
    } catch {
      addToast('Failed to save payment', 'error')
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/payments" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Record Payment</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Student & Month</h2>

          <div>
            <label className="form-label">Student *</label>
            <select
              value={form.studentId}
              onChange={(e) => set('studentId', e.target.value)}
              className={`form-input ${errors.studentId ? 'border-danger' : ''}`}
            >
              <option value="">Select student</option>
              {activeStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.class} — {formatCurrency(s.monthlyFee)}
                </option>
              ))}
            </select>
            {errors.studentId && <p className="text-danger text-xs mt-1">{errors.studentId}</p>}
            {hasExisting && (
              <p className="text-warning text-xs mt-1 flex items-center gap-1">
                ⚠ A payment record already exists for this month ({existingPayments[0].status === 'paid' ? 'Paid' : 'Unpaid'})
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Month *</label>
              <select value={form.month} onChange={(e) => set('month', e.target.value)} className="form-input">
                {MONTHS.map((m, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                className="form-input"
                min="2020" max="2035"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Payment Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Total Fee *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                className={`form-input ${errors.amount ? 'border-danger' : ''}`}
                placeholder="0" min="0"
              />
              {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="form-label">Amount Paid *</label>
              <input
                type="number"
                value={form.paidAmount}
                onChange={(e) => set('paidAmount', e.target.value)}
                className={`form-input ${errors.paidAmount ? 'border-danger' : ''}`}
                placeholder="0" min="0"
              />
              {errors.paidAmount && <p className="text-danger text-xs mt-1">{errors.paidAmount}</p>}
            </div>
          </div>

          {/* Live summary */}
          {form.amount && form.paidAmount && (
            <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="text-xs text-gray-400">Total Fee</p>
                <p className="font-bold text-gray-800">{formatCurrency(totalNum)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Paid</p>
                <p className="font-bold text-success">{formatCurrency(paidNum)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Due</p>
                <p className="font-bold text-danger">{formatCurrency(dueNum)}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Payment Method</label>
              <select value={form.method} onChange={(e) => set('method', e.target.value as PaymentMethod)} className="form-input">
                <option value="cash">Cash</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                value={form.paidDate}
                onChange={(e) => set('paidDate', e.target.value)}
                className={`form-input ${errors.paidDate ? 'border-danger' : ''}`}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="form-input resize-none"
              rows={2}
              placeholder="Additional information..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            <Save className="w-4 h-4" />
            Save Payment
          </button>
          <Link href="/payments" className="btn-secondary">Cancel</Link>
        </div>
      </form>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
