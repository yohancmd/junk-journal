/**
 * Every URL in the app, built in one place so screens never hard-code paths.
 * Screen numbers refer to design system/screens.md.
 */

/** Sticker Studio steps (5.1–5.5) as URL slugs. */
export const STICKER_STEPS = ['upload', 'background', 'crop', 'outline', 'save'] as const
export type StickerStep = (typeof STICKER_STEPS)[number]

/** Washi Studio steps (6.1–6.5). Step 1 is "pattern" or "upload" depending on the method. */
export const WASHI_STEPS = ['method', 'pattern', 'upload', 'customise', 'save'] as const
export type WashiStep = (typeof WASHI_STEPS)[number]

export const paths = {
  // 1 · Account
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: (token = 'demo') => `/reset-password/${encodeURIComponent(token)}`,
  account: '/account',

  // 2 · Dashboard
  dashboard: '/dashboard',

  // 3 · Notebooks
  notebooks: '/notebooks',
  newNotebook: '/notebooks/new',
  notebook: (notebookId: string) => `/notebooks/${encodeURIComponent(notebookId)}`,
  notebookSettings: (notebookId: string) => `/notebooks/${encodeURIComponent(notebookId)}/settings`,
  notebookPages: (notebookId: string) => `/notebooks/${encodeURIComponent(notebookId)}/pages`,

  // 4 · Editor
  editor: (notebookId: string, pageNumber = 1, view?: 'spread') =>
    `/notebooks/${encodeURIComponent(notebookId)}/pages/${pageNumber}${view ? `?view=${view}` : ''}`,

  // 5 · Sticker Studio
  stickers: '/stickers',
  stickerStudio: (step: StickerStep = 'upload') => `/stickers/new/${step}`,

  // 6 · Washi Tape Studio
  tapes: '/washi-tapes',
  washiStudio: (step: WashiStep = 'method') => `/washi-tapes/new/${step}`,

  // 7 · Asset Library
  library: '/library',
  libraryCollection: (collectionId: string) => `/library/collections/${encodeURIComponent(collectionId)}`,
  libraryAsset: (assetId: string) => `/library/assets/${encodeURIComponent(assetId)}`,

  // Dev only
  dev: '/dev',
  devScreen: (screenId: string) => `/dev/screens/${encodeURIComponent(screenId)}`,
  devComponents: '/dev/components',
} as const
