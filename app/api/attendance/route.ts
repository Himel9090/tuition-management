import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const studentId = searchParams.get('studentId')

  const records = await prisma.attendance.findMany({
    where: {
      ...(date ? { date } : {}),
      ...(studentId ? { studentId } : {}),
    },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(records)
}

export async function POST(req: Request) {
  const { records } = await req.json() as { records: Array<{ studentId: string; studentName: string; date: string; status: string }> }

  const upserted = await Promise.all(
    records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date: r.date } },
        update: { status: r.status, studentName: r.studentName },
        create: { id: generateId('ATT'), ...r },
      })
    )
  )
  return NextResponse.json(upserted, { status: 201 })
}
