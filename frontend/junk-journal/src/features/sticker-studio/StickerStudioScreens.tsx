import { useState } from 'react'
import type { ReactNode } from 'react'
import { Cat, Check, CircleCheck, Crop, Eraser, Lasso, Paintbrush, Pentagon, Plus, Redo2, RotateCcw, Sparkles, Sticker, Undo2 } from 'lucide-react'
import {
  Banner,
  BeforeAfter,
  Button,
  Checkerboard,
  CollectionList,
  CropBar,
  CropOverlay,
  DieCutSticker,
  DirectionDial,
  DropZone,
  EmptyState,
  FilterBar,
  IconButton,
  IconToggleRow,
  NumberField,
  Page,
  PageHeader,
  PropGroup,
  PropRow,
  SearchField,
  SelectField,
  Slider,
  StickerTile,
  StudioShell,
  SwatchGroup,
  Tag,
  TextField,
  TextLink,
  Tip,
  Toggle,
} from '../../components'
import type { CropRatio } from '../../components'
import { useNavigate } from 'react-router'
import { AppPage } from '../shared/AppPage'
import { MockPhotoBlock, StickerArt } from '../shared/MockArt'
import { useShellNav } from '../shared/useShellNav'
import { paths } from '../../routes/paths'
import { collections, libraryAssets, stickerCategories, stickers } from '../../services/mockData'
import s from '../shared/screens.module.css'

const noop = () => {}
const STEPS = ['Upload', 'Remove background', 'Crop', 'Die-cut & shadow', 'Save']
const cat = stickers.find((x) => x.id === 'st-cat') ?? stickers[0]

const BORDER_COLOURS = [
  { value: '#FFFFFF', color: '#FFFFFF', label: 'White' },
  { value: 'var(--color-cream)', color: 'var(--color-cream)', label: 'Light Yellow' },
  { value: 'var(--color-yellow)', color: 'var(--color-yellow)', label: 'Golden Yellow' },
  { value: 'var(--color-green)', color: 'var(--color-green)', label: 'Green', dark: true },
]

export interface StickerStudioScreenProps {
  /** 0 = 5.1 Upload … 4 = 5.5 Save */
  step?: number
  /** When set, the step is controlled by the route (/stickers/new/:step). */
  onStepChange?: (step: number) => void
  /** 5.5 saved state */
  saved?: boolean
}

/* ---------- 5.1 – 5.5 Sticker Studio ---------- */
export function StickerStudioScreen({ step: stepProp = 0, onStepChange, saved: initiallySaved = false }: StickerStudioScreenProps) {
  const navigate = useNavigate()
  const shell = useShellNav()
  const [localStep, setLocalStep] = useState(stepProp)
  const step = onStepChange ? stepProp : localStep
  const setStep = (next: number | ((s: number) => number)) => {
    const value = typeof next === 'function' ? next(step) : next
    if (onStepChange) onStepChange(value)
    else setLocalStep(value)
  }
  const [saved, setSaved] = useState(initiallySaved)
  const [refine, setRefine] = useState(35)
  const [showCompare, setShowCompare] = useState(true)
  const [tool, setTool] = useState<'crop' | 'lasso' | 'polygon'>('crop')
  const [ratio, setRatio] = useState<CropRatio>('Free')
  const [border, setBorder] = useState(10)
  const [borderColour, setBorderColour] = useState('#FFFFFF')
  const [borderOpacity, setBorderOpacity] = useState(100)
  const [shadowOn, setShadowOn] = useState(true)
  const [blur, setBlur] = useState(18)
  const [shadowOpacity, setShadowOpacity] = useState(35)
  const [distance, setDistance] = useState(12)
  const [angle, setAngle] = useState(60)
  const [rotation, setRotation] = useState(-4)
  const [name, setName] = useState('Sleepy Mochi')
  const [category, setCategory] = useState('Pets')

  const shadow = shadowOn ? { blur, opacity: shadowOpacity / 100, distance, angle } : false
  const sticker = (size: number, rot = rotation) => (
    <DieCutSticker width={size} height={size} rotation={rot} borderWidth={border} borderColor={borderColour} borderOpacity={borderOpacity / 100} shadow={shadow} fallbackBackground="var(--color-yellow)" alt={name}>
      <StickerArtIcon size={size} />
    </DieCutSticker>
  )

  let preview: ReactNode
  let panel: ReactNode
  let panelTitle = ''
  let next: { label?: string; icon?: typeof Check; onClick: () => void } = { onClick: () => setStep((x) => x + 1) }

  switch (step) {
    case 0:
      panelTitle = 'Start with a photo'
      preview = (
        <div className={s.center} style={{ padding: 40 }}>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <DropZone onFiles={() => setStep(1)} />
          </div>
        </div>
      )
      panel = (
        <>
          <p className={s.small}>Pick something with a clear subject: a flower, a pet, a ticket stub.</p>
          <PropGroup label="Recent uploads">
            <div className={s.grid3}>
              {(['green', 'yellow', 'cream'] as const).map((t) => (
                <button key={t} type="button" aria-label={`Use recent upload (${t})`} style={{ height: 90, padding: 0, border: '2px solid var(--color-green)', borderRadius: 12, overflow: 'hidden' }} onClick={() => setStep(1)}>
                  <MockPhotoBlock tone={t} />
                </button>
              ))}
            </div>
          </PropGroup>
          <Tip icon={Sparkles}>Already a transparent PNG? We’ll skip background removal.</Tip>
        </>
      )
      break
    case 1:
      panelTitle = 'Remove background'
      preview = showCompare ? (
        <BeforeAfter before={<MockPhotoBlock tone="green" />} after={<StickerArt sticker={cat} size={300} />} />
      ) : (
        <Checkerboard className={s.center}>
          <StickerArt sticker={cat} size={300} />
        </Checkerboard>
      )
      panel = (
        <>
          <Tip icon={CircleCheck}>Background removed</Tip>
          <Slider label="Refine edges" value={refine} onChange={setRefine} format={(v) => (v < 33 ? 'Sharp' : v < 66 ? 'Soft' : 'Very soft')} />
          <PropGroup label="Touch up">
            <IconToggleRow label="Touch-up brushes" value="" onChange={noop} items={[{ value: 'erase', icon: Eraser, label: 'Erase leftovers' }, { value: 'restore', icon: Paintbrush, label: 'Paint back' }, { value: 'undo', icon: Undo2, label: 'Undo' }, { value: 'redo', icon: Redo2, label: 'Redo' }]} />
          </PropGroup>
          <Toggle label="Show before / after" checked={showCompare} onChange={setShowCompare} />
          <TextLink onClick={() => setStep(2)}>Skip, it’s already transparent</TextLink>
        </>
      )
      break
    case 2:
      panelTitle = 'Crop the subject'
      preview = (
        <Checkerboard className={s.center}>
          <StickerArt sticker={cat} size={300} />
          <div style={{ position: 'absolute', inset: 0 }}>
            <CropOverlay width={752} height={686} bounds={{ x: 226, y: 193, width: 300, height: 300 }} crop={{ x: 246, y: 213, width: 260, height: 260 }} />
          </div>
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <CropBar tool={tool} onTool={setTool} ratio={ratio} onRatio={setRatio} onApply={() => setStep(3)} onCancel={noop} onClear={noop} onInvert={noop} onUndoPoint={noop} />
          </div>
        </Checkerboard>
      )
      panel = (
        <>
          <PropGroup label="Tool">
            <IconToggleRow label="Crop tool" value={tool} onChange={(v) => setTool(v as typeof tool)} items={[{ value: 'crop', icon: Crop, label: 'Rectangle crop' }, { value: 'lasso', icon: Lasso, label: 'Freeform lasso' }, { value: 'polygon', icon: Pentagon, label: 'Polygon lasso' }]} />
          </PropGroup>
          <PropGroup label="History">
            <div className={s.row}>
              <IconButton icon={Undo2} label="Undo" size="sm" />
              <IconButton icon={Redo2} label="Redo" size="sm" />
            </div>
          </PropGroup>
        </>
      )
      break
    case 3:
      panelTitle = 'Die-cut & shadow'
      preview = <Checkerboard className={s.center}>{sticker(320)}</Checkerboard>
      panel = (
        <>
          <PropGroup label="Border">
            <Slider label="Thickness" min={0} max={24} value={border} onChange={setBorder} format={(v) => `${v} px`} />
            <SwatchGroup label="Border colour" swatches={BORDER_COLOURS} value={borderColour} onChange={setBorderColour} />
            <Slider label="Opacity" value={borderOpacity} onChange={setBorderOpacity} format={(v) => `${v}%`} />
          </PropGroup>
          <Toggle label="Shadow" checked={shadowOn} onChange={setShadowOn} />
          {shadowOn && (
            <PropGroup label="Shadow">
              <Slider label="Blur" max={40} value={blur} onChange={setBlur} format={(v) => `${v} px`} />
              <Slider label="Opacity" value={shadowOpacity} onChange={setShadowOpacity} format={(v) => `${v}%`} />
              <PropRow>
                <NumberField label="Dist" ariaLabel="Shadow distance" value={distance} unit="px" min={0} max={40} onChange={setDistance} />
                <DirectionDial angle={angle} onChange={setAngle} />
              </PropRow>
            </PropGroup>
          )}
          <PropGroup label="Rotation">
            <PropRow>
              <NumberField label="↻" ariaLabel="Rotation in degrees" value={rotation} unit="°" onChange={setRotation} />
              <IconButton icon={RotateCcw} label="Reset rotation" size="sm" onClick={() => setRotation(0)} />
            </PropRow>
          </PropGroup>
        </>
      )
      break
    default:
      panelTitle = 'Save your sticker'
      next = { label: 'Save sticker', icon: Sticker, onClick: () => setSaved(true) }
      preview = (
        <>
          <Checkerboard className={s.splitHalf} style={{ left: 0 }}>
            {sticker(220)}
          </Checkerboard>
          <div className={s.splitHalf} style={{ right: 0, borderLeft: '2px solid var(--color-green)' }}>
            <div className={s.paperPreview}>
              <Page width={376} height={686} paper="lined" label="Sample paper">
                <div style={{ position: 'absolute', left: 90, top: 200 }}>{sticker(190, 8)}</div>
                <p className={s.handwriting} style={{ position: 'absolute', left: 100, top: 440, fontSize: 30, transform: 'rotate(-3deg)' }}>
                  my sleepy boy ♡
                </p>
              </Page>
            </div>
          </div>
          <span className={s.previewTag} style={{ left: 16 }}>On transparency</span>
          <span className={s.previewTag} style={{ right: 16 }}>On paper</span>
        </>
      )
      panel = saved ? (
        <>
          <Banner title="Saved to your sticker library">“{name}” is ready to use in any notebook.</Banner>
          <Button variant="primary" icon={Plus} fullWidth onClick={() => navigate(paths.notebooks)}>Use on a page</Button>
          <Button icon={Sparkles} fullWidth onClick={() => { setSaved(false); setStep(0) }}>Make another</Button>
        </>
      ) : (
        <>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <PropGroup label="Category">
            <div className={s.row}>
              {stickerCategories.map((c) => (
                <Tag key={c} label={c} selected={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
          </PropGroup>
          <SelectField label="Collection" value="cats" onChange={noop} options={collections.filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.name }))} />
          <p className={s.small}>Keeps the original photo, the cut-out, outline and shadow settings.</p>
        </>
      )
  }

  return (
    <StudioShell
      kind="sticker"
      steps={STEPS}
      current={step}
      onStepClick={setStep}
      onLibrary={() => navigate(paths.stickers)}
      {...shell}
      preview={preview}
      panelTitle={panelTitle}
      panel={panel}
      back={step > 0 ? { onClick: () => setStep((x) => x - 1) } : undefined}
      next={saved && step === 4 ? { label: 'Done', icon: Check, onClick: () => navigate(paths.stickers) } : next}
    />
  )
}

/** The cat sticker's mock icon inside the die-cut fallback (no transparent image in mocks). */
function StickerArtIcon({ size }: { size: number }) {
  return <Cat size={Math.round(size * 0.48)} color="var(--color-green)" aria-hidden />
}

/* ---------- 5.6 Sticker library ---------- */
export function StickerLibraryScreen({ state = 'filled' }: { state?: 'filled' | 'empty' | 'no-results' }) {
  const navigate = useNavigate()
  const openAsset = (stickerId: string) => {
    const asset = libraryAssets.find((a) => a.refId === stickerId)
    navigate(asset ? paths.libraryAsset(asset.id) : paths.library)
  }
  const [category, setCategory] = useState<string[]>(['all'])
  const [query, setQuery] = useState(state === 'no-results' ? 'sunflower' : '')
  const [activeCollection, setActiveCollection] = useState('japan')
  const list = state === 'empty' ? [] : stickers.filter((st) => st.name.toLowerCase().includes(query.toLowerCase()) && (category.includes('all') || category.includes(st.category)))

  return (
    <AppPage active="stickers">
      <PageHeader
        accent="your sticker box"
        title="Sticker library"
        actions={
          <>
            <SearchField placeholder="Search stickers" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
            <Button variant="primary" icon={Plus} onClick={() => navigate(paths.stickerStudio())}>New sticker</Button>
          </>
        }
      />
      {state === 'empty' ? (
        <div className={s.emptyFrame}>
          <EmptyState accent="no stickers yet" body="Turn a photo into your first die-cut sticker." action={{ label: 'Make a sticker', icon: Sticker, onClick: () => navigate(paths.stickerStudio()) }} />
        </div>
      ) : (
        <>
          <FilterBar
            filters={[{ id: 'all', label: 'All', count: 42 }, ...stickerCategories.map((c) => ({ id: c, label: c }))]}
            selected={category}
            onToggle={(id) => setCategory(id === 'all' ? ['all'] : (c) => c.filter((x) => x !== 'all').includes(id) ? c.filter((x) => x !== id && x !== 'all') : [...c.filter((x) => x !== 'all'), id])}
            resultText={query ? `${list.length} stickers match “${query}”` : undefined}
            onClear={() => {
              setQuery('')
              setCategory(['all'])
            }}
          />
          <div className={s.twoCol}>
            <CollectionList collections={collections.filter((c) => c.id !== 'all')} activeId={activeCollection} onSelect={setActiveCollection} onNew={noop} />
            {list.length === 0 ? (
              <div className={`${s.emptyFrame} ${s.grow}`}>
                <EmptyState accent="nothing here yet" body={`No stickers match “${query}”. Try another word or clear the filters.`} action={{ label: 'Clear filters', onClick: () => { setQuery(''); setCategory(['all']) } }} illustration={false} />
              </div>
            ) : (
              <div className={`${s.grid4} ${s.grow}`}>
                {list.map((st, i) => (
                  <StickerTile key={st.id} name={st.name} category={st.category} onOpen={() => openAsset(st.id)} onRename={() => openAsset(st.id)} onAddToCollection={() => openAsset(st.id)} onEdit={() => navigate(paths.stickerStudio('outline'))} onDelete={() => openAsset(st.id)} sticker={<StickerArt sticker={st} size={106} rotation={[-4, 6, 0, 3][i % 4]} />} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AppPage>
  )
}
