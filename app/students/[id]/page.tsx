import { StudentDetailView } from '@/components/students/StudentDetailView'

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  return <StudentDetailView id={params.id} />
}
