import { PaymentForm } from '@/components/payments/PaymentForm'
import { Suspense } from 'react'

export default function NewPaymentPage() {
  return (
    <Suspense>
      <PaymentForm />
    </Suspense>
  )
}
