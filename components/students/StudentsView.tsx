'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Phone, BookOpen, Search, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import type { StudentStatus } from '@/types'

const statusConfig: Record<StudentStatus, { label: string; variant: 'success' | 'danger' | 'gray' }> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'danger' },
  graduated: { label: 'Graduated', variant: 'gray' },
}

export function StudentsView() {
  const { students } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [classFilter, setClassFilter] = useState('')

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.nameBangla ?? '').includes(q) ||
        s.phone.includes(q)
      const matchStatus = !statusFilter || s.status === statusFilter
      const matchClass = !classFilter || s.class === classFilter
      return matchSearch && matchStatus && matchClass
    })
  }, [students, search, statusFilter, classFilter])

  const activeCount = students.filter((s) => s.status === 'active').length
  const classes = Array.from(new Set(students.map((s) => s.class))).sort()

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} total — ${activeCount} active`}
        action={
          <Link href="/students/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Student
          </Link>
        }
      />

      {/* Filters */}
      <div className="card mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input sm:w-40 bg-gray-50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
        </select>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="form-input sm:w-40 bg-gray-50"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-12 h-12 text-gray-200 mb-3" />
          <p className="text-gray-400">No students found</p>
          {search && (
            <button onClick={() => setSearch('')} className="text-primary text-sm mt-2 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student) => {
            const cfg = statusConfig[student.status]
            return (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="card hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={student.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{student.name}</p>
                      </div>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-medium">{student.class}</span>
                    <span className="text-gray-300">|</span>
                    <span className="truncate text-gray-500">{student.subject.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Monthly Fee</span>
                  <span className="font-semibold text-primary">{formatCurrency(student.monthlyFee)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
