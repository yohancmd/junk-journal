import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, WifiOff, X } from 'lucide-react'
import { cx } from '../utils/cx'
import { ToastContext } from './toastContext'
import type { ToastKind, ToastOptions } from './toastContext'
import s from './feedback.module.css'

const ICONS = { success: CircleCheck, info: Info, offline: WifiOff, error: CircleAlert }

export interface ToastProps {
  kind?: ToastKind
  message: string
  action?: { label: string; onClick: () => void }
  onClose?: () => void
}

/** A single toast (components.md §2.1). Usually shown via useToast(). */
export function Toast({ kind = 'info', message, action, onClose }: ToastProps) {
  const Icon = ICONS[kind]
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={cx(s.toast, kind === 'success' && s.toastSuccess, kind === 'error' && s.toastError)}
    >
      <Icon className={s.toastIcon} size={22} aria-hidden />
      <p>{message}</p>
      {action && (
        <button type="button" className={s.toastAction} onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onClose && (
        <button type="button" className={s.toastClose} aria-label="Dismiss" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>
      )}
    </div>
  )
}

interface ActiveToast extends ToastOptions {
  id: number
}

/** Wrap the app once; renders the bottom-centre toast stack. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (toast: ToastOptions) => {
      const id = nextId.current++
      setToasts((list) => [...list, { ...toast, id }])
      const sticky = toast.kind === 'error' || toast.kind === 'offline'
      if (!sticky) window.setTimeout(() => dismiss(id), toast.duration ?? 5000)
      return id
    },
    [dismiss],
  )

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={s.toastRegion} aria-live="polite">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            kind={t.kind}
            message={t.message}
            action={
              t.action && {
                label: t.action.label,
                onClick: () => {
                  t.action?.onClick()
                  dismiss(t.id)
                },
              }
            }
            onClose={() => dismiss(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
