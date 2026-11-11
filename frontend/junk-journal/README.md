# Digital Junk Journal — Frontend

The web frontend for **Digital Junk Journal**, a desktop-first app for making digital notebooks that feel like physical junk journals: photos, die-cut stickers, washi tape, handwriting and paper textures arranged freely on the page.

This is the **first milestone**: a frontend prototype running on mock data. There is no backend yet: sign-in, notebooks and assets are mocked in `src/services/`, ready to be replaced with calls to the Django REST API.

## Reference documents

| Document | What it covers |
|---|---|
| [`claude/product-claude.md`](<../../claude/product-claude.md>) | Product requirements and roadmap |
| [`claude/technical-claude.md`](<../../claude/technical-claude.md>) | Stack, folder structure, routes, data model, API, editor rules |
| [`design system/claude.md`](<../../design system/claude.md>) | Colours, contrast, typography, spacing, tokens |
| [`design system/components.md`](<../../design system/components.md>) | Spec for every UI component |
| [`design system/screens.md`](<../../design system/screens.md>) | Every screen and state, numbered (1.1, 4.2 …) |
| [`claude/learnings.md`](<../../claude/learnings.md>) | Decisions, contradictions between the docs, and known pitfalls |

The visual mockups live in `design system/junkie.pen` (open it with the Pencil extension).

## Getting started

Requires **Node.js 24** (the version used so far) and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). The app starts **signed out**: on the sign-in page, press **Sign in** (any input works; auth is mocked). Use **Sign out** in the account menu to go back.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`), then production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with Oxlint |

Run `npx tsc -b`, `npm run lint` and `npm run build` before calling a change done; all three pass today.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript, built with Vite 8 |
| Routing | React Router 8 (data router: `createBrowserRouter`; `RouterProvider` comes from `react-router/dom`) |
| Styling | CSS Modules + design tokens as CSS custom properties in `src/index.css` |
| Icons | Lucide (`lucide-react`) |
| Canvas | React-Konva (`konva`, `react-konva`, `use-image`). **Installed, not wired in yet**; see "What's next" |
| Linting | Oxlint |

Planned: Axios for API calls once the Django backend exists.

## Project structure

```text
src/
  assets/            images (e.g. the empty-state illustration exported from junkie.pen)
  components/        reusable UI, grouped by kind; import everything from components/index.ts
    primitives/      Button, TextField, Checkbox, Toggle, Slider, Tag, …
    feedback/        Toast + ToastProvider, Banner, SaveStatusPill, Skeleton, EmptyState, …
    overlays/        Modal, Drawer, ConfirmDialog, Menu
    shell/           AppShell, NavRail, PageHeader, Stepper, StudioShell
    cards/           NotebookCard, PageThumbnail, AssetCard, StickerTile, TapeCard, …
    editor/          editor toolbar, sidebar, properties panel, canvas stand-ins, crop/lasso overlays, dialogs
    studio/          DropZone, BeforeAfter, DieCutSticker, WashiTape, PatternPicker, …
    auth/            AuthLayout, PasswordStrength, DangerZone
    constants.ts     shared constants (never export constants from component files)
  features/          one folder per area; each holds its screens
    account/  dashboard/  notebook-management/  journal-editor/
    sticker-studio/  washi-tape-studio/  asset-library/  system/
    shared/          AppPage, shared layout styles, mock artwork
    screenCatalog.tsx  every screen state, used by the /dev pages
  routes/            router.tsx, paths.ts (URL builders), auth guards, route wrappers
  hooks/             useAuth, useLinkProps
  services/          mockData.ts, authService.ts (mock); the API layer goes here
  types/             domain types mirroring the data model
  gallery/           component gallery (dev only)
  index.css          design tokens and base styles
```

The components folder is grouped by kind rather than by the original plan in `technical-claude.md` (common / navigation / notebook / …). The mapping between the two is documented in `technical-claude.md` §2.

## Routes

Every screen has a URL; build URLs with `paths.*` from `src/routes/paths.ts`, never by hand.

| URL | Screen |
|---|---|
| `/sign-in`, `/sign-up`, `/forgot-password` | 1.1–1.3 (signed-out only) |
| `/reset-password/:token` | 1.4 |
| `/dashboard` (`/` redirects here), `/account` | 2.1, 1.5 |
| `/notebooks`, `/notebooks/new` | 3.0 notebook list, 3.1 create modal |
| `/notebooks/:notebookId`, `…/settings`, `…/pages` | 3.2 workspace, 3.4 settings drawer, 3.3 page overview |
| `/notebooks/:notebookId/pages/:pageNumber` (`?view=spread`) | 4.x journal editor, 4.16 spread |
| `/stickers`, `/stickers/new/:step` | 5.6 library, 5.1–5.5 studio steps |
| `/washi-tapes`, `/washi-tapes/new/:step` | 6.6 library, 6.1–6.5 studio steps |
| `/library`, `/library/collections/:id`, `/library/assets/:id` | 7.1, 7.3, 7.4 detail drawer |
| anything else | 8.5 not found |

- **Sign-in required:** every route except the sign-in group. Signed-out users go to `/sign-in` and come back to the page they asked for after signing in.
- **Overlay routes:** the settings drawer and the asset drawer are child routes, so the page behind them stays mounted (search text and filters survive).

### Dev-only pages

Available only in development builds (`npm run dev`):

- `/dev`: every screen state from `screens.md`, including ones that aren't URLs (crop mode, empty states, error states).
- `/dev/screens/:id`: a single state, e.g. `/dev/screens/4.6`.
- `/dev/components`: the component gallery.

## Conventions

- **Tokens only.** Use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)` from `src/index.css`. For transparency use `color-mix()`, never an alpha suffix on a token name. User content (paper colours, photos, pen ink) is the only exception.
- **Follow the design system.**
  - Small text sits only on Light Yellow or Green.
  - Jasper is for destructive or warning states, always paired with an icon or label.
  - One primary button per view.
  - The handwriting font is decoration only.
- **On Green panels,** components set their own text colour, and Green icons inside a selected (Green) row get a yellow or cream background.
- **`import type` for types.** `tsconfig` uses `verbatimModuleSyntax`. Import `ReactNode`, `CSSProperties` and so on from `react`; don't use the `React.` namespace.
- **Fast refresh.** A file that exports components must not also export constants or helpers; put those in a separate `.ts` file (`components/constants.ts`, `notebook-management/options.ts`).
- **Data access.** Screens read data only through `src/services/`, not from hard-coded values, so swapping in the API is a single place.
- **Links.** Use `TextLink` with `useLinkProps()` for in-app links, so they're real `<a href>` elements that still open in a new tab with Ctrl/⌘-click.

## Mock data and auth

- **`src/services/mockData.ts`:** notebooks, stickers, tapes, library assets, collections and one sample page. Photos are placeholder blocks (there are no real images in the repo yet).
- **`src/services/authService.ts`:** stores a signed-in flag in `localStorage` until the auth endpoints exist (`/api/auth/login/`, `/logout/`, `/me/`). Screens use `useAuth()`, never the service directly.

## What's next

Next is the journal editor on **React-Konva**, following `technical-claude.md` §7. The editor's current `Page`, `PageElement`, `SelectionBox` and crop overlays are DOM stand-ins.

1. **Editor state:** add, update, remove and reorder elements, and track the selection.
2. **Konva page:** a Stage with layers for the background, elements, drawing and the Transformer.
3. **Drag and drop:** dropping from the sidebar (`stage.setPointersPositions`) and click-to-add.
4. **Editing elements:** move, resize and rotate with a Transformer styled to the design system.
5. **Then:** undo/redo, the properties panel wired to the selected element, and saving to `localStorage`.

Page coordinates use logical units with a **true A5 ratio** (1 : √2, e.g. 1200 × 1697), never screen pixels.

## Troubleshooting

- **`Cannot find native binding` (rolldown) on build:** npm's optional-dependency bug. Run `npm install` again; if it persists, delete `node_modules` and `package-lock.json`, then `npm install`.
- **Another tool can't reach the dev server on Windows:** Vite binds to IPv6 `localhost`. Start it with `npx vite --host 127.0.0.1`.
- **Deep links 404 after deploying:** the app uses client-side routes, so the production server must return `index.html` for every non-API, non-asset path (a Django catch-all view or a static-host rewrite). The Vite dev and preview servers already do this.
