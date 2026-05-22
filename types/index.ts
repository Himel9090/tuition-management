export type UserRole = 'admin' | 'teacher'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  address?: string
  joinDate: string
  isActive: boolean
}

export type StudentStatus = 'active' | 'inactive' | 'graduated'

export interface Student {
  id: string
  name: string
  nameBangla?: string
  phone: string
  guardianName: string
  guardianPhone: string
  address: string
  class: string
  subject: string[]
  monthlyFee: number
  enrollDate: string
  status: StudentStatus
  avatar?: string
  notes?: string
}

export type PaymentStatus = 'paid' | 'unpaid' | 'partial'
export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank'

export interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  dueAmount: number
  paidAmount: number
  month: string
  year: number
  status: PaymentStatus
  method?: PaymentMethod
  paidDate?: string
  dueDate: string
  notes?: string
  receiptNumber?: string
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday'

export interface Attendance {
  id: string
  studentId: string
  studentName: string
  date: string
  status: AttendanceStatus
  subject?: string
  notes?: string
  markedBy?: string
}

export interface AttendanceSummary {
  studentId: string
  studentName: string
  month: string
  year: number
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  percentage: number
}

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalCollection: number
  pendingPayments: number
  todayAttendance: number
  monthlyTarget: number
}

export interface NavItem {
  label: string
  labelBangla: string
  href: string
  icon: string
}
