import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Brush,
  Check,
  CopyPlus,
  Crop,
  Eraser,
  FlipHorizontal,
  FlipHorizontal2,
  FlipVertical2,
  Highlighter,
  Italic,
  Lasso,
  Lock,
  MousePointer2,
  Pen,
  Pencil,
  Pentagon,
  Redo2,
  RotateCw,
  Scaling,
  Undo2,
  X,
} from 'lucide-react'
import { cx } from '../utils/cx'
import { Menu } from '../overlays/Overlays'
import { CROP_RATIOS } from '../constants'
import type { CropRatio } from '../constants'
import s from './editor.module.css'

/* ========== SelectionBox (§6.4) ========== */
export type Handle = 'nw' | 'ne' | 'sw' | 'se' | 'w' | 'e' | 'rotate'

export interface SelectionBoxProps {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  /** tape: handles on the two ends only. locked: no handles, lock badge. */
  variant?: 'default' | 'tape' | 'locked'
  /** The handle being dragged turns green. */
  activeHandle?: Handle
  /** Shows the angle tooltip while rotating. */
  showAngle?: boolean
  onHandlePointerDown?: (handle: Handle, e: PointerEvent<HTMLSpanElement>) => void
}

const HANDLE_POS: Record<Exclude<Handle, 'rotate'>, CSSProperties> = {
  nw: { left: -6, top: -6, cursor: 'nwse-resize' },
  ne: { left: 'calc(100% + 6px)', top: -6, cursor: 'nesw-resize' },
  sw: { left: -6, top: 'calc(100% + 6px)', cursor: 'nesw-resize' },
  se: { left: 'calc(100% + 6px)', top: 'calc(100% + 6px)', cursor: 'nwse-resize' },
  w: { left: -6, top: '50%', cursor: 'ew-resize' },
  e: { left: 'calc(100% + 6px)', top: '50%', cursor: 'ew-resize' },
}

export function SelectionBox({
  x,
  y,
  width,
  height,
  rotation = 0,
  variant = 'default',
  activeHandle,
  showAngle,
  onHandlePointerDown,
}: SelectionBoxProps) {
  const handles: Array<Exclude<Handle, 'rotate'>> =
    variant === 'tape' ? ['w', 'e'] : variant === 'locked' ? [] : ['nw', 'ne', 'sw', 'se']
  return (
    <div
      className={s.selection}
      style={{ left: x, top: y, width, height, transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      aria-hidden
    >
      <span className={s.selectionBox} />
      {handles.map((h) => (
        <span
          key={h}
          className={cx(s.handle, activeHandle === h && s.handleActive)}
          style={HANDLE_POS[h]}
          onPointerDown={(e) => onHandlePointerDown?.(h, e)}
        />
      ))}
      {variant !== 'locked' && (
        <>
          <span className={s.rotateStem} />
          <span
            className={cx(s.handle, s.rotateHandle, activeHandle === 'rotate' && s.handleActive)}
            onPointerDown={(e) => onHandlePointerDown?.('rotate', e)}
          />
          {showAngle && <span className={s.angleTip}>{Math.round(rotation)}°</span>}
        </>
      )}
      {variant === 'locked' && (
        <span className={s.lockBadge}>
          <Lock size={14} />
        </span>
      )}
    </div>
  )
}

/* ========== FloatingToolbar (§6.5) ========== */
export function FloatingToolbar({
  children,
  label,
  vertical,
  style,
  className,
}: {
  children: ReactNode
  label: string
  vertical?: boolean
  style?: CSSProperties
  className?: string
}) {
  return (
    <div role="toolbar" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'} className={cx(s.float, vertical && s.floatVertical, className)} style={style}>
      {children}
    </div>
  )
}

export interface FloatingButtonProps {
  icon?: LucideIcon
  label: string
  showLabel?: boolean
  active?: boolean
  danger?: boolean
  apply?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function FloatingButton({ icon: Icon, label, showLabel, active, danger, apply, onClick, disabled }: FloatingButtonProps) {
  return (
    <button
      type="button"
      className={cx(s.fb, danger && s.fbDanger, apply && s.fbApply)}
      aria-label={showLabel ? undefined : label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={18} aria-hidden />}
      {showLabel && label}
    </button>
  )
}

export function FloatingDivider() {
  return <span className={s.fbDivider} aria-hidden />
}

/* ----- ImageToolbar ----- */
export type ImageTool = 'select' | 'crop' | 'lasso' | 'polygon' | 'resize' | 'rotate'

export interface ImageToolbarProps {
  tool: ImageTool
  onTool: (tool: ImageTool) => void
  onFlipH: () => void
  onFlipV: () => void
  onUndo: () => void
  onRedo: () => void
  style?: CSSProperties
}

export function ImageToolbar({ tool, onTool, onFlipH, onFlipV, onUndo, onRedo, style }: ImageToolbarProps) {
  const t = (key: ImageTool, icon: LucideIcon, label: string) => (
    <FloatingButton icon={icon} label={label} active={tool === key} onClick={() => onTool(key)} />
  )
  return (
    <FloatingToolbar label="Image tools" style={style}>
      {t('select', MousePointer2, 'Select / move')}
      <FloatingDivider />
      {t('crop', Crop, 'Crop')}
      {t('lasso', Lasso, 'Freeform lasso')}
      {t('polygon', Pentagon, 'Polygon lasso')}
      <FloatingDivider />
      {t('resize', Scaling, 'Resize')}
      {t('rotate', RotateCw, 'Rotate')}
      <FloatingButton icon={FlipHorizontal2} label="Flip horizontal" onClick={onFlipH} />
      <FloatingButton icon={FlipVertical2} label="Flip vertical" onClick={onFlipV} />
      <FloatingDivider />
      <FloatingButton icon={Undo2} label="Undo" onClick={onUndo} />
      <FloatingButton icon={Redo2} label="Redo" onClick={onRedo} />
    </FloatingToolbar>
  )
}

/* ----- TextToolbar ----- */
export type FontCategory = 'Handwriting' | 'Typewriter' | 'Serif' | 'Sans-serif' | 'Decorative'
export interface FontOption {
  family: string
  category: FontCategory
}
export type TextAlign = 'left' | 'center' | 'right'

export interface TextStyleValue {
  family: string
  size: number
  color: string
  bold: boolean
  italic: boolean
  align: TextAlign
}

export interface TextToolbarProps {
  value: TextStyleValue
  fonts: FontOption[]
  sizes?: number[]
  onChange: (patch: Partial<TextStyleValue>) => void
  onColorClick: () => void
  style?: CSSProperties
}

export function TextToolbar({ value, fonts, sizes = [12, 14, 16, 20, 24, 28, 34, 40, 48, 64], onChange, onColorClick, style }: TextToolbarProps) {
  const categories = Array.from(new Set(fonts.map((f) => f.category)))
  return (
    <FloatingToolbar label="Text tools" style={style}>
      <label className={s.fontSelect}>
        <span className="sr-only">Font</span>
        <select value={value.family} onChange={(e) => onChange({ family: e.target.value })} style={{ fontFamily: value.family, fontSize: 18 }}>
          {categories.map((c) => (
            <optgroup key={c} label={c}>
              {fonts
                .filter((f) => f.category === c)
                .map((f) => (
                  <option key={f.family} value={f.family}>
                    {f.family}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className={s.fontSelect}>
        <span className="sr-only">Size</span>
        <select value={value.size} onChange={(e) => onChange({ size: Number(e.target.value) })}>
          {sizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className={s.colourDot} style={{ background: value.color }} aria-label="Text colour" onClick={onColorClick} />
      <FloatingDivider />
      <FloatingButton icon={Bold} label="Bold" active={value.bold} onClick={() => onChange({ bold: !value.bold })} />
      <FloatingButton icon={Italic} label="Italic" active={value.italic} onClick={() => onChange({ italic: !value.italic })} />
      <FloatingDivider />
      <FloatingButton icon={AlignLeft} label="Align left" active={value.align === 'left'} onClick={() => onChange({ align: 'left' })} />
      <FloatingButton icon={AlignCenter} label="Align centre" active={value.align === 'center'} onClick={() => onChange({ align: 'center' })} />
      <FloatingButton icon={AlignRight} label="Align right" active={value.align === 'right'} onClick={() => onChange({ align: 'right' })} />
    </FloatingToolbar>
  )
}

/* ----- CropBar ----- */
export type CropTool = 'crop' | 'lasso' | 'polygon'

export interface CropBarProps {
  tool: CropTool
  onTool: (tool: CropTool) => void
  ratio?: CropRatio
  onRatio?: (ratio: CropRatio) => void
  onApply: () => void
  onCancel: () => void
  onClear?: () => void
  onInvert?: () => void
  onUndoPoint?: () => void
  style?: CSSProperties
}

export function CropBar({ tool, onTool, ratio, onRatio, onApply, onCancel, onClear, onInvert, onUndoPoint, style }: CropBarProps) {
  const tools: Array<[CropTool, LucideIcon, string]> = [
    ['crop', Crop, 'Crop'],
    ['lasso', Lasso, 'Lasso'],
    ['polygon', Pentagon, 'Polygon'],
  ]
  function onRatioKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!onRatio || !ratio) return
    const i = CROP_RATIOS.indexOf(ratio)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1
    if (next < 0 || next >= CROP_RATIOS.length) return
    e.preventDefault()
    onRatio(CROP_RATIOS[next])
  }
  return (
    <FloatingToolbar label="Crop" style={style}>
      {tools.map(([key, icon, label]) => (
        <FloatingButton key={key} icon={icon} label={label} showLabel active={tool === key} onClick={() => onTool(key)} />
      ))}
      <FloatingDivider />
      {tool === 'crop' && onRatio && (
        <div role="radiogroup" aria-label="Aspect ratio" style={{ display: 'contents' }} onKeyDown={onRatioKey}>
          {CROP_RATIOS.map((r) => (
            <button key={r} type="button" role="radio" aria-checked={r === ratio} tabIndex={r === ratio ? 0 : -1} className={cx(s.fb, s.fbRatio)} onClick={() => onRatio(r)}>
              {r === 'Original' ? 'Orig.' : r}
            </button>
          ))}
        </div>
      )}
      {tool === 'polygon' && onUndoPoint && <FloatingButton icon={Undo2} label="Undo point" showLabel onClick={onUndoPoint} />}
      {tool !== 'crop' && onClear && <FloatingButton icon={Eraser} label="Clear" showLabel onClick={onClear} />}
      {tool !== 'crop' && onInvert && <FloatingButton icon={FlipHorizontal} label="Invert" showLabel onClick={onInvert} />}
      <FloatingDivider />
      <FloatingButton icon={X} label="Cancel · Esc" showLabel onClick={onCancel} />
      <FloatingButton icon={Check} label="Apply" showLabel apply onClick={onApply} />
    </FloatingToolbar>
  )
}

/* ----- PenRail ----- */
export type PenTool = 'pen' | 'pencil' | 'marker' | 'highlighter' | 'eraser'

export function PenRail({ tool, onTool, style }: { tool: PenTool; onTool: (t: PenTool) => void; style?: CSSProperties }) {
  const tools: Array<[PenTool, LucideIcon, string]> = [
    ['pen', Pen, 'Pen'],
    ['pencil', Pencil, 'Pencil'],
    ['marker', Brush, 'Marker'],
    ['highlighter', Highlighter, 'Highlighter'],
    ['eraser', Eraser, 'Eraser'],
  ]
  return (
    <FloatingToolbar label="Drawing tools" vertical style={style}>
      {tools.map(([key, icon, label]) => (
        <FloatingButton key={key} icon={icon} label={label} active={tool === key} onClick={() => onTool(key)} />
      ))}
    </FloatingToolbar>
  )
}

/* ========== ModeBanner (§6.6) ========== */
export function ModeBanner({ icon: Icon, children, style }: { icon: LucideIcon; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className={s.banner} role="status" style={style}>
      <Icon size={18} aria-hidden />
      {children}
    </div>
  )
}

/* ========== Crop / Lasso / Polygon overlays (§6.7) ========== */
type Pt = [number, number]
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface CropOverlayProps {
  /** Size of the coordinate space (usually the page). */
  width: number
  height: number
  crop: Rect
  /** Optional bounds of the image being cropped; dimming is limited to it. */
  bounds?: Rect
  onHandlePointerDown?: (handle: string, e: PointerEvent<SVGRectElement>) => void
}

/** Dashed boundary + square handles + dimmed outside + thirds. Square handles ≠ round selection handles. */
export function CropOverlay({ width, height, crop, bounds, onHandlePointerDown }: CropOverlayProps) {
  const b = bounds ?? { x: 0, y: 0, width, height }
  const { x, y, width: w, height: h } = crop
  const handles: Array<[string, number, number]> = [
    ['nw', x, y], ['n', x + w / 2, y], ['ne', x + w, y], ['e', x + w, y + h / 2],
    ['se', x + w, y + h], ['s', x + w / 2, y + h], ['sw', x, y + h], ['w', x, y + h / 2],
  ]
  return (
    <svg className={s.overlaySvg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path
        fillRule="evenodd"
        d={`M${b.x} ${b.y}h${b.width}v${b.height}h${-b.width}z M${x} ${y}h${w}v${h}h${-w}z`}
        fill="rgba(0, 61, 26, 0.5)"
      />
      {[1, 2].map((k) => (
        <g key={k} stroke="var(--color-cream)" strokeOpacity={0.6}>
          <line x1={x + (w * k) / 3} y1={y} x2={x + (w * k) / 3} y2={y + h} />
          <line x1={x} y1={y + (h * k) / 3} x2={x + w} y2={y + (h * k) / 3} />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="var(--color-green)" strokeWidth={3} strokeDasharray="9 6" />
      {handles.map(([id, hx, hy]) => (
        <rect
          key={id}
          x={hx - 7}
          y={hy - 7}
          width={14}
          height={14}
          rx={2}
          fill="var(--color-yellow)"
          stroke="var(--color-green)"
          strokeWidth={2}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onPointerDown={(e) => onHandlePointerDown?.(id, e)}
        />
      ))}
    </svg>
  )
}

const toPath = (pts: Pt[], close: boolean) =>
  pts.length ? `M${pts.map((p) => p.join(' ')).join(' L ')}${close ? ' Z' : ''}` : ''

export interface LassoOverlayProps {
  width: number
  height: number
  points: Pt[]
  closed: boolean
}

/** Live freeform path; once closed: tinted fill, cream halo and marching-ants outline. */
export function LassoOverlay({ width, height, points, closed }: LassoOverlayProps) {
  const d = toPath(points, closed)
  return (
    <svg className={s.overlaySvg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {closed && <path d={d} fill="rgba(255, 221, 0, 0.25)" stroke="var(--color-cream)" strokeWidth={5} />}
      <path
        d={d}
        fill="none"
        stroke="var(--color-green)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeDasharray={closed ? '8 6' : undefined}
        className={closed ? s.marching : undefined}
      />
    </svg>
  )
}

export interface PolygonOverlayProps {
  width: number
  height: number
  points: Pt[]
  closed?: boolean
  /** Current pointer position for the rubber-band line. */
  cursor?: Pt
  /** Pointer is over the start anchor: highlight it and show "Click to close". */
  hoverStart?: boolean
}

export function PolygonOverlay({ width, height, points, closed, cursor, hoverStart }: PolygonOverlayProps) {
  const last = points[points.length - 1]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg className={s.overlaySvg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
        {closed && <path d={toPath(points, true)} fill="rgba(255, 221, 0, 0.25)" />}
        <path
          d={toPath(points, !!closed)}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={2.5}
          strokeDasharray={closed ? '8 6' : undefined}
          className={closed ? s.marching : undefined}
        />
        {!closed && cursor && last && (
          <line x1={last[0]} y1={last[1]} x2={cursor[0]} y2={cursor[1]} stroke="var(--color-green)" strokeWidth={2} strokeDasharray="6 5" />
        )}
        {points.map(([px, py], i) =>
          i === 0 ? (
            <circle key={i} cx={px} cy={py} r={hoverStart ? 10 : 9} fill="var(--color-yellow)" stroke="var(--color-green)" strokeWidth={3} />
          ) : (
            <rect key={i} x={px - 6} y={py - 6} width={12} height={12} rx={2} fill="var(--color-cream)" stroke="var(--color-green)" strokeWidth={2} />
          ),
        )}
      </svg>
      {hoverStart && points[0] && (
        <span className={s.closeTip} style={{ left: points[0][0], top: points[0][1] }}>
          Click to close
        </span>
      )}
    </div>
  )
}

/* ========== SelectionActionsMenu (§6.8) ========== */
export interface SelectionActionsMenuProps {
  open: boolean
  x: number
  y: number
  onClose: () => void
  onCropToSelection: () => void
  onIsolate: () => void
  onDeleteArea: () => void
  onInvert: () => void
}

export function SelectionActionsMenu({ open, x, y, onClose, onCropToSelection, onIsolate, onDeleteArea, onInvert }: SelectionActionsMenuProps) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      label="Selection actions"
      style={{ left: x, top: y }}
      items={[
        { label: 'Crop to selection', icon: Crop, onSelect: onCropToSelection },
        { label: 'Isolate as new element', icon: CopyPlus, onSelect: onIsolate },
        { label: 'Delete selected area', icon: Eraser, onSelect: onDeleteArea, destructive: true },
        { label: 'Invert selection', icon: FlipHorizontal, onSelect: onInvert },
      ]}
    />
  )
}
