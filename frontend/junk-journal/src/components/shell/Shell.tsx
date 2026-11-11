import { useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  BookOpen,
  Check,
  ChevronRight,
  Keyboard,
  LayoutGrid,
  Library,
  LifeBuoy,
  LogOut,
  Ribbon,
  Sticker,
  User,
} from 'lucide-react'
import { cx } from '../utils/cx'
import { Button } from '../primitives/Button'
import { Menu } from '../overlays/Overlays'
import s from './shell.module.css'

/* ---------- NavRail (§4.2) ---------- */
export type NavKey = 'dashboard' | 'notebooks' | 'stickers' | 'washi' | 'library'

const NAV: Array<{ key: NavKey; label: string; icon: LucideIcon }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'notebooks', label: 'Notebooks', icon: BookOpen },
  { key: 'stickers', label: 'Sticker Studio', icon: Sticker },
  { key: 'washi', label: 'Washi Tape Studio', icon: Ribbon },
  { key: 'library', label: 'Asset Library', icon: Library },
]

export interface NavUser {
  name: string
  initials: string
}

export interface NavRailProps {
  active?: NavKey
  onNavigate: (key: NavKey) => void
  user: NavUser
  onAccountSettings?: () => void
  onShortcuts?: () => void
  onHelp?: () => void
  onSignOut?: () => void
}

export function NavRail({ active, onNavigate, user, onAccountSettings, onShortcuts, onHelp, onSignOut }: NavRailProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const items = [
    onAccountSettings && { label: 'Account settings', icon: User, onSelect: onAccountSettings },
    onShortcuts && { label: 'Shortcuts', icon: Keyboard, onSelect: onShortcuts },
    onHelp && { label: 'Help', icon: LifeBuoy, onSelect: onHelp },
    onSignOut && { label: 'Sign out', icon: LogOut, onSelect: onSignOut },
  ].filter((i): i is { label: string; icon: LucideIcon; onSelect: () => void } => Boolean(i))

  return (
    <nav className={s.rail} aria-label="Main">
      <div className={s.brand}>
        <span className={s.logo} aria-hidden>
          <BookHeart size={20} />
        </span>
        <span>
          <span className={s.brandName}>Junk Journal</span>
          <br />
          <span className={s.brandAccent} aria-hidden>
            studio
          </span>
        </span>
      </div>
      <ul className={s.navList}>
        {NAV.map(({ key, label, icon: Icon }) => (
          <li key={key}>
            <button
              type="button"
              className={s.navItem}
              aria-current={active === key ? 'page' : undefined}
              onClick={() => onNavigate(key)}
            >
              <Icon size={20} aria-hidden />
              {label}
            </button>
          </li>
        ))}
      </ul>
      <div className={s.spacer} />
      <div className={s.accountAnchor}>
        <button
          type="button"
          className={s.account}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={s.avatar} aria-hidden>
            {user.initials}
          </span>
          <span className={s.accountText}>
            <strong>{user.name}</strong>
            <span>Settings</span>
          </span>
          <ChevronRight size={18} aria-hidden />
        </button>
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} items={items} label="Account" placement="top-start" />
      </div>
    </nav>
  )
}

/* ---------- AppShell (§4.1) ---------- */
export interface AppShellProps extends NavRailProps {
  children: ReactNode
}

export function AppShell({ children, ...nav }: AppShellProps) {
  return (
    <div className={s.shell}>
      <NavRail {...nav} />
      <main className={s.main}>{children}</main>
    </div>
  )
}

/* ---------- PageHeader (§4.3) ---------- */
export interface PageHeaderProps {
  title: string
  /** Handwritten line above the title (decorative). */
  accent?: string
  size?: 'display' | 'h1'
  breadcrumb?: { label: string; onClick: () => void; current?: string }
  actions?: ReactNode
}

export function PageHeader({ title, accent, size = 'display', breadcrumb, actions }: PageHeaderProps) {
  return (
    <header className={s.header}>
      <div className={s.headerText}>
        {breadcrumb && (
          <nav className={s.crumb} aria-label="Breadcrumb">
            <ArrowLeft size={16} aria-hidden />
            <button type="button" onClick={breadcrumb.onClick}>
              {breadcrumb.label}
            </button>
            {breadcrumb.current && <span aria-current="page">/ {breadcrumb.current}</span>}
          </nav>
        )}
        {accent && (
          <p className={s.accent} aria-hidden>
            {accent}
          </p>
        )}
        <h1 className={size === 'display' ? s.titleDisplay : s.titleH1}>{title}</h1>
      </div>
      {actions && <div className={s.headerActions}>{actions}</div>}
    </header>
  )
}

/* ---------- Stepper (§4.4) ---------- */
export interface StepperProps {
  steps: string[]
  /** Zero-based index of the current step. */
  current: number
  /** Completed steps are clickable when provided. */
  onStepClick?: (index: number) => void
}

export function Stepper({ steps, current, onStepClick }: StepperProps) {
  return (
    <ol className={s.stepper} aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current
        const isCurrent = i === current
        return (
          <li key={label} className={s.step}>
            <button
              type="button"
              className={cx(s.stepButton, !done && !isCurrent && s.stepUpcoming, isCurrent && s.stepCurrent)}
              aria-current={isCurrent ? 'step' : undefined}
              disabled={!done || !onStepClick}
              onClick={() => onStepClick?.(i)}
            >
              <span className={cx(s.dot, done && s.dotDone, isCurrent && s.dotCurrent)} aria-hidden>
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              {label}
            </button>
            {i < steps.length - 1 && <span className={cx(s.connector, done && s.connectorDone)} aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- StudioShell (§4.5) ---------- */
export interface StudioShellProps extends Omit<NavRailProps, 'active'> {
  kind: 'sticker' | 'washi'
  steps: string[]
  current: number
  onStepClick?: (index: number) => void
  onLibrary: () => void
  preview: ReactNode
  panelTitle: string
  panel: ReactNode
  /** Footer buttons. Omit `back` on the first step. */
  back?: { label?: string; onClick: () => void }
  next: { label?: string; icon?: LucideIcon; onClick: () => void; disabled?: boolean; loading?: boolean }
}

export function StudioShell({
  kind,
  steps,
  current,
  onStepClick,
  onLibrary,
  preview,
  panelTitle,
  panel,
  back,
  next,
  ...nav
}: StudioShellProps) {
  const sticker = kind === 'sticker'
  return (
    <AppShell {...nav} active={sticker ? 'stickers' : 'washi'}>
      <PageHeader
        size="h1"
        accent={sticker ? 'cut, outline, stick!' : 'pattern play'}
        title={sticker ? 'Sticker Studio' : 'Washi Tape Studio'}
        actions={
          <Button icon={sticker ? Sticker : Ribbon} onClick={onLibrary}>
            Library
          </Button>
        }
      />
      <Stepper steps={steps} current={current} onStepClick={onStepClick} />
      <div className={s.studioBody}>
        <section className={s.preview} aria-label="Preview">
          {preview}
        </section>
        <aside className={s.panel} aria-label={panelTitle}>
          <h2 className={s.panelTitle}>{panelTitle}</h2>
          {panel}
          <div className={s.panelFooter}>
            {back && (
              <Button icon={ArrowLeft} onClick={back.onClick}>
                {back.label ?? 'Back'}
              </Button>
            )}
            <Button
              variant="primary"
              icon={next.icon ?? ArrowRight}
              onClick={next.onClick}
              disabled={next.disabled}
              loading={next.loading}
            >
              {next.label ?? 'Continue'}
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
