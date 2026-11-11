import { useState } from 'react'
import type { ReactNode } from 'react'
import { BookOpen, Crop, Flower2, Heart, ImageUp, Mail, Plus, Ribbon, Shapes, Star, Sticker, Type, Image as ImageIcon } from 'lucide-react'
import {
  AddPageTile,
  AppShell,
  AssetCard,
  AssetSidebar,
  Banner,
  BeforeAfter,
  Button,
  CanvasArea,
  Checkbox,
  CollectionHeader,
  CollectionList,
  ConfirmDialog,
  CropBar,
  CropOverlay,
  DangerZone,
  DieCutSticker,
  DirectionDial,
  DropZone,
  EditorToolbar,
  ElementActions,
  EmptyState,
  ExportModal,
  FilterBar,
  IconButton,
  ImageToolbar,
  KeyCap,
  LassoOverlay,
  LayerButtons,
  LayerList,
  MethodCard,
  ModeBanner,
  NotebookCard,
  NumberField,
  Page,
  PageElement,
  PageHeader,
  PageThumbnail,
  PaperSwatch,
  PasswordField,
  PasswordStrength,
  PatternPicker,
  PenRail,
  PolygonOverlay,
  ProgressBar,
  PropGroup,
  PropHead,
  PropRow,
  PropertiesPanel,
  RecoveryDialog,
  SaveStatusPill,
  SearchField,
  SegmentedControl,
  SelectionBox,
  ShortcutsModal,
  SidebarAsset,
  SidebarAssetGrid,
  Skeleton,
  Slider,
  StickerTile,
  Stepper,
  SwatchGroup,
  Tag,
  TapeCard,
  TextField,
  TextLink,
  TextToolbar,
  Tip,
  Toggle,
  UploadItem,
  WashiTape,
  useToast,
} from '../components'
import type { CropRatio, ImageTool, Layer, PenTool, SidebarTab, TapePattern, TextStyleValue } from '../components'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, border: '2px solid var(--color-green)', borderRadius: 16 }}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

const Row = ({ children, gap = 12 }: { children: ReactNode; gap?: number }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap }}>{children}</div>
)

const noop = () => {}

export function ComponentGallery() {
  const toast = useToast()
  const [toggle, setToggle] = useState(true)
  const [opacity, setOpacity] = useState(85)
  const [x, setX] = useState(330)
  const [seg, setSeg] = useState<'over' | 'under'>('over')
  const [swatch, setSwatch] = useState('green')
  const [tab, setTab] = useState<SidebarTab>('stickers')
  const [tool, setTool] = useState<ImageTool>('select')
  const [pen, setPen] = useState<PenTool>('pen')
  const [ratio, setRatio] = useState<CropRatio>('3:4')
  const [pattern, setPattern] = useState<TapePattern>('gingham')
  const [angle, setAngle] = useState(60)
  const [method, setMethod] = useState<'pattern' | 'upload'>('pattern')
  const [paper, setPaper] = useState('lined')
  const [pw, setPw] = useState('Kyoto2026!')
  const [filters, setFilters] = useState<string[]>(['all'])
  const [text, setText] = useState<TextStyleValue>({ family: 'Caveat', size: 34, color: 'var(--color-green)', bold: false, italic: false, align: 'left' })
  const [modal, setModal] = useState<null | 'confirm' | 'export' | 'shortcuts' | 'recovery'>(null)
  const [layers, setLayers] = useState<Layer[]>([
    { id: 't', name: 'Typed text', icon: Type },
    { id: 'd', name: 'Daisy sticker', icon: Sticker },
    { id: 'w', name: 'Red washi', icon: Ribbon },
    { id: 'p', name: 'Matcha polaroid', icon: ImageIcon },
    { id: 'bg', name: 'Background · Lined', icon: BookOpen, locked: true, isBackground: true },
  ])
  const [selectedLayer, setSelectedLayer] = useState('d')

  const user = { name: 'Mira Santos', initials: 'MS' }

  return (
    <AppShell active="dashboard" onNavigate={noop} user={user} onAccountSettings={noop} onShortcuts={() => setModal('shortcuts')} onHelp={noop} onSignOut={noop}>
      <PageHeader
        accent="every piece, in one place"
        title="Component gallery"
        actions={
          <>
            <SearchField placeholder="Search components" value="" onChange={noop} />
            <Button variant="primary" icon={Plus} onClick={() => toast.show({ kind: 'success', message: 'Sticker saved to your library.', action: { label: 'View', onClick: noop } })}>
              Show a toast
            </Button>
          </>
        }
      />

      <Section title="Buttons & controls">
        <Row>
          <Button variant="primary" icon={Plus}>Create notebook</Button>
          <Button>Duplicate</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="primary" loading>Saving</Button>
          <IconButton icon={Star} label="Favourite" />
          <IconButton icon={Star} label="Favourite (on)" active />
          <TextLink>Forgot password?</TextLink>
          <KeyCap>Ctrl</KeyCap>
          <KeyCap>Z</KeyCap>
        </Row>
        <Row gap={24}>
          <div style={{ width: 300 }}>
            <TextField label="Email" leadingIcon={Mail} defaultValue="mira@example.com" />
          </div>
          <div style={{ width: 300 }}>
            <TextField label="Notebook title" error="Give your notebook a title." defaultValue="" />
          </div>
          <div style={{ width: 300 }}>
            <PasswordField label="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
            <PasswordStrength password={pw} />
          </div>
        </Row>
        <Row gap={24}>
          <Checkbox label="Keep me signed in" defaultChecked />
          <div style={{ width: 240 }}>
            <Toggle label="Lock position" checked={toggle} onChange={setToggle} />
          </div>
          <div style={{ width: 260 }}>
            <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
          </div>
          <div style={{ width: 160 }}>
            <NumberField label="X" value={x} onChange={setX} />
          </div>
        </Row>
        <Row gap={24}>
          <div style={{ width: 300 }}>
            <SegmentedControl label="Draw" value={seg} onChange={setSeg} options={[{ value: 'over', label: 'Over decorations' }, { value: 'under', label: 'Under' }]} />
          </div>
          <Row>
            <Tag label="Florals" />
            <Tag label="Travel" count={14} selected onClick={noop} />
            <Tag label="Vintage" onClick={noop} />
          </Row>
          <SwatchGroup
            label="Colour"
            value={swatch}
            onChange={setSwatch}
            swatches={[
              { value: 'green', color: 'var(--color-green)', label: 'Green', dark: true },
              { value: 'red', color: 'var(--color-red)', label: 'Jasper', dark: true },
              { value: 'ink', color: 'var(--color-ink)', label: 'Ink', dark: true },
              { value: 'yellow', color: 'var(--color-yellow)', label: 'Golden Yellow' },
            ]}
          />
        </Row>
      </Section>

      <Section title="Feedback">
        <Row gap={16}>
          <SaveStatusPill status="saving" />
          <SaveStatusPill status="saved" />
          <SaveStatusPill status="offline" />
          <SaveStatusPill status="failed" onRetry={noop} />
        </Row>
        <Banner kind="error" title="We couldn’t save your last change" action={<Button>Retry now</Button>}>
          Your work is safe on this device. We’ll keep trying every 10 seconds.
        </Banner>
        <Tip>The original photo is never changed. Crops can be undone.</Tip>
        <Row gap={24}>
          <div style={{ width: 320 }}>
            <ProgressBar value={0.38} label="Preparing page 9 of 24" />
          </div>
          <Skeleton width={180} height={22} radius={999} />
          <Skeleton width={120} height={80} radius={16} />
        </Row>
        <Row>
          <Button onClick={() => setModal('confirm')}>Confirm dialog</Button>
          <Button onClick={() => setModal('export')}>Export modal</Button>
          <Button onClick={() => setModal('shortcuts')}>Shortcuts</Button>
          <Button onClick={() => setModal('recovery')}>Recovery dialog</Button>
          <Button onClick={() => toast.show({ kind: 'error', message: 'Couldn’t upload IMG_2041.heic. Try a JPG or PNG.', action: { label: 'Retry', onClick: noop } })}>Error toast</Button>
        </Row>
        <EmptyState accent="a blank page awaits" title="Make your first notebook" body="A notebook holds your pages. Fill them with photos, stickers, tape and handwriting." action={{ label: 'Create your first notebook', icon: Plus }} secondary={[{ label: 'Make a sticker', icon: Sticker }, { label: 'Make a washi tape', icon: Ribbon }]} />
      </Section>

      <Section title="Shell">
        <Stepper steps={['Upload', 'Remove background', 'Crop', 'Die-cut & shadow', 'Save']} current={2} onStepClick={noop} />
      </Section>

      <Section title="Cards">
        <Row gap={20}>
          <NotebookCard title="Travel Journal" meta="24 pages · edited today" coverAccent="our summer" onOpen={noop} menuItems={[{ label: 'Rename', onSelect: noop }, { label: 'Delete', onSelect: noop, destructive: true }]} />
          <NotebookCard title="Daily Journal" meta="61 pages · edited yesterday" coverColor="green" coverAccent="day by day" onOpen={noop} />
          <NotebookCard title="Memory Book" meta="8 pages" coverColor="cream" coverAccent="since 2024" onOpen={noop} />
        </Row>
        <Row gap={20}>
          <PageThumbnail number={1} selected onOpen={noop} onDuplicate={noop} onDelete={noop} />
          <PageThumbnail number={2} onOpen={noop} onDuplicate={noop} onChangeBackground={noop} onDelete={noop} />
          <PageThumbnail number={3} dragging onOpen={noop} />
          <AddPageTile onClick={noop} />
        </Row>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <AssetCard name="Sunny polka" type="Washi" onClick={noop} preview={<WashiTape length={200} width={36} rotation={-6} />} />
          <AssetCard name="Pressed daisy" type="Sticker" onClick={noop} preview={<DieCutSticker width={88} height={88}><Flower2 size={40} /></DieCutSticker>} />
          <AssetCard name="Lined cream" type="Paper" selected onClick={noop} preview={<Page width={240} height={120} paper="lined" />} />
          <StickerTile name="Love note" category="Shapes" onOpen={noop} onRename={noop} onEdit={noop} onDelete={noop} sticker={<DieCutSticker width={106} height={106} fallbackBackground="var(--color-cream)"><Heart size={52} color="var(--color-red)" /></DieCutSticker>} />
        </div>
        <Row gap={16}>
          <div style={{ width: 520 }}>
            <TapeCard name="Picnic check" meta="Scalloped edge · 40 px" onOpen={noop} onRename={noop} onEdit={noop} onDelete={noop} tape={<WashiTape pattern="check" baseColor="var(--color-yellow)" patternColor="var(--color-green)" edge="scalloped" length={220} />} />
          </div>
        </Row>
        <Row gap={24}>
          <CollectionList collections={[{ id: 'all', name: 'All assets', count: 186 }, { id: 'jp', name: 'Japan 2026', count: 42 }, { id: 'g', name: 'Garden', count: 19 }]} activeId="jp" onSelect={noop} onNew={noop} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CollectionHeader description="Kyoto & Osaka · June 2026" meta="42 assets · used in Travel Journal" onAdd={noop} onRename={noop} onDelete={noop} />
            <FilterBar
              filters={[{ id: 'all', label: 'All', count: 186 }, { id: 'stickers', label: 'Stickers' }, { id: 'washi', label: 'Washi tapes' }, { id: 'photos', label: 'Photos' }]}
              selected={filters}
              onToggle={(id) => setFilters((f) => (f.includes(id) ? f.filter((v) => v !== id) : [...f, id]))}
              resultText="3 stickers match “flower”"
              onClear={() => setFilters([])}
            />
          </div>
        </Row>
      </Section>

      <Section title="Editor">
        <div style={{ border: '2px solid var(--color-green)', borderRadius: 16, overflow: 'hidden' }}>
          <EditorToolbar notebookTitle="Travel Journal" page={3} pageCount={24} zoom={1} guides saveStatus="saved" onBack={noop} onUndo={noop} onRedo={noop} onZoomIn={noop} onZoomOut={noop} onFit={noop} onToggleGuides={noop} onPrevPage={noop} onNextPage={noop} onShortcuts={() => setModal('shortcuts')} onExport={() => setModal('export')} />
          <div style={{ display: 'flex', height: 760 }}>
            <AssetSidebar active={tab} onChange={setTab}>
              <SearchField placeholder="Search stickers" value="" onChange={noop} />
              <SidebarAssetGrid>
                {[Flower2, Star, Heart, Shapes].map((Ic, i) => (
                  <SidebarAsset key={i} name={['Daisy', 'Gold star', 'Love', 'Shapes'][i]} dragData={`sticker:${i}`} onAdd={noop} preview={<Ic size={40} />} />
                ))}
              </SidebarAssetGrid>
            </AssetSidebar>
            <CanvasArea
              overlay={
                <div style={{ position: 'absolute', top: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <ImageToolbar tool={tool} onTool={setTool} onFlipH={noop} onFlipV={noop} onUndo={noop} onRedo={noop} />
                </div>
              }
            >
              <Page width={380} height={560} paper="lined">
                <PageElement x={60} y={60} width={220} height={160} rotation={3} label="Temple photo" onSelect={noop}>
                  <div style={{ width: '100%', height: '100%', background: '#fff', padding: 10, boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--color-yellow)' }} />
                  </div>
                </PageElement>
                <PageElement x={40} y={36} width={120} height={30} rotation={-6} label="Washi tape" onSelect={noop}>
                  <WashiTape length={120} width={30} />
                </PageElement>
                <PageElement x={200} y={250} width={130} height={130} label="Daisy sticker" selected onSelect={noop}>
                  <DieCutSticker width={130} height={130}><Flower2 size={56} /></DieCutSticker>
                </PageElement>
                <SelectionBox x={200} y={250} width={130} height={130} activeHandle="se" />
                <PageElement x={40} y={420} width={300} height={80} label="Handwritten note" onSelect={noop}>
                  <p style={{ font: '400 34px/1.15 var(--font-accent)', transform: 'rotate(-2deg)' }}>day 3 — the temple at dawn</p>
                </PageElement>
              </Page>
            </CanvasArea>
            <PropertiesPanel footer={<ElementActions onDuplicate={noop} onDelete={noop} />}>
              <PropHead icon={Sticker} title="Sticker" subtitle="Pressed daisy" />
              <PropGroup label="Position & size">
                <PropRow>
                  <NumberField label="X" value={x} onChange={setX} />
                  <NumberField label="Y" value={250} onChange={noop} />
                </PropRow>
              </PropGroup>
              <Slider label="Opacity" value={opacity} onChange={setOpacity} format={(v) => `${v}%`} />
              <PropGroup label="Layer">
                <LayerButtons onMove={noop} />
              </PropGroup>
              <LayerList
                layers={layers}
                selectedId={selectedLayer}
                onSelect={setSelectedLayer}
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
            </PropertiesPanel>
          </div>
        </div>
        <Row gap={16}>
          <ModeBanner icon={Crop}>Crop mode · editing the crop, not the photo</ModeBanner>
          <TextToolbar value={text} fonts={[{ family: 'Caveat', category: 'Handwriting' }, { family: 'Courier Prime', category: 'Typewriter' }, { family: 'Fraunces', category: 'Serif' }, { family: 'Nunito Sans', category: 'Sans-serif' }]} onChange={(p) => setText((t) => ({ ...t, ...p }))} onColorClick={noop} />
        </Row>
        <Row gap={16}>
          <CropBar tool="crop" onTool={noop} ratio={ratio} onRatio={setRatio} onApply={noop} onCancel={noop} />
          <PenRail tool={pen} onTool={setPen} />
        </Row>
        <Row gap={24}>
          {[
            ['Crop', <CropOverlay key="c" width={260} height={200} crop={{ x: 50, y: 40, width: 150, height: 110 }} />],
            ['Lasso', <LassoOverlay key="l" width={260} height={200} closed points={[[40, 80], [90, 30], [180, 40], [220, 110], [150, 170], [60, 150]]} />],
            ['Polygon', <PolygonOverlay key="p" width={260} height={200} hoverStart points={[[60, 60], [150, 40], [210, 90], [190, 160], [100, 170]]} cursor={[70, 120]} />],
          ].map(([label, overlay]) => (
            <div key={label as string} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong>{label}</strong>
              <div style={{ position: 'relative', width: 260, height: 200, background: 'var(--color-yellow)' }}>{overlay}</div>
            </div>
          ))}
        </Row>
        <Row gap={16}>
          <div role="radiogroup" aria-label="Paper" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 110px)', gap: 12 }}>
            {(['white', 'lined', 'grid', 'dotted', 'kraft', 'vintage', 'floral', 'cream'] as const).map((p) => (
              <PaperSwatch key={p} paper={p} name={p[0].toUpperCase() + p.slice(1)} selected={paper === p} onSelect={() => setPaper(p)} />
            ))}
          </div>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <UploadItem name="osaka-castle.jpg" status="uploading" progress={0.64} />
            <UploadItem name="ramen-night.png" status="processing" />
            <UploadItem name="IMG_2041.heic" status="error" error="HEIC isn’t supported. Try a JPG or PNG." onChooseAnother={noop} />
          </div>
        </Row>
      </Section>

      <Section title="Studio">
        <Row gap={24}>
          <div style={{ width: 420 }}>
            <DropZone onFiles={noop} />
          </div>
          <div style={{ width: 420, height: 300, border: '2px solid var(--color-green)', borderRadius: 16, overflow: 'hidden' }}>
            <BeforeAfter before={<div style={{ width: '100%', height: '100%', background: 'var(--color-green)' }} />} after={<Heart size={120} color="var(--color-red)" />} />
          </div>
        </Row>
        <Row gap={24}>
          {(['straight', 'torn', 'uneven', 'scalloped'] as const).map((e) => (
            <WashiTape key={e} edge={e} length={180} width={44} title={`${e} edge`} />
          ))}
          <WashiTape pattern="florals" baseColor="var(--color-green)" patternColor="var(--color-yellow)" length={260} width={44} texture />
        </Row>
        <Row gap={24}>
          <div style={{ width: 320 }}>
            <PatternPicker value={pattern} onChange={setPattern} />
          </div>
          <div role="radiogroup" aria-label="Method" style={{ display: 'flex', gap: 16 }}>
            <MethodCard title="Use a pattern" description="Dots, stripes, gingham, florals and more." icon={Shapes} selected={method === 'pattern'} onSelect={() => setMethod('pattern')} art={<WashiTape pattern="dots" length={300} width={44} rotation={-4} />} />
            <MethodCard title="Upload an image" description="Turn a photo, scan or drawing into tape." icon={ImageUp} selected={method === 'upload'} onSelect={() => setMethod('upload')} />
          </div>
          <Row>
            <DirectionDial angle={angle} onChange={setAngle} />
            <span>{angle}°</span>
          </Row>
        </Row>
        <DangerZone title="Delete account" body="Removes every notebook, sticker and tape. This can’t be undone." actionLabel="Delete account" onAction={() => setModal('confirm')} />
      </Section>

      <ConfirmDialog open={modal === 'confirm'} title="Delete “Travel Journal”?" body="This removes the notebook and its 24 pages. You can’t undo this." reassure="Your stickers, tapes and uploads stay in your Asset Library." confirmLabel="Delete notebook" onConfirm={() => setModal(null)} onCancel={() => setModal(null)} />
      <ExportModal open={modal === 'export'} onClose={() => setModal(null)} onExport={() => setModal(null)} pageCount={24} progress={{ value: 0.38, page: 9 }} />
      <ShortcutsModal open={modal === 'shortcuts'} onClose={() => setModal(null)} />
      <RecoveryDialog open={modal === 'recovery'} notebookTitle="Travel Journal" page={3} time="today at 14:32" changes={6} onRestore={() => setModal(null)} onDiscard={() => setModal(null)} />
    </AppShell>
  )
}
