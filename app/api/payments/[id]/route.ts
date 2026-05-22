import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReceiptNumber } from '@/lib/utils'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params
  const data = await req.json()

  const current = await prisma.payment.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const wasUnpaid = current.status === 'unpaid'
  const becomingPaid = data.status && data.status !== 'unpaid'
  const receiptNumber =
    wasUnpaid && becomingPaid ? generateReceiptNumber() : current.receiptNumber

  const updated = await prisma.payment.update({
    where: { id },
    data: {
      ...(data.paidAmount !== undefined && { paidAmount: data.paidAmount }),
      ...(data.dueAmount !== undefined && { dueAmount: data.dueAmount }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.method !== undefined && { method: data.method }),
      ...(data.paidDate !== undefined && { paidDate: data.paidDate }),
      receiptNumber,
    },
  })
  return NextResponse.json(updated)
}
