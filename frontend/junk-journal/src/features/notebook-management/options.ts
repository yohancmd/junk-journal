import type { CoverTheme, PageSize, PaperBackground } from '../../types'

export const PAPERS: Array<{ value: PaperBackground; label: string }> = [
  { value: 'white', label: 'White' },
  { value: 'cream', label: 'Cream' },
  { value: 'grid', label: 'Grid' },
  { value: 'lined', label: 'Lined' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'kraft', label: 'Kraft' },
  { value: 'floral', label: 'Floral' },
]

export const PAGE_SIZES: PageSize[] = ['A5', 'A4', 'Letter', 'Square']

export const COVER_THEMES: Array<{ value: CoverTheme; label: string }> = [
  { value: 'yellow', label: 'Golden Yellow' },
  { value: 'green', label: 'La Salle Green' },
  { value: 'cream', label: 'Light Yellow' },
]
