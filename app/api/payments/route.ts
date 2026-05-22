import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateId, generateReceiptNumber } from '@/lib/utils'

export async function GET() {
  const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(payments)
}

export async function POST(req: Request) {
  const data = await req.json()

  const student = await prisma.student.findUnique({ where: { id: data.studentId }, select: { id: true } })
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 422 })

  const id = generateId('PAY')
  const receiptNumber = data.status !== 'unpaid' ? generateReceiptNumber() : null
  const payment = await prisma.payment.create({
    data: {
      id,
      studentId: data.studentId,
      studentName: data.studentName,
      amount: data.amount,
      paidAmount: data.paidAmount,
      dueAmount: data.dueAmount,
      month: data.month,
      year: data.year,
      status: data.status,
      method: data.method ?? null,
      paidDate: data.paidDate ?? null,
      dueDate: data.dueDate,
      receiptNumber,
    },
  })
  return NextResponse.json(payment, { status: 201 })
}
