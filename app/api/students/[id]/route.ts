import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

function toStudent(s: { subjects: string; [key: string]: unknown }) {
  const { subjects, ...rest } = s
  return { ...rest, subject: JSON.parse(subjects) }
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(toStudent(student))
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params
  const data = await req.json()
  const updated = await prisma.student.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.nameBangla !== undefined && { nameBangla: data.nameBangla }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.guardianName !== undefined && { guardianName: data.guardianName }),
      ...(data.guardianPhone !== undefined && { guardianPhone: data.guardianPhone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.class !== undefined && { class: data.class }),
      ...(data.subject !== undefined && { subjects: JSON.stringify(data.subject) }),
      ...(data.monthlyFee !== undefined && { monthlyFee: data.monthlyFee }),
      ...(data.enrollDate !== undefined && { enrollDate: data.enrollDate }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  })
  return NextResponse.json(toStudent(updated))
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  await prisma.student.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
