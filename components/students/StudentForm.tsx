'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { Student } from '@/types'

const CLASS_OPTIONS = [
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
]

interface Props {
  student?: Student
}

export function StudentForm({ student }: Props) {
  const router = useRouter()
  const { addStudent, updateStudent } = useStore()
  const { toasts, addToast, dismiss } = useToast()
  const isEdit = !!student

  const [form, setForm] = useState({
    name: student?.name ?? '',
    phone: student?.phone ?? '',
    address: student?.address ?? '',
    class: student?.class ?? '',
    monthlyFee: student?.monthlyFee ?? '',
    subject: student?.subject.join(', ') ?? '',
    enrollDate: student?.enrollDate ?? new Date().toISOString().split('T')[0],
    status: student?.status ?? 'active',
    guardianName: student?.guardianName ?? '',
    guardianPhone: student?.guardianPhone ?? '',
    notes: student?.notes ?? '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [submitting, setSubmitting] = useState(false)

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const errs: Partial<typeof form> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (!form.class) errs.class = 'Please select a class'
    if (!form.monthlyFee) errs.monthlyFee = 'Monthly fee is required'
    if (!form.guardianName.trim()) errs.guardianName = 'Guardian name is required'
    if (!form.guardianPhone.trim()) errs.guardianPhone = 'Guardian phone is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    const data = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      class: form.class,
      monthlyFee: Number(form.monthlyFee),
      subject: form.subject.split(',').map((s) => s.trim()).filter(Boolean),
      enrollDate: form.enrollDate,
      status: form.status as Student['status'],
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      notes: form.notes.trim() || undefined,
    }

    try {
      if (isEdit && student) {
        await updateStudent(student.id, data)
        addToast('Student updated successfully ✓')
        setTimeout(() => router.push(`/students/${student.id}`), 1200)
      } else {
        const id = await addStudent(data)
        addToast('Student added successfully ✓')
        setTimeout(() => router.push(`/students/${id}`), 1200)
      }
    } catch {
      addToast('Failed to save student', 'error')
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={isEdit && student ? `/students/${student.id}` : '/students'}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {/* Personal Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={`form-input ${errors.name ? 'border-danger' : ''}`}
                placeholder="Full Name"
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className={`form-input ${errors.phone ? 'border-danger' : ''}`}
                placeholder="Phone number"
              />
              {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="form-label">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="form-input"
                placeholder="Home address"
              />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Class *</label>
              <select
                value={form.class}
                onChange={(e) => set('class', e.target.value)}
                className={`form-input ${errors.class ? 'border-danger' : ''}`}
              >
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.class && <p className="text-danger text-xs mt-1">{errors.class}</p>}
            </div>
            <div>
              <label className="form-label">Monthly Fee *</label>
              <input
                type="number"
                value={form.monthlyFee}
                onChange={(e) => set('monthlyFee', e.target.value)}
                className={`form-input ${errors.monthlyFee ? 'border-danger' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.monthlyFee && <p className="text-danger text-xs mt-1">{errors.monthlyFee}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Subjects</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                className="form-input"
                placeholder="Math, Science, English (comma-separated)"
              />
            </div>
            <div>
              <label className="form-label">Enroll Date *</label>
              <input
                type="date"
                value={form.enrollDate}
                onChange={(e) => set('enrollDate', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guardian Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Guardian Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Guardian Name *</label>
              <input
                type="text"
                value={form.guardianName}
                onChange={(e) => set('guardianName', e.target.value)}
                className={`form-input ${errors.guardianName ? 'border-danger' : ''}`}
                placeholder="Guardian's full name"
              />
              {errors.guardianName && <p className="text-danger text-xs mt-1">{errors.guardianName}</p>}
            </div>
            <div>
              <label className="form-label">Guardian Phone *</label>
              <input
                type="tel"
                value={form.guardianPhone}
                onChange={(e) => set('guardianPhone', e.target.value)}
                className={`form-input ${errors.guardianPhone ? 'border-danger' : ''}`}
                placeholder="Guardian's phone"
              />
              {errors.guardianPhone && <p className="text-danger text-xs mt-1">{errors.guardianPhone}</p>}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <label className="form-label">Additional Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="form-input resize-none"
            rows={3}
            placeholder="Any additional information..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Save Student'}
          </button>
          <Link
            href={isEdit && student ? `/students/${student.id}` : '/students'}
            className="btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
