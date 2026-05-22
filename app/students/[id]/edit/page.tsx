'use client'

import { useStore } from '@/lib/store'
import { StudentForm } from '@/components/students/StudentForm'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const { getStudent } = useStore()
  const student = getStudent(params.id)

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-warning mb-3" />
        <p className="font-semibold text-gray-900 mb-4">শিক্ষার্থী পাওয়া যায়নি</p>
        <Link href="/students" className="btn-primary">তালিকায় ফিরুন</Link>
      </div>
    )
  }

  return <StudentForm student={student} />
}
