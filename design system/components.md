# Digital Junk Journal — Frontend Component Guide

How to build the UI components for the app. The rules come from `design system/claude.md` (tokens and visual rules). The screen list comes from `design system/screens.md`. You can see every component in use in `design system/junkie.pen`: the **Components** board holds the reusable pieces, and Areas 1–8 hold the 55 screens (numbers like **4.2** below point to those screens).

Implemented in React 19 + TypeScript with CSS Modules in `frontend/junk-journal/src/components/` (folder layout in `claude/technical-claude.md` §2). Import everything from `src/components/index.ts`; shared constants live in `src/components/constants.ts`, never in component files. All styling uses the CSS custom properties from section 6 of `claude.md`, defined in `src/index.css`. The journal editor's canvas is drawn with **React-Konva**; the DOM canvas components below (Page, PageElement, SelectionBox and the crop overlays) are visual stand-ins until the Konva versions exist.

---

## 0. Ground rules for every component

1. **Tokens only.** Never hard-code a colour, radius, spacing or shadow. Use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)` and `var(--shadow-*)`. Alpha versions go through `color-mix()`, for example `color-mix(in srgb, var(--color-green) 20%, transparent)`.
2. **Contrast.** Text under 16 px only sits on Light Yellow (`--color-cream`) or Green. Never put small text on Golden Yellow or Jasper. Green never touches Jasper.
3. **Jasper is for danger only.** Use it for borders, icons and large text, and always pair it with an icon or a label. Error messages themselves are Green text on cream.
4. **Focus.** Every interactive element shows `outline: 3px solid var(--focus-ring); outline-offset: 2px;` plus a 2 px Green inner edge. Use `:focus-visible`.
5. **Minimum size.** Interface text is at least 14 px. Hit targets are at least 32 × 32 px (40 px for icon buttons).
6. **Icons.** Lucide, outline, 2 px stroke, Green by default, Jasper only for destructive or warning states. Sizes are 16, 18, 20, 22, 24 or 28.
7. **Handwriting font** (`--font-accent`) is decoration only: greetings, notebook cover titles, empty-state titles. Never use it on labels, buttons or instructions.
8. **One primary button per view.**
9. **Motion.** 120–180 ms ease-out for hover and press. Pressed buttons move `translateY(1px)`. Respect `prefers-reduced-motion`.
10. **Set your own text colour on Green.** A component placed on a Green panel must set its own text colour instead of inheriting one (a cream label inside a cream card on a Green panel vanished this way).
11. **Selected rows on Green.** When a row turns Green because it's selected, any Green icon or thumbnail inside it needs a Golden Yellow or cream background, or it disappears.

### Derived and content tokens

These tokens are defined in `claude.md` §6 (added from the mockups). Use them instead of hard-coding the values:

| Token | Value | Used for |
|---|---|---|
| `--color-green-dark` | `#00652B` | Primary button hover |
| `--color-ink` | `#2E2A26` | Typed text and pen colour **on the page** (user content, not UI) |
| `--scrim` | `rgba(0, 61, 26, 0.55)` | Overlay behind modals and drawers |
| `--surface-tint` | `color-mix(in srgb, var(--color-yellow) 20%, transparent)` | Drop zones, tips, hover rows |
| `--canvas-surround` | `color-mix(in srgb, var(--color-green) 8%, var(--color-cream))` | Editor area around the page |
| `--paper-white` | `#FFFEF6` | Default page paper |
| `--font-mono-paper` | `"Courier Prime", monospace` | Typewriter text on pages |

Typeface stand-ins in the mockups: Fraunces (`--font-heading`), Nunito Sans (`--font-ui`) and Caveat (`--font-accent`). Swap them in the tokens once the real faces are chosen.

Paper colours (kraft `#C9A27A`, vintage `#F1E3B8`) and user photos are **content**, not UI, so they're exempt from the four-colour palette.

---

## 1. Primitives

### 1.1 Button
Three variants, all pill-shaped (`--radius-pill`), padding `10px 20px`, gap `--space-2`, Label type style (14/20 semibold), optional leading icon at 18 px.

| Variant | Default | Hover | Notes |
|---|---|---|---|
| `primary` | Green fill, cream label and icon | `--color-green-dark` fill | One per view |
| `secondary` | Cream fill, 2 px Green border, Green label | Border becomes 3 px (keep the size steady with `box-shadow: inset 0 0 0 1px`) | Default for toolbar actions |
| `destructive` | Cream fill, 2 px Jasper border, **Jasper icon, Green label** | Jasper border becomes 3 px | Always has a trash or warning icon |

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'destructive';
  icon?: IconName;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};
```
- **States:** default, hover, pressed (`translateY(1px)`), focus-visible, disabled (50% opacity, `cursor: not-allowed`), loading (a spinner replaces the icon, the label stays, `aria-busy`).
- `destructive` requires an icon; fall back to `trash-2`.
- Used everywhere, for example the 3.1 footer, the 3.5 dialog and the Account settings danger zone.

### 1.2 IconButton
40 × 40 circle, cream fill, 2 px Green border, 18 px icon. A required `aria-label` also serves as the tooltip text. Used for settings, the editor back arrow, rotate reset and the keyboard-shortcuts button (3.2, 4.1).

### 1.3 TextField
Label (14 semibold) above a field with a 2 px Green border, `--radius-input`, padding `10px 12px`, Body text, and an optional helper line below.
```ts
type TextFieldProps = {
  label: string; value: string; placeholder?: string;
  leadingIcon?: IconName;      // e.g. mail, lock, search
  trailing?: ReactNode;        // eye toggle, chevron, clear (x)
  helper?: string;
  error?: string;              // turns border Jasper + shows circle-alert
  hideLabel?: boolean;         // search fields; keep aria-label
};
```
- **Error state:** Jasper border, a `circle-alert` Jasper icon inside on the right, and the helper text replaced by the error message in **Green**. Link it with `aria-describedby` and set `aria-invalid`.
- **Focus:** the 3 px yellow ring around the whole field.
- Variants: `search` (leading `search` icon, label hidden, clear button), `password` (eye toggle), and `select` (trailing `chevron-down`, opens a listbox).
- Screens: 1.1–1.5, 3.1, 4.10, 7.5.

### 1.4 Checkbox
20 × 20 box, `border-radius: 6px`, 2 px Green border. When checked: Green fill with a 14 px cream check. The label sits to the right at 14 px. Used for "Keep me signed in", agreeing to the terms, and the collection picker in 7.5.

### 1.5 Toggle (switch)
44 × 24 track, 2 px Green border. **Off:** cream track with a Green knob on the left. **On:** Green track with a Golden Yellow knob on the right. The label sits on the left, the switch on the right, spread across the row. Use `role="switch"` with `aria-checked`. Used for Lock position, Shadow, Pressure, Paper texture and Lock aspect ratio.

### 1.6 Slider
Header row with the label (14 bold) on the left and the value (14) on the right. Below it, a 4 px track at 20% Green, a Green fill up to the value, and an 18 px Golden Yellow knob with a 2 px Green border. Use a native `input[type=range]` styled to match, and support arrow keys (Shift for steps of 10).
```ts
type SliderProps = { label: string; min: number; max: number; step?: number; value: number; format?: (v:number)=>string };
```
Used for opacity, size, blur, line and letter spacing, refine edges and pattern scale.

### 1.7 NumberField (compact)
A small inline field in the properties panel: a short faded label (`X`, `Y`, `W`, `H`, `L`, `↻`), a right-aligned value and an optional unit. 2 px Green border, radius 10, padding `6px 10px`. Supports dragging the label horizontally to scrub the value, and arrow keys. Can be placed in pairs (`X | Y`, `W 🔗 H` with an aspect-lock toggle between them).

### 1.8 SegmentedControl
A pill container with a 2 px Green border and 3 px padding. The selected segment has a Green fill and cream label; the others are transparent with Green labels. Use `role="radiogroup"`. Used for "Over decorations / Under", "Repeat / Scale", "This page / Whole notebook" and the Spread / Single toggle.

### 1.9 Tag / Chip
Pill shape, padding `6px 14px`, **1 px** Green border, cream fill, an 8 px Golden Yellow dot (1 px Green outline), and a 14 semibold label.
- **Selected:** Green fill, cream label, the dot is replaced by a check or hidden.
- Used as a filter (multi-select), a single choice (like a radio), or a static label. Optional count in the label: `Travel · 14`.
- Used in sort chips, category filters, aspect ratios, paper sizes, edge styles and brush types.

### 1.10 ColourSwatch / SwatchGroup
24–30 px circles. The selected swatch gets a 3 px Golden Yellow ring (on Green) or a 3 px Green ring (on light colours); others get a 1 px Green border. Use a radiogroup. Used for text colour, pen colour and die-cut border colour.

### 1.11 KeyCap
Inline key label for shortcuts: padding `2px 8px`, radius 6, a 1 px Green border with a 3 px bottom edge, 14 bold text. Used in 4.17.

### 1.12 Link
14–16 px, bold, underlined, Green. Use it for in-flow actions like "Forgot password?", "See all notebooks" or "Clear filters". Never use Jasper for links. For navigation, render a real `<a href>` and pass the `useLinkProps()` handler so it navigates inside the app while Ctrl/⌘-click still opens a new tab.

---

## 2. Feedback

### 2.1 Toast
Appears bottom-centre, stacks upward, max width 520 px, `--radius-card`, padding `14px 16px`, `--shadow-lg`. Contains an icon, the message, an optional action and a close button.

| Kind | Fill | Border | Icon | Auto-dismiss |
|---|---|---|---|---|
| `success` | Green | — | Golden Yellow `circle-check`, cream text, yellow action pill | 5 s |
| `info` | Cream | 2 px Green | Green `info` | 5 s |
| `offline` | Cream | 2 px Green | Green `wifi-off` | Stays while offline |
| `error` | Cream | 2 px Jasper | Jasper `circle-alert`, **Green text** | Never; needs an action |

Use `role="status"` (or `role="alert"` for errors). Every error toast offers a next step (Retry or Choose another). Shown in 4.9 and 8.4.

### 2.2 Banner (inline alert)
Full-width inside its container, `--radius-card`, 2 px border in the toast kind's colour, padding 16. Contains an icon, a title (16 bold), a body (14) and an optional secondary button. Used for "We couldn't save your last change" and wrong-credentials errors.

### 2.3 Tip / Note
`--surface-tint` fill, radius 12, padding 12, an 18 px Green icon (`info`, `sparkles` or `shield-check`) and 14 px text. Used for reassurance copy like "The original photo is never changed."

### 2.4 SaveStatusPill (editor toolbar)
A pill with a 1 px Green border, a 16 px icon and a 14 semibold label. States (4.14):

| State | Icon | Label | Extra |
|---|---|---|---|
| saving | `loader` (spinning) | Saving… | — |
| saved | `cloud-check` | Saved | Resting state |
| offline | `wifi-off` | Offline · kept on this device | `--surface-tint` fill |
| failed | Jasper `circle-alert` | Couldn't save | 2 px Jasper border plus an inline **Retry** link |

Wrap it in `aria-live="polite"`.

### 2.5 Skeleton
Blocks at 12% Green on cream, with the same radius as the real component, and a gentle pulse (paused under `prefers-reduced-motion`). Each skeleton should mirror its real layout: the card skeleton is the cover area plus two lines. Shown in 8.3.

### 2.6 ProgressBar
6–8 px tall, 20% Green track, Green fill, rounded. Always paired with a text status like "Uploading · 64%" or "Preparing page 9 of 24". Used in uploads, export and processing.

### 2.7 EmptyState
Centred column: the shared illustration (300 × 220, the `Empty Illustration` component in the .pen file), an accent title (handwriting, Green or Jasper, at least 24 px), one plain sentence (14–16, max width about 460 px), **one** primary button, and optional secondary buttons.
```ts
type EmptyStateProps = { accent: string; title?: string; body: string; action: ButtonProps & {label:string}; secondary?: (ButtonProps & {label:string})[] };
```
Used in 2.2, 7.2 (no results), the libraries and the empty editor page (8.2).

---

## 3. Overlays

### 3.1 Scrim
Fixed and full-screen, filled with `--scrim`. Clicking it closes non-destructive overlays only.

### 3.2 Modal
Centred, `--color-cream`, 2 px Green border, radius 24, `--shadow-lg`, padding 32, gap 20. The header has an H2 title (serif) and a 36 px circular close button. The footer is right-aligned: Cancel (secondary), then the primary or destructive button.
- Trap focus, close on Esc, return focus to the element that opened it, and use `aria-modal` with `aria-labelledby`.
- **Split variant:** form on the left, preview panel on the right. Create notebook (3.1) uses a Green preview panel with a live cover; Save as sticker (4.10) uses a checkerboard preview.

### 3.3 Drawer
Slides in from the right, 480 px wide, full height, 2 px Green left border, `--shadow-lg`, padding 28–32. The footer sticks to the bottom. Used for notebook settings (3.4) and asset detail (7.4).

### 3.4 ConfirmDialog
A Modal at 520 px wide. Header: a 44 px circle with a 2 px Jasper border and a Jasper `triangle-alert` icon, then the title ("Delete 'Travel Journal'?"). Body: what will be lost. A **Reassure** tip (yellow tint, `info` icon) says what is kept, for example "Your stickers stay in the Asset Library." Footer: Cancel, then a Destructive button. Default focus goes to **Cancel**. Used in 3.5, 3.6, 7.6 and the delete-account flow.

### 3.5 Popover / Menu
Cream fill, 2 px Green border, radius 16, `--shadow-md`, padding 6. Items are 14 semibold with an 18 px icon and padding `8px 10–12px`. Hover or active rows get a `--surface-tint` fill. Destructive items get a Jasper icon only. Use `role="menu"` with arrow-key navigation. Used for the account menu (8.1) and the selection-actions menu (4.9).

---

## 4. App shell and navigation

### 4.1 AppShell
Horizontal layout: `NavRail` (248 px) plus `Main` (fills the rest, padding `40px 56px`, vertical gap 28–32, scrolls). Background is `--bg-page`. Every non-editor page uses it.

### 4.2 NavRail
248 px wide, cream, 2 px Green right border, padding `28px 16px`.
- **Brand:** a 40 px Golden Yellow circle logo with a `book-heart` icon, "Junk Journal" (serif, 20 bold) and a handwritten "studio" in Jasper.
- **Items, always in this order:** Dashboard (`layout-grid`), Notebooks (`book-open`), Sticker Studio (`sticker`), Washi Tape Studio (`ribbon`), Asset Library (`library`). Each is a pill with a 20 px icon and a 16 semibold label.
  - **Active:** Green fill, cream icon and label, `aria-current="page"`.
  - **Hover:** `--surface-tint` fill.
- **Account chip,** pinned to the bottom: a 2 px Green border, radius 16, a 36 px Green avatar with cream initials, name and "Settings", and a chevron. It opens the account menu: Account settings, Shortcuts, Help, Sign out.
- Hidden in the editor (shown in 8.1).

### 4.3 PageHeader
A row with space between. Left: an accent line (handwriting, Jasper, 24–28), then the H1 or Display title (serif, Green). Right: actions (a search field about 280 px wide plus the single primary button). Optional breadcrumb above: a `arrow-left` icon, a parent link and the current page in plain text.

### 4.4 Stepper (studios)
A pill-shaped container (2 px Green border, padding `10px 16px`). Each step has a 28 px dot and a 14 px label, with a 2 px connector line between steps that fills the remaining width.

| Step state | Dot | Label | Connector after it |
|---|---|---|---|
| done | Green fill, cream check | Full opacity | Green |
| current | Golden Yellow fill, step number | Bold | 25% Green |
| upcoming | Cream fill, number | 60% opacity | 25% Green |

Use `<ol>` with `aria-current="step"`. Steps can be clicked if they're done. Sticker Studio has 5 steps; Washi Studio has 4.

### 4.5 StudioShell
`AppShell` plus `PageHeader` (accent, studio title, a "Library" secondary button), then the `Stepper`, then a body row:
- **Preview:** fills the space, radius 16, 2 px Green border, clips its content.
- **StepPanel:** 340 px, radius 16, 2 px Green border, padding 20, vertical gap 18.

The panel ends with a footer: Back (secondary) and Continue (primary), side by side and equal width.

---

## 5. Content cards and tiles

### 5.1 NotebookCard
240 px by default (or fills a grid cell), radius 16, 2 px Green border, `--shadow-sm`, clips its content.
- **Cover:** 168 px tall, with a 2 px Green bottom border. The cover colour is Golden Yellow, Green, cream, or a user image. It has a washi-tape strip and a handwritten cover accent.
- **Body:** padding 16, the title (Heading 2) and metadata ("24 pages · edited today", Small).
- **Hover:** `--shadow-md`, plus a ⋯ menu: Open, Rename, Change cover, Duplicate, Delete.
- **Dragging:** `--shadow-lg`, a slight tilt, and a drop indicator shown in the grid.
- Don't fill a cover with Jasper; it would break the 5% rule. Use cream with a Jasper accent instead.
- Used in 2.1 and 3.5.

### 5.2 PageThumbnail
A paper-ratio rectangle (110 × 150 in the strip, about 150 × 210 in the overview), square corners, 2 px Green border, `--shadow-sm`. The page number sits below.
- **Selected:** 4 px Golden Yellow border.
- **Hover:** `--shadow-md`, plus a floating pill of quick actions: duplicate, change background, delete (Jasper icon).
- **Dragging:** tilted −4°, `--shadow-lg`, and a 6 px Golden Yellow drop-indicator bar between thumbnails.
- **"Add page" tile:** tinted, with a `plus` icon.
- Used in 3.2 and 3.3.

### 5.3 AssetCard (library)
Fills a grid cell, padding 10, radius 16, 2 px Green border. Contains a preview (120 px tall, radius 10), a **TypeBadge** in its top-left corner and the asset name (14 bold).
- **Preview by type:**
  - Photo: the image, cover-fitted.
  - Sticker: a die-cut sticker on a tinted background.
  - Washi: a short tape strip.
  - Paper: the paper swatch.
- **Selected:** 3–4 px Golden Yellow or Green border and `--shadow-md`.
- Click opens AssetDetail (7.4).
- **TypeBadge:** a Green pill with cream 14 bold text: Photo, Sticker, Washi, Paper, Background, Upload, Extracted.

### 5.4 StickerTile (sticker library, 5.6)
Like AssetCard, but the preview is 150 px tall and shows the sticker with a white die-cut border (`DieCutSticker`) at a slight random tilt. On hover, quick actions appear: rename, add to collection, edit in studio, delete.

### 5.5 TapeCard (tape library, 6.6)
A horizontal card: a tape strip (220 px, clipped), then the name and metadata ("Torn edge · 40 px"). On hover, quick actions appear: rename, edit, delete.

### 5.6 CollectionList
A vertical list, 200 px wide. Each row is a pill with the name and count; the active row has a Green fill and cream text. A "+ New collection" link comes last. Used in 5.6 and 7.1–7.3.

### 5.7 CollectionHeader
A Green banner, radius 16, with the description and metadata in cream on the left. On the right: an "Add assets" yellow pill, plus rename and delete icon buttons with cream outlines. Used in 7.3.

### 5.8 FilterBar
A row of Tags. The active filters are selected (Green). A result count and a "Clear filters" link appear while filters are active (7.2).

---

## 6. Journal editor components

Layout (4.1): `EditorToolbar` (64 px tall) above a body row made of `AssetSidebar` (336 px), `CanvasArea` (fills the rest) and `PropertiesPanel` (300 px). The NavRail is hidden.

### 6.1 EditorToolbar
Cream, with a 2 px Green bottom border. Three groups:
- **Left:** a back IconButton, then the notebook title (16 bold) and "Page 3 of 24" (14).
- **Centre:** Undo and Redo, a divider, zoom out / zoom % / zoom in, Fit, a divider, the Guides toggle, a divider, previous page / "3 / 24" / next page.
- **Right:** `SaveStatusPill`, the keyboard IconButton, and an Export secondary button.

**ToolbarButton:** a pill with padding `8px 10px`, a 20 px icon and an optional label. Toggles that are on (like Guides) get a 35% Golden Yellow fill. Dividers are 2 × 28 px at 20% Green.

### 6.2 AssetSidebar
Two columns:
- **TabRail** (100 px): vertical tabs, each a 22 px icon over a 14 semibold label. The active tab has a Green fill and cream text. Tabs: Stickers, Washi, Backgrounds, Paper, Text, Uploads, Recent. Use `role="tablist"` with a vertical orientation.
- **TabPanel:** padding 16. Contains the panel title (Heading 2), a search field, filter chips, and a two-column grid of draggable `AssetTile`s (preview 92 px).
  - **Uploads tab:** a DropZone plus `UploadItem` rows (4.13).
  - **Backgrounds tab:** a `PaperSwatch` grid (4.11).
- Dragging a tile shows a ghost with `--shadow-lg`. Dropping it creates a new, independent element on the page.

### 6.3 CanvasArea and Page
- **CanvasArea:** `--canvas-surround` fill, clips its content, centres the page, and handles zoom and pan.
- **Page:** fixed paper size with a true A5 ratio (1 : √2; logical units such as 1200 × 1697, scaled to fit the canvas area), square corners, paper fill plus a pattern layer (lined, grid, dotted and so on), a 1 px 25% Green edge and `--shadow-md`.
- **React-Konva:** the editor draws the page as a Konva `Stage` with separate `Layer`s for the background, elements, freehand strokes and the selection Transformer. Positions are stored in logical page units, never screen pixels. Sidebar drops convert the pointer with `stage.setPointersPositions(e)` and `getRelativePointerPosition()`. The DOM `Page` / `PageElement` stay for thumbnails and the dev gallery.
- Page elements are positioned absolutely and can be rotated. Each element is its own **instance** with its own transform, opacity, crop and z-index. Editing one never changes the library asset or other instances.
- **TwoPageSpread** (4.16): the side panels collapse to the TabRail, two pages sit side by side with a spine shadow between them, a page-curl corner turns the page, and a floating spread nav sits at the bottom.

### 6.4 SelectionBox and handles
In the Konva editor this is a styled `Transformer`: `borderStroke` Green, `anchorFill` Golden Yellow, `anchorStroke` Green, round anchors, `keepRatio` on by default, and only the two end anchors for washi tape. The DOM `SelectionBox` is the visual reference.
- **Box:** a 2 px Green outline around the element's bounds.
- **Resize handles:** 14 px circles at the four corners, Golden Yellow fill with a 2 px Green outline. The handle being dragged turns **Green**.
- **Rotate handle:** a 16 px circle above the top-centre on a 28 px stem. Show the angle in a small tooltip while rotating.
- **Washi tape:** handles sit at the two ends only (they change length), plus the rotate handle.
- **Locked element:** no handles, a small lock badge, and a read-only properties panel.
- Shift keeps the aspect ratio when the lock is off. The aspect ratio is locked by default.

### 6.5 FloatingToolbar
A floating pill: cream, 2 px Green border, `--shadow-md`, padding 6. Contains icon buttons (34 px, the active one Green with a cream icon) and 1 px dividers. It sits above the selection, or at the top of the canvas if there isn't room. Variants:
- **ImageToolbar** (4.2): select, crop, lasso, polygon lasso, divider, resize, rotate, flip horizontal, flip vertical, divider, undo, redo.
- **TextToolbar** (4.4): font select (shows the family name in its own font plus its category), size select, colour swatch, divider, bold, italic, divider, align start / centre / end.
- **CropBar** (4.6–4.8): tool segments (Crop, Lasso, Polygon, with labels), divider, ratio chips (Free, 1:1, 4:5, 3:4, 16:9, Original; the active one Golden Yellow), or for lasso: Clear, Invert, Cancel and an **Apply** Green pill. Polygon adds "Undo point".
- **PenRail** (4.5): a vertical pill on the left of the canvas with pen, pencil, marker (`brush`), highlighter and eraser. The active tool is Green.

### 6.6 ModeBanner
A Green pill at the top-centre of the canvas, with a Golden Yellow icon and cream 14 semibold text, for example "Crop mode · editing the crop, not the photo" or "Drawing · Esc to finish". It shows whenever the editor is in a mode other than Select. Esc leaves the mode.

### 6.7 CropOverlay
In the Konva editor, crops and lasso/polygon selections are applied with `clipFunc` on the element's `Group`; the overlays below define how they look while editing.
- **Normal crop:** dim everything outside the crop to 50% dark green, show rule-of-thirds lines at 60% cream, a 3 px **dashed** Green boundary (`stroke-dasharray: 9 6`), and **square** 14 px Golden Yellow handles at the corners and edge midpoints. The square handles keep it visibly different from the round selection handles.
- **Lasso selection:** the live path while drawing. Once closed: 25% yellow fill, a Green dashed outline (animate the dash offset for marching ants), and a cream halo for contrast.
- **Polygon selection:** straight Green segments, 12 px cream square anchors, and a dashed rubber-band line to the cursor. The **start anchor** is an 18 px Golden Yellow circle; on hover it shows a "Click to close" pill.
- Implement on a `<canvas>` or SVG overlay layered above the page, not as DOM children of the element.

### 6.8 SelectionActionsMenu
A Popover next to a closed selection with four items: Crop to selection (`crop`), Isolate as new element (`copy-plus`), Delete selected area (`eraser`, Jasper icon), Invert selection (`flip-horizontal`). After Isolate, show a success toast with a "Save as sticker" action that opens the Save-as-sticker modal (4.9, 4.10).

### 6.9 PropertiesPanel
300 px, cream, 2 px Green left border, padding 20, vertical gap 18. Content switches with the selection.

**PropHead:** a 36 px Golden Yellow badge with a type icon, the title (Heading 2) and a subtitle (14), then a 1 px divider.

**PropGroup:** a 14 bold label, then its controls.

| Selection | Groups |
|---|---|
| Nothing (page) | Background swatches + "More papers & upload" link · Layers on this page (mini list) · Page actions: Duplicate, Delete |
| Image or sticker | Position & size (X/Y, W 🔗 H, "Restore original size") · Rotation (+ reset) · Opacity · Crop ("Crop image") · Layer (front / forward / backward / back) · Lock toggle · Duplicate / Delete |
| Washi tape | Position · Size (W, L) · Rotation · Opacity · Edge style chips · Layer · Duplicate / Delete |
| Text | Font list (grouped: Handwriting, Typewriter, Serif, Sans-serif, Decorative; each shown in its own face) · Size & colour · Line spacing · Letter spacing · Rotation · Duplicate / Delete |
| Drawing | Brush chips · Size · Colour swatches · Opacity · Draw over / under (segmented) · Pressure toggle · tip |
| Crop mode | Tool (crop / lasso / polygon) · Aspect ratio + lock · Reset crop · Apply / Cancel · "original never changed" note |
| Layers | `LayerList` + Arrange buttons |

Element actions are pinned to the bottom: Duplicate (secondary) and Delete (destructive), side by side.

### 6.10 LayerList
Rows from the top layer down. Each row: a grip, a 28 px thumbnail with a type icon, the name, a lock toggle and a visibility toggle.
- **Selected row:** Green fill, cream text; the type thumbnail switches to a Golden Yellow background so its Green icon stays visible.
- **Dragged row:** cream with a 2 px Green border, `--shadow-lg` and a slight tilt.
- **Drop line:** a 4 px Golden Yellow bar.
- Clicking a row selects that element on the canvas, and the reverse. The background row is always last and locked.
- Use `role="listbox"`, with keyboard reordering via Alt+↑/↓.

### 6.11 PaperSwatch
96 px tall, square corners, showing the paper fill and pattern (lined, grid, dots, florals). The selected swatch has a 3 px Green border and a Green check badge. The name sits below. The last item is "Upload your own" (secondary button).

### 6.12 UploadItem
A row with a border: an icon, the file name and a status.
- **Uploading:** a ProgressBar and "Uploading · 64%".
- **Processing:** "Optimising preview…".
- **Error:** 2 px Jasper border, a Jasper `circle-alert`, a Green message, and a "Choose another" link.

Show a placeholder on the canvas with a progress bar while an image uploads. Editing stays available.

### 6.13 ShortcutsModal
A Modal about 960 px wide with four columns (Edit, Tools, View, Layers). Each row has the action on the left and KeyCaps on the right. It opens from the toolbar or the `?` key (4.17).

### 6.14 ExportModal
SegmentedControl for This page / Whole notebook, then Format chips (PNG is disabled for a whole notebook), Pages chips, Quality chips, a progress block (tinted, with a ProgressBar and "You can keep editing while this runs"), and the footer (4.15).

### 6.15 RecoveryDialog
A Modal at 540 px: a Golden Yellow `history` badge, the title "We kept your unsaved changes", a body, an info box ("Travel Journal · Page 3 / 14:32 · 6 changes"), and buttons for Discard changes (destructive) and Restore changes (primary). Shown in 8.6.

---

## 7. Studio components

### 7.1 DropZone
A dashed or 3 px Green bordered box, radius 16–24, `--surface-tint` fill, centred content: an 88 px yellow circle with `image-up`, the title "Drop a photo here", "or", a "Browse files" primary button and the accepted formats in Small text.
- **Drag-over:** a stronger yellow fill and a 3 px border.
- **Error:** a Jasper border with a Green message.
- Accept `image/png, image/jpeg, image/webp` and validate on the client too. A smaller version is used in the Uploads tab (4.13) and in 6.3.

### 7.2 Checkerboard
The transparency background: 24 px squares, alternating cream and 6% Green. Use a CSS `conic-gradient` background, not individual elements.

### 7.3 BeforeAfter
A split preview with a 4 px Green divider and a 48 px Golden Yellow drag knob (`chevrons-left-right`). "Before" and "After" Green pill labels sit in the top corners. The "after" side **must have its own opaque background** (cream plus the checkerboard), or the original shows through transparent pixels. Use `role="slider"` for the knob. Shown in 5.2.

### 7.4 DieCutSticker
Renders a transparent cut-out with a die-cut border that follows the subject's silhouette. In the app, build the border from the alpha channel: dilate it (canvas or WebGL), or use SVG `feMorphology dilate` on the alpha, filled with the border colour. Then draw the cut-out on top and add a soft drop shadow (`filter: drop-shadow()`, which does follow alpha).
- Props: `src`, `borderWidth`, `borderColor`, `borderOpacity`, `shadow {blur, opacity, distance, angle}`, `rotation`.
- *The Pencil mockups show the border as a white rounded backing, because the design tool can't dilate alpha. Build the silhouette version described here.*
- The studios use the SVG version (`DieCutSticker`). On the Konva canvas, generate the bordered sticker once on an offscreen canvas (dilate the alpha, fill with the border colour, draw the cut-out on top) and place the result as a Konva `Image` with a Konva shadow.
- Used in 5.4, 5.5, 5.6 and the editor stickers.

### 7.5 WashiTape
Renders a tape at any length: a base colour, then a **repeating** pattern tile (CSS `background-repeat: repeat-x` or an SVG `<pattern>`, never stretched), then an optional paper-grain texture, then the edge mask.
- Edge styles are an SVG mask on both ends: `straight`, `torn` (zigzag), `uneven` (irregular) and `scalloped`.
- Default opacity is about 0.9, so content underneath shows through like real tape.
- On the Konva canvas, draw one pattern tile to a small canvas and use it as `fillPatternImage` with `fillPatternRepeat: 'repeat-x'` on a `Rect`, clipped to the edge shape; Konva can't render the SVG `WashiTape` directly.
- Props: `pattern` (solid, dots, stripes, gingham, grid, check, florals, hand-drawn, vintage, or a user image), `baseColor`, `patternColor`, `scale`, `width`, `length`, `edge`, `opacity`, `rotation`, `texture`, and `imageMode: 'repeat' | 'scale'`.
- Used in 6.x, 4.3, the library tiles and the dashboard.

### 7.6 PatternPicker
A three-column grid of small tape swatches with labels. The selected one has a 3 px Green border. Shown in 6.2.

### 7.7 MethodCard
A large selectable card (about 300 × 400) with illustration art, a 44 px yellow icon badge, a title and a description. The selected card has a 4 px border and `--shadow-md`. Use radio semantics. Shown in 6.1.

### 7.8 DirectionDial
A 44 px circle with a needle that you drag to set the shadow direction. It sits next to the Distance NumberField. Arrow keys rotate it in 15° steps. Shown in 5.4.

---

## 8. Account and auth components

- **AuthLayout:** a two-column split. The 640 px form panel (padding `48px 96px`, brand at the top, form in the middle, footer note at the bottom) sits beside a decorative **Collage** panel (Green background with paper sheets, a polaroid, washi tapes, a heart sticker and a handwritten line). The collage is `aria-hidden` and decorative only. Shown in 1.1–1.4.
- **PasswordStrength:** four bars (6 px, the filled ones Green, the rest 18% Green) and a label like "Strong password". Shown in 1.4.
- **DangerZone:** a card with a 2 px Jasper border, a warning icon, the title, an explanation and a Destructive button. Shown in 1.5.

---

## 9. Accessibility checklist

- All colour pairings follow the contrast table in `claude.md` §2. Run automated checks in CI.
- Keyboard: every toolbar, panel and canvas action can be reached with the keyboard. Arrow keys nudge the selected element 1 px (Shift for 10 px). Esc exits modes and closes overlays.
- Canvas elements are exposed as a list to assistive tech (mirroring `LayerList`), with name, type and position.
- Live regions for save status, upload progress and toasts.
- Respect `prefers-reduced-motion` for page turns, skeleton pulses and marching ants.
- Decorative images and collages get `alt=""` and `aria-hidden`. User photos get their asset names as alt text.

---

## 10. Suggested build order

Follow the roadmap phases in `screens.md` §9:
1. **Tokens and primitives:** Button, IconButton, TextField, Checkbox, Toggle, Tag, Slider, NumberField, SegmentedControl, Link.
2. **Shell:** AppShell, NavRail, PageHeader, Modal, Drawer, ConfirmDialog, Toast, Banner, Skeleton, EmptyState.
3. **Phase 1 content:** NotebookCard, PageThumbnail, AuthLayout.
4. **Editor (Phases 2–3):** EditorToolbar, SaveStatusPill, AssetSidebar, CanvasArea / Page, SelectionBox, FloatingToolbar, PropertiesPanel, LayerList, PaperSwatch, ModeBanner, CropOverlay, SelectionActionsMenu, UploadItem.
5. **Studios (Phases 4–5):** StudioShell, Stepper, DropZone, Checkerboard, BeforeAfter, DieCutSticker, WashiTape, PatternPicker, MethodCard, DirectionDial, AssetCard, StickerTile, TapeCard, CollectionList.
6. **Later phases:** PenRail and drawing (6), ExportModal, TwoPageSpread and ShortcutsModal polish (7).
