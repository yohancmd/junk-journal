import { useState } from 'react'
import { BookOpen, Check, Download, FolderPlus, Pencil, Plus, Search, ShieldCheck, WandSparkles } from 'lucide-react'
import {
  AssetCard,
  Button,
  Checkbox,
  CollectionHeader,
  CollectionList,
  ConfirmDialog,
  Drawer,
  EmptyState,
  FilterBar,
  Modal,
  Page,
  PageHeader,
  SearchField,
  TextField,
  TextLink,
  Tip,
  TypeBadge,
  useToast,
} from '../../components'
import { useNavigate } from 'react-router'
import { AppPage } from '../shared/AppPage'
import { MockPhotoBlock, StickerArt, TapeArt } from '../shared/MockArt'
import type { PhotoTone } from '../shared/MockArt'
import { paths } from '../../routes/paths'
import { collections, getCollection, getLibraryAsset, libraryAssets, stickers, tapes } from '../../services/mockData'
import type { LibraryAsset } from '../../types'
import s from '../shared/screens.module.css'

const TONES: PhotoTone[] = ['yellow', 'green', 'cream']

const FILTERS = [
  { id: 'all', label: 'All', count: 186 },
  { id: 'Sticker', label: 'Stickers' },
  { id: 'Washi', label: 'Washi tapes' },
  { id: 'Background', label: 'Backgrounds' },
  { id: 'Paper', label: 'Paper' },
  { id: 'Photo', label: 'Photos' },
  { id: 'Upload', label: 'Uploads' },
  { id: 'Extracted', label: 'Extracted' },
]

function AssetPreview({ asset, large }: { asset: LibraryAsset; large?: boolean }) {
  const i = libraryAssets.indexOf(asset)
  switch (asset.kind) {
    case 'Sticker': {
      const st = stickers.find((x) => x.id === asset.refId) ?? stickers[0]
      return <StickerArt sticker={st} size={large ? 200 : 88} />
    }
    case 'Extracted':
      return <StickerArt sticker={{ ...stickers[5], name: asset.name }} size={large ? 200 : 88} rotation={-5} />
    case 'Washi': {
      const t = tapes.find((x) => x.id === asset.refId) ?? tapes[0]
      return <TapeArt tape={t} length={large ? 400 : 200} width={large ? 56 : 36} rotation={-6} bg="card" />
    }
    case 'Paper':
    case 'Background':
      return <Page width={large ? 420 : 240} height={large ? 280 : 120} paper={asset.paper ?? 'cream'} label={asset.name} />
    default:
      return <MockPhotoBlock tone={TONES[i % 3]} />
  }
}

export interface AssetLibraryScreenProps {
  /** all = 7.1, filtered = 7.2, no-results = 7.2 empty */
  view?: 'all' | 'filtered' | 'no-results'
  /** From /library/collections/:collectionId (7.3). */
  collectionId?: string
  /** From /library/assets/:assetId — opens the detail drawer (7.4). */
  assetId?: string
  /** rename = 7.5, delete = 7.6 (local overlays, not routes) */
  overlay?: 'rename' | 'delete'
}

export function AssetLibraryScreen({ view = 'all', collectionId = 'all', assetId, overlay }: AssetLibraryScreenProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState(view === 'filtered' ? 'flower' : view === 'no-results' ? 'sunflower' : '')
  const [filters, setFilters] = useState<string[]>(view === 'filtered' || view === 'no-results' ? ['Sticker'] : ['all'])
  const [renameOpen, setRenameOpen] = useState(overlay === 'rename')
  const [deleteOpen, setDeleteOpen] = useState(overlay === 'delete')
  const [newCollection, setNewCollection] = useState('')

  const routedAsset = getLibraryAsset(assetId)
  const active: LibraryAsset | undefined = routedAsset ?? (overlay ? libraryAssets[0] : undefined)
  const drawerOpen = !!routedAsset
  const libraryHome = collectionId === 'all' ? paths.library : paths.libraryCollection(collectionId)
  const closeDrawer = () => navigate(libraryHome)
  const editInStudio = (a: LibraryAsset) =>
    navigate(a.kind === 'Washi' ? paths.washiStudio('customise') : paths.stickerStudio(a.kind === 'Sticker' ? 'outline' : 'upload'))

  const collection = getCollection(collectionId)
  const filtered = libraryAssets.filter(
    (a) =>
      (filters.includes('all') || filters.includes(a.kind)) &&
      (collectionId === 'all' || a.collections.includes(collectionId)) &&
      (!query || a.name.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase().replace(/s$/, ''))),
  )
  const filtering = !filters.includes('all') || !!query

  return (
    <AppPage active="library">
      <PageHeader
        accent={collectionId === 'all' ? 'everything you’ve made' : 'collection'}
        title={collectionId === 'all' ? 'Asset Library' : (collection?.name ?? 'Collection')}
        actions={<SearchField placeholder="Search all assets" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />}
      />
      <FilterBar
        filters={FILTERS}
        selected={filters}
        onToggle={(id) => setFilters((f) => (id === 'all' ? ['all'] : f.includes(id) ? f.filter((x) => x !== id) : [...f.filter((x) => x !== 'all'), id]))}
        resultText={filtering ? `${filtered.length} ${filtered.length === 1 ? 'asset matches' : 'assets match'}${query ? ` “${query}”` : ''}` : undefined}
        onClear={() => {
          setQuery('')
          setFilters(['all'])
        }}
      />
      <div className={s.twoCol}>
        <CollectionList
          collections={collections}
          activeId={collectionId}
          onSelect={(id) => navigate(id === 'all' ? paths.library : paths.libraryCollection(id))}
          onNew={() => setRenameOpen(true)}
        />
        <div className={`${s.stack} ${s.grow}`}>
          {collectionId !== 'all' && collection && (
            <CollectionHeader
              description={collection.description ?? collection.name}
              meta={`${collection.count} assets · used in Travel Journal`}
              onAdd={() => navigate(paths.library)}
              onRename={() => setRenameOpen(true)}
              onDelete={() => {
                toast.show({ kind: 'success', message: `Collection “${collection.name}” deleted. Its assets stay in your library.` })
                navigate(paths.library, { replace: true })
              }}
            />
          )}
          {filtered.length === 0 ? (
            <div className={s.emptyFrame} style={{ minHeight: 360 }}>
              <EmptyState accent="nothing here yet" body={`Nothing matches “${query}”. Try another word or clear the filters.`} action={{ label: 'Clear filters', icon: Search, onClick: () => { setQuery(''); setFilters(['all']) } }} illustration={false} />
            </div>
          ) : (
            <div className={s.grid5}>
              {filtered.map((a) => (
                <AssetCard
                  key={a.id}
                  name={a.name}
                  type={a.kind}
                  selected={drawerOpen && active?.id === a.id}
                  preview={<AssetPreview asset={a} />}
                  onClick={() => navigate(paths.libraryAsset(a.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7.4 Asset detail */}
      {active && (
        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={active.name}
          headerStart={<TypeBadge type={active.kind} />}
          footer={
            <>
              <div className={s.row}>
                <Button icon={Pencil} onClick={() => setRenameOpen(true)}>Rename</Button>
                <Button icon={FolderPlus} onClick={() => setRenameOpen(true)}>Collection</Button>
                <Button icon={Download}>Download</Button>
              </div>
              <div className={s.row}>
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Delete</Button>
                <Button variant="primary" icon={WandSparkles} onClick={() => editInStudio(active)}>Edit in studio</Button>
              </div>
            </>
          }
        >
          <div style={{ height: 280, display: 'grid', placeItems: 'center', overflow: 'hidden', border: '2px solid var(--color-green)', borderRadius: 16 }}>
            <AssetPreview asset={active} large />
          </div>
          <dl className={s.small} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', margin: 0 }}>
            <dt style={{ fontWeight: 700 }}>Category</dt><dd style={{ margin: 0 }}>{active.category}</dd>
            <dt style={{ fontWeight: 700 }}>Collections</dt><dd style={{ margin: 0 }}>{active.collections.map((id) => collections.find((c) => c.id === id)?.name).join(', ') || '—'}</dd>
            <dt style={{ fontWeight: 700 }}>Created</dt><dd style={{ margin: 0 }}>{active.createdAt}</dd>
            <dt style={{ fontWeight: 700 }}>Updated</dt><dd style={{ margin: 0 }}>{active.updatedAt}</dd>
            {active.sizeLabel && (<><dt style={{ fontWeight: 700 }}>Size</dt><dd style={{ margin: 0 }}>{active.sizeLabel}</dd></>)}
          </dl>
          <div className={s.panel} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, boxShadow: 'none' }}>
            <BookOpen size={18} aria-hidden />
            <span className={`${s.small} ${s.grow}`} style={{ fontWeight: 600 }}>
              Placed on {active.usedOnPages} pages in {active.usedInNotebooks} notebooks
            </span>
            <TextLink onClick={() => navigate(paths.notebooks)}>Show</TextLink>
          </div>
          <Tip icon={ShieldCheck}>Editing this asset won’t change pages where it’s already placed.</Tip>
        </Drawer>
      )}

      {/* 7.5 Rename & move to collection */}
      <Modal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        title={active ? `Edit “${active.name}”` : 'New collection'}
        width={520}
        footer={
          <>
            <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button variant="primary" icon={Check} onClick={() => setRenameOpen(false)}>Save</Button>
          </>
        }
      >
        {active && <TextField label="Name" defaultValue={active.name} />}
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <legend style={{ font: 'var(--text-label)', fontWeight: 700, padding: 0, marginBottom: 8 }}>Collections</legend>
          {collections.filter((c) => c.id !== 'all').map((c) => (
            <Checkbox key={c.id} label={c.name} defaultChecked={!!active?.collections.includes(c.id)} />
          ))}
        </fieldset>
        <div className={s.row} style={{ alignItems: 'flex-end' }}>
          <TextField className={s.grow} label="New collection" value={newCollection} onChange={(e) => setNewCollection(e.target.value)} placeholder="e.g. Temples" />
          <Button icon={Plus} disabled={!newCollection}>Add</Button>
        </div>
      </Modal>

      {/* 7.6 Delete asset */}
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete “${active?.name ?? 'asset'}”?`}
        body="It will be removed from your library and from every collection."
        reassure={`It’s placed on ${active?.usedOnPages ?? 0} pages. Those copies stay where they are.`}
        confirmLabel="Delete asset"
        onConfirm={() => {
          setDeleteOpen(false)
          toast.show({ kind: 'success', message: `“${active?.name}” deleted from your library.` })
          if (drawerOpen) closeDrawer()
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </AppPage>
  )
}
