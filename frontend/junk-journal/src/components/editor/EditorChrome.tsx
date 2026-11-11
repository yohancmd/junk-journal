import { useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BringToFront,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Download,
  Eye,
  EyeOff,
  GripVertical,
  Image,
  Keyboard,
  Lock,
  LockOpen,
  Redo2,
  Ruler,
  Scan,
  SendToBack,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { SIDEBAR_TABS } from '../constants'
import type { SidebarTab } from '../constants'
import { cx } from '../utils/cx'
import { Button } from '../primitives/Button'
import { IconButton } from '../primitives/IconButton'
import { SaveStatusPill, ProgressBar } from '../feedback/Feedback'
import type { SaveStatus } from '../feedback/Feedback'
import { TextLink } from '../primitives/Controls'
import s from './editor.module.css'

/* ========== EditorToolbar (§6.1) ========== */
export interface ToolbarButtonProps {
  icon: LucideIcon
  label: string
  /** Show the label next to the icon (otherwise it's only the aria-label/tooltip). */
  showLabel?: boolean
  pressed?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function ToolbarButton({ icon: Icon, label, showLabel, pressed, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={s.tbButton}
      aria-label={showLabel ? undefined : label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon size={20} aria-hidden />
      {showLabel && label}
    </button>
  )
}

export function ToolbarDivider() {
  return <span className={s.tbDivider} aria-hidden />
}

export interface EditorToolbarProps {
  notebookTitle: string
  page: number
  pageCount: number
  /** e.g. "Pages 2–3" in spread view */
  pageLabel?: string
  zoom: number
  guides: boolean
  saveStatus: SaveStatus
  canUndo?: boolean
  canRedo?: boolean
  onBack: () => void
  onUndo: () => void
  onRedo: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onToggleGuides: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onRetrySave?: () => void
  onShortcuts: () => void
  onExport: () => void
}

export function EditorToolbar(p: EditorToolbarProps) {
  return (
    <header className={s.toolbar} role="toolbar" aria-label="Editor">
      <div className={s.toolbarSide}>
        <IconButton icon={ArrowLeft} label="Back to notebook" onClick={p.onBack} />
        <div className={s.doc}>
          <strong>{p.notebookTitle}</strong>
          <span>{p.pageLabel ?? `Page ${p.page} of ${p.pageCount}`}</span>
        </div>
      </div>
      <div className={s.toolbarCenter}>
        <ToolbarButton icon={Undo2} label="Undo" disabled={p.canUndo === false} onClick={p.onUndo} />
        <ToolbarButton icon={Redo2} label="Redo" disabled={p.canRedo === false} onClick={p.onRedo} />
        <ToolbarDivider />
        <ToolbarButton icon={ZoomOut} label="Zoom out" onClick={p.onZoomOut} />
        <span className={s.tbText} aria-live="polite">
          {Math.round(p.zoom * 100)}%
        </span>
        <ToolbarButton icon={ZoomIn} label="Zoom in" onClick={p.onZoomIn} />
        <ToolbarButton icon={Scan} label="Fit" showLabel onClick={p.onFit} />
        <ToolbarDivider />
        <ToolbarButton icon={Ruler} label="Guides" showLabel pressed={p.guides} onClick={p.onToggleGuides} />
        <ToolbarDivider />
        <ToolbarButton icon={ChevronLeft} label="Previous page" disabled={p.page <= 1} onClick={p.onPrevPage} />
        <span className={s.tbText}>
          {p.page} / {p.pageCount}
        </span>
        <ToolbarButton icon={ChevronRight} label="Next page" disabled={p.page >= p.pageCount} onClick={p.onNextPage} />
      </div>
      <div className={cx(s.toolbarSide, s.toolbarEnd)}>
        <SaveStatusPill status={p.saveStatus} onRetry={p.onRetrySave} />
        <IconButton icon={Keyboard} label="Keyboard shortcuts" onClick={p.onShortcuts} />
        <Button icon={Download} onClick={p.onExport}>
          Export
        </Button>
      </div>
    </header>
  )
}

/* ========== AssetSidebar (§6.2) ========== */
export interface AssetSidebarProps {
  active: SidebarTab
  onChange: (tab: SidebarTab) => void
  /** Panel content for the active tab. Omit to collapse to the rail (spread view). */
  children?: ReactNode
  title?: string
}

export function AssetSidebar({ active, onChange, children, title }: AssetSidebarProps) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = SIDEBAR_TABS.findIndex((t) => t.key === active)
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : -1
    if (next < 0 || next >= SIDEBAR_TABS.length) return
    e.preventDefault()
    onChange(SIDEBAR_TABS[next].key)
  }
  const activeTab = SIDEBAR_TABS.find((t) => t.key === active)
  return (
    <aside className={cx(s.sidebar, !children && s.sidebarCollapsed)} aria-label="Assets">
      <div className={s.tabRail} role="tablist" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {SIDEBAR_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={key === active}
            aria-controls={children ? 'asset-panel' : undefined}
            tabIndex={key === active ? 0 : -1}
            className={s.tab}
            onClick={() => onChange(key)}
          >
            <Icon size={22} aria-hidden />
            {label}
          </button>
        ))}
      </div>
      {children && (
        <div id="asset-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className={s.tabPanel}>
          <h2 className={s.panelTitle}>{title ?? activeTab?.label}</h2>
          {children}
        </div>
      )}
    </aside>
  )
}

export interface SidebarAssetProps {
  name: string
  preview: ReactNode
  /** Serialised asset id for drag-and-drop onto the page. */
  dragData: string
  onAdd: () => void
}

/** Draggable tile inside the sidebar panel. Click (or Enter) also adds it to the page. */
export function SidebarAsset({ name, preview, dragData, onAdd }: SidebarAssetProps) {
  return (
    <button
      type="button"
      className={s.assetTile}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-junk-asset', dragData)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={onAdd}
      aria-label={`Add ${name} to page`}
    >
      <span className={s.assetTilePreview}>{preview}</span>
      {name}
    </button>
  )
}

export function SidebarAssetGrid({ children }: { children: ReactNode }) {
  return <div className={s.assetGrid}>{children}</div>
}

/* ========== CanvasArea, Page, PageElement, Spread (§6.3) ========== */
export type PaperType = 'white' | 'cream' | 'lined' | 'grid' | 'dotted' | 'kraft' | 'vintage' | 'floral'

export interface CanvasAreaProps {
  children: ReactNode
  /** Floating UI (mode banner, toolbars, crop bar) positioned over the canvas. */
  overlay?: ReactNode
  onDropAsset?: (data: string, x: number, y: number) => void
}

export function CanvasArea({ children, overlay, onDropAsset }: CanvasAreaProps) {
  return (
    <section
      className={s.canvas}
      aria-label="Page canvas"
      onDragOver={(e) => onDropAsset && e.preventDefault()}
      onDrop={(e) => {
        const data = e.dataTransfer.getData('application/x-junk-asset')
        if (!data || !onDropAsset) return
        e.preventDefault()
        onDropAsset(data, e.clientX, e.clientY)
      }}
    >
      {children}
      {overlay && <div className={s.canvasOverlay}>{overlay}</div>}
    </section>
  )
}

export interface PageProps {
  width?: number
  height?: number
  paper?: PaperType
  /** Custom uploaded background image (overrides paper). */
  backgroundImage?: string
  zoom?: number
  children?: ReactNode
  label?: string
}

/** Fixed-size, square-cornered paper page. Children are absolutely positioned PageElements. */
export function Page({ width = 560, height = 720, paper = 'lined', backgroundImage, zoom = 1, children, label = 'Page' }: PageProps) {
  const style: CSSProperties = {
    width,
    height,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' } : {}),
  }
  return (
    <div className={cx(s.page, s[`paper-${paper}`])} style={style} role="group" aria-label={label}>
      {children}
    </div>
  )
}

export interface PageElementProps {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  opacity?: number
  zIndex?: number
  /** Accessible name, e.g. "Matcha polaroid, photo". */
  label: string
  selected?: boolean
  onSelect?: () => void
  children: ReactNode
}

/** One independent instance on the page (its own transform, opacity and z-order). */
export function PageElement({ x, y, width, height, rotation = 0, opacity = 1, zIndex, label, selected, onSelect, children }: PageElementProps) {
  return (
    <div
      className={s.element}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      style={{ left: x, top: y, width, height, opacity, zIndex, transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      onPointerDown={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.()}
    >
      {children}
    </div>
  )
}

/** Two-page spread (§6.3, phase 7): two Pages side by side with a spine shadow. */
export function SpreadView({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className={s.spread}>
      {left}
      {right}
      <span className={s.spine} aria-hidden />
    </div>
  )
}

/* ========== PropertiesPanel (§6.9) ========== */
export function PropertiesPanel({ children, footer, label = 'Properties' }: { children: ReactNode; footer?: ReactNode; label?: string }) {
  return (
    <aside className={s.props} aria-label={label}>
      {children}
      {footer && <div className={s.propsFooter}>{footer}</div>}
    </aside>
  )
}

export function PropHead({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className={s.propHead}>
      <span className={s.typeBadge} aria-hidden>
        <Icon size={18} />
      </span>
      <div>
        <h2 className={s.propTitle}>{title}</h2>
        {subtitle && <p className={s.propSub}>{subtitle}</p>}
      </div>
    </div>
  )
}

export function PropGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className={s.group}>
      <legend className={s.groupLabel}>{label}</legend>
      {children}
    </fieldset>
  )
}

/** Horizontal row of controls inside a PropGroup (e.g. X | Y). */
export function PropRow({ children }: { children: ReactNode }) {
  return <div className={s.row}>{children}</div>
}

/** Duplicate + Delete pinned to the bottom of the panel. */
export function ElementActions({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <>
      <Button fullWidth onClick={onDuplicate}>
        Duplicate
      </Button>
      <Button variant="destructive" fullWidth onClick={onDelete}>
        Delete
      </Button>
    </>
  )
}

export type LayerMove = 'front' | 'forward' | 'backward' | 'back'

/** Bring to front / forward / backward / send to back. */
export function LayerButtons({ onMove }: { onMove: (move: LayerMove) => void }) {
  const items: Array<[LayerMove, LucideIcon, string]> = [
    ['front', BringToFront, 'Bring to front'],
    ['forward', ArrowUp, 'Bring forward'],
    ['backward', ArrowDown, 'Send backward'],
    ['back', SendToBack, 'Send to back'],
  ]
  return (
    <div className={s.iconRow}>
      {items.map(([move, Icon, label]) => (
        <button key={move} type="button" className={s.squareBtn} aria-label={label} title={label} onClick={() => onMove(move)}>
          <Icon size={18} aria-hidden />
        </button>
      ))}
    </div>
  )
}

/** Row of square icon toggles (crop tools, brush ops). */
export function IconToggleRow({
  items,
  value,
  onChange,
  label,
}: {
  items: Array<{ value: string; icon: LucideIcon; label: string }>
  value?: string
  onChange: (value: string) => void
  label: string
}) {
  return (
    <div className={s.iconRow} role="group" aria-label={label}>
      {items.map(({ value: v, icon: Icon, label: l }) => (
        <button key={v} type="button" className={s.squareBtn} aria-label={l} title={l} aria-pressed={v === value} onClick={() => onChange(v)}>
          <Icon size={18} aria-hidden />
        </button>
      ))}
    </div>
  )
}

/* ========== LayerList (§6.10) ========== */
export interface Layer {
  id: string
  name: string
  icon: LucideIcon
  locked?: boolean
  hidden?: boolean
  /** The background row is always last and locked. */
  isBackground?: boolean
}

export interface LayerListProps {
  /** Top layer first. */
  layers: Layer[]
  selectedId?: string
  onSelect: (id: string) => void
  onToggleLock: (id: string) => void
  onToggleVisible: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function LayerList({ layers, selectedId, onSelect, onToggleLock, onToggleVisible, onReorder }: LayerListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  function onReorderKey(e: KeyboardEvent<HTMLElement>, i: number) {
    if (!e.altKey) return
    if (e.key === 'ArrowUp' && i > 0) onReorder(i, i - 1)
    else if (e.key === 'ArrowDown' && i < layers.length - 1 && !layers[i + 1].isBackground) onReorder(i, i + 1)
    else return
    e.preventDefault()
  }

  return (
    <ul className={s.layers} role="listbox" aria-label="Layers, top first">
      {layers.map((l, i) => {
        const selected = l.id === selectedId
        const Icon = l.icon
        return (
          <li key={l.id} style={{ display: 'contents' }}>
            {dropIndex === i && dragIndex !== null && dragIndex !== i && <div className={s.dropLine} aria-hidden />}
            <div
              role="option"
              aria-selected={selected}
              tabIndex={0}
              className={cx(s.layer, dragIndex === i && s.layerDragging)}
              draggable={!l.isBackground}
              onClick={() => onSelect(l.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(l.id)
                onReorderKey(e, i)
              }}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                if (l.isBackground) return
                e.preventDefault()
                setDropIndex(i)
              }}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i)
                setDragIndex(null)
                setDropIndex(null)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                setDropIndex(null)
              }}
            >
              <GripVertical className={s.layerGrip} size={16} aria-hidden />
              <span className={s.layerThumb} aria-hidden>
                <Icon size={16} />
              </span>
              <span className={s.layerName}>{l.name}</span>
              <button
                type="button"
                className={cx(s.layerToggle, !l.locked && s.layerToggleOff)}
                aria-label={l.locked ? `Unlock ${l.name}` : `Lock ${l.name}`}
                aria-pressed={!!l.locked}
                disabled={l.isBackground}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleLock(l.id)
                }}
              >
                {l.locked ? <Lock size={16} aria-hidden /> : <LockOpen size={16} aria-hidden />}
              </button>
              <button
                type="button"
                className={cx(s.layerToggle, l.hidden && s.layerToggleOff)}
                aria-label={l.hidden ? `Show ${l.name}` : `Hide ${l.name}`}
                aria-pressed={!l.hidden}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisible(l.id)
                }}
              >
                {l.hidden ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ========== PaperSwatch (§6.11) ========== */
export interface PaperSwatchProps {
  paper: PaperType
  name: string
  selected?: boolean
  onSelect: () => void
}

/** Use inside a role="radiogroup" container. */
export function PaperSwatch({ paper, name, selected, onSelect }: PaperSwatchProps) {
  return (
    <button type="button" role="radio" aria-checked={!!selected} className={s.paperSwatch} onClick={onSelect}>
      <span className={cx(s.paperChip, s[`paper-${paper}`])}>
        {selected && (
          <span className={s.paperCheck} aria-hidden>
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </span>
      {name}
    </button>
  )
}

/* ========== UploadItem (§6.12) ========== */
export interface UploadItemProps {
  name: string
  status: 'uploading' | 'processing' | 'done' | 'error'
  /** 0–1 while uploading */
  progress?: number
  error?: string
  onRetry?: () => void
  onChooseAnother?: () => void
}

export function UploadItem({ name, status, progress = 0, error, onRetry, onChooseAnother }: UploadItemProps) {
  const Icon = status === 'error' ? CircleAlert : status === 'done' ? CircleCheck : Image
  return (
    <div className={cx(s.upload, status === 'error' && s.uploadError)}>
      <div className={s.uploadHead}>
        <Icon size={18} aria-hidden />
        <span>{name}</span>
      </div>
      {status === 'error' ? (
        <>
          <p className={s.uploadMsg} role="alert">
            {error ?? 'Upload failed.'}
          </p>
          <div className={s.row}>
            {onRetry && <TextLink onClick={onRetry}>Retry</TextLink>}
            {onChooseAnother && <TextLink onClick={onChooseAnother}>Choose another</TextLink>}
          </div>
        </>
      ) : status === 'done' ? (
        <p className={s.uploadMsg}>Ready</p>
      ) : (
        <ProgressBar
          size="sm"
          value={status === 'processing' ? 1 : progress}
          status={status === 'processing' ? 'Optimising preview…' : `Uploading · ${Math.round(progress * 100)}%`}
        />
      )}
    </div>
  )
}
