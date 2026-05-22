'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Student, Payment, Attendance } from '@/types'
// utils used only in API routes now

interface StoreContextValue {
  students: Student[]
  payments: Payment[]
  attendance: Attendance[]
  loading: boolean

  // Students
  addStudent: (data: Omit<Student, 'id'>) => Promise<string>
  updateStudent: (id: string, data: Partial<Omit<Student, 'id'>>) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  getStudent: (id: string) => Student | undefined

  // Payments
  addPayment: (data: Omit<Payment, 'id' | 'receiptNumber'>) => Promise<string>
  updatePayment: (id: string, data: Partial<Omit<Payment, 'id'>>) => Promise<void>
  getStudentPayments: (studentId: string) => Payment[]

  // Attendance
  addAttendanceBatch: (records: Omit<Attendance, 'id'>[]) => Promise<void>
  getAttendanceByDate: (date: string) => Attendance[]
  getStudentAttendance: (studentId: string) => Attendance[]
  getAttendanceDates: () => string[]
}

const StoreContext = createContext<StoreContextValue | null>(null)

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  // Seed then load all data on mount
  useEffect(() => {
    async function init() {
      try {
        await fetch('/api/seed', { method: 'POST' })
        const [s, p, a] = await Promise.all([
          apiFetch('/api/students'),
          apiFetch('/api/payments'),
          apiFetch('/api/attendance'),
        ])
        setStudents(s)
        setPayments(p)
        setAttendance(a)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Students ──────────────────────────────────────────
  const addStudent = useCallback(async (data: Omit<Student, 'id'>): Promise<string> => {
    const student: Student = await apiFetch('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setStudents((prev) => [...prev, student])
    return student.id
  }, [])

  const updateStudent = useCallback(async (id: string, data: Partial<Omit<Student, 'id'>>) => {
    const updated: Student = await apiFetch(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)))
  }, [])

  const deleteStudent = useCallback(async (id: string) => {
    await apiFetch(`/api/students/${id}`, { method: 'DELETE' })
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setPayments((prev) => prev.filter((p) => p.studentId !== id))
    setAttendance((prev) => prev.filter((a) => a.studentId !== id))
  }, [])

  const getStudent = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students]
  )

  // ── Payments ─────────────────────────────────────────
  const addPayment = useCallback(async (data: Omit<Payment, 'id' | 'receiptNumber'>): Promise<string> => {
    const payment: Payment = await apiFetch('/api/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setPayments((prev) => [...prev, payment])
    return payment.id
  }, [])

  const updatePayment = useCallback(async (id: string, data: Partial<Omit<Payment, 'id'>>) => {
    const updated: Payment = await apiFetch(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const getStudentPayments = useCallback(
    (studentId: string) => payments.filter((p) => p.studentId === studentId),
    [payments]
  )

  // ── Attendance ────────────────────────────────────────
  const addAttendanceBatch = useCallback(async (records: Omit<Attendance, 'id'>[]) => {
    const upserted: Attendance[] = await apiFetch('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({ records }),
    })
    setAttendance((prev) => {
      const updated = [...prev]
      for (const rec of upserted) {
        const idx = updated.findIndex(
          (a) => a.studentId === rec.studentId && a.date === rec.date
        )
        if (idx >= 0) updated[idx] = rec
        else updated.push(rec)
      }
      return updated
    })
  }, [])

  const getAttendanceByDate = useCallback(
    (date: string) => attendance.filter((a) => a.date === date),
    [attendance]
  )

  const getStudentAttendance = useCallback(
    (studentId: string) =>
      attendance
        .filter((a) => a.studentId === studentId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance]
  )

  const getAttendanceDates = useCallback((): string[] => {
    return Array.from(new Set(attendance.map((a) => a.date))).sort((a, b) =>
      b.localeCompare(a)
    )
  }, [attendance])

  return (
    <StoreContext.Provider
      value={{
        students, payments, attendance, loading,
        addStudent, updateStudent, deleteStudent, getStudent,
        addPayment, updatePayment, getStudentPayments,
        addAttendanceBatch, getAttendanceByDate, getStudentAttendance, getAttendanceDates,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
