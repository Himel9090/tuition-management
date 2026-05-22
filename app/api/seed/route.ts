import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mockStudents, mockPayments, mockAttendance } from '@/lib/mock-data'

export async function DELETE() {
  await prisma.attendance.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.student.deleteMany()
  return NextResponse.json({ message: 'Cleared' })
}

export async function POST() {
  const existing = await prisma.student.count()
  if (existing > 0) return NextResponse.json({ message: 'Already seeded' })

  await prisma.student.createMany({
    data: mockStudents.map((s) => ({
      id: s.id,
      name: s.name,
      nameBangla: s.nameBangla ?? '',
      phone: s.phone,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      address: s.address ?? '',
      class: s.class,
      subjects: JSON.stringify(s.subject),
      monthlyFee: s.monthlyFee,
      enrollDate: s.enrollDate,
      status: s.status,
      notes: s.notes ?? null,
    })),
  })

  await prisma.payment.createMany({
    data: mockPayments.map((p) => ({
      id: p.id,
      studentId: p.studentId,
      studentName: p.studentName,
      amount: p.amount,
      paidAmount: p.paidAmount,
      dueAmount: p.dueAmount,
      month: p.month,
      year: p.year,
      status: p.status,
      method: p.method ?? null,
      paidDate: p.paidDate ?? null,
      dueDate: p.dueDate,
      receiptNumber: p.receiptNumber ?? null,
    })),
  })

  await prisma.attendance.createMany({
    data: mockAttendance.map((a) => ({
      id: a.id,
      studentId: a.studentId,
      studentName: a.studentName,
      date: a.date,
      status: a.status,
    })),
  })

  return NextResponse.json({ message: 'Seeded successfully' })
}
