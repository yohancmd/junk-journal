import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Cat, Coffee, Flower2, Heart, Image as ImageIcon, Leaf, Plane, Star } from 'lucide-react'
import { DieCutSticker, Page, PageElement, WashiTape } from '../../components'
import type { StickerAsset, WashiTapeAsset, JournalPage, CanvasElement } from '../../types'
import { cx } from '../../components/utils/cx'
import { stickers, tapes } from '../../services/mockData'
import s from './screens.module.css'

const ICONS: Record<string, LucideIcon> = { flower: Flower2, cat: Cat, star: Star, plane: Plane, coffee: Coffee, leaf: Leaf, heart: Heart }

/** Renders a sticker asset: its transparent image, or a mock icon in a die-cut. */
export function StickerArt({ sticker, size = 100, rotation = 0 }: { sticker: StickerAsset; size?: number; rotation?: number }) {
  if (sticker.processedImage) {
    return <DieCutSticker src={sticker.processedImage} alt={sticker.name} width={size} height={size} rotation={rotation} />
  }
  const Icon = ICONS[sticker.mockIcon ?? 'star'] ?? Star
  const cream = sticker.mockColor === 'cream'
  return (
    <DieCutSticker width={size} height={size} rotation={rotation} alt={sticker.name} fallbackBackground={cream ? 'var(--color-cream)' : 'var(--color-yellow)'} borderWidth={Math.max(4, Math.round(size / 16))}>
      <Icon size={Math.round(size * 0.48)} color={sticker.mockIcon === 'heart' ? 'var(--color-red)' : 'var(--color-green)'} aria-hidden />
    </DieCutSticker>
  )
}

/** Renders a washi tape asset at a given length. */
export function TapeArt({ tape, length, width, rotation, bg }: { tape: WashiTapeAsset; length?: number; width?: number; rotation?: number; bg?: string }) {
  return (
    <WashiTape
      pattern={tape.pattern}
      baseColor={tape.baseColor}
      patternColor={tape.patternColor}
      edge={tape.edgeStyle}
      opacity={tape.opacity}
      width={width ?? tape.width}
      length={length ?? tape.defaultLength}
      rotation={rotation}
      imageSrc={tape.patternImage}
      title={bg ? undefined : tape.name}
    />
  )
}

export type PhotoTone = 'yellow' | 'green' | 'cream'

/** Placeholder for user photos until real uploads exist. */
export function MockPhoto({ tone = 'yellow', polaroid, label }: { tone?: PhotoTone; polaroid?: boolean; label?: string }) {
  return (
    <div className={cx(s.photo, polaroid && s.photoPolaroid)} role="img" aria-label={label ?? 'Photo'}>
      <div className={cx(s.photoInner, tone === 'yellow' && s.toneYellow, tone === 'green' && s.toneGreen, tone === 'cream' && s.toneCream)}>
        <ImageIcon size={40} aria-hidden />
      </div>
    </div>
  )
}

/** Unframed photo block (asset cards, previews). */
export function MockPhotoBlock({ tone = 'yellow' }: { tone?: PhotoTone }) {
  return (
    <div className={cx(s.photoBlock, tone === 'yellow' && s.toneYellow, tone === 'green' && s.toneGreen, tone === 'cream' && s.toneCream)} aria-hidden>
      <ImageIcon size={36} />
    </div>
  )
}

const PHOTO_TONES: Record<string, PhotoTone> = { 'as-temple': 'yellow', 'as-matcha': 'green', 'as-dotonbori': 'green', 'as-wild': 'cream' }

function ElementArt({ el }: { el: CanvasElement }) {
  switch (el.type) {
    case 'image':
      return <MockPhoto tone={PHOTO_TONES[el.assetId] ?? 'yellow'} polaroid={el.id === 'el-polaroid'} label="Photo" />
    case 'washi_tape': {
      const tape = tapes.find((t) => t.id === el.assetId) ?? tapes[0]
      return <TapeArt tape={tape} length={el.width} width={el.height} />
    }
    case 'sticker': {
      const st = stickers.find((x) => x.id === el.assetId) ?? stickers[0]
      return <StickerArt sticker={st} size={el.width} />
    }
    case 'text':
      return (
        <p className={el.fontFamily === 'Caveat' ? s.handwriting : s.typed} style={{ fontSize: el.fontSize, color: el.color }}>
          {el.content}
        </p>
      )
    default:
      return null
  }
}

function elementLabel(el: CanvasElement): string {
  if (el.type === 'text') return `Text: ${el.content.split('\n')[0]}`
  if (el.type === 'sticker') return `Sticker: ${stickers.find((x) => x.id === el.assetId)?.name ?? ''}`
  if (el.type === 'washi_tape') return `Washi tape: ${tapes.find((t) => t.id === el.assetId)?.name ?? ''}`
  if (el.type === 'image') return 'Photo'
  return 'Drawing'
}

export interface SamplePageViewProps {
  page: JournalPage
  selectedId?: string
  onSelect?: (id: string) => void
  /** Ids to hide (e.g. an element replaced by an overlay). */
  hide?: string[]
  children?: ReactNode
}

/** Renders a JournalPage's elements with the Page / PageElement components. */
export function SamplePageView({ page, selectedId, onSelect, hide = [], children }: SamplePageViewProps) {
  return (
    <Page width={page.canvasWidth} height={page.canvasHeight} paper={page.background.paper} label={`Page ${page.pageNumber}`}>
      {page.content.elements
        .filter((el) => !hide.includes(el.id) && !el.hidden)
        .map((el) => (
          <PageElement
            key={el.id}
            x={el.x}
            y={el.y}
            width={el.width}
            height={el.height}
            rotation={el.rotation}
            opacity={el.opacity}
            zIndex={el.zIndex}
            label={elementLabel(el)}
            selected={el.id === selectedId}
            onSelect={() => onSelect?.(el.id)}
          >
            <ElementArt el={el} />
          </PageElement>
        ))}
      {children}
    </Page>
  )
}

/** Tiny page sketch for thumbnails. */
export function MiniPage({ tone = 'yellow' }: { tone?: PhotoTone }) {
  return (
    <span className={s.miniPage} aria-hidden>
      <span className={cx(s.miniPhoto, tone === 'yellow' && s.toneYellow, tone === 'green' && s.toneGreen, tone === 'cream' && s.toneCream)} />
      <span className={s.miniTape} />
      {[58, 66, 74, 82].map((top, i) => (
        <span key={top} className={s.miniLine} style={{ top: `${top}%`, width: i === 3 ? '40%' : '72%' }} />
      ))}
    </span>
  )
}
