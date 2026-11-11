import { useState } from 'react'
import { BookOpen, Download, File, History, RotateCcw, ShieldCheck, Sticker, Trash2 } from 'lucide-react'
import { Modal } from '../overlays/Overlays'
import { Button } from '../primitives/Button'
import { KeyCap, SegmentedControl, Tag, Toggle } from '../primitives/Controls'
import { TextField } from '../primitives/TextField'
import { ProgressBar, Tip } from '../feedback/Feedback'
import { Checkerboard } from '../studio/Studio'
import { PropGroup } from './EditorChrome'
import { SHORTCUTS } from '../constants'
import s from './editor.module.css'

/* ========== ShortcutsModal (§6.13) ========== */
export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts" width={960}>
      <div className={s.shortcutCols}>
        {Object.entries(SHORTCUTS).map(([group, rows]) => (
          <section key={group} className={s.shortcutGroup}>
            <h3>{group}</h3>
            {rows.map(([action, keys]) => (
              <div key={action} className={s.shortcutRow}>
                <span>{action}</span>
                <span className={s.keys}>
                  {keys.map((k) => (
                    <KeyCap key={k}>{k}</KeyCap>
                  ))}
                </span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </Modal>
  )
}

/* ========== ExportModal (§6.14) ========== */
export interface ExportOptions {
  scope: 'page' | 'notebook'
  format: 'pdf' | 'png'
  pages: 'all' | 'range'
  quality: 'screen' | 'print'
}

export interface ExportModalProps {
  open: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
  pageCount: number
  /** While running: 0–1 and the current page. */
  progress?: { value: number; page: number }
}

export function ExportModal({ open, onClose, onExport, pageCount, progress }: ExportModalProps) {
  const [opts, setOpts] = useState<ExportOptions>({ scope: 'notebook', format: 'pdf', pages: 'all', quality: 'print' })
  const set = (patch: Partial<ExportOptions>) => setOpts((o) => ({ ...o, ...patch }))
  const notebook = opts.scope === 'notebook'
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export"
      width={620}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Download} loading={!!progress} onClick={() => onExport(opts)}>
            Export {opts.format.toUpperCase()}
          </Button>
        </>
      }
    >
      <SegmentedControl
        label="What to export"
        value={opts.scope}
        onChange={(scope) => set({ scope, format: scope === 'notebook' ? 'pdf' : opts.format })}
        options={[
          { value: 'page', label: 'This page', icon: File },
          { value: 'notebook', label: 'Whole notebook', icon: BookOpen },
        ]}
      />
      <PropGroup label="Format">
        <div className={s.row}>
          <Tag label="PDF" selected={opts.format === 'pdf'} onClick={() => set({ format: 'pdf' })} />
          <Tag
            label={notebook ? 'PNG (single page only)' : 'PNG'}
            selected={opts.format === 'png'}
            disabled={notebook}
            onClick={() => set({ format: 'png' })}
          />
        </div>
      </PropGroup>
      {notebook && (
        <PropGroup label="Pages">
          <div className={s.row}>
            <Tag label={`All ${pageCount} pages`} selected={opts.pages === 'all'} onClick={() => set({ pages: 'all' })} />
            <Tag label="Range" selected={opts.pages === 'range'} onClick={() => set({ pages: 'range' })} />
          </div>
        </PropGroup>
      )}
      <PropGroup label="Quality">
        <div className={s.row}>
          <Tag label="Screen" selected={opts.quality === 'screen'} onClick={() => set({ quality: 'screen' })} />
          <Tag label="Print · 300 dpi" selected={opts.quality === 'print'} onClick={() => set({ quality: 'print' })} />
        </div>
      </PropGroup>
      {progress && (
        <div className={s.progressBox}>
          <ProgressBar value={progress.value} label={`Preparing page ${progress.page} of ${pageCount}`} />
          <p>You can keep editing while this runs.</p>
        </div>
      )}
    </Modal>
  )
}

/* ========== RecoveryDialog (§6.15) ========== */
export interface RecoveryDialogProps {
  open: boolean
  notebookTitle: string
  page: number
  time: string
  changes: number
  onRestore: () => void
  onDiscard: () => void
}

export function RecoveryDialog({ open, notebookTitle, page, time, changes, onRestore, onDiscard }: RecoveryDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onRestore}
      title="We kept your unsaved changes"
      width={540}
      hideClose
      dismissOnScrim={false}
      headerIcon={
        <span className={s.historyBadge} aria-hidden>
          <History size={24} />
        </span>
      }
      footer={
        <>
          <Button variant="destructive" icon={Trash2} onClick={onDiscard}>
            Discard changes
          </Button>
          <Button variant="primary" icon={RotateCcw} onClick={onRestore}>
            Restore changes
          </Button>
        </>
      }
    >
      <p>
        Your connection dropped before {changes} changes on page {page} were saved. They’re still on this device.
      </p>
      <div className={s.infoBox}>
        <strong>
          {notebookTitle} · Page {page}
        </strong>
        <span>
          Last edited {time} · {changes} changes
        </span>
      </div>
    </Modal>
  )
}

/* ========== SaveAsStickerModal (screen 4.10) ========== */
export interface SaveAsStickerModalProps {
  open: boolean
  onClose: () => void
  /** Transparent cut-out preview URL. */
  src: string
  categories: string[]
  onSave: (data: { name: string; category: string; collection: string; dieCut: boolean }) => void
}

export function SaveAsStickerModal({ open, onClose, src, categories, onSave }: SaveAsStickerModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0] ?? '')
  const [collection, setCollection] = useState('')
  const [dieCut, setDieCut] = useState(true)
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save as sticker"
      width={760}
      aside={
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', gap: 12, padding: 24, background: 'var(--color-green)', color: 'var(--color-cream)' }}>
          <Checkerboard style={{ width: 256, height: 256, borderRadius: 16, display: 'grid', placeItems: 'center' }}>
            <img src={src} alt="Sticker preview" style={{ maxWidth: '80%', maxHeight: '80%' }} />
          </Checkerboard>
          <p style={{ font: 'var(--text-small)', textAlign: 'center' }}>Transparent areas show as a checkerboard</p>
        </div>
      }
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Sticker} disabled={!name} onClick={() => onSave({ name, category, collection, dieCut })}>
            Save sticker
          </Button>
        </>
      }
    >
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <PropGroup label="Category">
        <div className={s.row} style={{ flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <Tag key={c} label={c} selected={c === category} onClick={() => setCategory(c)} />
          ))}
        </div>
      </PropGroup>
      <TextField label="Collection" value={collection} onChange={(e) => setCollection(e.target.value)} />
      <Toggle label="Add a die-cut border" checked={dieCut} onChange={setDieCut} />
      <Tip icon={ShieldCheck}>The original photo stays untouched.</Tip>
    </Modal>
  )
}
