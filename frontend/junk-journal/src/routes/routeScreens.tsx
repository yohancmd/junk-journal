/**
 * Route elements: read URL params, look up data, and render the feature screens.
 * Unknown ids render the Not found screen (8.5) instead of crashing.
 */
import { Link, Navigate, isRouteErrorResponse, useLocation, useNavigate, useParams, useRouteError, useSearchParams } from 'react-router'
import { DashboardScreen } from '../features/dashboard/DashboardScreen'
import { NotebookWorkspaceScreen, PageOverviewScreen } from '../features/notebook-management/NotebookScreens'
import { JournalEditorScreen } from '../features/journal-editor/JournalEditorScreen'
import { StickerStudioScreen } from '../features/sticker-studio/StickerStudioScreens'
import { WashiStudioScreen } from '../features/washi-tape-studio/WashiStudioScreens'
import type { WashiMethod } from '../features/washi-tape-studio/WashiStudioScreens'
import { AssetLibraryScreen } from '../features/asset-library/AssetLibraryScreen'
import { NotFoundScreen } from '../features/system/NotFoundScreen'
import { SCREENS } from '../features/screenCatalog'
import { ComponentGallery } from '../gallery/ComponentGallery'
import { getCollection, getNotebook } from '../services/mockData'
import { paths, STICKER_STEPS, WASHI_STEPS } from './paths'
import type { StickerStep, WashiStep } from './paths'

/* ---------- Notebooks ---------- */

/** /notebooks — every notebook (the NavRail "Notebooks" destination). */
export function NotebookListRoute() {
  return <DashboardScreen view="notebooks" />
}

/** /notebooks/new → dashboard with the Create notebook modal (3.1). */
export function NewNotebookRoute() {
  return <DashboardScreen overlay="create" />
}

/** /notebooks/:notebookId and /notebooks/:notebookId/settings (3.2 + 3.4). */
export function NotebookRoute() {
  const { notebookId } = useParams()
  const location = useLocation()
  const notebook = getNotebook(notebookId)
  if (!notebook) return <NotFoundScreen />
  const settings = location.pathname.endsWith('/settings')
  return <NotebookWorkspaceScreen notebook={notebook} overlay={settings ? 'settings' : undefined} />
}

/** /notebooks/:notebookId/pages (3.3). */
export function PageOverviewRoute() {
  const notebook = getNotebook(useParams().notebookId)
  if (!notebook) return <NotFoundScreen />
  return <PageOverviewScreen notebook={notebook} />
}

/** /notebooks/:notebookId/pages/:pageNumber[?view=spread] (4.x, 4.16). */
export function EditorRoute() {
  const { notebookId, pageNumber } = useParams()
  const [search] = useSearchParams()
  const notebook = getNotebook(notebookId)
  const page = Number(pageNumber)
  if (!notebook || !Number.isInteger(page) || page < 1 || page > notebook.pageCount) return <NotFoundScreen />
  const spread = search.get('view') === 'spread'
  // Remount when the page or view changes so editor state starts fresh.
  return <JournalEditorScreen key={`${notebook.id}-${page}-${spread}`} notebook={notebook} pageNumber={page} mode={spread ? 'spread' : 'nothing'} />
}

/* ---------- Studios ---------- */

/** /stickers/new/:step (5.1–5.5). */
export function StickerStudioRoute() {
  const { step } = useParams()
  const navigate = useNavigate()
  const index = STICKER_STEPS.indexOf(step as StickerStep)
  if (index < 0) return <Navigate to={paths.stickerStudio('upload')} replace />
  return <StickerStudioScreen step={index} onStepChange={(n) => navigate(paths.stickerStudio(STICKER_STEPS[n]))} />
}

/** /washi-tapes/new/:step (6.1–6.5). "pattern" and "upload" are both step 1. */
export function WashiStudioRoute() {
  const { step } = useParams()
  const navigate = useNavigate()
  const slug = step as WashiStep
  if (!WASHI_STEPS.includes(slug)) return <Navigate to={paths.washiStudio('method')} replace />
  const method: WashiMethod = slug === 'upload' ? 'upload' : 'pattern'
  const index = { method: 0, pattern: 1, upload: 1, customise: 2, save: 3 }[slug]
  const toSlug = (n: number, m: WashiMethod): WashiStep => (['method', m, 'customise', 'save'] as WashiStep[])[n]
  return <WashiStudioScreen key={slug === 'method' ? 'start' : 'flow'} step={index} method={method} onStepChange={(n, m) => navigate(paths.washiStudio(toSlug(n, m)))} />
}

/* ---------- Asset library ---------- */

/** /library, /library/collections/:collectionId (7.1, 7.3), /library/assets/:assetId (7.4). */
export function LibraryRoute() {
  const { collectionId, assetId } = useParams()
  if (collectionId && !getCollection(collectionId)) return <NotFoundScreen />
  return <AssetLibraryScreen collectionId={collectionId ?? 'all'} assetId={assetId} />
}

/* ---------- Errors ---------- */

/** errorElement for the whole tree: 404 responses and unexpected render errors. */
export function RouteError() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundScreen />
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <h1 style={{ font: 'var(--text-h1)' }}>Something went wrong</h1>
      <p>We couldn’t show this page. Your journal is safe; try going back to the dashboard.</p>
      <p>
        <a href={paths.dashboard}>Back to dashboard</a>
      </p>
    </main>
  )
}

/* ---------- Dev only (design review) ---------- */

/** /dev — every screen state from design system/screens.md, including ones that aren't URLs. */
export function DevIndex() {
  const areas = Array.from(new Set(SCREENS.map((s) => s.area)))
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ font: 'var(--text-display)' }}>Screens (dev)</h1>
      <p>
        <Link to={paths.devComponents}>Component gallery</Link>
      </p>
      {areas.map((area) => (
        <section key={area}>
          <h2 style={{ font: 'var(--text-h2)', marginBottom: 8 }}>{area}</h2>
          <ul style={{ margin: 0, paddingLeft: 20, columns: 2 }}>
            {SCREENS.filter((s) => s.area === area).map((s) => (
              <li key={s.id}>
                <Link to={paths.devScreen(s.id)}>
                  {s.id} · {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

/** /dev/screens/:screenId */
export function DevScreenRoute() {
  const { screenId } = useParams()
  const screen = SCREENS.find((s) => s.id === screenId)
  if (!screen) return <NotFoundScreen />
  return <div key={screen.id}>{screen.render()}</div>
}

export function DevComponentsRoute() {
  return <ComponentGallery />
}
