import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET() {
  const students = await prisma.student.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(
    students.map((s: typeof students[number]) => {
      const { subjects, ...rest } = s
      return { ...rest, subject: JSON.parse(subjects) }
    })
  )
}

export async function POST(req: Request) {
  const data = await req.json()
  const id = generateId('STD')
  const student = await prisma.student.create({
    data: {
      id,
      name: data.name,
      nameBangla: data.nameBangla,
      phone: data.phone,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      address: data.address,
      class: data.class,
      subjects: JSON.stringify(data.subject ?? []),
      monthlyFee: data.monthlyFee,
      enrollDate: data.enrollDate,
      status: data.status ?? 'active',
      notes: data.notes ?? null,
    },
  })
  const { subjects, ...rest } = student
  return NextResponse.json({ ...rest, subject: JSON.parse(subjects) }, { status: 201 })
}
