import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'info' | 'offline' | 'error'

export interface ToastOptions {
  kind?: ToastKind
  message: string
  action?: { label: string; onClick: () => void }
  /** ms before auto-dismiss. Defaults to 5000; errors and offline never auto-dismiss. */
  duration?: number
}

export interface ToastApi {
  show: (toast: ToastOptions) => number
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

/** Show toasts from anywhere inside <ToastProvider>. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
