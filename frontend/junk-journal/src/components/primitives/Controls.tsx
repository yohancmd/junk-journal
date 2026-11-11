import { useId, useRef } from 'react'
import type { CSSProperties, InputHTMLAttributes, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { cx } from '../utils/cx'
import s from './primitives.module.css'

/* ---------- Checkbox (§1.4) ---------- */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={cx(s.checkbox, className)}>
      <input type="checkbox" className={s.checkboxInput} {...rest} />
      <span className={s.checkboxBox} aria-hidden>
        <Check size={14} strokeWidth={3} />
      </span>
      <span>{label}</span>
    </label>
  )
}

/* ---------- Toggle (§1.5) ---------- */
export interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Toggle({ label, checked, onChange, disabled, className }: ToggleProps) {
  const id = useId()
  return (
    <div className={cx(s.toggleRow, className)}>
      <span id={id} className={s.toggleLabel}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        className={s.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={s.switchKnob} />
      </button>
    </div>
  )
}

/* ---------- Slider (§1.6) ---------- */
export interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  format?: (value: number) => string
  className?: string
}

export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, format, className }: SliderProps) {
  const id = useId()
  const pct = ((value - min) / (max - min || 1)) * 100
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!e.shiftKey) return
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    onChange(Math.min(max, Math.max(min, value + dir * step * 10)))
  }
  return (
    <div className={cx(s.slider, className)}>
      <div className={s.sliderHead}>
        <label htmlFor={id}>{label}</label>
        <span>{format ? format(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        className={s.range}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

/* ---------- NumberField (§1.7) ---------- */
export interface NumberFieldProps {
  /** Short label such as X, Y, W, H, L or ↻. Drag it sideways to scrub the value. */
  label: string
  ariaLabel?: string
  value: number
  onChange: (value: number) => void
  unit?: string
  step?: number
  min?: number
  max?: number
  disabled?: boolean
}

export function NumberField({ label, ariaLabel, value, onChange, unit, step = 1, min, max, disabled }: NumberFieldProps) {
  const start = useRef<{ x: number; v: number } | null>(null)
  const clamp = (v: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, v))

  function onPointerDown(e: PointerEvent<HTMLSpanElement>) {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, v: value }
  }
  function onPointerMove(e: PointerEvent<HTMLSpanElement>) {
    if (!start.current) return
    onChange(clamp(Math.round(start.current.v + (e.clientX - start.current.x) * step)))
  }
  function onPointerUp() {
    start.current = null
  }

  return (
    <label className={s.number}>
      <span
        className={s.numberLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-hidden
      >
        {label}
      </span>
      <input
        type="number"
        className={s.numberInput}
        aria-label={ariaLabel ?? label}
        value={value}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
      />
      {unit && <span className={s.numberUnit}>{unit}</span>}
    </label>
  )
}

/* ---------- SegmentedControl (§1.8) ---------- */
export interface SegmentOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

export interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({ label, options, value, onChange, className }: SegmentedControlProps<T>) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = options.findIndex((o) => o.value === value)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1
    if (next < 0 || next >= options.length) return
    e.preventDefault()
    onChange(options[next].value)
  }
  return (
    <div role="radiogroup" aria-label={label} className={cx(s.segmented, className)} onKeyDown={onKeyDown}>
      {options.map(({ value: v, label: l, icon: Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={v === value}
          tabIndex={v === value ? 0 : -1}
          className={s.segment}
          onClick={() => onChange(v)}
        >
          {Icon && <Icon size={18} aria-hidden />}
          {l}
        </button>
      ))}
    </div>
  )
}

/* ---------- Tag / Chip (§1.9) ---------- */
export interface TagProps {
  label: string
  count?: number
  selected?: boolean
  disabled?: boolean
  /** When provided, the tag is a toggle button (aria-pressed). Otherwise it's a static label. */
  onClick?: () => void
  className?: string
}

export function Tag({ label, count, selected, disabled, onClick, className }: TagProps) {
  const content = (
    <>
      {selected ? <Check size={14} strokeWidth={3} aria-hidden /> : <span className={s.tagDot} aria-hidden />}
      {count !== undefined ? `${label} · ${count}` : label}
    </>
  )
  const cls = cx(s.tag, selected && s.tagSelected, disabled && s.tagDisabled, className)
  if (!onClick) return <span className={cls}>{content}</span>
  return (
    <button type="button" className={cls} aria-pressed={!!selected} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}

/* ---------- SwatchGroup (§1.10) ---------- */
export interface Swatch {
  value: string
  /** Any CSS colour, ideally a token: var(--color-green). */
  color: string
  label: string
  dark?: boolean
}

export interface SwatchGroupProps {
  label: string
  swatches: Swatch[]
  value: string
  onChange: (value: string) => void
}

export function SwatchGroup({ label, swatches, value, onChange }: SwatchGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} className={s.swatches}>
      {swatches.map((sw) => (
        <button
          key={sw.value}
          type="button"
          role="radio"
          aria-checked={sw.value === value}
          aria-label={sw.label}
          title={sw.label}
          className={cx(s.swatch, sw.dark && s.swatchDark)}
          style={{ background: sw.color }}
          onClick={() => onChange(sw.value)}
        />
      ))}
    </div>
  )
}

/* ---------- KeyCap (§1.11) ---------- */
export function KeyCap({ children }: { children: ReactNode }) {
  return <kbd className={s.keycap}>{children}</kbd>
}

/* ---------- TextLink (§1.12) ---------- */
export interface TextLinkProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function TextLink({ children, href, onClick, className }: TextLinkProps) {
  if (href)
    return (
      <a href={href} className={cx(s.link, className)} onClick={onClick}>
        {children}
      </a>
    )
  return (
    <button type="button" className={cx(s.link, className)} onClick={onClick}>
      {children}
    </button>
  )
}
