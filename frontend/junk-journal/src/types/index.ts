/**
 * Domain types, mirroring the data model in claude/technical-claude.md §4–5.
 * Field names are camelCase on the frontend; the API layer maps snake_case.
 */

export interface User {
  id: string
  username: string
  email: string
  /** Display initials for the avatar. */
  initials: string
}

export type PageSize = 'A5' | 'A4' | 'Letter' | 'Square'
export type PaperBackground = 'white' | 'cream' | 'lined' | 'grid' | 'dotted' | 'kraft' | 'vintage' | 'floral'
export type CoverTheme = 'yellow' | 'green' | 'cream'

export interface Notebook {
  id: string
  title: string
  description?: string
  coverImage?: string
  theme: CoverTheme
  /** Handwritten line on the cover (decorative). */
  coverAccent?: string
  pageSize: PageSize
  defaultBackground: PaperBackground
  pageCount: number
  createdAt: string
  updatedAt: string
  /** Human-readable "edited today" label (mock only; the API returns timestamps). */
  editedLabel: string
}

export interface BackgroundConfig {
  paper: PaperBackground
  imageUrl?: string
}

interface ElementBase {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity?: number
  zIndex: number
  locked?: boolean
  hidden?: boolean
}

export interface StickerElement extends ElementBase {
  type: 'sticker'
  assetId: string
}

export interface ImageElement extends ElementBase {
  type: 'image'
  assetId: string
  crop?: { type: 'rect' | 'lasso' | 'polygon'; points: Array<[number, number]> }
}

export interface WashiElement extends ElementBase {
  type: 'washi_tape'
  assetId: string
}

export interface TextElement extends ElementBase {
  type: 'text'
  content: string
  fontFamily: string
  fontSize: number
  color: string
}

export interface DrawingElement extends ElementBase {
  type: 'drawing'
  brush: 'pen' | 'pencil' | 'marker' | 'highlighter'
  color: string
  size: number
  points: Array<[number, number, number?]>
}

export type CanvasElement = StickerElement | ImageElement | WashiElement | TextElement | DrawingElement

export interface JournalPage {
  id: string
  notebookId: string
  pageNumber: number
  background: BackgroundConfig
  canvasWidth: number
  canvasHeight: number
  content: { version: 1; elements: CanvasElement[] }
}

export interface StickerAsset {
  id: string
  name: string
  category: string
  /** Transparent processed image; undefined in mocks (an icon placeholder is shown). */
  processedImage?: string
  /** Lucide icon name used by mocks when there is no image. */
  mockIcon?: string
  mockColor?: 'yellow' | 'cream'
  collections: string[]
  createdAt: string
}

export type TapePatternName = 'solid' | 'dots' | 'stripes' | 'gingham' | 'grid' | 'check' | 'florals' | 'hearts' | 'vintage' | 'image'
export type TapeEdgeStyle = 'straight' | 'torn' | 'uneven' | 'scalloped'

export interface WashiTapeAsset {
  id: string
  name: string
  pattern: TapePatternName
  baseColor: string
  patternColor: string
  width: number
  defaultLength: number
  edgeStyle: TapeEdgeStyle
  opacity: number
  patternImage?: string
}

export type AssetKind = 'Photo' | 'Sticker' | 'Washi' | 'Paper' | 'Background' | 'Upload' | 'Extracted'

export interface LibraryAsset {
  id: string
  name: string
  kind: AssetKind
  category: string
  collections: string[]
  /** Image URL when available. */
  preview?: string
  /** For sticker/washi/paper kinds, the source asset used to draw the preview. */
  refId?: string
  paper?: PaperBackground
  usedOnPages: number
  usedInNotebooks: number
  createdAt: string
  updatedAt: string
  sizeLabel?: string
}

export interface AssetCollection {
  id: string
  name: string
  description?: string
  count: number
}
