import type { Student, Payment, Attendance } from '@/types'

export const mockStudents: Student[] = [
  {
    id: 'STD001',
    name: 'Arif Hossain',
    nameBangla: '',
    phone: '01811112233',
    guardianName: 'Karim Hossain',
    guardianPhone: '01811112234',
    address: 'House 5, Road 3, Mirpur-10, Dhaka',
    class: 'Class 9',
    subject: ['Math', 'Science', 'English'],
    monthlyFee: 3000,
    enrollDate: '2024-01-15',
    status: 'active',
    notes: 'Excellent student, attends regularly.',
  },
  {
    id: 'STD002',
    name: 'Mitu Akter',
    nameBangla: '',
    phone: '01922334455',
    guardianName: 'Rahim Akter',
    guardianPhone: '01922334456',
    address: 'Flat 3B, House 12, Gulshan-2, Dhaka',
    class: 'Class 10',
    subject: ['Math', 'Physics', 'Chemistry'],
    monthlyFee: 3500,
    enrollDate: '2024-02-01',
    status: 'active',
    notes: 'SSC exam candidate.',
  },
  {
    id: 'STD003',
    name: 'Rahim Uddin',
    nameBangla: '',
    phone: '01733445566',
    guardianName: 'Jamal Uddin',
    guardianPhone: '01733445567',
    address: 'House 23, Sector 7, Uttara, Dhaka',
    class: 'Class 8',
    subject: ['Math', 'Bengali', 'English'],
    monthlyFee: 2500,
    enrollDate: '2024-03-10',
    status: 'active',
  },
  {
    id: 'STD004',
    name: 'Nasrin Sultana',
    nameBangla: '',
    phone: '01844556677',
    guardianName: 'Abdul Karim',
    guardianPhone: '01844556678',
    address: 'House 8, Road 15, Banani, Dhaka',
    class: 'Class 7',
    subject: ['English', 'Math'],
    monthlyFee: 2000,
    enrollDate: '2024-01-20',
    status: 'inactive',
    notes: 'On temporary break.',
  },
  {
    id: 'STD005',
    name: 'Shakib Ahmed',
    nameBangla: '',
    phone: '01955667788',
    guardianName: 'Faruk Ahmed',
    guardianPhone: '01955667789',
    address: 'House 4, Road 8, Dhanmondi, Dhaka',
    class: 'Class 10',
    subject: ['Chemistry', 'Physics', 'Math'],
    monthlyFee: 4000,
    enrollDate: '2024-04-05',
    status: 'active',
    notes: 'Very focused on science subjects.',
  },
  {
    id: 'STD006',
    name: 'Tanvir Hasan',
    nameBangla: '',
    phone: '01766778899',
    guardianName: 'Nazrul Hasan',
    guardianPhone: '01766778800',
    address: 'House 17, Road 5, Mohammadpur, Dhaka',
    class: 'Class 9',
    subject: ['Math', 'English'],
    monthlyFee: 3200,
    enrollDate: '2024-05-01',
    status: 'active',
  },
  {
    id: 'STD007',
    name: 'Sumaiya Khanam',
    nameBangla: '',
    phone: '01677889900',
    guardianName: 'Abdur Rahman',
    guardianPhone: '01677889901',
    address: 'House 6, Road 12, Badda, Dhaka',
    class: 'Class 8',
    subject: ['Math', 'Science'],
    monthlyFee: 2800,
    enrollDate: '2024-06-15',
    status: 'active',
  },
  {
    id: 'STD008',
    name: 'Rafi Islam',
    nameBangla: '',
    phone: '01388990011',
    guardianName: 'Kamal Islam',
    guardianPhone: '01388990012',
    address: 'House 3, Road 2, Khilgaon, Dhaka',
    class: 'Class 6',
    subject: ['Math', 'Bengali', 'English'],
    monthlyFee: 1800,
    enrollDate: '2025-01-08',
    status: 'active',
  },
  {
    id: 'STD009',
    name: 'Nowrin Jahan',
    nameBangla: '',
    phone: '01499001122',
    guardianName: 'Selim Jahan',
    guardianPhone: '01499001123',
    address: 'Flat 5A, House 32, Malibagh, Dhaka',
    class: 'Class 10',
    subject: ['Biology', 'Chemistry'],
    monthlyFee: 3800,
    enrollDate: '2025-02-20',
    status: 'active',
    notes: 'Interested in medical science.',
  },
  {
    id: 'STD010',
    name: 'Saiful Islam',
    nameBangla: '',
    phone: '01500112233',
    guardianName: 'Nurul Islam',
    guardianPhone: '01500112234',
    address: 'House 11, Road 4, Rampura, Dhaka',
    class: 'Class 7',
    subject: ['Math', 'Science'],
    monthlyFee: 2200,
    enrollDate: '2025-03-01',
    status: 'active',
  },
]

// Helper to create payment entries
function pay(
  id: string, studentId: string, studentName: string,
  amount: number, month: string, year: number,
  status: 'paid' | 'unpaid' | 'partial',
  method?: 'cash' | 'bkash' | 'nagad' | 'bank',
  paidDate?: string, paidAmount?: number
): Payment {
  const paid = paidAmount ?? (status === 'paid' ? amount : status === 'partial' ? Math.floor(amount * 0.6) : 0)
  return {
    id,
    studentId,
    studentName,
    amount,
    paidAmount: paid,
    dueAmount: amount - paid,
    month,
    year,
    status,
    method,
    paidDate,
    dueDate: `${year}-${month}-10`,
    receiptNumber: status !== 'unpaid' ? `RCP${year}${month}${id.slice(-3)}` : undefined,
  }
}

export const mockPayments: Payment[] = [
  // March 2026
  pay('PAY001', 'STD001', 'Arif Hossain', 3000, '03', 2026, 'paid', 'bkash', '2026-03-07'),
  pay('PAY002', 'STD002', 'Mitu Akter', 3500, '03', 2026, 'paid', 'nagad', '2026-03-05'),
  pay('PAY003', 'STD003', 'Rahim Uddin', 2500, '03', 2026, 'paid', 'cash', '2026-03-09'),
  pay('PAY004', 'STD005', 'Shakib Ahmed', 4000, '03', 2026, 'paid', 'bkash', '2026-03-04'),
  pay('PAY005', 'STD006', 'Tanvir Hasan', 3200, '03', 2026, 'paid', 'cash', '2026-03-08'),
  pay('PAY006', 'STD007', 'Sumaiya Khanam', 2800, '03', 2026, 'paid', 'nagad', '2026-03-06'),
  pay('PAY007', 'STD008', 'Rafi Islam', 1800, '03', 2026, 'paid', 'cash', '2026-03-10'),
  pay('PAY008', 'STD009', 'Nowrin Jahan', 3800, '03', 2026, 'paid', 'bank', '2026-03-05'),
  pay('PAY009', 'STD010', 'Saiful Islam', 2200, '03', 2026, 'paid', 'bkash', '2026-03-07'),
  // April 2026
  pay('PAY010', 'STD001', 'Arif Hossain', 3000, '04', 2026, 'paid', 'cash', '2026-04-07'),
  pay('PAY011', 'STD002', 'Mitu Akter', 3500, '04', 2026, 'paid', 'bkash', '2026-04-05'),
  pay('PAY012', 'STD003', 'Rahim Uddin', 2500, '04', 2026, 'partial', 'cash', '2026-04-08', 1500),
  pay('PAY013', 'STD005', 'Shakib Ahmed', 4000, '04', 2026, 'paid', 'nagad', '2026-04-03'),
  pay('PAY014', 'STD006', 'Tanvir Hasan', 3200, '04', 2026, 'paid', 'bkash', '2026-04-09'),
  pay('PAY015', 'STD007', 'Sumaiya Khanam', 2800, '04', 2026, 'paid', 'cash', '2026-04-06'),
  pay('PAY016', 'STD008', 'Rafi Islam', 1800, '04', 2026, 'unpaid'),
  pay('PAY017', 'STD009', 'Nowrin Jahan', 3800, '04', 2026, 'paid', 'bank', '2026-04-04'),
  pay('PAY018', 'STD010', 'Saiful Islam', 2200, '04', 2026, 'paid', 'bkash', '2026-04-07'),
  // May 2026
  pay('PAY019', 'STD001', 'Arif Hossain', 3000, '05', 2026, 'paid', 'bkash', '2026-05-05'),
  pay('PAY020', 'STD002', 'Mitu Akter', 3500, '05', 2026, 'unpaid'),
  pay('PAY021', 'STD003', 'Rahim Uddin', 2500, '05', 2026, 'partial', 'cash', '2026-05-08', 1500),
  pay('PAY022', 'STD005', 'Shakib Ahmed', 4000, '05', 2026, 'paid', 'nagad', '2026-05-03'),
  pay('PAY023', 'STD006', 'Tanvir Hasan', 3200, '05', 2026, 'unpaid'),
  pay('PAY024', 'STD007', 'Sumaiya Khanam', 2800, '05', 2026, 'paid', 'cash', '2026-05-07'),
  pay('PAY025', 'STD008', 'Rafi Islam', 1800, '05', 2026, 'unpaid'),
  pay('PAY026', 'STD009', 'Nowrin Jahan', 3800, '05', 2026, 'paid', 'bank', '2026-05-04'),
  pay('PAY027', 'STD010', 'Saiful Islam', 2200, '05', 2026, 'unpaid'),
]

type AttStatus = 'present' | 'absent' | 'late'
function att(
  id: string, studentId: string, studentName: string,
  date: string, status: AttStatus
): Attendance {
  return { id, studentId, studentName, date, status }
}

const activeStudents: [string, string][] = [
  ['STD001', 'Arif Hossain'], ['STD002', 'Mitu Akter'], ['STD003', 'Rahim Uddin'],
  ['STD005', 'Shakib Ahmed'], ['STD006', 'Tanvir Hasan'], ['STD007', 'Sumaiya Khanam'],
  ['STD008', 'Rafi Islam'], ['STD009', 'Nowrin Jahan'], ['STD010', 'Saiful Islam'],
]

// Patterns per date: index → status (P=present, A=absent, L=late)
const datPatterns: Record<string, AttStatus[]> = {
  '2026-05-21': ['present','present','absent','present','late','present','present','absent','present'],
  '2026-05-20': ['present','absent','present','present','present','absent','present','present','late'],
  '2026-05-19': ['present','present','present','late','present','present','absent','present','present'],
  '2026-05-18': ['absent','present','present','present','present','present','present','late','present'],
  '2026-05-15': ['present','present','late','present','absent','present','present','present','present'],
  '2026-05-14': ['present','present','present','present','present','absent','present','present','present'],
  '2026-05-13': ['late','present','present','present','present','present','present','absent','present'],
  '2026-05-12': ['present','absent','present','present','present','present','late','present','present'],
  '2026-05-11': ['present','present','present','absent','present','present','present','present','present'],
  '2026-05-08': ['present','present','absent','present','present','present','present','present','late'],
}

let attIdCounter = 1
export const mockAttendance: Attendance[] = Object.entries(datPatterns).flatMap(([date, statuses]) =>
  activeStudents.map(([studentId, studentName], i) =>
    att(
      `ATT${String(attIdCounter++).padStart(3, '0')}`,
      studentId, studentName, date, statuses[i]
    )
  )
)
