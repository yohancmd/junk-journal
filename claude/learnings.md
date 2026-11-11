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

## 2026-11-11 — Contrast ratios in design system/claude.md checked
- I recalculated the WCAG ratios from the HEX values: Green/Cream 5.6, Green/Yellow 4.3, Jasper/Cream 4.3, Jasper/Yellow 3.3, Green/Jasper 1.3. They all match the doc, so no correction is needed.
