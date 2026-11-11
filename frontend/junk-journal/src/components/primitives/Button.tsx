import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Loader2, Trash2 } from 'lucide-react'
import { cx } from '../utils/cx'
import s from './primitives.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: one per view. secondary: default for toolbars. destructive: always has an icon. */
  variant?: ButtonVariant
  icon?: LucideIcon
  fullWidth?: boolean
  loading?: boolean
  ref?: Ref<HTMLButtonElement>
  children: ReactNode
}

/** Pill button (components.md §1.1). */
export function Button({
  variant = 'secondary',
  icon,
  fullWidth,
  loading,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const Icon = loading ? Loader2 : (icon ?? (variant === 'destructive' ? Trash2 : undefined))
  return (
    <button
      type={type}
      className={cx(s.button, s[variant], fullWidth && s.full, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {Icon && <Icon className={cx(s.buttonIcon, loading && s.spin)} size={18} aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
