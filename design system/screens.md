# Digital Junk Journal — Screen Inventory

All screens, modals and key states the product needs, built from `claude/product-claude.md` (requirements) and `design system/claude.md` (visual rules). Each screen lists its purpose, what it shows, the states to design, and the roadmap phase it belongs to.

**Conventions for every screen**
- Desktop-first. Design at 1440 × 900, and check at 1280 × 800.
- Light Yellow page background, Green text and structure, Golden Yellow for anything to notice, Jasper only for destructive or warning states (under ~5% of the screen).
- One primary (green) button per view. Toolbar actions use secondary buttons.
- Every interactive element has the 3 px Golden Yellow focus ring.
- Handwriting font only for decorative titles, never for labels or instructions.
- The product doc suggests a muted pastel palette (Warm Cream, Dusty Pink and so on). The design system replaces it with Green / Golden Yellow / Light Yellow / Jasper, so screens use the design system palette.

---

## 0. Screen map

| # | Area | Screen | Type | Phase |
|---|------|--------|------|-------|
| 1.1 | Account | Sign in | Page | 1 |
| 1.2 | Account | Create account | Page | 1 |
| 1.3 | Account | Forgot password | Page | 1 |
| 1.4 | Account | Reset password | Page | 1 |
| 1.5 | Account | Account settings | Page | 1 |
| 2.1 | Dashboard | Dashboard | Page | 1 |
| 2.2 | Dashboard | Dashboard, first-time (empty) | State | 1 |
| 3.1 | Notebooks | Create notebook | Modal (multi-step) | 1 |
| 3.2 | Notebooks | Notebook workspace | Page | 1 |
| 3.3 | Notebooks | Page overview (all thumbnails) | Page / view | 1 |
| 3.4 | Notebooks | Notebook settings | Modal / drawer | 1 |
| 3.5 | Notebooks | Delete notebook | Confirm dialog | 1 |
| 3.6 | Notebooks | Delete page | Confirm dialog | 1 |
| 4.1 | Editor | Journal editor, nothing selected | Page | 2 |
| 4.2 | Editor | Sticker / image selected | State | 2–3 |
| 4.3 | Editor | Washi tape selected | State | 5 |
| 4.4 | Editor | Text selected / editing | State | 2 |
| 4.5 | Editor | Drawing mode | Mode | 6 |
| 4.6 | Editor | Crop mode, normal crop | Mode | 3 |
| 4.7 | Editor | Crop mode, freeform lasso | Mode | 3 |
| 4.8 | Editor | Crop mode, polygon lasso | Mode | 3 |
| 4.9 | Editor | Selection actions (crop, isolate, delete area, invert) | Menu / state | 3 |
| 4.10 | Editor | Save as sticker | Modal | 4 |
| 4.11 | Editor | Background & paper picker | Sidebar tab / popover | 2 |
| 4.12 | Editor | Layers panel | Panel / popover | 2 |
| 4.13 | Editor | Image upload in progress | State | 3 |
| 4.14 | Editor | Save status: saving / saved / offline / failed | State | 2+ |
| 4.15 | Editor | Export page / notebook | Modal | 7 |
| 4.16 | Editor | Two-page spread view | View | 7 |
| 4.17 | Editor | Keyboard shortcuts | Modal | 2 |
| 5.1 | Sticker Studio | Upload | Step | 4 |
| 5.2 | Sticker Studio | Background removal | Step | 4 |
| 5.3 | Sticker Studio | Crop & select | Step | 4 |
| 5.4 | Sticker Studio | Die-cut border & shadow | Step | 4 |
| 5.5 | Sticker Studio | Preview & save | Step | 4 |
| 5.6 | Sticker Studio | Sticker library | Page | 4 |
| 6.1 | Washi Studio | Choose method | Step | 5 |
| 6.2 | Washi Studio | Pattern creator | Step | 5 |
| 6.3 | Washi Studio | Upload pattern | Step | 5 |
| 6.4 | Washi Studio | Customise & preview | Step | 5 |
| 6.5 | Washi Studio | Save tape | Step / modal | 5 |
| 6.6 | Washi Studio | Tape library | Page | 5 |
| 7.1 | Asset Library | All assets | Page | 4 |
| 7.2 | Asset Library | Filtered / search results | State | 4 |
| 7.3 | Asset Library | Collection view | Page | 4 |
| 7.4 | Asset Library | Asset detail | Drawer | 4 |
| 7.5 | Asset Library | Rename / move to collection | Modal | 4 |
| 7.6 | Asset Library | Delete asset | Confirm dialog | 4 |
| 8.1 | System | Global navigation | Shell | 1 |
| 8.2 | System | Empty states | Pattern | 1+ |
| 8.3 | System | Loading & skeletons | Pattern | 1+ |
| 8.4 | System | Toasts & inline errors | Pattern | 1+ |
| 8.5 | System | Not found / no access | Page | 1 |
| 8.6 | System | Unsaved-changes recovery | Dialog | 2+ |

---

## 1. Account

### 1.1 Sign in
- **Purpose:** return users get into their notebooks.
- **Shows:** app name with a handwritten accent line, email and password inputs, "Sign in" primary button, links to Create account and Forgot password. A decorative scrapbook collage (taped photo, sticker) on one side, kept away from the form.
- **States:** default, field error (Jasper border + icon + green message), wrong credentials (inline banner with warning icon), loading (button spinner, inputs disabled).

### 1.2 Create account
- **Shows:** name, email, password (with requirements hint in Small text), "Create account" primary button, link back to Sign in.
- **States:** default, validation errors per field, email already used, loading, success → goes to the first-time Dashboard (2.2).

### 1.3 Forgot password / 1.4 Reset password
- **1.3:** email input, "Send reset link" button, then a confirmation state ("Check your inbox").
- **1.4:** new password + confirm, "Save password" button, then a success state with a link to Sign in. An expired or invalid link gets its own error state.

### 1.5 Account settings
- **Shows:** profile (name, email), change password, sign out, delete account (destructive button with trash icon, opens a confirm dialog).
- **States:** saved toast, field errors.

---

## 2. Dashboard

### 2.1 Dashboard
- **Purpose:** home base. Shows what the user was working on and gets them back into it.
- **Shows:**
  - Welcome message (Display serif, with a handwritten accent such as "welcome back").
  - **Recently opened** notebooks: a row of notebook cards (cover, title, page count, last edited).
  - **All notebooks**: a grid of notebook cards with sort (recent, name, created) and drag-to-reorder.
  - "Create notebook" primary button.
  - **Recently created** stickers and washi tapes: two small rows of asset cards with "Open Sticker Studio" / "Open Washi Studio" secondary buttons.
- **Card actions (hover menu):** open, rename, change cover, duplicate, delete.
- **States:** default, hover on card (`--shadow-md`), reordering (card lifted with `--shadow-lg`), loading skeletons.

### 2.2 Dashboard, first-time (empty)
- Friendly empty state: illustration, handwritten heading, one-line explanation, "Create your first notebook" primary button. Secondary links to make a sticker or a washi tape.

---

## 3. Notebook management

### 3.1 Create notebook (modal, multi-step or single long form)
- **Fields:** title (required), optional description, cover (pick a preset or upload), colour/theme, paper size, default page background (white, cream, grid, lined, dotted, vintage, kraft, floral), creation date (prefilled with today).
- **Shows:** a live cover preview beside the form.
- **States:** default, title missing error, cover upload in progress, creating (button loading). On success, opens the Notebook workspace (3.2).

### 3.2 Notebook workspace
- **Purpose:** one notebook at a glance before editing.
- **Shows:** cover (large, like a closed journal), title and description, notebook metadata (pages, created, edited), a strip of page thumbnails, "Add page" secondary button, "Open editor" primary button, settings icon button.
- **Page thumbnail actions:** open, duplicate, delete, drag to reorder, change background.
- **States:** default, single blank page (new notebook), reordering pages, hover on thumbnail.

### 3.3 Page overview
- All pages of a notebook in a thumbnail grid (larger than in 3.2), with page numbers. Same actions as the strip. Clicking a thumbnail opens that page in the editor.
- **States:** default, many pages (scroll), reorder drag, selected page.

### 3.4 Notebook settings
- Rename, edit description, change cover, change theme, change paper size, change default background, duplicate notebook, delete notebook (destructive).

### 3.5 Delete notebook / 3.6 Delete page
- Confirm dialogs with a warning icon and the item name. "Delete" is a destructive button, "Cancel" is secondary. Copy explains that library assets are not deleted.

---

## 4. Journal editor

The central screen. One shared layout with four areas:
- **Top toolbar:** undo, redo, save status (auto-save), zoom out / zoom level / zoom in, fit page, toggle alignment guides, export page, export notebook, previous / next page, page number, back to notebook.
- **Left sidebar:** search plus tabs for Stickers, Washi Tapes, Backgrounds, Paper, Text, Uploaded Images, Recent Assets. Each tab is a grid of draggable assets, with an upload button in Uploads.
- **Main canvas:** the fixed-size page, square-cornered like real paper, centred on a slightly darker surround. Freeform placement.
- **Right properties panel:** changes with the selection (see 4.1–4.5).
- **Contextual image toolbar:** a floating bar shown only when an image or sticker is selected.

### 4.1 Nothing selected
- Properties panel shows **page** properties: background, paper type, page size (read-only), plus page actions (duplicate, delete).
- **States:** empty page (a hint in the centre: "Drag a sticker, tape or photo onto the page"), page with content, dragging an asset from the sidebar (drop target highlighted, ghost with `--shadow-lg`), alignment guides on.

### 4.2 Sticker / image selected
- **Canvas:** bounding box, Golden Yellow corner handles, rotate handle above. A dragged handle turns green.
- **Contextual image toolbar:** move/select, normal crop, lasso, polygon lasso, resize, rotate, flip horizontal, flip vertical, undo, redo.
- **Properties panel:** X, Y, width, height (with aspect-lock toggle and "Restore original size"), rotation (with reset to 0), opacity slider, crop (enter crop mode), layer position (front, forward, backward, back), lock/unlock, duplicate, delete (destructive).
- **States:** selected, moving, resizing, rotating, locked (lock icon, no handles, properties read-only).

### 4.3 Washi tape selected
- **Properties panel:** X, Y, width, length, rotation, opacity, edge style (straight, torn, uneven, scalloped), layer position, duplicate, delete.
- **Canvas:** handles on the ends to change length. The pattern repeats along the length instead of stretching.

### 4.4 Text selected / editing
- Text toolbar replaces the image toolbar: font family (grouped as handwriting, typewriter, serif, sans-serif, decorative), size, colour, bold, italic, alignment.
- **Properties panel:** font, size, colour, alignment, line spacing, letter spacing, rotation, layer position, lock, delete.
- **States:** selected (box + handles), editing (text cursor, box outlined, handles hidden), empty new text box with placeholder.

### 4.5 Drawing mode
- Pen toolbar: pen, pencil, marker, highlighter, eraser. The active tool has the Golden Yellow highlight bar.
- **Properties panel:** brush type, size, colour, opacity, plus "Draw over / under decorations".
- **States:** drawing, erasing (eraser cursor), stylus with pressure. Escape returns to select mode.

### 4.6 Crop mode, normal crop
- Visual cue that the **crop boundary**, not the object, is being edited: a green dashed boundary with square Golden Yellow handles, and the area outside it dimmed.
- **Crop bar:** aspect ratio chips (freeform, 1:1, 4:5, 3:4, 16:9, original), "Apply" primary button, "Cancel" secondary button, with an "Esc to cancel" hint.

### 4.7 Crop mode, freeform lasso
- **States:** before drawing (crosshair cursor + hint), drawing (live path), closed selection (marching dashed outline), refinement.
- **Bar:** clear, invert, apply, cancel.

### 4.8 Crop mode, polygon lasso
- **States:** placing points (anchors joined by straight lines, a rubber-band line to the cursor), hovering the start point (start anchor highlighted, "click to close"), closed selection.
- **Bar:** undo last point, clear, invert, apply, cancel.

### 4.9 Selection actions
- Shown once a lasso or crop selection exists: **Crop to selection**, **Isolate selection** (becomes a new transparent element), **Delete selected area** (destructive, with icon), **Invert selection**.
- After Isolate, show a toast offering "Save as sticker". The original photo stays untouched.

### 4.10 Save as sticker (modal)
- Preview on a checkerboard (to show transparency), name, category, collection, "Save sticker" primary button. On success, a toast with a link to the sticker library.

### 4.11 Background & paper picker
- Grid of swatches: plain white, cream, grid, lined, dotted, vintage, kraft, floral, and "Upload your own". The current background is marked.
- A note that changing the background never deletes page content.

### 4.12 Layers panel
- An ordered list of page elements (thumbnail + name + type icon), top layer first. Drag to reorder, plus lock and visibility toggles. Clicking a row selects that element on the canvas.

### 4.13 Image upload in progress
- A placeholder on the canvas or in the Uploads tab with a progress bar, then a short processing state. Errors: unsupported type (only PNG, JPG, JPEG, WEBP), file too large, upload failed (with Retry).

### 4.14 Save status
- Toolbar status pill states: **Saving…**, **Saved** (cloud-check icon), **Offline, changes kept on this device** (warning icon), **Save failed** (Jasper icon + "Retry" button, never colour alone).

### 4.15 Export
- **Export page:** format (PNG, PDF), quality, then a "Export" primary button and a progress state.
- **Export notebook:** page range, format (PDF), then progress and a done state with a download link.

### 4.16 Two-page spread view
- The notebook shown open, with two pages side by side and the spine in the middle. Previous/next page turn, plus the page-turn animation (phase 7).

### 4.17 Keyboard shortcuts
- A modal listing shortcuts grouped by Edit, Tools, View and Layers (undo/redo, delete, duplicate, Esc to exit a mode, zoom and so on).

---

## 5. Sticker Studio

A step-by-step studio with a large preview canvas in the centre and a step panel on the right. Steps are shown in a stepper at the top: Upload → Remove background → Crop → Die-cut & shadow → Save.

### 5.1 Upload
- A drop zone ("Drop an image or browse"), the accepted formats, and recent uploads to reuse.
- **States:** empty, dragging over (zone highlighted Golden Yellow), uploading, error (wrong type or too large). A transparent PNG skips straight to 5.3.

### 5.2 Background removal
- Before/after preview, a "Remove background" button, then a refine-edges control. "Skip" for images that are already transparent.
- **States:** processing (non-blocking progress), done, failed (retry).

### 5.3 Crop & select
- The same three tools as the editor (normal crop, freeform lasso, polygon lasso), with apply, cancel, invert, clear, and undo/redo.

### 5.4 Die-cut border & shadow
- **Die-cut border:** thickness slider, colour picker, opacity slider. The border follows the subject's silhouette.
- **Shadow (toggle):** blur, opacity, distance, direction.
- **Rotation:** angle input + reset.
- The preview updates live on a checkerboard background.

### 5.5 Preview & save
- The final sticker on a checkerboard and on a sample paper page. Fields: name, category, collection. "Save sticker" primary button.
- **States:** saving, saved (with "Use on a page" and "Make another" actions).

### 5.6 Sticker library
- A grid of sticker previews with search, category chips and collections. Hover actions: rename, edit (reopens the studio), delete, add to collection.
- **States:** empty ("Make your first sticker"), no search results, loading.

---

## 6. Washi Tape Studio

The same studio shell as the Sticker Studio: a large tape preview laid across a sample page, controls on the right.

### 6.1 Choose method
- Two large option cards: "Use a pattern" and "Upload an image".

### 6.2 Pattern creator
- Pattern presets: solid, polka dots, stripes, florals, gingham, grid, vintage paper, hand-drawn, checkerboard, illustrations. Each has colour pickers and scale.

### 6.3 Upload pattern
- A drop zone, then a choice to repeat or scale the image along the tape.

### 6.4 Customise & preview
- Colour, width, default length, opacity, rotation, texture (paper grain on/off), edge style (straight, torn paper, uneven handmade, scalloped).
- The preview shows the tape at a short and a long length to prove the pattern repeats instead of stretching.

### 6.5 Save tape
- Name, then "Save tape". Success state with "Use on a page".

### 6.6 Tape library
- Tapes shown as horizontal strips in a list or grid, with search, filters and collections. Hover actions: rename, edit, delete.
- **States:** empty, no results.

---

## 7. Personal asset library

### 7.1 All assets
- Tabs or filter chips: All, Stickers, Washi tapes, Backgrounds, Paper textures, Photos, Uploads, Extracted elements. A search field, a sort control, and a collections list in a left column.
- A grid of asset cards with a type label.

### 7.2 Filtered / search results
- Active filter chips shown in their selected (green) state, a result count, and a "Clear filters" action. A no-results empty state.

### 7.3 Collection view
- The collection's name and description, its assets, "Add assets", rename, and delete collection.

### 7.4 Asset detail (drawer)
- A large preview, name, type, category, collections, created/updated dates, and where it is used ("Placed on 4 pages in 2 notebooks").
- Actions: rename, edit in studio, add to collection, download, delete.
- A note that editing the asset won't change pages where it is already placed.

### 7.5 Rename / move to collection
- A small modal with a name input, or a collection picker with "New collection".

### 7.6 Delete asset
- Confirm dialog. Explains that placed copies on pages stay, and that the original is removed from the library.

---

## 8. System patterns and shared screens

### 8.1 Global navigation
- A left rail or top bar on all non-editor pages: Dashboard, Notebooks, Sticker Studio, Washi Studio, Asset Library, then account menu. The editor hides it to keep the focus on the page, with a back button in the toolbar instead.

### 8.2 Empty states
- One pattern used everywhere: illustration, handwritten title, one line of plain explanation, one primary action.

### 8.3 Loading & skeletons
- Card skeletons in Light Yellow with green outlines at low opacity. Image processing shows non-blocking progress and never freezes the editor.

### 8.4 Toasts & inline errors
- Toasts for success (green) and failure (Jasper icon + green text on cream). Errors always pair Jasper with an icon and a message.

### 8.5 Not found / no access
- "This page isn't in your journal", with a link back to the Dashboard. The same layout for notebooks the user can't access.

### 8.6 Unsaved-changes recovery
- Shown when the editor reopens with local changes that never reached the server: "We kept your unsaved changes from [time]". Actions: "Restore" (primary) or "Discard" (destructive).

---

## 9. Suggested design order

Follow the roadmap phases so each batch of screens is usable on its own:
1. **Phase 1:** global navigation, sign in / create account, dashboard (filled + empty), create notebook, notebook workspace, page overview.
2. **Phase 2:** journal editor shell, nothing selected, image selected, text selected, background picker, layers, save status.
3. **Phase 3:** the three crop modes, selection actions, upload states.
4. **Phase 4:** Sticker Studio steps, sticker library, save as sticker, asset library.
5. **Phase 5:** Washi Tape Studio steps, tape library, tape selected.
6. **Phase 6:** drawing mode.
7. **Phase 7:** export, two-page spread, keyboard shortcuts polish.
