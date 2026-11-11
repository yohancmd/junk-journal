import { useState } from 'react'
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
} from '../../components'
import { AppPage } from '../shared/AppPage'
import { MiniPage } from '../shared/MockArt'
import type { PhotoTone } from '../shared/MockArt'
import { notebooks } from '../../services/mockData'
import { JournalCover, NotebookSettingsDrawer } from './NotebookParts'
import { PAPERS } from './options'
import n from './notebook.module.css'
import s from '../shared/screens.module.css'

const noop = () => {}
const tones: PhotoTone[] = ['yellow', 'green', 'cream']
const notebook = notebooks[0]

/* ---------- 3.2 Notebook workspace (+ 3.4 settings drawer, 3.5 delete notebook) ---------- */
export function NotebookWorkspaceScreen({ overlay }: { overlay?: 'settings' | 'delete' }) {
  const [settingsOpen, setSettingsOpen] = useState(overlay === 'settings')
  const [deleteOpen, setDeleteOpen] = useState(overlay === 'delete')
  const [selected, setSelected] = useState(1)
  const paper = PAPERS.find((p) => p.value === notebook.defaultBackground)?.label
  return (
    <AppPage active="notebooks">
      <PageHeader title={notebook.title} size="h1" breadcrumb={{ label: 'Notebooks', onClick: noop, current: notebook.title }} />
      <section className={n.hero}>
        <JournalCover title={notebook.title} accent={notebook.coverAccent} theme={notebook.theme} />
        <div className={n.info}>
          <p className={n.accent} aria-hidden>
            Kyoto &amp; Osaka, June 2026
          </p>
          <h2 className={n.title}>{notebook.title}</h2>
          <p style={{ maxWidth: 520 }}>{notebook.description}</p>
          <ul className={n.meta} aria-label="Notebook details" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li className={n.metaPill}><BookOpen size={16} aria-hidden />{notebook.pageCount} pages</li>
            <li className={n.metaPill}><Calendar size={16} aria-hidden />Created 2 Jun 2026</li>
            <li className={n.metaPill}><History size={16} aria-hidden />Edited today</li>
            <li className={n.metaPill}><NotebookIcon size={16} aria-hidden />{notebook.pageSize} · {paper} paper</li>
          </ul>
          <div className={s.row}>
            <Button variant="primary" icon={PenLine}>Open editor</Button>
            <Button icon={FilePlus}>Add page</Button>
            <IconButton icon={Settings} label="Notebook settings" onClick={() => setSettingsOpen(true)} />
          </div>
        </div>
      </section>
      <div className={s.rowBetween}>
        <h2 className={s.sectionTitle}>Pages</h2>
        <TextLink onClick={noop}>View all {notebook.pageCount} pages</TextLink>
      </div>
      <div className={n.strip}>
        {Array.from({ length: 7 }, (_, i) => (
          <PageThumbnail key={i} number={i + 1} selected={selected === i + 1} onOpen={() => setSelected(i + 1)} onDuplicate={noop} onChangeBackground={noop} onDelete={noop}>
            <MiniPage tone={tones[i % 3]} />
          </PageThumbnail>
        ))}
        <AddPageTile onClick={noop} />
      </div>
      <NotebookSettingsDrawer
        open={settingsOpen}
        notebook={notebook}
        onClose={() => setSettingsOpen(false)}
        onDelete={() => {
          setSettingsOpen(false)
          setDeleteOpen(true)
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete “${notebook.title}”?`}
        body={`This removes the notebook and its ${notebook.pageCount} pages. You can’t undo this.`}
        reassure="Your stickers, tapes and uploads stay in your Asset Library."
        confirmLabel="Delete notebook"
        onConfirm={() => setDeleteOpen(false)}
        onCancel={() => setDeleteOpen(false)}
      />
    </AppPage>
  )
}

/* ---------- 3.3 Page overview (+ 3.6 delete page) ---------- */
export function PageOverviewScreen({ reordering = false, deletePage }: { reordering?: boolean; deletePage?: number }) {
  const [selected, setSelected] = useState(1)
  const [toDelete, setToDelete] = useState<number | undefined>(deletePage)
  const pages = Array.from({ length: 12 }, (_, i) => i + 1)
  return (
    <AppPage active="notebooks">
      <PageHeader
        title="All pages"
        size="h1"
        breadcrumb={{ label: notebook.title, onClick: noop }}
        actions={
          <>
            <span className={s.small}>{notebook.pageCount} pages</span>
            <Button icon={FilePlus}>Add page</Button>
            <Button variant="primary" icon={PenLine}>Open editor</Button>
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
              selected={selected === p}
              dragging={reordering && p === 9}
              onOpen={() => setSelected(p)}
              onDuplicate={noop}
              onChangeBackground={noop}
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
        onConfirm={() => setToDelete(undefined)}
        onCancel={() => setToDelete(undefined)}
      />
    </AppPage>
  )
}
