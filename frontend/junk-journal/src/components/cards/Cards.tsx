import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Copy, FolderPlus, Image, MoreHorizontal, PenLine, Pencil, Plus, Trash2 } from 'lucide-react'
import { cx } from '../utils/cx'
import { IconButton } from '../primitives/IconButton'
import { Tag, TextLink } from '../primitives/Controls'
import { Menu, MenuAnchor } from '../overlays/Overlays'
import type { MenuItem } from '../overlays/Overlays'
import s from './cards.module.css'

interface QuickAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  destructive?: boolean
}

function QuickActions({ actions, className }: { actions: QuickAction[]; className: string }) {
  return (
    <div className={className}>
      {actions.map(({ label, icon: Icon, onClick, destructive }) => (
        <button
          key={label}
          type="button"
          className={cx(s.qa, destructive && s.qaDanger)}
          aria-label={label}
          title={label}
          onClick={onClick}
        >
          <Icon size={16} aria-hidden />
        </button>
      ))}
    </div>
  )
}

/* ---------- NotebookCard (§5.1) ---------- */
export type CoverColor = 'yellow' | 'green' | 'cream'

const COVER: Record<CoverColor, { bg: string; accent: string }> = {
  yellow: { bg: 'var(--color-yellow)', accent: 'var(--color-green)' },
  green: { bg: 'var(--color-green)', accent: 'var(--color-yellow)' },
  // Never a Jasper cover (5% rule): cream with a Jasper accent instead.
  cream: { bg: 'var(--color-cream)', accent: 'var(--color-red)' },
}

export interface NotebookCardProps {
  title: string
  meta: string
  coverColor?: CoverColor
  /** Optional cover image URL; overrides coverColor. */
  coverImage?: string
  coverAccent?: string
  onOpen: () => void
  menuItems?: MenuItem[]
  dragging?: boolean
  fill?: boolean
}

export function NotebookCard({
  title,
  meta,
  coverColor = 'yellow',
  coverImage,
  coverAccent,
  onOpen,
  menuItems,
  dragging,
  fill,
}: NotebookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const c = COVER[coverColor]
  const coverStyle: CSSProperties = coverImage
    ? { backgroundImage: `url(${coverImage})` }
    : { background: c.bg }
  return (
    <article className={cx(s.card, s.notebook, fill && s.notebookFill, dragging && s.dragging)}>
      <button type="button" className={s.hit} aria-label={`Open ${title}`} onClick={onOpen} />
      <div className={s.notebookCover} style={coverStyle} aria-hidden>
        <span className={s.coverTape} />
        {coverAccent && (
          <span className={s.coverAccent} style={{ color: c.accent }}>
            {coverAccent}
          </span>
        )}
      </div>
      <div className={s.cardBody}>
        <h3 className={s.cardTitle}>{title}</h3>
        <p className={s.cardMeta}>{meta}</p>
      </div>
      {menuItems && menuItems.length > 0 && (
        <MenuAnchor className={s.cardMenu}>
          <IconButton
            icon={MoreHorizontal}
            label={`${title} options`}
            size="sm"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          />
          <Menu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
            label={`${title} options`}
            placement="bottom-end"
          />
        </MenuAnchor>
      )}
    </article>
  )
}

/* ---------- PageThumbnail (§5.2) ---------- */
export interface PageThumbnailProps {
  number: number
  /** Small preview of the page content. */
  children?: ReactNode
  selected?: boolean
  dragging?: boolean
  size?: 'strip' | 'large'
  onOpen: () => void
  onDuplicate?: () => void
  onChangeBackground?: () => void
  onDelete?: () => void
}

export function PageThumbnail({
  number,
  children,
  selected,
  dragging,
  size = 'strip',
  onOpen,
  onDuplicate,
  onChangeBackground,
  onDelete,
}: PageThumbnailProps) {
  const actions: QuickAction[] = [
    onDuplicate && { label: 'Duplicate page', icon: Copy, onClick: onDuplicate },
    onChangeBackground && { label: 'Change background', icon: Image, onClick: onChangeBackground },
    onDelete && { label: 'Delete page', icon: Trash2, onClick: onDelete, destructive: true },
  ].filter(Boolean) as QuickAction[]
  return (
    <div className={s.thumbWrap} style={size === 'large' ? { width: '100%' } : undefined}>
      <button
        type="button"
        className={cx(s.thumb, size === 'large' && s.thumbLarge, selected && s.thumbSelected, dragging && s.thumbDragging)}
        aria-label={`Open page ${number}`}
        aria-current={selected ? 'page' : undefined}
        onClick={onOpen}
      >
        {children}
      </button>
      {actions.length > 0 && <QuickActions actions={actions} className={s.thumbActions} />}
      <span className={cx(s.thumbNum, (selected || dragging) && s.thumbNumStrong)}>
        {dragging ? `Moving · Page ${number}` : size === 'large' ? `Page ${number}` : number}
      </span>
    </div>
  )
}

export function AddPageTile({ onClick, size = 'strip' }: { onClick: () => void; size?: 'strip' | 'large' }) {
  return (
    <div className={s.thumbWrap} style={size === 'large' ? { width: '100%' } : undefined}>
      <button type="button" className={cx(s.thumb, s.addThumb, size === 'large' && s.thumbLarge)} onClick={onClick}>
        <Plus size={28} aria-hidden />
        <span className="sr-only">Add page</span>
      </button>
      <span className={cx(s.thumbNum, s.thumbNumStrong)}>Add</span>
    </div>
  )
}

/** 6 px yellow bar marking where a dragged thumbnail will drop. */
export function DropIndicator() {
  return <span className={s.dropIndicator} aria-hidden />
}

/* ---------- TypeBadge & AssetCard (§5.3) ---------- */
export type AssetType = 'Photo' | 'Sticker' | 'Washi' | 'Paper' | 'Background' | 'Upload' | 'Extracted'

export function TypeBadge({ type }: { type: AssetType }) {
  return <span className={s.badge}>{type}</span>
}

export interface AssetCardProps {
  name: string
  type: AssetType
  /** Image URL or custom preview (sticker, tape strip, paper swatch). */
  preview: string | ReactNode
  selected?: boolean
  onClick: () => void
}

export function AssetCard({ name, type, preview, selected, onClick }: AssetCardProps) {
  return (
    <article className={cx(s.card, s.asset, selected && s.selected)}>
      <button type="button" className={s.hit} aria-label={`${name}, ${type}`} onClick={onClick} />
      <div className={s.assetPreview}>
        {typeof preview === 'string' ? <img src={preview} alt="" /> : preview}
        <span className={s.assetBadge}>
          <TypeBadge type={type} />
        </span>
      </div>
      <p className={s.assetName}>{name}</p>
    </article>
  )
}

/* ---------- StickerTile (§5.4) ---------- */
export interface StickerTileProps {
  name: string
  category: string
  /** Usually a <DieCutSticker />. */
  sticker: ReactNode
  onOpen: () => void
  onRename?: () => void
  onAddToCollection?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function StickerTile({ name, category, sticker, onOpen, onRename, onAddToCollection, onEdit, onDelete }: StickerTileProps) {
  const actions: QuickAction[] = [
    onRename && { label: 'Rename', icon: Pencil, onClick: onRename },
    onAddToCollection && { label: 'Add to collection', icon: FolderPlus, onClick: onAddToCollection },
    onEdit && { label: 'Edit in studio', icon: PenLine, onClick: onEdit },
    onDelete && { label: 'Delete', icon: Trash2, onClick: onDelete, destructive: true },
  ].filter(Boolean) as QuickAction[]
  return (
    <article className={cx(s.card, s.sticker)}>
      <button type="button" className={s.hit} aria-label={`${name}, ${category}`} onClick={onOpen} />
      <div className={s.stickerPreview}>{sticker}</div>
      {actions.length > 0 && <QuickActions actions={actions} className={s.tileActions} />}
      <div>
        <h3 className={s.cardTitle} style={{ font: 'var(--text-body)', fontWeight: 600 }}>
          {name}
        </h3>
        <p className={s.cardMeta}>{category}</p>
      </div>
    </article>
  )
}

/* ---------- TapeCard (§5.5) ---------- */
export interface TapeCardProps {
  name: string
  meta: string
  /** Usually a <WashiTape />. */
  tape: ReactNode
  onOpen: () => void
  onRename?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function TapeCard({ name, meta, tape, onOpen, onRename, onEdit, onDelete }: TapeCardProps) {
  const actions: QuickAction[] = [
    onRename && { label: 'Rename', icon: Pencil, onClick: onRename },
    onEdit && { label: 'Edit in studio', icon: PenLine, onClick: onEdit },
    onDelete && { label: 'Delete', icon: Trash2, onClick: onDelete, destructive: true },
  ].filter(Boolean) as QuickAction[]
  return (
    <article className={cx(s.card, s.tape)}>
      <button type="button" className={s.hit} aria-label={name} onClick={onOpen} />
      <div className={s.tapeStrip}>{tape}</div>
      <div className={s.tapeText}>
        <h3 style={{ font: 'var(--text-body)', fontWeight: 600 }}>{name}</h3>
        <p className={s.cardMeta}>{meta}</p>
      </div>
      {actions.length > 0 && <QuickActions actions={actions} className={s.tapeActions} />}
    </article>
  )
}

/* ---------- CollectionList (§5.6) ---------- */
export interface Collection {
  id: string
  name: string
  count: number
}

export interface CollectionListProps {
  collections: Collection[]
  activeId?: string
  onSelect: (id: string) => void
  onNew?: () => void
  title?: string
}

export function CollectionList({ collections, activeId, onSelect, onNew, title = 'Collections' }: CollectionListProps) {
  return (
    <nav className={s.collections} aria-label={title}>
      <p className={s.collectionsTitle}>{title}</p>
      {collections.map((c) => (
        <button
          key={c.id}
          type="button"
          className={s.collection}
          aria-current={c.id === activeId ? 'true' : undefined}
          onClick={() => onSelect(c.id)}
        >
          <span>{c.name}</span>
          <span>{c.count}</span>
        </button>
      ))}
      {onNew && (
        <button type="button" className={s.newCollection} onClick={onNew}>
          <Plus size={16} aria-hidden />
          New collection
        </button>
      )}
    </nav>
  )
}

/* ---------- CollectionHeader (§5.7) ---------- */
export interface CollectionHeaderProps {
  description: string
  meta: string
  onAdd: () => void
  onRename: () => void
  onDelete: () => void
}

export function CollectionHeader({ description, meta, onAdd, onRename, onDelete }: CollectionHeaderProps) {
  return (
    <div className={s.collectionHeader}>
      <div>
        <p>{description}</p>
        <p>{meta}</p>
      </div>
      <div className={s.collectionActions}>
        <button type="button" className={s.addPill} onClick={onAdd}>
          <Plus size={16} aria-hidden />
          Add assets
        </button>
        <IconButton icon={Pencil} label="Rename collection" tone="onBrand" size="sm" onClick={onRename} />
        <IconButton icon={Trash2} label="Delete collection" tone="onBrand" size="sm" onClick={onDelete} />
      </div>
    </div>
  )
}

/* ---------- FilterBar (§5.8) ---------- */
export interface Filter {
  id: string
  label: string
  count?: number
}

export interface FilterBarProps {
  filters: Filter[]
  selected: string[]
  onToggle: (id: string) => void
  /** Shown while filters or a search are active, e.g. "3 stickers match “flower”". */
  resultText?: string
  onClear?: () => void
}

export function FilterBar({ filters, selected, onToggle, resultText, onClear }: FilterBarProps) {
  return (
    <div className={s.filterBar}>
      <div className={s.filterRow} role="group" aria-label="Filters">
        {filters.map((f) => (
          <Tag key={f.id} label={f.label} count={f.count} selected={selected.includes(f.id)} onClick={() => onToggle(f.id)} />
        ))}
      </div>
      {resultText && (
        <div className={s.filterResult} aria-live="polite">
          <span>{resultText}</span>
          {onClear && <TextLink onClick={onClear}>Clear filters</TextLink>}
        </div>
      )}
    </div>
  )
}
