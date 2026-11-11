# Learnings

## 2026-11-11 — Pencil MCP not connected
- **What happened:** Tried to build the design system in `design system/junkie.pen`. The Pencil MCP tools (`get_app_state`, `read_skill`) failed with "transport not connected to app: visual_studio_code".
- **Cause:** You can only edit `.pen` files through the Pencil MCP server, and that only works while the Pencil extension has the file open in VS Code. The file is also encrypted, so the Read tool shows it as empty.
- **Next time:** Open `junkie.pen` in the Pencil editor tab first. Then call `get_app_state` to check the connection before planning any work.
- **Retry:** Retrying straight away failed with the same error, so retrying alone doesn't help. Something in VS Code or Pencil has to change first: the file opened in the Pencil editor, the window reloaded, or Pencil signed in.
- **Progress, third try:** The Pencil app connected, but every tool returned "A document needs to be open in the editor". The tools can't open a file from its path. Someone has to open `junkie.pen` in the Pencil editor tab, and it has to stay open.

## 2026-11-11 — Pencil layout mistakes while building junkie.pen
- **Text spilled past its panel:** Pencil text defaults to `textGrowth: "auto"`, which never wraps, so captions and labels ran past their panels. For any sentence-length text, set `textGrowth: "fixed-width"` with `width: "fill_container"`.
- **Toolbar active-bar collapsed to zero width:** a child with `fill_container` inside a parent that sizes to its content (`fit_content`) makes each wait on the other. For an active-tab underline, use a bottom border (`strokeWidth: {bottom: 4}`) on the tool itself instead of a separate bar.
- **No dashed strokes in the .pen format:** the format has no dash setting. The crop-mode dashed boundary is drawn as a path made of short line segments.
- **Hard-coded colours crept in:** I used an off-palette zebra-row tint and a white canvas, which breaks the "never hardcode colours" rule. Stick to the four palette colours, plus their alpha versions only for shadows and dividers.
- **Typefaces are still TBD in the design-system doc:** Fraunces, Nunito Sans and Caveat are labelled as stand-ins in the `font-heading`, `font-ui` and `font-accent` variables. Swap them there once the real fonts are chosen.

## 2026-11-11 — Mistakes while building the screens in junkie.pen
- **Helper functions don't survive between `execute` calls:** only plain values (ids, strings, objects) carry over. My first screen call failed with "T is not defined". Fix: keep the helpers as one string global (`LIB`) and run `eval(LIB)` at the start of each call.
- **Alpha suffix on a colour variable:** `"$color-green" + "80"` makes `"$color-green80"`, which isn't a real variable, so the gingham tape rendered black. Alpha only works on hex values (`#00763380`). The `al()` helper now maps a token to its hex before adding alpha.
- **8-digit gradient colour:** I wrote `#0076330000` by mistake. Pencil colours are `#RGB`, `#RRGGBB` or `#RRGGBBAA` only.
- **Text nodes have no `padding`:** passing `padding` to a text node is a schema error. Wrap the text in a frame instead.
- **Instances of a frame without layout don't scale their children:** resizing the Empty Illustration instance to 180 × 132 cropped the artwork instead of shrinking it. Use generated SVG art at its own size, or generate it at the size it will be shown.
- **Background removal failed twice on a stock photo:** `Generate("remove-background", …)` on the Unsplash cat photo returned a pending URL that later disappeared both times, which means it failed. The Sticker Studio screens show the cat in a rounded die-cut shape instead, with the white border made from eight stacked zero-blur white shadows. Retry with a photo that has a plainer background, or upload a cut-out PNG.
  - **Update, third try worked:** the same call on the same photo succeeded (the URL became `generated.webp`). It took about a minute; earlier checks just ran too soon or hit a temporary failure. Apply the result to a single node first, wait until the URL stops being `pencil:pending-image…`, then copy the resolved URL to the other nodes. That way a failure only breaks one fill.
- **Shadows don't follow a cut-out's alpha:** stacked zero-blur white shadows on a transparent image draw a white rectangle, not a silhouette outline. The die-cut is shown instead as a white rounded "sticker backing" frame with the cut-out inside.
- **A frame with no fill lets lower layers show through transparent pixels:** the 5.2 "After" half needed its own cream fill, or the original photo underneath showed through the cut-out.
- **Copy before images finish loading:** copying a node while its stock image is still pending may copy the placeholder. Check that the fill URL no longer starts with `pencil:pending-image` before copying the editor screen.
- **Lucide icon names that don't exist here:** `clock`, `align-justify`, `upload-cloud`, `circle-help`. Working replacements: `history`, `menu`, `cloud-upload`, `life-buoy`.

## 2026-11-11 — Building the frontend components
- **npm optional-dependency bug fixed itself:** `vite build` first failed with "Cannot find native binding" (rolldown). Running `npm install lucide-react` re-resolved the optional packages and fixed it, so there was no need to delete `node_modules`.
- **Pencil browser nodes don't work in VS Code:** they exist only in the Pencil desktop app; inside VS Code the node just shows a placeholder. To check the React app visually, use headless Edge: `msedge --headless=new --user-data-dir=<scratch> --window-size=1440,6200 --virtual-time-budget=8000 --screenshot=<file> <url>` with `Start-Process -Wait`, then crop with System.Drawing to see detail.
- **Vite on Windows binds to IPv6 `localhost`:** start it with `--host 127.0.0.1` when another tool needs to reach it.
- **Fast-refresh lint:** files that export components must not also export constants or helper functions (oxlint `only-export-components`). Shared constants live in `src/components/constants.ts`.
- **Selected rows on Green:** any icon or thumbnail inside a Green-filled selected row needs a Yellow or cream background, otherwise the Green icon disappears (seen in LayerList).
- **tsconfig uses `verbatimModuleSyntax`:** type-only imports must use `import type`, and don't use the `React.` namespace without importing it. Import `CSSProperties` and `RefObject` directly.

## 2026-11-11 — Building the screens: contradictions between the reference docs
The screens use the choice noted after each one. **Status (2026-11-11): all items below are now reflected in the reference documents**; see "Reference documents updated" at the end of this list.
1. **Component folder structure.** technical-claude.md §2 wants `components/{common, navigation, notebook, editor, sticker, washi-tape, image-editor}`. The existing components are in `{primitives, feedback, overlays, shell, cards, editor, studio, auth}`. *Choice:* left them as they are, because guideline 9 says to explain before replacing an implementation. A possible mapping: primitives/feedback/overlays/auth → common, shell → navigation, NotebookCard/PageThumbnail → notebook, crop/lasso/polygon overlays + CropBar + BeforeAfter → image-editor, DieCutSticker/StickerTile → sticker, WashiTape/PatternPicker/TapeCard → washi-tape.
2. **Missing feature folders.** technical-claude.md lists six features but has no home for the account screens (1.1–1.5) or the system pages (8.5 not found, 8.6 recovery). *Choice:* added `features/account/`, `features/system/` and `features/shared/` (shared layout, mock artwork).
3. **"Don't generate the entire application in one response"** (technical-claude.md guideline 11) vs the request to add all screens at once. *Choice:* built them one area at a time, type-checking and screenshotting after each. The screens are UI only with mock data: no routing, no API, no real canvas logic.
4. **Ink colour.** technical-claude.md's page JSON example uses `#39332E` (the product doc's "Dark Ink"), but the design system defines `--color-ink: #2E2A26`. *Choice:* used the design-system token.
5. **Page size and aspect ratio.**
   - technical-claude.md §7.1 uses logical page units of 1200 × 1600 (3:4).
   - screens.md and the mockups say A5 (148 × 210 mm, about 1:1.41).
   - The Pencil mockups draw the page at 560 × 720 (7:9), which matches neither.
   - *Choice:* mock pages use 560 × 720 to match the mockups. This needs one agreed logical size before the editor is built for real.
   - **Decided 2026-11-11:** use a **true A5 ratio** (1 : √2, about 1 : 1.414) for logical page units, for example 1200 × 1697. Canvas library decided at the same time: **React-Konva** (konva 10.9.1, react-konva 19.3.2, use-image 1.1.x).
6. **Data model gaps** (technical-claude.md §4 vs screens.md):
   - **Notebook:** screens 3.1/3.4 set a *default page background* and a creation date, but the Notebook table has no default-background field (`background_config` is only on JournalPage).
   - **WashiTapeAsset:** has one `color` and a `pattern_image`, but the pattern creator (6.2) needs a pattern type, a base colour, a pattern colour, scale and a texture flag.
   - **Collections:** they appear everywhere in the Asset Library (7.1–7.5) and the sticker library, but there is no Collection table and no many-to-many link.
   - *Choice:* the frontend types in `src/types/index.ts` include these fields, so the backend model needs to catch up.
7. **Canvas library not chosen** (React-Konva vs Fabric.js). *Choice:* the editor screens use the DOM-based `Page` / `PageElement` / `SelectionBox` components as visual stand-ins. Swap them for the chosen canvas library when the editor logic is built. **Decided 2026-11-11: React-Konva.**
8. **3.1 Create notebook:** the screen map in screens.md says "Modal (multi-step)" but the details say "multi-step or single long form". *Choice:* a single form with a live preview, matching the Pencil mockup.
9. **"Notebooks" nav item:** the NavRail has a Notebooks destination, but screens.md has no notebooks-list page (the dashboard's "All notebooks" covers it). **Decided in routing:** `/notebooks` is its own list page (now screen 3.0).
10. **8.1 navigation, 8.2 empty states and 8.4 toasts are patterns, not screens.** They're built into every screen (AppPage, EmptyState, ToastProvider), so the screen catalogue has no separate entry for them. 8.3 loading is `DashboardScreen state="loading"`.
11. **No real photos in the repo.** Pages and libraries show `MockPhoto` placeholders (tinted blocks with an image icon), and sticker previews use icon die-cuts. The save-as-sticker preview and the uploaded washi pattern borrow the empty-state illustration.

**Reference documents updated (2026-11-11)** so every doc matches these decisions:
- **technical-claude.md:**
  - §1: React 19, React Router 8, Lucide, React-Konva (item 7).
  - §2: the actual folder tree with account / system / shared / routes, the components grouping with its mapping to the original plan (items 1–2), and a Routes table that includes the notebook list (item 9).
  - §2 canvas paragraph: React-Konva specifics.
  - §3: SPA fallback for hosting.
  - §4: nine tables, adding Notebook.default_background_config, the washi pattern fields, Collection and CollectionItem (item 6).
  - §5: ink `#2E2A26` (item 4).
  - §7.1: A5 ratio (item 5).
  - §7.2: React-Konva clipping.
- **product-claude.md §5:** the design-system palette replaces the pastel suggestion, plus the stand-in typefaces and a "Notebooks" list page.
- **screens.md:**
  - New 3.0 Notebook list (item 9); 3.1 is a single form with a live preview (item 8).
  - 8.1 is a 248 px left rail; the canvas uses React-Konva and A5 units.
  - A pointer to the routes table.
- **components.md:**
  - Implementation location, `constants.ts`, React-Konva notes for Page, Transformer, crop clipFunc, die-cut and washi tape.
  - Two new ground rules (own text colour on Green, selected rows on Green), a `useLinkProps` note on TextLink, and the selected LayerList thumbnail.
- **design system/claude.md:** the same two Green-panel rules, plus the Konva `dash: [9, 6]` for the crop boundary.
- **Item 3** (step-by-step building) was a way of working, not a document conflict, so nothing changed. **Items 10–11** describe the mock prototype and need no doc change.

## 2026-11-11 — Mistakes while building the screens (fixed)
- **Inline span as a sized box:** `MiniPage` was a `<span>` with width/height 100%, so the page-thumbnail sketches didn't show. Give it `display: block`.
- **Overlays hidden under page elements:** each PageElement has its own z-index, so CropOverlay and PolygonOverlay, added later in the DOM, were drawn underneath. Wrap page overlays in a layer with a high z-index.
- **Inherited colour hid text:** the JournalCover label inherited the cream text colour of the Green preview panel, so the title vanished. Components on Green panels must set their own text colour.
- **`React.ReactNode` without importing React** again (verbatimModuleSyntax). Always `import type { ReactNode } from 'react'`.
- **Constants exported next to components** (NotebookParts' `PAPERS`) trips the fast-refresh lint. Moved to `options.ts`.
- **Visual check method that works:** `?screen=<id>` opens a screen directly, and `scratchpad/shoot.ps1` (headless Edge + System.Drawing) builds a contact sheet of several screens.

## 2026-11-11 — Adding routing (React Router)
- **npm installed React Router 8** (`react-router@^8.5`), not v7. The data-router API is the same: `createBrowserRouter` from `react-router`, but `RouterProvider` comes from **`react-router/dom`**. The package ships its own docs in `node_modules/react-router/docs`; check those rather than relying on memory.
- **Race between two redirects after sign-in:** the sign-in screen called `navigate(returnTo)` after `signIn()`, but the state change made the `GuestOnly` guard render `<Navigate to="/dashboard">` first, so users never returned to the page they wanted. *Fix:* the guard owns the post-sign-in redirect (it reads `location.state.from`), and the screen only calls `signIn()`.
- **Overlay URLs shouldn't remount the page underneath:** `/notebooks/:id/settings` and `/library/assets/:id` are *child* routes without a component. The parent screen stays mounted (search text and filters survive opening and closing the drawer) and reads the child params with `useParams()`.
- **Structure addition not in technical-claude.md:** routing lives in `src/routes/` (router, path builders, guards, route wrappers). The doc's tree has no place for it; `hooks/useAuth`, `hooks/useLinkProps` and `services/authService` follow the doc.
- **Mock auth:** `services/authService.ts` stores a flag in localStorage until the Django auth endpoints exist. A fresh browser starts signed out, so open `/sign-in` and press Sign in.
- **Production hosting needs an SPA fallback:** every unknown path must serve `index.html` (Django catch-all view or a static-host rewrite), or deep links like `/notebooks/nb-travel/pages/3` 404 on refresh. The Vite dev and preview servers already do this.
- **Route testing without a test framework:** `scratchpad/route-test.mjs` drives headless Edge over the DevTools protocol (Node 24's built-in WebSocket). It signs in, clicks through every area and asserts URL, title and content. Final run: 48/48 checks passed.

## 2026-11-11 — Contrast ratios in design system/claude.md checked
- I recalculated the WCAG ratios from the HEX values: Green/Cream 5.6, Green/Yellow 4.3, Jasper/Cream 4.3, Jasper/Yellow 3.3, Green/Jasper 1.3. They all match the doc, so no correction is needed.
