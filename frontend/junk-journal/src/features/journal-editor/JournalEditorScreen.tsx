import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Crop, File, ImageUp, PenLine } from 'lucide-react'
import {
  AssetSidebar,
  CanvasArea,
  CropBar,
  CropOverlay,
  EditorToolbar,
  ExportModal,
  FloatingButton,
  FloatingDivider,
  FloatingToolbar,
  ImageToolbar,
  LassoOverlay,
  ModeBanner,
  PenRail,
  PolygonOverlay,
  ProgressBar,
  RecoveryDialog,
  SaveAsStickerModal,
  SelectionActionsMenu,
  SelectionBox,
  ShortcutsModal,
  SpreadView,
  TextToolbar,
  Toast,
} from '../../components'
import type { CropRatio, ImageTool, PaperType, PenTool, SaveStatus, SidebarTab, TextStyleValue } from '../../components'
import { fonts, notebooks, samplePage, stickerCategories } from '../../services/mockData'
import type { JournalPage } from '../../types'
import { SamplePageView } from '../shared/MockArt'
import { EditorProperties, SidebarContent } from './EditorPanels'
import type { PanelKind } from './EditorPanels'
import emptyArt from '../../assets/empty-illustration.svg'
import e from './editorScreen.module.css'

/** Initial state for each editor screen in design system/screens.md §4 (and 8.6). */
export type EditorMode =
  | 'nothing' // 4.1
  | 'empty' // 4.1 empty page
  | 'image' // 4.2
  | 'washi' // 4.3
  | 'text' // 4.4
  | 'drawing' // 4.5
  | 'crop' // 4.6
  | 'lasso' // 4.7
  | 'polygon' // 4.8
  | 'selection-actions' // 4.9
  | 'save-sticker' // 4.10
  | 'backgrounds' // 4.11
  | 'layers' // 4.12
  | 'uploading' // 4.13
  | 'export' // 4.15
  | 'spread' // 4.16
  | 'shortcuts' // 4.17
  | 'recovery' // 8.6

const SELECT_FOR_MODE: Partial<Record<EditorMode, string>> = {
  image: 'el-polaroid',
  washi: 'el-tape-1',
  text: 'el-text',
  layers: 'el-sticker',
}

const noop = () => {}
const notebook = notebooks[0]

// Lasso / polygon sample points, in page coordinates over the temple photo.
const LASSO: Array<[number, number]> = [[110, 130], [150, 95], [230, 90], [300, 120], [320, 180], [270, 235], [180, 240], [120, 210]]
const POLY: Array<[number, number]> = [[120, 110], [200, 92], [262, 120], [250, 190], [170, 214], [150, 170]]

const PAGE_TWO: JournalPage = {
  ...samplePage,
  id: 'pg-2',
  pageNumber: 2,
  content: {
    version: 1,
    elements: [
      { id: 'p2-photo', type: 'image', assetId: 'as-dotonbori', x: 60, y: 80, width: 420, height: 300, rotation: -2, zIndex: 1 },
      { id: 'p2-tape', type: 'washi_tape', assetId: 'tp-hearts', x: 230, y: 64, width: 120, height: 30, rotation: 4, zIndex: 2 },
      { id: 'p2-text', type: 'text', x: 70, y: 430, width: 360, height: 90, rotation: -2, zIndex: 3, content: 'day 2 — Dotonbori\nlights everywhere!', fontFamily: 'Caveat', fontSize: 36, color: 'var(--color-green)' },
    ],
  },
}

export interface JournalEditorScreenProps {
  mode?: EditorMode
  /** 4.14 save-status states */
  saveStatus?: SaveStatus
}

export function JournalEditorScreen({ mode: initialMode = 'nothing', saveStatus: initialStatus }: JournalEditorScreenProps) {
  const [mode, setMode] = useState<EditorMode>(initialMode)
  const [selectedId, setSelectedId] = useState<string | undefined>(SELECT_FOR_MODE[initialMode])
  const [tab, setTab] = useState<SidebarTab>(initialMode === 'backgrounds' ? 'backgrounds' : initialMode === 'uploading' ? 'uploads' : 'stickers')
  const [paper, setPaper] = useState<PaperType>(samplePage.background.paper)
  const [imageTool, setImageTool] = useState<ImageTool>('select')
  const [penTool, setPenTool] = useState<PenTool>('pen')
  const [ratio, setRatio] = useState<CropRatio>('3:4')
  const [guides, setGuides] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [menuOpen, setMenuOpen] = useState(initialMode === 'selection-actions')
  const [isolated, setIsolated] = useState(initialMode === 'selection-actions')
  const [modal, setModal] = useState<null | 'save-sticker' | 'export' | 'shortcuts' | 'recovery'>(
    initialMode === 'save-sticker' || initialMode === 'export' || initialMode === 'shortcuts' || initialMode === 'recovery' ? initialMode : null,
  )
  const [text, setText] = useState<TextStyleValue>({ family: 'Caveat', size: 34, color: 'var(--color-green)', bold: false, italic: false, align: 'left' })

  const page: JournalPage = useMemo(
    () => ({
      ...samplePage,
      background: { paper },
      content: mode === 'empty' ? { version: 1, elements: [] } : samplePage.content,
    }),
    [paper, mode],
  )
  const selected = page.content.elements.find((el) => el.id === selectedId)
  const saveStatus: SaveStatus = initialStatus ?? (mode === 'uploading' ? 'saving' : 'saved')
  const cropMode = mode === 'crop' || mode === 'lasso' || mode === 'polygon' || mode === 'selection-actions'
  const spread = mode === 'spread'

  function select(id: string) {
    setSelectedId(id)
    if (cropMode || mode === 'drawing' || mode === 'empty') return
    const el = page.content.elements.find((x) => x.id === id)
    setMode(el?.type === 'text' ? 'text' : el?.type === 'washi_tape' ? 'washi' : 'image')
  }

  const panelKind: PanelKind =
    mode === 'drawing'
      ? 'drawing'
      : mode === 'crop'
        ? 'crop'
        : mode === 'lasso'
          ? 'lasso'
          : mode === 'polygon' || mode === 'selection-actions'
            ? 'polygon'
            : mode === 'layers'
              ? 'layers'
              : mode === 'text'
                ? 'text'
                : mode === 'washi'
                  ? 'washi'
                  : mode === 'image' && selected?.type === 'sticker'
                    ? 'sticker'
                    : mode === 'image'
                      ? 'image'
                      : 'page'

  /* ----- overlays drawn inside the page (page coordinates) ----- */
  const temple = page.content.elements.find((x) => x.id === 'el-photo')
  let pageOverlay: ReactNode = null
  if (selected && (mode === 'image' || mode === 'layers')) {
    pageOverlay = <SelectionBox x={selected.x} y={selected.y} width={selected.width} height={selected.height} rotation={selected.rotation} activeHandle={mode === 'image' ? 'se' : undefined} />
  } else if (selected && mode === 'washi') {
    pageOverlay = <SelectionBox x={selected.x} y={selected.y} width={selected.width} height={selected.height} rotation={selected.rotation} variant="tape" />
  } else if (selected && mode === 'text') {
    pageOverlay = <span className={e.editBox} style={{ left: selected.x - 8, top: selected.y - 8, width: selected.width + 16, height: selected.height + 8 }} aria-hidden />
  } else if (mode === 'crop' && temple) {
    pageOverlay = (
      <CropOverlay
        width={page.canvasWidth}
        height={page.canvasHeight}
        bounds={{ x: temple.x, y: temple.y, width: temple.width, height: temple.height }}
        crop={{ x: temple.x + 40, y: temple.y + 26, width: 180, height: 140 }}
      />
    )
  } else if (mode === 'lasso') {
    pageOverlay = <LassoOverlay width={page.canvasWidth} height={page.canvasHeight} points={LASSO} closed />
  } else if (mode === 'polygon') {
    pageOverlay = <PolygonOverlay width={page.canvasWidth} height={page.canvasHeight} points={POLY} cursor={[118, 150]} hoverStart />
  } else if (mode === 'selection-actions') {
    pageOverlay = <PolygonOverlay width={page.canvasWidth} height={page.canvasHeight} points={POLY} closed />
  } else if (mode === 'drawing') {
    pageOverlay = (
      <svg width={page.canvasWidth} height={page.canvasHeight} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <path d="M300 660 C 325 610, 355 610, 365 645 S 405 685, 425 640 S 465 600, 485 635" fill="none" stroke="var(--color-green)" strokeWidth={4} strokeLinecap="round" />
        <circle cx={505} cy={652} r={8} fill="none" stroke="var(--color-green)" strokeWidth={2} />
      </svg>
    )
  } else if (mode === 'uploading') {
    pageOverlay = (
      <div className={e.uploadPlaceholder} style={{ left: 340, top: 560, width: 190, height: 120 }}>
        <ImageUp size={28} aria-hidden />
        <ProgressBar size="sm" value={0.64} status="Uploading · 64%" />
      </div>
    )
  } else if (mode === 'empty') {
    pageOverlay = (
      <div className={e.emptyHint}>
        <p>Drag a sticker, tape or photo onto the page to begin.</p>
      </div>
    )
  }

  /* ----- floating UI over the canvas ----- */
  let overlay: ReactNode = null
  if (mode === 'image') {
    overlay = (
      <div className={e.overlayTop}>
        <ImageToolbar
          tool={imageTool}
          onTool={(t) => {
            setImageTool(t)
            if (t === 'crop' || t === 'lasso' || t === 'polygon') setMode(t)
          }}
          onFlipH={noop}
          onFlipV={noop}
          onUndo={noop}
          onRedo={noop}
        />
      </div>
    )
  } else if (mode === 'text') {
    overlay = (
      <div className={e.overlayTop}>
        <TextToolbar value={text} fonts={fonts} onChange={(p) => setText((t) => ({ ...t, ...p }))} onColorClick={noop} />
      </div>
    )
  } else if (mode === 'drawing') {
    overlay = (
      <>
        <div className={e.overlayTop}>
          <ModeBanner icon={PenLine}>Drawing · Esc to finish</ModeBanner>
        </div>
        <div className={e.overlayLeft}>
          <PenRail tool={penTool} onTool={setPenTool} />
        </div>
      </>
    )
  } else if (cropMode) {
    overlay = (
      <>
        <div className={e.overlayTop}>
          <ModeBanner icon={Crop}>Crop mode · editing the crop, not the photo</ModeBanner>
        </div>
        {mode === 'selection-actions' ? (
          <>
            <SelectionActionsMenu
              open={menuOpen}
              x={420}
              y={170}
              onClose={() => setMenuOpen(false)}
              onCropToSelection={() => setMode('nothing')}
              onIsolate={() => setIsolated(true)}
              onDeleteArea={noop}
              onInvert={noop}
            />
            {isolated && (
              <div className={e.overlayBottom}>
                <div className={e.toastSlot}>
                  <Toast kind="success" message="Isolated as a new element. The original photo is untouched." action={{ label: 'Save as sticker', onClick: () => setModal('save-sticker') }} onClose={() => setIsolated(false)} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={e.overlayBottom}>
            <CropBar
              tool={mode as 'crop' | 'lasso' | 'polygon'}
              onTool={(t) => setMode(t)}
              ratio={ratio}
              onRatio={setRatio}
              onApply={() => setMode(mode === 'crop' ? 'image' : 'selection-actions')}
              onCancel={() => setMode('image')}
              onClear={noop}
              onInvert={noop}
              onUndoPoint={noop}
            />
          </div>
        )}
      </>
    )
  } else if (spread) {
    overlay = (
      <div className={e.overlayBottom}>
        <FloatingToolbar label="Spread navigation">
          <FloatingButton icon={ChevronLeft} label="Previous spread" />
          <FloatingButton label="Pages 2–3" showLabel />
          <FloatingButton icon={ChevronRight} label="Next spread" />
          <FloatingDivider />
          <FloatingButton icon={BookOpen} label="Spread" showLabel active />
          <FloatingButton icon={File} label="Single" showLabel onClick={() => setMode('nothing')} />
        </FloatingToolbar>
      </div>
    )
  }

  return (
    <div className={e.editor}>
      <EditorToolbar
        notebookTitle={notebook.title}
        page={spread ? 2 : 3}
        pageCount={notebook.pageCount}
        pageLabel={spread ? 'Pages 2–3 of 24 · spread' : undefined}
        zoom={zoom}
        guides={guides}
        saveStatus={saveStatus}
        onBack={noop}
        onUndo={noop}
        onRedo={noop}
        onZoomIn={() => setZoom((z) => Math.min(2, z + 0.1))}
        onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.1))}
        onFit={() => setZoom(1)}
        onToggleGuides={() => setGuides((g) => !g)}
        onPrevPage={noop}
        onNextPage={noop}
        onRetrySave={noop}
        onShortcuts={() => setModal('shortcuts')}
        onExport={() => setModal('export')}
      />
      <div className={e.body}>
        <AssetSidebar active={tab} onChange={setTab}>
          {spread ? undefined : <SidebarContent tab={tab} paper={paper} onPaper={setPaper} />}
        </AssetSidebar>
        <CanvasArea overlay={overlay}>
          {spread ? (
            <SpreadView left={<SamplePageView page={PAGE_TWO} />} right={<SamplePageView page={page} />} />
          ) : (
            <div style={{ transform: zoom !== 1 ? `scale(${zoom})` : undefined }}>
              <SamplePageView page={page} selectedId={selectedId} onSelect={select}>
                {pageOverlay && <div className={e.pageOverlay}>{pageOverlay}</div>}
              </SamplePageView>
            </div>
          )}
        </CanvasArea>
        {!spread && (
          <EditorProperties
            key={`${panelKind}-${selectedId}`}
            kind={panelKind}
            page={page}
            element={selected}
            selectedId={selectedId}
            paper={paper}
            onPaper={setPaper}
            onSelect={select}
            onShowAllPapers={() => setTab('backgrounds')}
            onOpenLayers={() => setMode('layers')}
            onCrop={() => setMode('crop')}
            onCropTool={(t) => setMode(t)}
            onExitMode={() => setMode('image')}
          />
        )}
      </div>
      <SaveAsStickerModal open={modal === 'save-sticker'} onClose={() => setModal(null)} src={emptyArt} categories={stickerCategories} onSave={() => setModal(null)} />
      <ExportModal open={modal === 'export'} onClose={() => setModal(null)} onExport={() => setModal(null)} pageCount={notebook.pageCount} />
      <ShortcutsModal open={modal === 'shortcuts'} onClose={() => setModal(null)} />
      <RecoveryDialog open={modal === 'recovery'} notebookTitle={notebook.title} page={3} time="today at 14:32" changes={6} onRestore={() => setModal(null)} onDiscard={() => setModal(null)} />
    </div>
  )
}
