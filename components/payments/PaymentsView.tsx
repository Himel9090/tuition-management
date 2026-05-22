'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Download } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDateEn, MONTHS } from '@/lib/utils'
import type { PaymentStatus, PaymentMethod } from '@/types'

const statusConfig: Record<PaymentStatus, { label: string; variant: 'success' | 'danger' | 'warning' }> = {
  paid: { label: 'Paid', variant: 'success' },
  unpaid: { label: 'Unpaid', variant: 'danger' },
  partial: { label: 'Partial', variant: 'warning' },
}
const methodLabel: Record<PaymentMethod, string> = {
  cash: 'Cash', bkash: 'bKash', nagad: 'Nagad', bank: 'Bank Transfer',
}

export function PaymentsView() {
  const { payments } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

  const filtered = useMemo(() => {
    return payments
      .filter((p) => {
        const matchSearch = !search || p.studentName.toLowerCase().includes(search.toLowerCase())
        const matchStatus = !statusFilter || p.status === statusFilter
        const matchMonth = !monthFilter || p.month === monthFilter
        return matchSearch && matchStatus && matchMonth
      })
      .sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`))
  }, [payments, search, statusFilter, monthFilter])

  const totalPaid = filtered.reduce((s, p) => s + p.paidAmount, 0)
  const totalDue = filtered.reduce((s, p) => s + p.dueAmount, 0)

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} records`}
        action={
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link href="/payments/new" className="btn-primary text-sm">
              <Plus className="w-4 h-4" />
              Record Payment
            </Link>
          </div>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="card bg-success-50 border-success-100">
          <p className="text-xs text-success-700 mb-1">Collected</p>
          <p className="text-2xl font-bold text-success-700">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="card bg-danger-50 border-danger-100">
          <p className="text-xs text-danger-700 mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-danger-700">{formatCurrency(totalDue)}</p>
        </div>
        <div className="card bg-primary-50 border-primary-100">
          <p className="text-xs text-primary-600 mb-1">Total Records</p>
          <p className="text-2xl font-bold text-primary">{filtered.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name..."
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input sm:w-40 bg-gray-50">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="form-input sm:w-36 bg-gray-50">
          <option value="">All Months</option>
          {MONTHS.map((m, i) => (
            <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header">Receipt</th>
                <th className="table-header">Student</th>
                <th className="table-header">Month/Year</th>
                <th className="table-header">Total Fee</th>
                <th className="table-header">Paid</th>
                <th className="table-header">Due</th>
                <th className="table-header">Method</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No records found</td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cfg = statusConfig[p.status]
                  return (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell text-gray-400 text-xs">{p.receiptNumber ?? '—'}</td>
                      <td className="table-cell font-medium text-gray-900">{p.studentName}</td>
                      <td className="table-cell text-gray-500">
                        {MONTHS[parseInt(p.month) - 1]} {p.year}
                      </td>
                      <td className="table-cell font-semibold">{formatCurrency(p.amount)}</td>
                      <td className="table-cell text-success font-semibold">{formatCurrency(p.paidAmount)}</td>
                      <td className="table-cell text-danger font-semibold">{p.dueAmount > 0 ? formatCurrency(p.dueAmount) : '—'}</td>
                      <td className="table-cell text-gray-500">{p.method ? methodLabel[p.method] : '—'}</td>
                      <td className="table-cell"><Badge variant={cfg.variant}>{cfg.label}</Badge></td>
                      <td className="table-cell text-gray-400 text-xs whitespace-nowrap">
                        {p.paidDate ? formatDateEn(p.paidDate) : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
