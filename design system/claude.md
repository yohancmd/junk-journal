Digital Junk Journal — Design System

1. Color Palette
The system uses four colors: a deep green and a golden yellow as the brand pair, a pale yellow as the page neutral, and a red accent used sparingly.
Token
Name
HEX
RGB
CMYK
Role
--color-green
La Salle Green
#007633
0 118 51
100 21 100 11
Primary brand color, headings, primary buttons, text on light surfaces
--color-yellow
Golden Yellow
#FFDD00
255 221 0
0 12 97 0
Highlights, secondary surfaces, text on green
--color-cream
Light Yellow
#FFFCE1
255 252 225
1 2 16 0
Page and canvas background, card surface
--color-red
Jasper
#D84040
216 64 64
0 85 70 0
Accent, alerts, destructive actions, small emphasis
The reference image shows La Salle Green as "#07633" and Golden Yellow as "#FFDD0", each one digit short. This doc uses #007633 and #FFDD00, which match the RGB values given for both.
Proportions — Light Yellow carries most of the screen, Green carries structure and text, Golden Yellow marks the things to notice, and Jasper stays under roughly 5% of any screen.
Tints and transparency — beyond the four solid colours, use only transparent versions of them, and only for shadows, dividers, scrims, hover rows and soft tints. Build them from the token (for example color-mix(in srgb, var(--color-green) 20%, transparent)) or from the full hex with an alpha channel (#00763333). Never add an alpha suffix to a token name: "--color-green80" is not a colour. Never introduce a new solid colour, such as a gray, a white canvas or an off-palette tint.
UI colour vs content colour — the palette rules apply to the interface. Paper colours on pages (white, kraft, vintage), user photos, pen ink and anything users upload are content and are exempt.
2. Color Pairings and Contrast
Only Green on Light Yellow and Light Yellow on Green clear the WCAG AA bar for body text (4.5:1). Every other pairing is for large text (24 px, or 19 px bold) or non-text UI only. Ratios are calculated from the HEX values and rounded.
Text
Background
Contrast
Use
Green
Light Yellow
5.6:1
Body text, labels, any size
Light Yellow
Green
5.6:1
Body text on green panels, any size
Green
Golden Yellow
4.3:1
Large text only
Golden Yellow
Green
4.3:1
Large headings on green, as in the palette card
Jasper
Light Yellow
4.3:1
Large text and icons only, never small error copy
Light Yellow
Jasper
4.3:1
Large text on red only
Jasper
Golden Yellow
3.3:1
Non-text only, such as borders and icons
Green
Jasper
1.3:1
Do not use
Rules
• Default body text is Green on Light Yellow.
• Small text (under 16 px) never sits on Golden Yellow or Jasper.
• Jasper text must be paired with an icon or label so meaning never depends on color alone.
• Do not place Green directly against Jasper.
3. Typography
Three type roles carry over from the product requirements: a clean sans-serif for the interface, a serif for editorial headings, and a handwriting face for decorative accents only. Specific typefaces are not chosen yet; pick them once and set them in the font tokens. Until then, the mockups in junkie.pen use these stand-ins: Fraunces (serif headings), Nunito Sans (interface) and Caveat (handwriting). Change them only through the font tokens so every screen updates.
Style
Role
Size / line height
Weight
Default color
Display
Page titles, empty states
40 / 48 px
Bold, serif
Green
Heading 1
Section titles
28 / 36 px
Bold, serif
Green
Heading 2
Panel and card titles
20 / 28 px
Semibold, sans
Green
Body
Default interface text
16 / 24 px
Regular, sans
Green
Small
Helper text, metadata
14 / 20 px
Regular, sans
Green
Label
Buttons, tabs, inputs
14 / 20 px
Semibold, sans
Green
Accent
Handwritten flourishes, notebook titles
24 / 32 px
Regular, handwriting
Green or Jasper
• Never go below 14 px for interface text.
• Handwriting fonts are not used for labels, instructions or anything the user must read to complete a task.
• Text on Green panels is Light Yellow or, at heading sizes, Golden Yellow.
4. Spacing, Shape and Elevation
Spacing runs on a 4 px base so panels, handles and toolbars line up with the editor canvas.
Token
Value
Typical use
--space-1
4 px
Icon gaps
--space-2
8 px
Inline gaps, tight stacks
--space-3
12 px
Input padding
--space-4
16 px
Card padding, default gap
--space-6
24 px
Panel padding
--space-8
32 px
Section spacing
--space-12
48 px
Page margins
Shape — controls are fully rounded pills (--radius-pill: 999 px), echoing stationery labels. Cards and panels use 16 px corners (--radius-card), inputs 12 px (--radius-input). The page canvas itself stays square-cornered like real paper.
Borders — 2 px Green outlines on controls and cards, so surfaces read as flat cut-paper rather than glass.
Elevation — keep it soft and warm, never gray.
Token
Value
Use
--shadow-sm
0 1px 2px rgba(0, 118, 51, 0.15)
Cards, chips
--shadow-md
0 4px 12px rgba(0, 118, 51, 0.18)
Popovers, selected elements
--shadow-lg
0 12px 28px rgba(0, 118, 51, 0.22)
Modals, dragged assets
5. Core Components
Components follow the contrast rules above, so small text always sits on Green or Light Yellow.
Component
Default
Hover / active
Notes
Primary button
Green fill, Light Yellow label, pill
Slightly darker green fill (--color-green-dark); pressed shifts down 1 px
One per view for the main action
Secondary button
Light Yellow fill, 2 px Green border, Green label, pill
Border thickens to 3 px
Default for toolbar actions
Destructive button
Light Yellow fill, 2 px Jasper border, Jasper icon, Green label
Jasper border thickens
Always paired with a trash or warning icon
Input
Light Yellow fill, 2 px Green border, Green text
Golden Yellow focus ring, 3 px
Error: Jasper border plus an icon and message
Card
Light Yellow fill, 2 px Green border, 16 px radius, --shadow-sm
--shadow-md on hover
Used for notebooks and library assets
Tag / chip
Light Yellow fill, 1 px Green border, Golden Yellow dot
Green fill, Light Yellow label when selected
Categories and collections
Toolbar and panels
Light Yellow fill, Green icons and labels
Golden Yellow highlight bar marks the active tool
Left sidebar, top toolbar and right properties panel
Selection handles
Golden Yellow fill, 2 px Green outline
Green fill when dragged
Resize and rotate handles on canvas elements
Crop mode
Green dashed boundary, Golden Yellow handles
n/a
Clear visual difference from normal selection
Icons — outline style, 2 px stroke, Green by default, Jasper only for destructive or warning states.
Focus — every interactive element shows a visible 3 px Golden Yellow focus ring with a Green inner edge, so focus is visible on both light and green surfaces.
Die-cut stickers — the border must follow the cut-out's silhouette, built from the image's transparency (alpha), for example by dilating the alpha channel or with an SVG feMorphology filter. A box-shadow or stacked shadows on the image follow its rectangle instead and draw a white square. The soft drop shadow can use filter: drop-shadow(), which does follow the silhouette. The Pencil mockups show the border as a white rounded backing only because the design tool can't do this.
Transparency previews — anything that shows a transparent cut-out (the before/after split, the sticker preview, the save-as-sticker modal) sits on its own opaque background, cream plus the checkerboard, so layers underneath never show through the transparent pixels.
Crop boundary — the dashed line is a real dashed stroke (stroke-dasharray: 9 6) with square handles, so crop mode never looks like normal selection, which has round handles.
Illustrations — use the empty-state illustration at its native size (300 × 220) or export it at the size needed. Don't squeeze it into a smaller box, which crops it instead of scaling it.
Full component specs are in design system/components.md.
6. Design Tokens
Centralize every value above as CSS custom properties so components never hardcode colors. Font families hold stand-ins until the real typefaces are chosen.
:root {
  /* Color */
  --color-green: #007633;   /* La Salle Green */
  --color-yellow: #FFDD00;  /* Golden Yellow */
  --color-cream: #FFFCE1;   /* Light Yellow */
  --color-red: #D84040;     /* Jasper */

  /* Derived (used in the mockups; never add other solid colours) */
  --color-green-dark: #00652B;  /* primary button hover */
  --scrim: rgba(0, 61, 26, 0.55);  /* behind modals and drawers */
  --surface-tint: color-mix(in srgb, var(--color-yellow) 20%, transparent);  /* drop zones, tips, hover rows */
  --canvas-surround: color-mix(in srgb, var(--color-green) 8%, var(--color-cream));  /* editor area around the page */
  --divider: color-mix(in srgb, var(--color-green) 20%, transparent);

  /* Content colours (on pages only, exempt from the UI palette) */
  --paper-white: #FFFEF6;
  --color-ink: #2E2A26;  /* typed text and pen on pages */

  /* Semantic roles */
  --bg-page: var(--color-cream);
  --bg-surface: var(--color-cream);
  --bg-brand: var(--color-green);
  --bg-highlight: var(--color-yellow);
  --text-default: var(--color-green);
  --text-on-brand: var(--color-cream);
  --text-on-brand-large: var(--color-yellow);
  --border-default: var(--color-green);
  --accent: var(--color-red);
  --focus-ring: var(--color-yellow);

  /* Typography */
  --font-ui: /* TBD, stand-in: Nunito Sans */ "Nunito Sans", sans-serif;
  --font-heading: /* TBD, stand-in: Fraunces */ "Fraunces", serif;
  --font-accent: /* TBD, stand-in: Caveat */ "Caveat", cursive;
  --font-mono-paper: "Courier Prime", monospace;  /* typewriter text on pages */

  /* Spacing (4 px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Shape */
  --radius-pill: 999px;
  --radius-card: 16px;
  --radius-input: 12px;
  --border-width: 2px;

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(0, 118, 51, 0.15);
  --shadow-md: 0 4px 12px rgba(0, 118, 51, 0.18);
  --shadow-lg: 0 12px 28px rgba(0, 118, 51, 0.22);
}