import { useEffect, useId, useRef } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { Info, TriangleAlert, X } from 'lucide-react'
import { cx } from '../utils/cx'
import { useFocusTrap } from '../utils/useFocusTrap'
import { Button } from '../primitives/Button'
import { Tip } from '../feedback/Feedback'
import s from './overlays.module.css'

/* ---------- Scrim (§3.1) ---------- */
export function Scrim({ onClick }: { onClick?: () => void }) {
  return <div className={s.scrim} onClick={onClick} aria-hidden />
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={s.close} aria-label="Close" onClick={onClick}>
      <X size={18} aria-hidden />
    </button>
  )
}

/* ---------- Modal (§3.2) ---------- */
export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** Optional side panel (split variant), e.g. a live preview. */
  aside?: ReactNode
  width?: number
  /** Header extra element replacing the close button (e.g. a badge). */
  hideClose?: boolean
  /** Whether clicking the scrim closes it. Off for destructive dialogs. */
  dismissOnScrim?: boolean
  initialFocus?: RefObject<HTMLElement | null>
  headerIcon?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  aside,
  width = 560,
  hideClose,
  dismissOnScrim = true,
  initialFocus,
  headerIcon,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(ref, open, onClose, initialFocus)
  if (!open) return null
  return createPortal(
    <>
      <Scrim onClick={dismissOnScrim ? onClose : undefined} />
      <div className={s.modalWrap}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={s.modal}
          style={{ maxWidth: width }}
        >
          <div className={s.modalMain}>
            <div className={s.modalHead}>
              <div className={s.confirmHead}>
                {headerIcon}
                <h2 id={titleId} className={s.modalTitle}>
                  {title}
                </h2>
              </div>
              {!hideClose && <CloseButton onClick={onClose} />}
            </div>
            <div className={s.modalBody}>{children}</div>
            {footer && <div className={s.modalFooter}>{footer}</div>}
          </div>
          {aside && <aside className={s.modalAside}>{aside}</aside>}
        </div>
      </div>
    </>,
    document.body,
  )
}

/* ---------- Drawer (§3.3) ---------- */
export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  /** Small element shown left of the close button instead of the title, e.g. a TypeBadge. */
  headerStart?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, headerStart, children, footer }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(ref, open, onClose)
  if (!open) return null
  return createPortal(
    <>
      <Scrim onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={s.drawer}>
        <div className={s.modalHead}>
          {headerStart ?? (
            <h2 id={titleId} className={s.modalTitle}>
              {title}
            </h2>
          )}
          <CloseButton onClick={onClose} />
        </div>
        {headerStart && (
          <h2 id={titleId} className={s.modalTitle}>
            {title}
          </h2>
        )}
        {children}
        {footer && <div className={s.drawerFooter}>{footer}</div>}
      </div>
    </>,
    document.body,
  )
}

/* ---------- ConfirmDialog (§3.4) ---------- */
export interface ConfirmDialogProps {
  open: boolean
  title: string
  body: ReactNode
  /** What is kept, e.g. "Your stickers stay in the Asset Library." */
  reassure?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  confirming?: boolean
}

export function ConfirmDialog({
  open,
  title,
  body,
  reassure,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirming,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={520}
      hideClose
      dismissOnScrim={false}
      initialFocus={cancelRef}
      headerIcon={
        <span className={s.warnBadge} aria-hidden>
          <TriangleAlert size={22} />
        </span>
      }
      footer={
        <>
          <Button ref={cancelRef} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" loading={confirming} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{body}</p>
      {reassure && <Tip icon={Info}>{reassure}</Tip>}
    </Modal>
  )
}

/* ---------- Menu / Popover (§3.5) ---------- */
export interface MenuItem {
  label: string
  icon?: LucideIcon
  onSelect: () => void
  destructive?: boolean
}

export interface MenuProps {
  open: boolean
  onClose: () => void
  items: MenuItem[]
  label: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'right'
  /** Absolute positioning override (e.g. next to a canvas selection). */
  style?: CSSProperties
  className?: string
}

const PLACEMENT = {
  'bottom-start': s.menuBottomStart,
  'bottom-end': s.menuBottomEnd,
  'top-start': s.menuTopStart,
  right: s.menuRight,
}

/** Render inside a positioned parent (e.g. <MenuAnchor>). Arrow keys move, Esc closes. */
export function Menu({ open, onClose, items, label, placement = 'bottom-start', style, className }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, onClose])

  if (!open) return null

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      buttons[(i + 1) % buttons.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      buttons[(i - 1 + buttons.length) % buttons.length]?.focus()
    }
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      className={cx(s.menu, !style && PLACEMENT[placement], className)}
      style={style}
      onKeyDown={onKeyDown}
    >
      {items.map(({ label: l, icon: Icon, onSelect, destructive }) => (
        <button
          key={l}
          type="button"
          role="menuitem"
          className={cx(s.menuItem, destructive && s.menuItemDanger)}
          onClick={() => {
            onSelect()
            onClose()
          }}
        >
          {Icon && <Icon size={18} aria-hidden />}
          {l}
        </button>
      ))}
    </div>
  )
}

/** Positioned wrapper for a trigger + <Menu>. */
export function MenuAnchor({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(s.menuAnchor, className)}>{children}</div>
}
