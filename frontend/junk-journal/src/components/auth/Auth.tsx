import type { ReactNode } from 'react'
import { BookHeart, Heart, TriangleAlert } from 'lucide-react'
import { cx } from '../utils/cx'
import { Button } from '../primitives/Button'
import { scorePassword } from '../constants'
import s from './auth.module.css'

/* ---------- AuthLayout (§8) ---------- */
export interface AuthLayoutProps {
  /** Handwritten greeting, e.g. "welcome back!" (decorative). */
  accent?: string
  title: string
  lead?: string
  children: ReactNode
  footer?: ReactNode
  /** Optional photo for the collage polaroid. */
  collagePhoto?: string
}

export function AuthLayout({ accent, title, lead, children, footer = 'Your notebooks are private to you.', collagePhoto }: AuthLayoutProps) {
  return (
    <div className={s.layout}>
      <main className={s.formPanel}>
        <div className={s.brand}>
          <span className={s.logo} aria-hidden>
            <BookHeart size={20} />
          </span>
          Junk Journal
        </div>
        <div className={s.form}>
          <div className={s.formHead}>
            {accent && (
              <p className={s.accent} aria-hidden>
                {accent}
              </p>
            )}
            <h1 className={s.title}>{title}</h1>
            {lead && <p>{lead}</p>}
          </div>
          {children}
        </div>
        <p className={s.footer}>{footer}</p>
      </main>
      <div className={s.collage} aria-hidden>
        <span className={s.sheet} />
        <span className={s.grid} />
        <span className={s.polaroid}>{collagePhoto ? <img src={collagePhoto} alt="" /> : <span className={s.polaroidBlank} />}</span>
        <span className={s.tape1} />
        <span className={s.tape2} />
        <span className={s.heart}>
          <Heart size={52} />
        </span>
        <span className={s.handwriting}>{'little things,\nkept forever'}</span>
      </div>
    </div>
  )
}

/** Wraps auth form fields; submit handling stays with the page. */
export function AuthForm({ children, onSubmit }: { children: ReactNode; onSubmit: () => void }) {
  return (
    <form
      className={s.form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {children}
    </form>
  )
}

/* ---------- PasswordStrength (§8) ---------- */
const LABELS = ['Too short', 'Weak password', 'Okay password', 'Strong password', 'Very strong password']

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password)
  return (
    <div className={s.strength} aria-live="polite">
      <div className={s.bars} aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cx(s.bar, i <= score && s.barOn)} />
        ))}
      </div>
      <span className={s.strengthLabel}>{LABELS[score]}</span>
    </div>
  )
}

/* ---------- DangerZone (§8) ---------- */
export interface DangerZoneProps {
  title: string
  body: string
  actionLabel: string
  onAction: () => void
}

export function DangerZone({ title, body, actionLabel, onAction }: DangerZoneProps) {
  return (
    <section className={s.danger} aria-label={title}>
      <h2 className={s.dangerHead}>
        <TriangleAlert size={20} aria-hidden />
        {title}
      </h2>
      <p className={s.dangerBody}>{body}</p>
      <Button variant="destructive" onClick={onAction}>
        {actionLabel}
      </Button>
    </section>
  )
}
