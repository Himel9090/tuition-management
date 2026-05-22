import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateEn(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const MONTHS_BANGLA = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

// alias for clarity
export const MONTHS = MONTHS_BANGLA

export function getMonthName(month: string | number): string {
  const index = typeof month === 'string' ? parseInt(month) - 1 : month - 1
  return MONTHS[index] ?? ''
}

export function generateId(prefix = ''): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return prefix ? `${prefix}${ts}${rand}` : `${ts}${rand}`
}

export function generateReceiptNumber(): string {
  const now = new Date()
  const yy = now.getFullYear().toString().slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const seq = Math.floor(Math.random() * 9000 + 1000)
  return `RCP${yy}${mm}${seq}`
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function currentMonth(): string {
  return String(new Date().getMonth() + 1).padStart(2, '0')
}

export function currentYear(): number {
  return new Date().getFullYear()
}
