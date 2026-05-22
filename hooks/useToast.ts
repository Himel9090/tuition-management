'use client'

import { useState, useCallback } from 'react'
import type { ToastMessage, ToastType } from '@/components/ui/Toast'
import { generateId } from '@/lib/utils'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = generateId()
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, dismiss }
}
