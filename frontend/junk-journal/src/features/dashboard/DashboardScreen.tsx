import { useState } from 'react'
import { Copy, Image, Pencil, Plus, Ribbon, Sticker, Trash2 } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  NotebookCard,
  PageHeader,
  SearchField,
  Skeleton,
  Tag,
  TextLink,
} from '../../components'
import type { MenuItem } from '../../components'
import { AppPage } from '../shared/AppPage'
import { CreateNotebookModal } from '../notebook-management/NotebookParts'
import { StickerArt, TapeArt } from '../shared/MockArt'
import { notebooks, stickers, tapes } from '../../services/mockData'
import type { Notebook } from '../../types'
import s from '../shared/screens.module.css'

type SortKey = 'recent' | 'name' | 'created'

export interface DashboardScreenProps {
  /** filled = 2.1, empty = 2.2, loading = 8.3 */
  state?: 'filled' | 'empty' | 'loading'
  /** create = 3.1 modal, delete = 3.5 confirm */
  overlay?: 'create' | 'create-error' | 'delete'
}

function DashboardSkeleton() {
  return (
    <div className={s.stackLg} aria-busy="true" aria-label="Loading your journals">
      <Skeleton width={200} height={24} radius={999} />
      <div className={s.grid4}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={s.stack}>
            <Skeleton height={168} radius={16} />
            <Skeleton width={140} height={18} radius={999} />
            <Skeleton width={100} height={14} radius={999} />
          </div>
        ))}
      </div>
      <Skeleton width={240} height={24} radius={999} />
      <div className={s.grid3}>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} height={110} radius={16} />
        ))}
      </div>
    </div>
  )
}

/* ---------- 2.1 Dashboard · 2.2 first-time · 8.3 loading ---------- */
export function DashboardScreen({ state = 'filled', overlay }: DashboardScreenProps) {
  const [createOpen, setCreateOpen] = useState(overlay === 'create' || overlay === 'create-error')
  const [toDelete, setToDelete] = useState<Notebook | undefined>(overlay === 'delete' ? notebooks[0] : undefined)
  const [sort, setSort] = useState<SortKey>('recent')
  const [query, setQuery] = useState('')

  const sorted = [...notebooks].sort((a, b) =>
    sort === 'name' ? a.title.localeCompare(b.title) : sort === 'created' ? b.createdAt.localeCompare(a.createdAt) : b.updatedAt.localeCompare(a.updatedAt),
  )
  const visible = sorted.filter((nb) => nb.title.toLowerCase().includes(query.toLowerCase()))

  const menuFor = (nb: Notebook): MenuItem[] => [
    { label: 'Rename', icon: Pencil, onSelect: () => {} },
    { label: 'Change cover', icon: Image, onSelect: () => {} },
    { label: 'Duplicate', icon: Copy, onSelect: () => {} },
    { label: 'Delete', icon: Trash2, destructive: true, onSelect: () => setToDelete(nb) },
  ]

  const header = (
    <PageHeader
      accent={state === 'empty' ? 'hello, Mira!' : 'good morning, Mira!'}
      title="Your journals"
      actions={
        state === 'filled' ? (
          <>
            <SearchField placeholder="Search notebooks" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
            <Button variant="primary" icon={Plus} onClick={() => setCreateOpen(true)}>
              Create notebook
            </Button>
          </>
        ) : undefined
      }
    />
  )

  return (
    <AppPage active="dashboard">
      {header}
      {state === 'loading' && <DashboardSkeleton />}
      {state === 'empty' && (
        <div className={s.emptyFrame}>
          <EmptyState
            accent="a blank page awaits"
            title="Make your first notebook"
            body="A notebook holds your pages. Fill them with photos, stickers, tape and handwriting."
            action={{ label: 'Create your first notebook', icon: Plus, onClick: () => setCreateOpen(true) }}
            secondary={[
              { label: 'Make a sticker', icon: Sticker },
              { label: 'Make a washi tape', icon: Ribbon },
            ]}
          />
        </div>
      )}
      {state === 'filled' && (
        <>
          <section className={s.stack} aria-labelledby="recent-title">
            <div className={s.rowBetween}>
              <h2 id="recent-title" className={s.sectionTitle}>
                Recently opened
              </h2>
              <TextLink onClick={() => {}}>See all notebooks</TextLink>
            </div>
            <div className={s.grid4}>
              {notebooks.slice(0, 4).map((nb) => (
                <NotebookCard key={nb.id} fill title={nb.title} meta={`${nb.pageCount} pages · ${nb.editedLabel}`} coverColor={nb.theme} coverAccent={nb.coverAccent} onOpen={() => {}} menuItems={menuFor(nb)} />
              ))}
            </div>
          </section>
          <div className={s.twoCol}>
            <section className={`${s.stack} ${s.grow}`} aria-labelledby="all-title">
              <div className={s.row}>
                <h2 id="all-title" className={s.sectionTitle}>
                  All notebooks · {visible.length}
                </h2>
                <div className={s.row} role="group" aria-label="Sort notebooks">
                  {(['recent', 'name', 'created'] as SortKey[]).map((k) => (
                    <Tag key={k} label={k[0].toUpperCase() + k.slice(1)} selected={sort === k} onClick={() => setSort(k)} />
                  ))}
                </div>
              </div>
              <div className={s.grid3}>
                {visible.map((nb) => (
                  <NotebookCard key={nb.id} fill title={nb.title} meta={`${nb.pageCount} pages`} coverColor={nb.theme} onOpen={() => {}} menuItems={menuFor(nb)} />
                ))}
              </div>
            </section>
            <aside className={s.sideCol} aria-label="Recently made">
              <div className={s.brandPanel}>
                <div className={s.rowBetween}>
                  <h2>Recent stickers</h2>
                  <Button icon={Sticker}>Open Sticker Studio</Button>
                </div>
                <div className={s.grid3}>
                  {stickers.slice(0, 3).map((st) => (
                    <div key={st.id} style={{ display: 'grid', placeItems: 'center', height: 90, borderRadius: 12, background: 'var(--color-cream)' }}>
                      <StickerArt sticker={st} size={64} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={s.brandPanel}>
                <div className={s.rowBetween}>
                  <h2>Recent tapes</h2>
                  <Button icon={Ribbon}>Open Washi Studio</Button>
                </div>
                {tapes.slice(0, 3).map((t) => (
                  <div key={t.id} style={{ overflow: 'hidden' }}>
                    <TapeArt tape={t} length={320} width={30} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}
      <CreateNotebookModal open={createOpen} onClose={() => setCreateOpen(false)} showTitleError={overlay === 'create-error'} />
      <ConfirmDialog
        open={!!toDelete}
        title={`Delete “${toDelete?.title}”?`}
        body={`This removes the notebook and its ${toDelete?.pageCount} pages. You can’t undo this.`}
        reassure="Your stickers, tapes and uploads stay in your Asset Library."
        confirmLabel="Delete notebook"
        onConfirm={() => setToDelete(undefined)}
        onCancel={() => setToDelete(undefined)}
      />
    </AppPage>
  )
}
