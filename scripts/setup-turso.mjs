import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url || !url.startsWith('libsql://')) {
  console.error('Set DATABASE_URL=libsql://... and DATABASE_AUTH_TOKEN=...')
  process.exit(1)
}

const client = createClient({ url, authToken })

const statements = [
  `CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameBangla" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "class" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "monthlyFee" INTEGER NOT NULL,
    "enrollDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "dueAmount" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT,
    "paidDate" TEXT,
    "dueDate" TEXT NOT NULL,
    "receiptNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_studentId_date_key" ON "Attendance"("studentId", "date")`,
]

for (const sql of statements) {
  await client.execute(sql)
  const name = sql.match(/"(\w+)"/)?.[1] ?? 'index'
  console.log(`✓ ${name}`)
}

console.log('\nTurso schema ready.')
await client.close()
