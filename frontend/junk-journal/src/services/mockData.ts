/**
 * Mock data for the screen prototypes (first milestone: frontend with mock data,
 * claude/technical-claude.md §8). Replace with Axios calls to the Django API later;
 * screens should only read data through this module (or the future services).
 */
import type {
  AssetCollection,
  JournalPage,
  LibraryAsset,
  Notebook,
  StickerAsset,
  User,
  WashiTapeAsset,
} from '../types'

export const currentUser: User = { id: 'u1', username: 'mira', email: 'mira@example.com', initials: 'MS' }
export const currentUserName = 'Mira Santos'

export const notebooks: Notebook[] = [
  { id: 'nb-travel', title: 'Travel Journal', description: 'Tickets, temple stamps, food we loved and everything in between.', theme: 'yellow', coverAccent: 'our summer', pageSize: 'A5', defaultBackground: 'dotted', pageCount: 24, createdAt: '2026-06-02', updatedAt: '2026-11-11', editedLabel: 'edited today' },
  { id: 'nb-daily', title: 'Daily Journal', theme: 'green', coverAccent: 'day by day', pageSize: 'A5', defaultBackground: 'lined', pageCount: 61, createdAt: '2026-01-01', updatedAt: '2026-11-10', editedLabel: 'edited yesterday' },
  { id: 'nb-reading', title: 'Reading Journal', theme: 'cream', coverAccent: 'books & tea', pageSize: 'A5', defaultBackground: 'grid', pageCount: 12, createdAt: '2026-03-14', updatedAt: '2026-11-09', editedLabel: 'edited Mon' },
  { id: 'nb-memory', title: 'Memory Book', theme: 'cream', coverAccent: 'since 2024', pageSize: 'A4', defaultBackground: 'cream', pageCount: 8, createdAt: '2024-05-20', updatedAt: '2026-11-03', editedLabel: 'edited 3 Nov' },
  { id: 'nb-art', title: 'Art Journal', theme: 'yellow', pageSize: 'Square', defaultBackground: 'white', pageCount: 15, createdAt: '2025-09-01', updatedAt: '2026-10-21', editedLabel: 'edited 21 Oct' },
  { id: 'nb-recap', title: 'Monthly Recap', theme: 'green', pageSize: 'A5', defaultBackground: 'lined', pageCount: 10, createdAt: '2026-01-31', updatedAt: '2026-10-31', editedLabel: 'edited 31 Oct' },
  { id: 'nb-garden', title: 'Garden Notes', theme: 'cream', pageSize: 'A5', defaultBackground: 'kraft', pageCount: 6, createdAt: '2026-04-02', updatedAt: '2026-09-12', editedLabel: 'edited 12 Sep' },
]

export const stickers: StickerAsset[] = [
  { id: 'st-daisy', name: 'Pressed daisy', category: 'Florals', mockIcon: 'flower', collections: ['garden'], createdAt: '2026-11-10' },
  { id: 'st-cat', name: 'Sleepy Mochi', category: 'Pets', mockIcon: 'cat', collections: ['cats'], createdAt: '2026-11-09' },
  { id: 'st-star', name: 'Gold star', category: 'Shapes', mockIcon: 'star', collections: [], createdAt: '2026-11-08' },
  { id: 'st-plane', name: 'Paper plane', category: 'Travel', mockIcon: 'plane', mockColor: 'cream', collections: ['japan'], createdAt: '2026-11-07' },
  { id: 'st-matcha', name: 'Matcha set', category: 'Food', mockIcon: 'coffee', collections: ['japan'], createdAt: '2026-11-06' },
  { id: 'st-maple', name: 'Maple leaf', category: 'Travel', mockIcon: 'leaf', collections: ['japan'], createdAt: '2026-11-05' },
  { id: 'st-heart', name: 'Love note', category: 'Shapes', mockIcon: 'heart', mockColor: 'cream', collections: [], createdAt: '2026-11-04' },
  { id: 'st-blossom', name: 'Cherry blossom', category: 'Florals', mockIcon: 'flower', mockColor: 'cream', collections: ['garden'], createdAt: '2026-11-03' },
]

export const tapes: WashiTapeAsset[] = [
  { id: 'tp-polka', name: 'Sunny polka', pattern: 'dots', baseColor: 'var(--color-yellow)', patternColor: 'var(--color-red)', width: 40, defaultLength: 220, edgeStyle: 'torn', opacity: 0.9 },
  { id: 'tp-gingham', name: 'Garden gingham', pattern: 'gingham', baseColor: 'var(--color-cream)', patternColor: 'var(--color-green)', width: 40, defaultLength: 220, edgeStyle: 'straight', opacity: 0.9 },
  { id: 'tp-check', name: 'Picnic check', pattern: 'check', baseColor: 'var(--color-yellow)', patternColor: 'var(--color-green)', width: 40, defaultLength: 220, edgeStyle: 'scalloped', opacity: 0.9 },
  { id: 'tp-hearts', name: 'Love letters', pattern: 'hearts', baseColor: 'var(--color-cream)', patternColor: 'var(--color-red)', width: 40, defaultLength: 220, edgeStyle: 'uneven', opacity: 0.9 },
  { id: 'tp-stripes', name: 'Forest stripes', pattern: 'stripes', baseColor: 'var(--color-green)', patternColor: 'var(--color-yellow)', width: 40, defaultLength: 220, edgeStyle: 'torn', opacity: 0.9 },
  { id: 'tp-florals', name: 'Pressed flowers', pattern: 'florals', baseColor: 'var(--color-green)', patternColor: 'var(--color-yellow)', width: 40, defaultLength: 220, edgeStyle: 'straight', opacity: 0.9 },
  { id: 'tp-grid', name: 'Graph paper', pattern: 'grid', baseColor: 'var(--color-cream)', patternColor: 'var(--color-green)', width: 40, defaultLength: 220, edgeStyle: 'torn', opacity: 0.9 },
  { id: 'tp-map', name: 'Old map', pattern: 'vintage', baseColor: '#E9D9A6', patternColor: 'var(--color-green)', width: 40, defaultLength: 220, edgeStyle: 'uneven', opacity: 0.9 },
]

export const collections: AssetCollection[] = [
  { id: 'all', name: 'All assets', count: 186 },
  { id: 'japan', name: 'Japan 2026', description: 'Kyoto & Osaka · June 2026', count: 42 },
  { id: 'garden', name: 'Garden', count: 19 },
  { id: 'cats', name: 'Cozy cats', count: 11 },
  { id: 'paper', name: 'Paper stash', count: 23 },
]

export const libraryAssets: LibraryAsset[] = [
  { id: 'as-temple', name: 'Temple roof', kind: 'Photo', category: 'Travel', collections: ['japan'], usedOnPages: 4, usedInNotebooks: 2, createdAt: '14 Jun 2026', updatedAt: '2 days ago', sizeLabel: '4032 × 3024 · 2.1 MB' },
  { id: 'as-mochi', name: 'Sleepy Mochi', kind: 'Sticker', refId: 'st-cat', category: 'Pets', collections: ['cats'], usedOnPages: 2, usedInNotebooks: 1, createdAt: '9 Nov 2026', updatedAt: '9 Nov 2026' },
  { id: 'as-polka', name: 'Sunny polka', kind: 'Washi', refId: 'tp-polka', category: 'Patterns', collections: [], usedOnPages: 6, usedInNotebooks: 3, createdAt: '1 Oct 2026', updatedAt: '1 Oct 2026' },
  { id: 'as-lined', name: 'Lined cream', kind: 'Paper', paper: 'lined', category: 'Paper', collections: ['paper'], usedOnPages: 30, usedInNotebooks: 2, createdAt: '1 Jan 2026', updatedAt: '1 Jan 2026' },
  { id: 'as-matcha', name: 'Matcha set', kind: 'Photo', category: 'Food', collections: ['japan'], usedOnPages: 1, usedInNotebooks: 1, createdAt: '15 Jun 2026', updatedAt: '15 Jun 2026' },
  { id: 'as-daisy', name: 'Pressed daisy', kind: 'Sticker', refId: 'st-daisy', category: 'Florals', collections: ['garden'], usedOnPages: 3, usedInNotebooks: 2, createdAt: '10 Nov 2026', updatedAt: '10 Nov 2026' },
  { id: 'as-gingham', name: 'Garden gingham', kind: 'Washi', refId: 'tp-gingham', category: 'Patterns', collections: ['garden'], usedOnPages: 2, usedInNotebooks: 1, createdAt: '3 Sep 2026', updatedAt: '3 Sep 2026' },
  { id: 'as-kraft', name: 'Kraft', kind: 'Background', paper: 'kraft', category: 'Paper', collections: ['paper'], usedOnPages: 6, usedInNotebooks: 1, createdAt: '2 Apr 2026', updatedAt: '2 Apr 2026' },
  { id: 'as-dotonbori', name: 'Dotonbori', kind: 'Upload', category: 'Travel', collections: ['japan'], usedOnPages: 1, usedInNotebooks: 1, createdAt: '13 Jun 2026', updatedAt: '13 Jun 2026' },
  { id: 'as-cutout', name: 'Temple cut-out', kind: 'Extracted', category: 'Travel', collections: ['japan'], usedOnPages: 1, usedInNotebooks: 1, createdAt: '14 Jun 2026', updatedAt: '14 Jun 2026' },
  { id: 'as-wild', name: 'Wildflowers', kind: 'Photo', category: 'Florals', collections: ['garden'], usedOnPages: 2, usedInNotebooks: 1, createdAt: '2 May 2026', updatedAt: '2 May 2026' },
  { id: 'as-star', name: 'Gold star', kind: 'Sticker', refId: 'st-star', category: 'Shapes', collections: [], usedOnPages: 9, usedInNotebooks: 4, createdAt: '8 Nov 2026', updatedAt: '8 Nov 2026' },
  { id: 'as-check', name: 'Picnic check', kind: 'Washi', refId: 'tp-check', category: 'Patterns', collections: [], usedOnPages: 3, usedInNotebooks: 2, createdAt: '20 Aug 2026', updatedAt: '20 Aug 2026' },
  { id: 'as-vintage', name: 'Vintage', kind: 'Paper', paper: 'vintage', category: 'Paper', collections: ['paper'], usedOnPages: 4, usedInNotebooks: 1, createdAt: '5 Feb 2026', updatedAt: '5 Feb 2026' },
  { id: 'as-heart', name: 'Love note', kind: 'Sticker', refId: 'st-heart', category: 'Shapes', collections: [], usedOnPages: 5, usedInNotebooks: 3, createdAt: '4 Nov 2026', updatedAt: '4 Nov 2026' },
]

/** Sample page used by the editor screens (A5 at 560 × 720 display units). */
export const samplePage: JournalPage = {
  id: 'pg-3',
  notebookId: 'nb-travel',
  pageNumber: 3,
  background: { paper: 'lined' },
  canvasWidth: 560,
  canvasHeight: 720,
  content: {
    version: 1,
    elements: [
      { id: 'el-photo', type: 'image', assetId: 'as-temple', x: 84, y: 70, width: 270, height: 200, rotation: 3, zIndex: 1 },
      { id: 'el-tape-1', type: 'washi_tape', assetId: 'tp-polka', x: 180, y: 52, width: 120, height: 32, rotation: -6, zIndex: 2, opacity: 0.9 },
      { id: 'el-polaroid', type: 'image', assetId: 'as-matcha', x: 330, y: 250, width: 190, height: 226, rotation: -6, zIndex: 3 },
      { id: 'el-tape-2', type: 'washi_tape', assetId: 'tp-hearts', x: 386, y: 236, width: 100, height: 28, rotation: 14, zIndex: 4, opacity: 0.9 },
      { id: 'el-sticker', type: 'sticker', assetId: 'st-daisy', x: 240, y: 420, width: 110, height: 110, rotation: 0, zIndex: 5 },
      { id: 'el-text', type: 'text', x: 84, y: 520, width: 320, height: 90, rotation: -2, zIndex: 6, content: 'day 3 — the temple\nat dawn, so quiet', fontFamily: 'Caveat', fontSize: 34, color: 'var(--color-green)' },
      { id: 'el-typed', type: 'text', x: 84, y: 630, width: 360, height: 50, rotation: 0, zIndex: 7, content: 'We walked 18,000 steps and ate three kinds of mochi.', fontFamily: 'Courier Prime', fontSize: 15, color: 'var(--color-ink)' },
    ],
  },
}

export const fonts = [
  { family: 'Caveat', category: 'Handwriting' as const },
  { family: 'Courier Prime', category: 'Typewriter' as const },
  { family: 'Fraunces', category: 'Serif' as const },
  { family: 'Nunito Sans', category: 'Sans-serif' as const },
]

export const stickerCategories = ['Travel', 'Florals', 'Food', 'Pets', 'Shapes']
