import { useState } from 'react'
import { ArrowLeftRight, Crop, File, Image, Lasso, Layers, Link, Pen, Pentagon, RotateCcw, Ribbon, ShieldCheck, Sticker, Type, Upload } from 'lucide-react'
import {
  Button,
  DropZone,
  ElementActions,
  IconButton,
  IconToggleRow,
  LayerButtons,
  LayerList,
  NumberField,
  PaperSwatch,
  PropGroup,
  PropHead,
  PropRow,
  PropertiesPanel,
  SearchField,
  SegmentedControl,
  SelectField,
  SidebarAsset,
  SidebarAssetGrid,
  Slider,
  SwatchGroup,
  Tag,
  TextLink,
  Tip,
  Toggle,
  UploadItem,
} from '../../components'
import type { Layer, PaperType, SidebarTab } from '../../components'
import { fonts, stickers, tapes } from '../../services/mockData'
import type { CanvasElement, JournalPage } from '../../types'
import { StickerArt, TapeArt } from '../shared/MockArt'
import { PAPERS } from '../notebook-management/options'
import s from '../shared/screens.module.css'

const noop = () => {}

const INK_SWATCHES = [
  { value: 'green', color: 'var(--color-green)', label: 'Green', dark: true },
  { value: 'red', color: 'var(--color-red)', label: 'Jasper', dark: true },
  { value: 'ink', color: 'var(--color-ink)', label: 'Ink', dark: true },
  { value: 'yellow', color: 'var(--color-yellow)', label: 'Golden Yellow' },
]

/* ========== Sidebar panel content per tab ========== */
export function SidebarContent({ tab, paper, onPaper }: { tab: SidebarTab; paper: PaperType; onPaper: (p: PaperType) => void }) {
  const [query, setQuery] = useState('')
  if (tab === 'stickers' || tab === 'recent') {
    const list = (tab === 'recent' ? stickers.slice(0, 4) : stickers).filter((st) => st.name.toLowerCase().includes(query.toLowerCase()))
    return (
      <>
        <SearchField placeholder="Search stickers" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
        {tab === 'stickers' && (
          <div className={s.row}>
            <Tag label="All" selected onClick={noop} />
            <Tag label="Florals" onClick={noop} />
          </div>
        )}
        <SidebarAssetGrid>
          {list.map((st) => (
            <SidebarAsset key={st.id} name={st.name} dragData={`sticker:${st.id}`} onAdd={noop} preview={<StickerArt sticker={st} size={64} />} />
          ))}
        </SidebarAssetGrid>
      </>
    )
  }
  if (tab === 'washi') {
    return (
      <>
        <SearchField placeholder="Search tapes" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
        <SidebarAssetGrid>
          {tapes.map((t) => (
            <SidebarAsset key={t.id} name={t.name} dragData={`washi:${t.id}`} onAdd={noop} preview={<TapeArt tape={t} length={110} width={28} rotation={-8} bg="sidebar" />} />
          ))}
        </SidebarAssetGrid>
      </>
    )
  }
  if (tab === 'backgrounds' || tab === 'paper') {
    return (
      <>
        <div role="radiogroup" aria-label="Page background" className={s.grid2}>
          {PAPERS.map((p) => (
            <PaperSwatch key={p.value} paper={p.value} name={p.label} selected={paper === p.value} onSelect={() => onPaper(p.value)} />
          ))}
        </div>
        <Button icon={Upload} fullWidth>
          Upload your own
        </Button>
        <Tip icon={ShieldCheck}>Changing paper never removes what’s on the page.</Tip>
      </>
    )
  }
  if (tab === 'text') {
    return (
      <div className={s.stack}>
        <Button icon={Type} fullWidth>Add a heading</Button>
        <Button icon={Pen} fullWidth>Add a handwritten note</Button>
        <Button icon={Type} fullWidth>Add typewriter text</Button>
        <p className={s.small}>Text boxes can be moved, resized and rotated like any element.</p>
      </div>
    )
  }
  // uploads
  return (
    <>
      <DropZone compact onFiles={noop} formats="PNG, JPG, JPEG, WEBP" />
      <UploadItem name="osaka-castle.jpg" status="uploading" progress={0.64} />
      <UploadItem name="ramen-night.png" status="processing" />
      <UploadItem name="IMG_2041.heic" status="error" error="HEIC isn’t supported. Try a JPG or PNG." onChooseAnother={noop} />
    </>
  )
}

/* ========== Properties panels ========== */
export type PanelKind = 'page' | 'image' | 'sticker' | 'washi' | 'text' | 'drawing' | 'crop' | 'lasso' | 'polygon' | 'layers'

function layerFor(el: CanvasElement): Layer {
  const icon = el.type === 'text' ? Type : el.type === 'sticker' ? Sticker : el.type === 'washi_tape' ? Ribbon : Image
  const name =
    el.type === 'text'
      ? el.content.split('\n')[0].slice(0, 22)
      : el.type === 'sticker'
        ? (stickers.find((x) => x.id === el.assetId)?.name ?? 'Sticker')
        : el.type === 'washi_tape'
          ? (tapes.find((x) => x.id === el.assetId)?.name ?? 'Washi tape')
          : el.id === 'el-polaroid'
            ? 'Matcha polaroid'
            : 'Temple photo'
  return { id: el.id, name, icon, locked: el.locked, hidden: el.hidden }
}

export function PageLayers({ page, selectedId, onSelect }: { page: JournalPage; selectedId?: string; onSelect: (id: string) => void }) {
  const [layers, setLayers] = useState<Layer[]>(() => [
    ...[...page.content.elements].sort((a, b) => b.zIndex - a.zIndex).map(layerFor),
    { id: 'bg', name: `Background · ${page.background.paper}`, icon: File, locked: true, isBackground: true },
  ])
  return (
    <LayerList
      layers={layers}
      selectedId={selectedId}
      onSelect={onSelect}
      onToggleLock={(id) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)))}
      onToggleVisible={(id) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, hidden: !l.hidden } : l)))}
      onReorder={(from, to) =>
        setLayers((ls) => {
          const next = [...ls]
          const [m] = next.splice(from, 1)
          next.splice(to, 0, m)
          return next
        })
      }
    />
  )
}

export interface PropertiesProps {
  kind: PanelKind
  page: JournalPage
  element?: CanvasElement
  selectedId?: string
  paper: PaperType
  onPaper: (p: PaperType) => void
  onSelect: (id: string) => void
  onShowAllPapers: () => void
  onOpenLayers: () => void
  onCrop: () => void
  onCropTool: (tool: 'crop' | 'lasso' | 'polygon') => void
  onExitMode: () => void
}

export function EditorProperties(p: PropertiesProps) {
  const [opacity, setOpacity] = useState(p.element?.opacity !== undefined ? Math.round(p.element.opacity * 100) : 100)
  const [locked, setLocked] = useState(!!p.element?.locked)
  const [ratio, setRatio] = useState('3:4')
  const [lockRatio, setLockRatio] = useState(true)
  const [edge, setEdge] = useState('torn')
  const [brush, setBrush] = useState('pen')
  const [ink, setInk] = useState('green')
  const [brushSize, setBrushSize] = useState(4)
  const [drawOver, setDrawOver] = useState<'over' | 'under'>('over')
  const [pressure, setPressure] = useState(true)
  const [lineSpacing, setLineSpacing] = useState(115)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const el = p.element

  const position = el && (
    <PropGroup label="Position & size">
      <PropRow>
        <NumberField label="X" value={el.x} onChange={noop} />
        <NumberField label="Y" value={el.y} onChange={noop} />
      </PropRow>
      <PropRow>
        <NumberField label="W" ariaLabel="Width" value={el.width} onChange={noop} />
        {el.type !== 'washi_tape' && <IconButton icon={Link} label="Lock aspect ratio" size="sm" active />}
        <NumberField label={el.type === 'washi_tape' ? 'L' : 'H'} ariaLabel={el.type === 'washi_tape' ? 'Length' : 'Height'} value={el.height} onChange={noop} />
      </PropRow>
      {el.type !== 'washi_tape' && el.type !== 'text' && <TextLink onClick={noop}>Restore original size</TextLink>}
    </PropGroup>
  )
  const rotation = el && (
    <PropGroup label="Rotation">
      <PropRow>
        <NumberField label="↻" ariaLabel="Rotation in degrees" value={el.rotation} unit="°" onChange={noop} />
        <IconButton icon={RotateCcw} label="Reset rotation" size="sm" />
      </PropRow>
    </PropGroup>
  )
  const layer = (
    <PropGroup label="Layer">
      <LayerButtons onMove={noop} />
    </PropGroup>
  )
  const elementFooter = <ElementActions onDuplicate={noop} onDelete={noop} />

  switch (p.kind) {
    case 'image':
    case 'sticker':
      return (
        <PropertiesPanel footer={elementFooter}>
          <PropHead icon={p.kind === 'sticker' ? Sticker : Image} title={p.kind === 'sticker' ? 'Sticker' : 'Photo'} subtitle={p.kind === 'sticker' ? 'Pressed daisy' : 'matcha.jpg · uploaded'} />
          {position}
          {rotation}
          <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
          <PropGroup label="Crop">
            <Button icon={Crop} fullWidth onClick={p.onCrop}>
              Crop image
            </Button>
          </PropGroup>
          {layer}
          <Toggle label="Lock position" checked={locked} onChange={setLocked} />
        </PropertiesPanel>
      )
    case 'washi':
      return (
        <PropertiesPanel footer={elementFooter}>
          <PropHead icon={Ribbon} title="Washi tape" subtitle="Sunny polka" />
          {position}
          {rotation}
          <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
          <PropGroup label="Edge style">
            <div className={s.row}>
              {['straight', 'torn', 'uneven', 'scalloped'].map((e) => (
                <Tag key={e} label={e[0].toUpperCase() + e.slice(1)} selected={edge === e} onClick={() => setEdge(e)} />
              ))}
            </div>
          </PropGroup>
          {layer}
        </PropertiesPanel>
      )
    case 'text':
      return (
        <PropertiesPanel footer={elementFooter}>
          <PropHead icon={Type} title="Text" subtitle="Handwritten note" />
          <SelectField label="Font" value="Caveat" onChange={noop} options={fonts.map((f) => ({ value: f.family, label: `${f.family} · ${f.category}` }))} />
          <PropGroup label="Size & colour">
            <NumberField label="Aa" ariaLabel="Font size" value={34} unit="px" onChange={noop} />
            <SwatchGroup label="Text colour" swatches={INK_SWATCHES} value={ink} onChange={setInk} />
          </PropGroup>
          <Slider label="Line spacing" min={80} max={200} value={lineSpacing} onChange={setLineSpacing} format={(v) => (v / 100).toFixed(2)} />
          <Slider label="Letter spacing" min={-5} max={20} value={letterSpacing} onChange={setLetterSpacing} />
          {rotation}
          {layer}
        </PropertiesPanel>
      )
    case 'drawing':
      return (
        <PropertiesPanel>
          <PropHead icon={Pen} title="Pen" subtitle="Draw on the page" />
          <PropGroup label="Brush">
            <div className={s.row}>
              {['pen', 'pencil', 'marker', 'highlighter', 'eraser'].map((b) => (
                <Tag key={b} label={b[0].toUpperCase() + b.slice(1)} selected={brush === b} onClick={() => setBrush(b)} />
              ))}
            </div>
          </PropGroup>
          <Slider label="Size" min={1} max={24} value={brushSize} onChange={setBrushSize} format={(v) => `${v} px`} />
          <PropGroup label="Colour">
            <SwatchGroup label="Pen colour" swatches={INK_SWATCHES} value={ink} onChange={setInk} />
          </PropGroup>
          <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
          <PropGroup label="Draw">
            <SegmentedControl label="Draw over or under decorations" value={drawOver} onChange={setDrawOver} options={[{ value: 'over', label: 'Over decorations' }, { value: 'under', label: 'Under' }]} />
          </PropGroup>
          <Toggle label="Pressure (stylus)" checked={pressure} onChange={setPressure} />
          <Tip>Strokes are saved as page content and can be undone.</Tip>
        </PropertiesPanel>
      )
    case 'crop':
    case 'lasso':
    case 'polygon':
      return (
        <PropertiesPanel
          footer={
            <>
              <Button onClick={p.onExitMode}>Cancel</Button>
              <Button variant="primary" onClick={p.onExitMode}>
                Apply
              </Button>
            </>
          }
        >
          <PropHead icon={Crop} title="Crop" subtitle="temple.jpg" />
          <PropGroup label="Tool">
            <IconToggleRow
              label="Crop tool"
              value={p.kind}
              onChange={(v) => p.onCropTool(v as 'crop' | 'lasso' | 'polygon')}
              items={[
                { value: 'crop', icon: Crop, label: 'Rectangle crop' },
                { value: 'lasso', icon: Lasso, label: 'Freeform lasso' },
                { value: 'polygon', icon: Pentagon, label: 'Polygon lasso' },
              ]}
            />
          </PropGroup>
          {p.kind === 'crop' ? (
            <>
              <PropGroup label="Aspect ratio">
                <div className={s.row}>
                  {['Free', '1:1', '4:5', '3:4', '16:9', 'Original'].map((r) => (
                    <Tag key={r} label={r} selected={ratio === r} onClick={() => setRatio(r)} />
                  ))}
                </div>
              </PropGroup>
              <Toggle label="Lock aspect ratio" checked={lockRatio} onChange={setLockRatio} />
              <TextLink onClick={noop}>Reset crop</TextLink>
            </>
          ) : (
            <PropGroup label="Selection">
              <div className={s.row}>
                <Button icon={ArrowLeftRight}>Invert</Button>
                <Button>Clear</Button>
              </div>
            </PropGroup>
          )}
          <Tip icon={ShieldCheck}>The original photo is never changed. Crops can be undone.</Tip>
        </PropertiesPanel>
      )
    case 'layers':
      return (
        <PropertiesPanel>
          <PropHead icon={Layers} title="Layers" subtitle={`${p.page.content.elements.length} elements · Page ${p.page.pageNumber}`} />
          <PageLayers page={p.page} selectedId={p.selectedId} onSelect={p.onSelect} />
          <PropGroup label="Arrange selected">
            <LayerButtons onMove={noop} />
          </PropGroup>
        </PropertiesPanel>
      )
    default:
      return (
        <PropertiesPanel
          footer={
            <>
              <Button fullWidth>Duplicate page</Button>
              <Button variant="destructive" fullWidth>
                Delete page
              </Button>
            </>
          }
        >
          <PropHead icon={File} title={`Page ${p.page.pageNumber}`} subtitle="A5 · 148 × 210 mm" />
          <PropGroup label="Background">
            <div role="radiogroup" aria-label="Page background" className={s.grid3}>
              {PAPERS.slice(0, 6).map((pp) => (
                <PaperSwatch key={pp.value} paper={pp.value} name={pp.label} selected={p.paper === pp.value} onSelect={() => p.onPaper(pp.value)} />
              ))}
            </div>
            <TextLink onClick={p.onShowAllPapers}>More papers &amp; upload</TextLink>
          </PropGroup>
          <PropGroup label="Layers on this page">
            <PageLayers page={p.page} selectedId={p.selectedId} onSelect={p.onSelect} />
            <TextLink onClick={p.onOpenLayers}>Open layers panel</TextLink>
          </PropGroup>
        </PropertiesPanel>
      )
  }
}
