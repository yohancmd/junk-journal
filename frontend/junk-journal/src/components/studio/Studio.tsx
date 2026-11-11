import { useId, useRef, useState } from 'react'
import type { CSSProperties, DragEvent, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronsLeftRight, CircleAlert, FolderOpen, ImageUp } from 'lucide-react'
import { cx } from '../utils/cx'
import { WashiTape } from './WashiTape'
import type { TapePattern } from './WashiTape'
import { IMAGE_TYPES, PATTERN_OPTIONS } from '../constants'
import s from './studio.module.css'

/* ---------- DropZone (§7.1) ---------- */
export interface DropZoneProps {
  onFiles: (files: File[]) => void
  /** Called with files that don't match `accept`. */
  onReject?: (files: File[]) => void
  accept?: string[]
  multiple?: boolean
  compact?: boolean
  title?: string
  formats?: string
  error?: string
}

export function DropZone({
  onFiles,
  onReject,
  accept = IMAGE_TYPES,
  multiple,
  compact,
  title,
  formats = 'PNG, JPG, JPEG or WEBP · up to 20 MB',
  error,
}: DropZoneProps) {
  const [over, setOver] = useState(false)
  const inputId = useId()

  function handle(list: FileList | null) {
    if (!list) return
    const files = Array.from(list)
    const ok = files.filter((f) => accept.includes(f.type))
    const bad = files.filter((f) => !accept.includes(f.type))
    if (ok.length) onFiles(ok)
    if (bad.length) onReject?.(bad)
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setOver(false)
    handle(e.dataTransfer.files)
  }

  return (
    <label
      htmlFor={inputId}
      className={cx(s.drop, compact && s.dropCompact, over && s.dropOver, error && s.dropError)}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept.join(',')}
        multiple={multiple}
        onChange={(e) => handle(e.target.files)}
      />
      {compact ? (
        <ImageUp size={28} aria-hidden />
      ) : (
        <span className={s.dropIcon} aria-hidden>
          <ImageUp size={40} />
        </span>
      )}
      <span className={s.dropTitle}>{title ?? (compact ? 'Drop images or browse' : 'Drop a photo here')}</span>
      {!compact && (
        <>
          <span>or</span>
          <span className={s.browse} aria-hidden>
            <FolderOpen size={18} />
            Browse files
          </span>
        </>
      )}
      <span className={s.dropFormats}>{formats}</span>
      {error && (
        <span className={s.dropErrorText} role="alert">
          <CircleAlert size={16} aria-hidden />
          {error}
        </span>
      )}
    </label>
  )
}

/* ---------- Checkerboard (§7.2) ---------- */
export function Checkerboard({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cx('checkerboard', className)} style={style}>
      {children}
    </div>
  )
}

/* ---------- BeforeAfter (§7.3) ---------- */
export interface BeforeAfterProps {
  before: ReactNode
  /** The "after" side always gets its own opaque cream + checkerboard background. */
  after: ReactNode
  /** Divider position 0–100. Uncontrolled if omitted. */
  value?: number
  onChange?: (value: number) => void
}

export function BeforeAfter({ before, after, value, onChange }: BeforeAfterProps) {
  const [inner, setInner] = useState(50)
  const pos = value ?? inner
  const ref = useRef<HTMLDivElement>(null)
  const set = (v: number) => {
    const clamped = Math.min(100, Math.max(0, v))
    if (value === undefined) setInner(clamped)
    onChange?.(clamped)
  }
  function fromPointer(e: PointerEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (r) set(((e.clientX - r.left) / r.width) * 100)
  }
  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft') set(pos - step)
    else if (e.key === 'ArrowRight') set(pos + step)
    else return
    e.preventDefault()
  }
  return (
    <div
      ref={ref}
      className={s.ba}
      onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        fromPointer(e)
      }}
    >
      <div className={s.baLayer}>{before}</div>
      <div className={cx(s.baLayer, 'checkerboard')} style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {after}
      </div>
      <span className={s.baDivider} style={{ left: `${pos}%` }} aria-hidden />
      <button
        type="button"
        role="slider"
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        className={s.baKnob}
        style={{ left: `${pos}%` }}
        onKeyDown={onKeyDown}
      >
        <ChevronsLeftRight size={22} aria-hidden />
      </button>
      <span className={s.baTag} style={{ left: 16 }}>
        Before
      </span>
      <span className={s.baTag} style={{ right: 16 }}>
        After
      </span>
    </div>
  )
}

/* ---------- DieCutSticker (§7.4) ---------- */
export interface StickerShadow {
  blur: number
  /** 0–1 */
  opacity: number
  distance: number
  /** degrees, 0 = right, 90 = down */
  angle: number
}

export interface DieCutStickerProps {
  /** Transparent cut-out (PNG/WebP with alpha). */
  src?: string
  alt?: string
  width?: number
  height?: number
  borderWidth?: number
  borderColor?: string
  borderOpacity?: number
  shadow?: StickerShadow | false
  rotation?: number
  /** Fallback for icon stickers without an image: rendered in a round die-cut. */
  children?: ReactNode
  fallbackBackground?: string
}

const DEFAULT_SHADOW: StickerShadow = { blur: 16, opacity: 0.25, distance: 8, angle: 60 }

/**
 * Die-cut sticker. The border is built from the image's alpha channel
 * (feMorphology dilate), so it follows the silhouette. Never use box-shadow for it.
 */
export function DieCutSticker({
  src,
  alt = '',
  width = 200,
  height = 200,
  borderWidth = 8,
  borderColor = '#FFFFFF',
  borderOpacity = 1,
  shadow = DEFAULT_SHADOW,
  rotation = 0,
  children,
  fallbackBackground = 'var(--color-yellow)',
}: DieCutStickerProps) {
  const filterId = `diecut-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const rad = shadow ? (shadow.angle * Math.PI) / 180 : 0
  const dropShadow = shadow
    ? `drop-shadow(${(Math.cos(rad) * shadow.distance).toFixed(1)}px ${(Math.sin(rad) * shadow.distance).toFixed(1)}px ${shadow.blur}px rgba(0, 118, 51, ${shadow.opacity}))`
    : undefined
  const style: CSSProperties = { filter: dropShadow, transform: rotation ? `rotate(${rotation}deg)` : undefined }

  if (!src) {
    return (
      <span
        className={s.stickerFallback}
        style={{ ...style, width, height, background: fallbackBackground, borderColor, borderWidth }}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        {children}
      </span>
    )
  }

  const pad = borderWidth + 2
  return (
    <svg
      className={s.sticker}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={style}
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={borderWidth} result="dilated" />
          <feFlood style={{ floodColor: borderColor, floodOpacity: borderOpacity }} result="ink" />
          <feComposite in="ink" in2="dilated" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <image
        href={src}
        x={pad}
        y={pad}
        width={width - pad * 2}
        height={height - pad * 2}
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}

/* ---------- PatternPicker (§7.6) ---------- */
export interface PatternPickerProps {
  value: TapePattern
  onChange: (value: TapePattern) => void
  baseColor?: string
  patternColor?: string
  options?: Array<{ value: TapePattern; label: string }>
}

export function PatternPicker({
  value,
  onChange,
  baseColor = 'var(--color-cream)',
  patternColor = 'var(--color-green)',
  options = PATTERN_OPTIONS,
}: PatternPickerProps) {
  return (
    <div role="radiogroup" aria-label="Pattern" className={s.patterns}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={s.pattern}
          onClick={() => onChange(o.value)}
        >
          <span className={s.patternSwatch}>
            <WashiTape pattern={o.value} baseColor={baseColor} patternColor={patternColor} width={44} length={120} edge="straight" opacity={1} />
          </span>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- MethodCard (§7.7) ---------- */
export interface MethodCardProps {
  title: string
  description: string
  icon: LucideIcon
  art?: ReactNode
  selected: boolean
  onSelect: () => void
}

/** Use inside a role="radiogroup" container. */
export function MethodCard({ title, description, icon: Icon, art, selected, onSelect }: MethodCardProps) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={s.method} onClick={onSelect}>
      <span className={s.methodArt} aria-hidden>
        {art}
      </span>
      <span className={s.methodBadge} aria-hidden>
        <Icon size={22} />
      </span>
      <span className={s.methodTitle}>{title}</span>
      <span className={s.methodDesc}>{description}</span>
    </button>
  )
}

/* ---------- DirectionDial (§7.8) ---------- */
export interface DirectionDialProps {
  /** degrees, 0 = right, 90 = down */
  angle: number
  onChange: (angle: number) => void
  label?: string
}

export function DirectionDial({ angle, onChange, label = 'Shadow direction' }: DirectionDialProps) {
  const norm = (a: number) => ((Math.round(a) % 360) + 360) % 360
  function fromPointer(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const a = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
    onChange(norm(a))
  }
  return (
    <button
      type="button"
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={norm(angle)}
      aria-valuetext={`${norm(angle)} degrees`}
      className={s.dial}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        fromPointer(e)
      }}
      onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(norm(angle + 15))
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(norm(angle - 15))
        else return
        e.preventDefault()
      }}
    >
      {/* needle points along `angle`: rotate from "down" (default) */}
      <span className={s.needle} style={{ transform: `rotate(${angle - 90}deg)` }} />
      <span className={s.pivot} />
    </button>
  )
}
