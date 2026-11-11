import type { LucideIcon } from 'lucide-react'
import { File, History, Image, Ribbon, Sticker, Type, Upload } from 'lucide-react'
import type { TapePattern } from './studio/WashiTape'

/** Accepted upload types (PNG, JPG/JPEG, WEBP). Validate on the server too. */
export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/** Built-in washi patterns shown in the PatternPicker (screen 6.2). */
export const PATTERN_OPTIONS: Array<{ value: TapePattern; label: string }> = [
  { value: 'solid', label: 'Solid' },
  { value: 'dots', label: 'Dots' },
  { value: 'stripes', label: 'Stripes' },
  { value: 'gingham', label: 'Gingham' },
  { value: 'grid', label: 'Grid' },
  { value: 'check', label: 'Check' },
  { value: 'florals', label: 'Florals' },
  { value: 'hearts', label: 'Hand-drawn' },
  { value: 'vintage', label: 'Vintage' },
]

/** Crop aspect ratios (screen 4.6). */
export const CROP_RATIOS = ['Free', '1:1', '4:5', '3:4', '16:9', 'Original'] as const
export type CropRatio = (typeof CROP_RATIOS)[number]

/** Editor sidebar tabs, in order (screen 4.1). */
export type SidebarTab = 'stickers' | 'washi' | 'backgrounds' | 'paper' | 'text' | 'uploads' | 'recent'
export const SIDEBAR_TABS: Array<{ key: SidebarTab; label: string; icon: LucideIcon }> = [
  { key: 'stickers', label: 'Stickers', icon: Sticker },
  { key: 'washi', label: 'Washi', icon: Ribbon },
  { key: 'backgrounds', label: 'Backgrounds', icon: Image },
  { key: 'paper', label: 'Paper', icon: File },
  { key: 'text', label: 'Text', icon: Type },
  { key: 'uploads', label: 'Uploads', icon: Upload },
  { key: 'recent', label: 'Recent', icon: History },
]

/** Keyboard shortcuts grouped for the ShortcutsModal (screen 4.17). */
export const SHORTCUTS: Record<string, Array<[string, string[]]>> = {
  Edit: [
    ['Undo', ['Ctrl', 'Z']],
    ['Redo', ['Ctrl', '⇧', 'Z']],
    ['Duplicate', ['Ctrl', 'D']],
    ['Copy / paste', ['Ctrl', 'C / V']],
    ['Delete', ['Del']],
    ['Exit mode', ['Esc']],
  ],
  Tools: [
    ['Select', ['V']],
    ['Crop', ['C']],
    ['Lasso', ['L']],
    ['Polygon lasso', ['P']],
    ['Pen', ['B']],
    ['Text', ['T']],
  ],
  View: [
    ['Zoom in', ['Ctrl', '+']],
    ['Zoom out', ['Ctrl', '−']],
    ['Fit page', ['Ctrl', '0']],
    ['Guides', ['Ctrl', ';']],
    ['Next page', ['PgDn']],
    ['Shortcuts', ['?']],
  ],
  Layers: [
    ['Forward', ['Ctrl', ']']],
    ['Backward', ['Ctrl', '[']],
    ['To front', ['Ctrl', '⇧', ']']],
    ['To back', ['Ctrl', '⇧', '[']],
    ['Lock', ['Ctrl', 'L']],
  ],
}

/** Simple password heuristic, 0–4. Swap for zxcvbn or the backend's rules if needed. */
export function scorePassword(pw: string): number {
  if (pw.length < 8) return 0
  let score = 1
  if (/[0-9]/.test(pw)) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) score++
  return Math.min(4, score)
}
