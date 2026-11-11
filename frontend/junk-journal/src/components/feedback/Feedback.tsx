import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CircleAlert, CloudCheck, Info, Loader, TriangleAlert, WifiOff } from 'lucide-react'
import { cx } from '../utils/cx'
import { Button } from '../primitives/Button'
import type { ButtonProps } from '../primitives/Button'
import emptyArt from '../../assets/empty-illustration.svg'
import s from './feedback.module.css'

/* ---------- Banner (§2.2) ---------- */
export interface BannerProps {
  kind?: 'info' | 'error'
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

export function Banner({ kind = 'info', title, children, action, className }: BannerProps) {
  const Icon = kind === 'error' ? TriangleAlert : Info
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cx(s.banner, kind === 'error' && s.bannerError, className)}>
      <Icon className={s.bannerIcon} size={22} aria-hidden />
      <div className={s.bannerBody}>
        <p className={s.bannerTitle}>{title}</p>
        {children && <p className={s.bannerText}>{children}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Tip (§2.3) ---------- */
export function Tip({ icon: Icon = Info, children, className }: { icon?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <div className={cx(s.tip, className)}>
      <Icon size={18} aria-hidden />
      <p>{children}</p>
    </div>
  )
}

/* ---------- SaveStatusPill (§2.4) ---------- */
export type SaveStatus = 'saving' | 'saved' | 'offline' | 'failed'

const STATUS: Record<SaveStatus, { icon: LucideIcon; label: string }> = {
  saving: { icon: Loader, label: 'Saving…' },
  saved: { icon: CloudCheck, label: 'Saved' },
  offline: { icon: WifiOff, label: 'Offline · kept on this device' },
  failed: { icon: CircleAlert, label: 'Couldn’t save' },
}

export function SaveStatusPill({ status, onRetry }: { status: SaveStatus; onRetry?: () => void }) {
  const { icon: Icon, label } = STATUS[status]
  return (
    <div
      aria-live="polite"
      className={cx(s.status, status === 'offline' && s.statusOffline, status === 'failed' && s.statusFailed)}
    >
      <Icon className={cx(s.statusIcon, status === 'saving' && s.statusSpin)} size={16} aria-hidden />
      <span>{label}</span>
      {status === 'failed' && onRetry && (
        <button type="button" className={s.statusRetry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

/* ---------- Skeleton (§2.5) ---------- */
export interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: number | string
  className?: string
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 16, radius = 8, className, style }: SkeletonProps) {
  return <span aria-hidden className={cx(s.skeleton, className)} style={{ width, height, borderRadius: radius, ...style }} />
}

/* ---------- ProgressBar (§2.6) ---------- */
export interface ProgressBarProps {
  /** 0–1 */
  value: number
  label?: string
  status?: string
  size?: 'md' | 'sm'
}

export function ProgressBar({ value, label, status, size = 'md' }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div className={s.progress}>
      {(label || status) && (
        <div className={s.progressHead}>
          {label && <strong>{label}</strong>}
          <span>{status ?? `${pct}%`}</span>
        </div>
      )}
      <div
        className={cx(s.track, size === 'sm' && s.trackSm)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label ?? status}
      >
        <div className={s.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ---------- EmptyState (§2.7) ---------- */
type ActionSpec = Omit<ButtonProps, 'children'> & { label: string }

export interface EmptyStateProps {
  /** Handwritten accent line (decorative). */
  accent: string
  title?: string
  body: string
  action: ActionSpec
  secondary?: ActionSpec[]
  secondaryLead?: string
  illustration?: string | false
  className?: string
}

export function EmptyState({
  accent,
  title,
  body,
  action,
  secondary,
  secondaryLead = 'or start with',
  illustration = emptyArt,
  className,
}: EmptyStateProps) {
  const { label, ...primaryProps } = action
  return (
    <section className={cx(s.empty, className)}>
      {illustration && <img className={s.emptyArt} src={illustration} alt="" aria-hidden />}
      <p className={s.emptyAccent}>{accent}</p>
      {title && <h2 className={s.emptyTitle}>{title}</h2>}
      <p className={s.emptyBody}>{body}</p>
      <div className={s.emptyActions}>
        <Button variant="primary" {...primaryProps}>
          {label}
        </Button>
      </div>
      {secondary && secondary.length > 0 && (
        <div className={s.emptySecondary}>
          <span>{secondaryLead}</span>
          {secondary.map(({ label: l, ...p }) => (
            <Button key={l} variant="secondary" {...p}>
              {l}
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
