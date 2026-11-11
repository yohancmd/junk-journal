import { useState } from 'react'
import type { ReactNode } from 'react'
import { ImageUp, Plus, Ribbon, Shapes } from 'lucide-react'
import {
  Banner,
  Button,
  DropZone,
  EmptyState,
  FilterBar,
  MethodCard,
  NumberField,
  Page,
  PageHeader,
  PatternPicker,
  PropGroup,
  PropRow,
  SearchField,
  SegmentedControl,
  SelectField,
  Slider,
  StudioShell,
  SwatchGroup,
  Tag,
  TapeCard,
  TextField,
  Tip,
  Toggle,
  WashiTape,
} from '../../components'
import type { TapeEdge, TapePattern } from '../../components'
import { useNavigate } from 'react-router'
import { AppPage } from '../shared/AppPage'
import { MockPhoto, TapeArt } from '../shared/MockArt'
import { useShellNav } from '../shared/useShellNav'
import { paths } from '../../routes/paths'
import { collections, libraryAssets, tapes } from '../../services/mockData'
import emptyArt from '../../assets/empty-illustration.svg'
import s from '../shared/screens.module.css'

const noop = () => {}
const STEPS = ['Method', 'Pattern', 'Customise', 'Save']

const COLOURS = [
  { value: 'var(--color-cream)', color: 'var(--color-cream)', label: 'Light Yellow' },
  { value: 'var(--color-yellow)', color: 'var(--color-yellow)', label: 'Golden Yellow' },
  { value: 'var(--color-green)', color: 'var(--color-green)', label: 'Green', dark: true },
  { value: 'var(--color-red)', color: 'var(--color-red)', label: 'Jasper', dark: true },
]
const EDGES: TapeEdge[] = ['straight', 'torn', 'uneven', 'scalloped']
const cap = (x: string) => x[0].toUpperCase() + x.slice(1)

/** Lined paper filling the preview, with children positioned absolutely on it. */
function PaperStage({ children }: { children: ReactNode }) {
  return (
    <div className={s.paperPreview}>
      <Page width={2000} height={2000} paper="lined" label="Sample paper">
        {children}
      </Page>
    </div>
  )
}

export type WashiMethod = 'pattern' | 'upload'

export interface WashiStudioScreenProps {
  /** 0 = 6.1 Method, 1 = 6.2 Pattern / 6.3 Upload, 2 = 6.4 Customise, 3 = 6.5 Save */
  step?: number
  method?: WashiMethod
  /** When set, step and method are controlled by the route (/washi-tapes/new/:step). */
  onStepChange?: (step: number, method: WashiMethod) => void
  saved?: boolean
}

/* ---------- 6.1 – 6.5 Washi Tape Studio ---------- */
export function WashiStudioScreen({ step: stepProp = 0, method: methodProp = 'pattern', onStepChange, saved: initiallySaved = false }: WashiStudioScreenProps) {
  const navigate = useNavigate()
  const shell = useShellNav()
  const [localStep, setLocalStep] = useState(stepProp)
  const [method, setMethod] = useState<WashiMethod>(methodProp)
  const step = onStepChange ? stepProp : localStep
  const setStep = (next: number | ((s: number) => number)) => {
    const value = typeof next === 'function' ? next(step) : next
    if (onStepChange) onStepChange(value, method)
    else setLocalStep(value)
  }
  const [pattern, setPattern] = useState<TapePattern>('gingham')
  const [base, setBase] = useState('var(--color-cream)')
  const [ink, setInk] = useState('var(--color-green)')
  const [scale, setScale] = useState(100)
  const [imageMode, setImageMode] = useState<'repeat' | 'scale'>('repeat')
  const [tile, setTile] = useState(96)
  const [mirror, setMirror] = useState(false)
  const [width, setWidth] = useState(56)
  const [length, setLength] = useState(220)
  const [opacity, setOpacity] = useState(90)
  const [rotation, setRotation] = useState(-4)
  const [texture, setTexture] = useState(true)
  const [edge, setEdge] = useState<TapeEdge>('torn')
  const [name, setName] = useState('Garden gingham')
  const [saved, setSaved] = useState(initiallySaved)

  const isImage = method === 'upload'
  const tape = (len: number, w = width, rot = 0) => (
    <WashiTape
      pattern={isImage ? 'image' : pattern}
      imageSrc={isImage ? emptyArt : undefined}
      imageMode={imageMode}
      baseColor={base}
      patternColor={ink}
      scale={scale / 100}
      width={w}
      length={len}
      edge={edge}
      opacity={opacity / 100}
      rotation={rot}
      texture={texture}
    />
  )

  let preview: ReactNode
  let panel: ReactNode
  let panelTitle = ''
  let next: { label?: string; icon?: typeof Ribbon; onClick: () => void } = { onClick: () => setStep((x) => x + 1) }

  if (step === 0) {
    panelTitle = 'How do you want to start?'
    preview = (
      <PaperStage>
        <div role="radiogroup" aria-label="How to make the tape" style={{ position: 'absolute', left: 56, top: 100, display: 'flex', gap: 40 }}>
          <MethodCard title="Use a pattern" description="Dots, stripes, gingham, florals and more. Pick colours and scale." icon={Shapes} selected={method === 'pattern'} onSelect={() => setMethod('pattern')} art={<div style={{ padding: '24px 0' }}><TapeArt tape={tapes[0]} length={300} width={38} rotation={-4} /><TapeArt tape={tapes[1]} length={300} width={34} rotation={3} /></div>} />
          <MethodCard title="Upload an image" description="Turn a photo, scan or drawing into a repeating tape." icon={ImageUp} selected={method === 'upload'} onSelect={() => setMethod('upload')} art={<div style={{ padding: 20, height: '100%' }}><MockPhoto tone="cream" /></div>} />
        </div>
      </PaperStage>
    )
    panel = (
      <>
        <p className={s.small}>Either way you can change colours, width, edges and texture next.</p>
        <PropGroup label="Or start from a recent tape">
          <div className={s.stack} style={{ overflow: 'hidden' }}>
            {tapes.slice(3, 7).map((t) => (
              <TapeArt key={t.id} tape={t} length={296} width={30} />
            ))}
          </div>
        </PropGroup>
      </>
    )
  } else if (step === 1 && !isImage) {
    panelTitle = 'Pattern'
    preview = (
      <PaperStage>
        <div style={{ position: 'absolute', left: 200, top: 250, width: 340, height: 250, transform: 'rotate(3deg)' }}>
          <MockPhoto tone="yellow" />
        </div>
        <div style={{ position: 'absolute', left: 60, top: 170 }}>{tape(640, 64, -6)}</div>
        <div style={{ position: 'absolute', left: 380, top: 470 }}>{tape(240, 46, 20)}</div>
        <span className={s.previewTag} style={{ left: 16 }}>Live preview</span>
      </PaperStage>
    )
    panel = (
      <>
        <PatternPicker value={pattern} onChange={setPattern} baseColor={base} patternColor={ink} />
        <PropGroup label="Base colour">
          <SwatchGroup label="Base colour" swatches={COLOURS} value={base} onChange={setBase} />
        </PropGroup>
        <PropGroup label="Pattern colour">
          <SwatchGroup label="Pattern colour" swatches={COLOURS} value={ink} onChange={setInk} />
        </PropGroup>
        <Slider label="Pattern scale" min={50} max={200} value={scale} onChange={setScale} format={(v) => `${v}%`} />
      </>
    )
  } else if (step === 1) {
    panelTitle = 'Upload a pattern'
    preview = (
      <PaperStage>
        <div style={{ position: 'absolute', left: 56, top: 56, width: 260, height: 200, transform: 'rotate(-2deg)', background: '#fff', padding: 10, boxShadow: 'var(--shadow-sm)' }}>
          <img src={emptyArt} alt="Uploaded pattern" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className={s.previewTag} style={{ left: 340, top: 70 }}>Your image</span>
        <div style={{ position: 'absolute', left: 40, top: 330 }}>{tape(670, 70, -3)}</div>
        <span className={s.previewTag} style={{ left: 56, top: 420 }}>{imageMode === 'repeat' ? `Repeat · ${tile} px tile` : 'Scale · stretched once'}</span>
      </PaperStage>
    )
    panel = (
      <>
        <DropZone compact onFiles={noop} title="Replace image" formats="PNG, JPG, JPEG, WEBP" />
        <PropGroup label="Along the tape">
          <SegmentedControl label="How the image runs along the tape" value={imageMode} onChange={setImageMode} options={[{ value: 'repeat', label: 'Repeat' }, { value: 'scale', label: 'Scale' }]} />
        </PropGroup>
        {imageMode === 'repeat' && <Slider label="Tile size" min={32} max={240} value={tile} onChange={setTile} format={(v) => `${v} px`} />}
        <Toggle label="Mirror alternate tiles" checked={mirror} onChange={setMirror} />
        <Tip>Repeat keeps the pattern crisp at any length. Scale suits one-off images like a ticket.</Tip>
      </>
    )
  } else if (step === 2) {
    panelTitle = 'Customise'
    preview = (
      <PaperStage>
        <div style={{ position: 'absolute', left: 60, top: 110 }}>{tape(length, width, rotation)}</div>
        <span className={s.previewTag} style={{ left: 60, top: 200 }}>Short · {length} px</span>
        <div style={{ position: 'absolute', left: 40, top: 290 }}>{tape(670, width, 2)}</div>
        <span className={s.previewTag} style={{ left: 60, top: 380 }}>Long · 670 px, same pattern size</span>
        <div style={{ position: 'absolute', left: 40, top: 470, display: 'flex', gap: 24 }}>
          {EDGES.map((e) => (
            <figure key={e} style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <WashiTape pattern={isImage ? 'dots' : pattern} baseColor={base} patternColor={ink} edge={e} width={44} length={150} />
              <figcaption className={s.small} style={{ fontWeight: e === edge ? 700 : 400 }}>{cap(e)}</figcaption>
            </figure>
          ))}
        </div>
      </PaperStage>
    )
    panel = (
      <>
        <PropGroup label="Size">
          <PropRow>
            <NumberField label="W" ariaLabel="Width" value={width} unit="px" min={16} max={120} onChange={setWidth} />
            <NumberField label="L" ariaLabel="Default length" value={length} unit="px" min={60} max={640} onChange={setLength} />
          </PropRow>
        </PropGroup>
        <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
        <PropGroup label="Rotation">
          <NumberField label="↻" ariaLabel="Rotation in degrees" value={rotation} unit="°" onChange={setRotation} />
        </PropGroup>
        <Toggle label="Paper texture" checked={texture} onChange={setTexture} />
        <PropGroup label="Edge style">
          <div className={s.row}>
            {EDGES.map((e) => (
              <Tag key={e} label={cap(e)} selected={edge === e} onClick={() => setEdge(e)} />
            ))}
          </div>
        </PropGroup>
      </>
    )
  } else {
    panelTitle = 'Save your tape'
    next = saved ? { label: 'Use on a page', icon: Plus, onClick: () => navigate(paths.notebooks) } : { label: 'Save tape', icon: Ribbon, onClick: () => setSaved(true) }
    preview = (
      <PaperStage>
        <div style={{ position: 'absolute', left: 170, top: 150, width: 420, height: 320, transform: 'rotate(-3deg)' }}>
          <MockPhoto tone="cream" />
        </div>
        <div style={{ position: 'absolute', left: 110, top: 150 }}>{tape(220, 52, -28)}</div>
        <div style={{ position: 'absolute', left: 440, top: 450 }}>{tape(220, 52, -24)}</div>
        <p className={s.handwriting} style={{ position: 'absolute', left: 200, top: 540, fontSize: 36, transform: 'rotate(-2deg)' }}>
          {name.toLowerCase()} ✿
        </p>
      </PaperStage>
    )
    panel = saved ? (
      <Banner title="Saved to your tape library">“{name}” is ready to use in any notebook.</Banner>
    ) : (
      <>
        <div style={{ overflow: 'hidden', padding: '12px 0' }}>{tape(296, 40)}</div>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <PropGroup label="Saved settings">
          <dl className={s.small} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', margin: 0 }}>
            <dt style={{ fontWeight: 700 }}>Pattern</dt><dd style={{ margin: 0 }}>{isImage ? 'Uploaded image' : cap(pattern)}</dd>
            <dt style={{ fontWeight: 700 }}>Size</dt><dd style={{ margin: 0 }}>{width} × {length} px</dd>
            <dt style={{ fontWeight: 700 }}>Edges</dt><dd style={{ margin: 0 }}>{cap(edge)}</dd>
            <dt style={{ fontWeight: 700 }}>Opacity</dt><dd style={{ margin: 0 }}>{opacity}%</dd>
          </dl>
        </PropGroup>
        <SelectField label="Collection" value="garden" onChange={noop} options={collections.filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.name }))} />
      </>
    )
  }

  return (
    <StudioShell
      kind="washi"
      steps={STEPS.map((x, i) => (i === 1 && isImage ? 'Upload' : x))}
      current={step}
      onStepClick={setStep}
      onLibrary={() => navigate(paths.tapes)}
      {...shell}
      preview={preview}
      panelTitle={panelTitle}
      panel={panel}
      back={step > 0 ? { onClick: () => setStep((x) => x - 1) } : undefined}
      next={next}
    />
  )
}

/* ---------- 6.6 Tape library ---------- */
export function TapeLibraryScreen({ state = 'filled' }: { state?: 'filled' | 'empty' | 'no-results' }) {
  const navigate = useNavigate()
  const openAsset = (tapeId: string) => {
    const asset = libraryAssets.find((a) => a.refId === tapeId)
    navigate(asset ? paths.libraryAsset(asset.id) : paths.library)
  }
  const [query, setQuery] = useState(state === 'no-results' ? 'tartan' : '')
  const [filters, setFilters] = useState<string[]>(['all'])
  const list = state === 'empty' ? [] : tapes.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) && (filters.includes('all') || filters.some((f) => f === t.edgeStyle || (f === 'patterns' && t.pattern !== 'image'))))

  return (
    <AppPage active="washi">
      <PageHeader
        accent="tape drawer"
        title="Tape library"
        actions={
          <>
            <SearchField placeholder="Search tapes" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
            <Button variant="primary" icon={Plus} onClick={() => navigate(paths.washiStudio())}>New tape</Button>
          </>
        }
      />
      {state === 'empty' ? (
        <div className={s.emptyFrame}>
          <EmptyState accent="no tapes yet" body="Pick a pattern or upload an image to make a washi tape." action={{ label: 'Make a tape', icon: Ribbon, onClick: () => navigate(paths.washiStudio()) }} />
        </div>
      ) : (
        <>
          <FilterBar
            filters={[{ id: 'all', label: 'All', count: 18 }, { id: 'patterns', label: 'Patterns', count: 12 }, { id: 'images', label: 'From images', count: 6 }, { id: 'torn', label: 'Torn edges' }, { id: 'scalloped', label: 'Scalloped' }]}
            selected={filters}
            onToggle={(id) => setFilters((f) => (id === 'all' ? ['all'] : f.includes(id) ? f.filter((x) => x !== id) : [...f.filter((x) => x !== 'all'), id]))}
            resultText={query ? `${list.length} tapes match “${query}”` : undefined}
            onClear={() => {
              setQuery('')
              setFilters(['all'])
            }}
          />
          {list.length === 0 ? (
            <div className={s.emptyFrame}>
              <EmptyState accent="nothing here yet" body={`No tapes match “${query}”. Try another word or clear the filters.`} action={{ label: 'Clear filters', onClick: () => { setQuery(''); setFilters(['all']) } }} illustration={false} />
            </div>
          ) : (
            <div className={s.grid2}>
              {list.map((t) => (
                <TapeCard key={t.id} name={t.name} meta={`${cap(t.edgeStyle)} edge · ${t.width} px`} onOpen={() => openAsset(t.id)} onRename={() => openAsset(t.id)} onEdit={() => navigate(paths.washiStudio('customise'))} onDelete={() => openAsset(t.id)} tape={<TapeArt tape={t} length={220} bg="card" />} />
              ))}
            </div>
          )}
        </>
      )}
    </AppPage>
  )
}
