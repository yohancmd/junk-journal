import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Check, Copy, Plus, Upload } from 'lucide-react'
import { Button, Drawer, Modal, PaperSwatch, PropGroup, Tag, TextField } from '../../components'
import type { CoverTheme, Notebook, PageSize, PaperBackground } from '../../types'
import { COVER_THEMES, PAGE_SIZES, PAPERS } from './options'
import n from './notebook.module.css'
import s from '../shared/screens.module.css'

const COVER_BG: Record<CoverTheme, string> = {
  yellow: 'var(--color-yellow)',
  green: 'var(--color-green)',
  cream: 'var(--color-cream)',
}

/** Large closed-journal cover (screens 3.1, 3.2). */
export function JournalCover({ title, accent, theme = 'yellow', width = 300 }: { title: string; accent?: string; theme?: CoverTheme; width?: number }) {
  const style: CSSProperties = { width, height: Math.round(width * 1.27), background: COVER_BG[theme] }
  return (
    <div className={n.cover} style={style} role="img" aria-label={`${title} cover`}>
      <span className={n.spine} />
      <span className={n.elastic} />
      <span className={n.washi} />
      <span className={n.label}>
        <span className={n.labelTitle}>{title.split(' ')[0]}</span>
        {accent && <span className={n.labelAccent}>{accent}</span>}
      </span>
    </div>
  )
}

const SIZES = PAGE_SIZES
const THEMES = COVER_THEMES

interface NotebookFormState {
  title: string
  description: string
  pageSize: PageSize
  background: PaperBackground
  theme: CoverTheme
}

function NotebookFields({ value, onChange, titleError }: { value: NotebookFormState; onChange: (v: Partial<NotebookFormState>) => void; titleError?: string }) {
  return (
    <>
      <TextField label="Title" value={value.title} onChange={(e) => onChange({ title: e.target.value })} error={titleError} required />
      <TextField label="Description (optional)" value={value.description} onChange={(e) => onChange({ description: e.target.value })} />
      <PropGroup label="Paper size">
        <div className={s.row}>
          {SIZES.map((sz) => (
            <Tag key={sz} label={sz} selected={value.pageSize === sz} onClick={() => onChange({ pageSize: sz })} />
          ))}
        </div>
      </PropGroup>
      <PropGroup label="Default page background">
        <div role="radiogroup" aria-label="Default page background" className={n.swatches}>
          {PAPERS.map((p) => (
            <span key={p.value} className={n.swatch}>
              <PaperSwatch paper={p.value} name={p.label} selected={value.background === p.value} onSelect={() => onChange({ background: p.value })} />
            </span>
          ))}
        </div>
      </PropGroup>
      <PropGroup label="Cover colour">
        <div className={s.row}>
          {THEMES.map((t) => (
            <Tag key={t.value} label={t.label} selected={value.theme === t.value} onClick={() => onChange({ theme: t.value })} />
          ))}
          <Button icon={Upload}>Upload a cover</Button>
        </div>
      </PropGroup>
    </>
  )
}

/* ---------- 3.1 Create notebook ---------- */
export function CreateNotebookModal({
  open,
  onClose,
  onCreated,
  showTitleError = false,
}: {
  open: boolean
  onClose: () => void
  /** Called after a valid submit (mock: no notebook is actually created yet). */
  onCreated?: () => void
  showTitleError?: boolean
}) {
  const [form, setForm] = useState<NotebookFormState>({ title: showTitleError ? '' : 'Travel Journal', description: 'Kyoto & Osaka, June 2026', pageSize: 'A5', background: 'dotted', theme: 'yellow' })
  const [submitted, setSubmitted] = useState(showTitleError)
  const titleError = submitted && !form.title.trim() ? 'Give your notebook a title.' : undefined
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New notebook"
      width={980}
      aside={
        <div className={n.previewPanel}>
          <span className={n.previewLabel}>LIVE PREVIEW</span>
          <JournalCover title={form.title || 'Untitled'} accent={form.description ? 'our summer' : undefined} theme={form.theme} width={220} />
          <span className={s.small}>
            {form.pageSize} · {PAPERS.find((p) => p.value === form.background)?.label} paper · 1 page
          </span>
        </div>
      }
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setSubmitted(true)
              if (form.title.trim()) onCreated?.()
            }}
          >
            Create notebook
          </Button>
        </>
      }
    >
      <NotebookFields value={form} onChange={(v) => setForm((f) => ({ ...f, ...v }))} titleError={titleError} />
    </Modal>
  )
}

/* ---------- 3.4 Notebook settings ---------- */
export function NotebookSettingsDrawer({ open, notebook, onClose, onDelete }: { open: boolean; notebook: Notebook; onClose: () => void; onDelete: () => void }) {
  const [form, setForm] = useState<NotebookFormState>({
    title: notebook.title,
    description: notebook.description ?? '',
    pageSize: notebook.pageSize,
    background: notebook.defaultBackground,
    theme: notebook.theme,
  })
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Notebook settings"
      footer={
        <>
          <div className={s.row}>
            <Button icon={Copy}>Duplicate notebook</Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete notebook
            </Button>
          </div>
          <div className={s.row} style={{ justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" icon={Check} onClick={onClose}>
              Save changes
            </Button>
          </div>
        </>
      }
    >
      <NotebookFields value={form} onChange={(v) => setForm((f) => ({ ...f, ...v }))} />
      <p className={s.small}>Changing the size keeps every element; pages are re-centred.</p>
    </Drawer>
  )
}
