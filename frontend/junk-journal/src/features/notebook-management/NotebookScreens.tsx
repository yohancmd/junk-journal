import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BookOpen, Calendar, FilePlus, History, Notebook as NotebookIcon, PenLine, Settings } from 'lucide-react'
import {
  AddPageTile,
  Button,
  ConfirmDialog,
  DropIndicator,
  IconButton,
  PageHeader,
  PageThumbnail,
  TextLink,
  useToast,
} from '../../components'
import { AppPage } from '../shared/AppPage'
import { MiniPage } from '../shared/MockArt'
import type { PhotoTone } from '../shared/MockArt'
import { useLinkProps } from '../../hooks/useLinkProps'
import { paths } from '../../routes/paths'
import { notebooks } from '../../services/mockData'
import type { Notebook } from '../../types'
import { JournalCover, NotebookSettingsDrawer } from './NotebookParts'
import { PAPERS } from './options'
import n from './notebook.module.css'
import s from '../shared/screens.module.css'

const tones: PhotoTone[] = ['yellow', 'green', 'cream']
/** Mock notebooks only have sample content for the first pages. */
const thumbCount = (nb: Notebook) => Math.min(nb.pageCount, 7)

/* ---------- 3.2 Notebook workspace (+ 3.4 settings drawer, 3.5 delete notebook) ---------- */
export function NotebookWorkspaceScreen({ notebook = notebooks[0], overlay }: { notebook?: Notebook; overlay?: 'settings' | 'delete' }) {
  const navigate = useNavigate()
  const link = useLinkProps()
  const toast = useToast()
  const [deleteOpen, setDeleteOpen] = useState(overlay === 'delete')
  const paper = PAPERS.find((p) => p.value === notebook.defaultBackground)?.label
  const addPage = () => toast.show({ kind: 'success', message: `Page ${notebook.pageCount + 1} added.` })

  return (
    <AppPage active="notebooks">
      <PageHeader title={notebook.title} size="h1" breadcrumb={{ label: 'Notebooks', onClick: () => navigate(paths.notebooks), current: notebook.title }} />
      <section className={n.hero}>
        <JournalCover title={notebook.title} accent={notebook.coverAccent} theme={notebook.theme} />
        <div className={n.info}>
          {notebook.description && (
            <p className={n.accent} aria-hidden>
              {notebook.coverAccent}
            </p>
          )}
          <h2 className={n.title}>{notebook.title}</h2>
          {notebook.description && <p style={{ maxWidth: 520 }}>{notebook.description}</p>}
          <ul className={n.meta} aria-label="Notebook details" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li className={n.metaPill}><BookOpen size={16} aria-hidden />{notebook.pageCount} pages</li>
            <li className={n.metaPill}><Calendar size={16} aria-hidden />Created {notebook.createdAt}</li>
            <li className={n.metaPill}><History size={16} aria-hidden />{notebook.editedLabel[0].toUpperCase() + notebook.editedLabel.slice(1)}</li>
            <li className={n.metaPill}><NotebookIcon size={16} aria-hidden />{notebook.pageSize} · {paper} paper</li>
          </ul>
          <div className={s.row}>
            <Button variant="primary" icon={PenLine} onClick={() => navigate(paths.editor(notebook.id, 1))}>
              Open editor
            </Button>
            <Button icon={FilePlus} onClick={addPage}>
              Add page
            </Button>
            <IconButton icon={Settings} label="Notebook settings" onClick={() => navigate(paths.notebookSettings(notebook.id))} />
          </div>
        </div>
      </section>
      <div className={s.rowBetween}>
        <h2 className={s.sectionTitle}>Pages</h2>
        <TextLink {...link(paths.notebookPages(notebook.id))}>View all {notebook.pageCount} pages</TextLink>
      </div>
      <div className={n.strip}>
        {Array.from({ length: thumbCount(notebook) }, (_, i) => (
          <PageThumbnail
            key={i}
            number={i + 1}
            onOpen={() => navigate(paths.editor(notebook.id, i + 1))}
            onDuplicate={() => toast.show({ kind: 'success', message: `Page ${i + 1} duplicated.` })}
            onChangeBackground={() => navigate(paths.editor(notebook.id, i + 1))}
            onDelete={() => navigate(paths.notebookPages(notebook.id))}
          >
            <MiniPage tone={tones[i % 3]} />
          </PageThumbnail>
        ))}
        <AddPageTile onClick={addPage} />
      </div>
      <NotebookSettingsDrawer
        open={overlay === 'settings'}
        notebook={notebook}
        onClose={() => navigate(paths.notebook(notebook.id))}
        onDelete={() => {
          navigate(paths.notebook(notebook.id), { replace: true })
          setDeleteOpen(true)
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete “${notebook.title}”?`}
        body={`This removes the notebook and its ${notebook.pageCount} pages. You can’t undo this.`}
        reassure="Your stickers, tapes and uploads stay in your Asset Library."
        confirmLabel="Delete notebook"
        onConfirm={() => {
          setDeleteOpen(false)
          toast.show({ kind: 'success', message: `“${notebook.title}” deleted.` })
          navigate(paths.dashboard, { replace: true })
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </AppPage>
  )
}

/* ---------- 3.3 Page overview (+ 3.6 delete page) ---------- */
export function PageOverviewScreen({ notebook = notebooks[0], reordering = false, deletePage }: { notebook?: Notebook; reordering?: boolean; deletePage?: number }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [toDelete, setToDelete] = useState<number | undefined>(deletePage)
  const pages = Array.from({ length: Math.min(notebook.pageCount, 12) }, (_, i) => i + 1)
  return (
    <AppPage active="notebooks">
      <PageHeader
        title="All pages"
        size="h1"
        breadcrumb={{ label: notebook.title, onClick: () => navigate(paths.notebook(notebook.id)) }}
        actions={
          <>
            <span className={s.small}>{notebook.pageCount} pages</span>
            <Button icon={FilePlus} onClick={() => toast.show({ kind: 'success', message: `Page ${notebook.pageCount + 1} added.` })}>
              Add page
            </Button>
            <Button variant="primary" icon={PenLine} onClick={() => navigate(paths.editor(notebook.id, 1))}>
              Open editor
            </Button>
          </>
        }
      />
      <div className={s.thumbGrid}>
        {pages.map((p) => (
          <div key={p} style={{ display: 'flex', gap: 12 }}>
            {reordering && p === 8 && <DropIndicator />}
            <PageThumbnail
              number={p}
              size="large"
              dragging={reordering && p === 9}
              onOpen={() => navigate(paths.editor(notebook.id, p))}
              onDuplicate={() => toast.show({ kind: 'success', message: `Page ${p} duplicated.` })}
              onChangeBackground={() => navigate(paths.editor(notebook.id, p))}
              onDelete={() => setToDelete(p)}
            >
              <MiniPage tone={tones[p % 3]} />
            </PageThumbnail>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={toDelete !== undefined}
        title={`Delete page ${toDelete}?`}
        body="Everything placed on this page will be removed. Other pages aren’t affected."
        reassure="Stickers and photos on it stay in your Asset Library."
        confirmLabel="Delete page"
        onConfirm={() => {
          toast.show({ kind: 'success', message: `Page ${toDelete} deleted.` })
          setToDelete(undefined)
        }}
        onCancel={() => setToDelete(undefined)}
      />
    </AppPage>
  )
}
