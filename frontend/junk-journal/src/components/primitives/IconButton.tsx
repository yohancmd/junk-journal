import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../utils/cx'
import s from './primitives.module.css'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon
  /** Required: used as aria-label and tooltip. */
  label: string
  size?: 'md' | 'sm'
  active?: boolean
  tone?: 'default' | 'danger' | 'onBrand'
}

/** 40 px circular icon button (components.md §1.2). */
export function IconButton({
  icon: Icon,
  label,
  size = 'md',
  active,
  tone = 'default',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cx(
        s.iconButton,
        size === 'sm' && s.iconButtonSm,
        active && s.iconButtonActive,
        tone === 'danger' && s.iconButtonDanger,
        tone === 'onBrand' && s.iconButtonOnBrand,
        className,
      )}
      {...rest}
    >
      <Icon size={size === 'sm' ? 16 : 18} aria-hidden />
    </button>
  )
}
