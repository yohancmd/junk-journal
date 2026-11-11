Digital Junk Journal — Technical Requirements

1. Stack and Architecture Overview
The app is a desktop-first web application built from a component-based React frontend, a Django REST backend, PostgreSQL for structured data and object storage for files. This document covers the technical side of the product described in the separate Product Requirements doc.
Layer
Choice
Notes
Frontend
React 19 + TypeScript (Vite)
React Router 8 (data router) for navigation, Axios for API calls, CSS Modules for styling, Lucide icons (lucide-react)
Canvas
React-Konva (konva 10, react-konva 19, use-image) — decided 2026-11-11
Custom logic still needed for lasso and polygon selection
Backend
Python + Django REST Framework
One Django app per domain
Database
PostgreSQL
Relational tables plus JSONB for flexible content
File storage
Django media storage (local), object storage (production)
Never store large images in PostgreSQL
Where data lives
• JSONB: journal page content, element properties, crop configurations, drawing configurations and background configurations.
• Relational tables: users, notebooks, pages, stickers, washi tapes and uploaded assets.
• File or object storage: uploaded photographs, original images, processed stickers, extracted image elements, sticker previews, washi tape patterns, backgrounds and journal exports. PostgreSQL stores only the file paths or storage URLs.
2. Frontend
The frontend uses React and TypeScript with a feature-based folder structure and reusable components. This tree matches the code in frontend/junk-journal (updated 2026-11-11).
src/
  assets/
  components/          reusable UI, grouped by kind (specs: design system/components.md)
    primitives/        Button, IconButton, TextField, Checkbox, Toggle, Slider, NumberField, SegmentedControl, Tag, SwatchGroup, KeyCap, TextLink
    feedback/          Toast + ToastProvider, Banner, Tip, SaveStatusPill, Skeleton, ProgressBar, EmptyState
    overlays/          Modal, Drawer, ConfirmDialog, Menu
    shell/             AppShell, NavRail, PageHeader, Stepper, StudioShell (navigation)
    cards/             NotebookCard, PageThumbnail, AssetCard, StickerTile, TapeCard, CollectionList, FilterBar
    editor/            editor chrome, canvas stand-ins, image-editor overlays (crop / lasso / polygon) and editor dialogs
    studio/            DropZone, BeforeAfter, DieCutSticker, WashiTape, PatternPicker, MethodCard, DirectionDial
    auth/              AuthLayout, PasswordStrength, DangerZone
    constants.ts       shared constants (kept out of component files for fast refresh)
    index.ts           single import point for all components
  features/
    account/           sign in, sign up, password reset, account settings
    dashboard/
    notebook-management/
    sticker-studio/
    washi-tape-studio/
    journal-editor/
    asset-library/
    system/            not found / no access
    shared/            AppPage, shared layout styles, mock artwork
  routes/              router, path builders (paths.ts), auth guards, route wrappers
  hooks/
  services/            API layer (mock data + mock auth until the Django API exists)
  types/
  utils/
  App.tsx
  main.tsx
The components folder was originally planned as common/, navigation/, notebook/, editor/, sticker/, washi-tape/ and image-editor/. It is grouped by kind instead; the mapping is primitives + feedback + overlays + auth → common, shell → navigation, cards → notebook and asset tiles, studio → sticker and washi-tape, editor → editor and image-editor. Design tokens live in src/index.css.
Routes
Route
Screen (design system/screens.md)
/sign-in, /sign-up, /forgot-password
1.1–1.3, signed-out only
/reset-password/:token
1.4
/dashboard (/ redirects here)
2.1, 2.2
/account
1.5
/notebooks
Notebook list (NavRail "Notebooks")
/notebooks/new
3.1 create modal over the dashboard
/notebooks/:notebookId, /notebooks/:notebookId/settings
3.2 workspace, 3.4 settings drawer (child route, page stays mounted)
/notebooks/:notebookId/pages
3.3 page overview
/notebooks/:notebookId/pages/:pageNumber (?view=spread)
4.x journal editor, 4.16 spread
/stickers, /stickers/new/:step
5.6 library, 5.1–5.5 studio (upload, background, crop, outline, save)
/washi-tapes, /washi-tapes/new/:step
6.6 library, 6.1–6.5 studio (method, pattern or upload, customise, save)
/library, /library/collections/:collectionId, /library/assets/:assetId
7.1, 7.3, 7.4 detail drawer (child routes, page stays mounted)
*
8.5 not found
/dev, /dev/screens/:id, /dev/components
Development builds only: every screen state and the component gallery
Every route except the sign-in group requires a signed-in user; signed-out users are redirected to /sign-in and returned to the page they wanted after signing in.
Responsibilities
• React: UI rendering.
• TypeScript: type safety, with interfaces for notebooks, pages, stickers, washi tapes, images and canvas elements.
• React Router: navigation.
• State management: editor and notebook state, kept separate from backend API communication.
• Axios: backend communication.
• CSS Modules: component styling, with colors centralized as design tokens.
Canvas library — React-Konva (chosen over Fabric.js on 2026-11-11). It covers object selection, dragging (draggable), resizing and rotation (Transformer), layer management (Layer and element order), custom rendering, pointer and touch interaction, and clipping and masking (clipFunc). It does not provide every cropping operation out of the box, and it cannot render the React SVG components directly: washi tape patterns are drawn to a tile used as fillPatternImage, and die-cut borders are generated from the image's alpha on an offscreen canvas. Use a separate Konva Layer for freehand strokes. The HTML UI (toolbars, sidebar, properties panel, crop bar) stays as React DOM layered over the Stage. A canvas is invisible to screen readers, so the layers list and keyboard shortcuts are the accessible way to work with page elements.
3. Backend
The backend uses Django and Django REST Framework, split into one app per domain. Each app contains its own models, serializers, views, URLs and business logic.
accounts/
notebooks/
journal_pages/
stickers/
washi_tapes/
assets/
image_processing/
Backend responsibilities
• Authentication.
• Notebook management.
• Page persistence.
• Asset management.
• Image uploads.
• Image processing requests.
• Asset metadata.
• Ownership and permissions: users can only access their own notebooks and assets, and uploaded files are validated.
File storage — use Django media storage for local development and an appropriate object storage service in production.
Frontend hosting — the frontend is a single-page app with client-side routes. Whatever serves it (a Django catch-all view or a static-host rewrite) must return index.html for every non-API, non-asset path, otherwise deep links such as /notebooks/{id}/pages/3 return 404 on refresh.
4. Data Model
The proposed initial schema has nine tables. Every table has created_at, and all except ImageEdit and CollectionItem also have updated_at (User and the asset tables included). Foreign keys to the user enforce ownership. Updated 2026-11-11 with the fields the screens need (default page background, washi pattern settings, collections).
Table
Fields
Relationships
User
id, username, email, password_hash, created_at, updated_at
One user has many notebooks
Notebook
id, user_id (FK), title, description, cover_image, theme, page_size, default_background_config (JSONB), created_at, updated_at
One notebook has many pages. default_background_config is copied into each new page's background_config (screens 3.1 and 3.4); created_at is the creation date shown in the create form.
JournalPage
id, notebook_id (FK), title, page_number, background_config (JSONB), canvas_width, canvas_height, page_content (JSONB), created_at, updated_at
Belongs to a notebook
StickerAsset
id, user_id (FK), name, original_image, processed_image, preview_image, outline_config (JSONB), shadow_config (JSONB), category, created_at, updated_at
Belongs to a user
WashiTapeAsset
id, user_id (FK), name, pattern_type (solid, dots, stripes, gingham, grid, check, florals, hand-drawn, vintage, image), base_color, pattern_color, pattern_scale, image_mode (repeat or scale), texture (boolean), pattern_image (only for pattern_type image), preview_image, width, default_length, edge_style, opacity, created_at, updated_at
Belongs to a user
UploadedAsset
id, user_id (FK), name, original_file, preview_file, file_type, category, created_at, updated_at
Belongs to a user
ImageEdit
id, user_id (FK), source_asset_id, output_asset_id (optional), edit_type, crop_configuration (JSONB), mask_data (JSONB or file reference), created_at
Links a source asset to an optional extracted output
Collection
id, user_id (FK), name, description, created_at, updated_at
Belongs to a user; groups assets in the Asset Library and sticker/tape libraries
CollectionItem
id, collection_id (FK), asset_type (sticker, washi_tape or uploaded), asset_id, created_at
Many-to-many link: one asset can be in several collections. Deleting a collection never deletes its assets.
ImageEdit stores reusable or generated image-editing information, which preserves the distinction between original images and extracted results.
5. Journal Page Content Structure
Each page's objects are stored as versioned, structured JSON in JournalPage.page_content. The example below shows a sticker, a text box, a washi tape and a cropped image; the image's crop is stored on its placement, independent of the original asset.
{
  "version": 1,
  "elements": [
    {
      "id": "element-001",
      "type": "sticker",
      "asset_id": "sticker-001",
      "x": 120,
      "y": 150,
      "width": 160,
      "height": 160,
      "rotation": 12,
      "opacity": 1,
      "z_index": 3,
      "locked": false
    },
    {
      "id": "element-002",
      "type": "text",
      "x": 200,
      "y": 350,
      "width": 250,
      "height": 100,
      "rotation": 0,
      "z_index": 4,
      "content": "A little memory from today.",
      "font_family": "serif",
      "font_size": 24,
      "color": "#2E2A26"
    },
    {
      "id": "element-003",
      "type": "washi_tape",
      "asset_id": "tape-001",
      "x": 80,
      "y": 100,
      "width": 300,
      "height": 45,
      "rotation": -5,
      "opacity": 0.9,
      "z_index": 5
    },
    {
      "id": "element-004",
      "type": "image",
      "asset_id": "image-001",
      "x": 400,
      "y": 200,
      "width": 250,
      "height": 300,
      "rotation": 0,
      "opacity": 1,
      "z_index": 6,
      "crop": {
        "type": "polygon",
        "points": [
          [20, 10],
          [220, 30],
          [200, 250],
          [40, 270]
        ]
      }
    }
  ]
}
Schema rules
• Every element has a unique identifier and independent transform properties.
• Asset references (asset_id) are kept separate from placement properties.
• Crop configurations belong to individual placements where appropriate.
• Drawing strokes have their own structured representation.
• Background settings are stored separately (background_config).
• The JSON structure is versioned.
• Actual file data lives in file or object storage, never in the JSON.
6. API Endpoint Proposal
These endpoints are proposals. The frontend may run interactive crop previews locally and only call the backend for final processing or persistence.
Group
Method and path
Authentication
POST /api/auth/register/ · POST /api/auth/login/ · POST /api/auth/logout/ · GET /api/auth/me/
Notebooks
GET /api/notebooks/ · POST /api/notebooks/ · GET /api/notebooks/{id}/ · PATCH /api/notebooks/{id}/ · DELETE /api/notebooks/{id}/
Journal pages
GET /api/notebooks/{notebook_id}/pages/ · POST /api/notebooks/{notebook_id}/pages/ · GET /api/pages/{id}/ · PATCH /api/pages/{id}/ · DELETE /api/pages/{id}/
Stickers
GET /api/stickers/ · POST /api/stickers/ · GET /api/stickers/{id}/ · PATCH /api/stickers/{id}/ · DELETE /api/stickers/{id}/
Washi tapes
GET /api/washi-tapes/ · POST /api/washi-tapes/ · GET /api/washi-tapes/{id}/ · PATCH /api/washi-tapes/{id}/ · DELETE /api/washi-tapes/{id}/
Uploaded assets
GET /api/assets/ · POST /api/assets/ · DELETE /api/assets/{id}/
Image processing
POST /api/images/crop/ · POST /api/images/extract-selection/ · POST /api/images/remove-background/ · POST /api/images/preview/
7. Editor and Image Editing Implementation
7.1 Editor requirements
• Coordinate system: each page has fixed logical dimensions with a true A5 ratio of 1 : √2 (example: 1200 × 1697 units, portrait) that never change with zoom. The displayed canvas scales to fit the workspace at the correct aspect ratio, and object positions are stored in logical page units, not browser screen coordinates.
• Object independence: every placed object is its own instance with its own transform and crop. Placing one sticker five times creates five separate objects.
• Drop behavior: on drop, create a new element instance, assign a unique id, calculate its initial canvas position, apply default dimensions, add it to the page's element collection and make it selectable and editable.
• Undo and redo: maintain an editing history covering all significant operations, including destructive image edits.
• Performance: avoid re-rendering the whole app when one object changes, and optimize drawing to prevent lag. Use a separate drawing layer or canvas for freehand strokes.
• Persistence: restore a page exactly as saved, including positions, dimensions, rotation, layer order, opacity, crop configurations, text formatting, drawing strokes and background settings.
• Auto-save: track modifications, debounce save requests, send updated page content to the backend, show saving and saved status, handle network failures and keep unsaved changes locally.
• Stylus input: support mouse and stylus, with pressure sensitivity where available. Drawing strokes are saved as structured page content.
7.2 Image editing implementation
Rectangular crop — use the canvas library's cropping functionality or custom clipping logic.
Freeform lasso
1. Capture pointer coordinates while the user draws.
2. Store the coordinates as a path.
3. Close the path on pointer release.
4. Use the path as an alpha clipping mask.
Polygon lasso
1. Store each click as an anchor point.
2. Connect the points into a closed polygon.
3. Use the polygon as a clipping mask.
Transparent image extraction
1. Render the selected region to an offscreen canvas.
2. Apply the alpha mask.
3. Preserve the selected region.
4. Export as a transparent PNG.
Non-destructive approach
• Preserve original image files.
• Store crop configuration or clipping masks with individual placements.
• Generate processed previews only when necessary.
• Save extracted results as new assets only when the user asks.
• Preserve image quality, and support undo and redo for crop operations.
Background removal — a dedicated service or API, with manual crop and selection as an alternative. Transparent PNG uploads skip this step.
React-Konva handles selection, clipping (clipFunc on a Group) and rendering, but custom logic is still needed for complete lasso and polygon behavior.
8. Development Guidelines and First Milestone
Guidelines for implementing with Claude
1. Build incrementally, following the product roadmap, and prioritize the working editor over decorative animation and effects.
2. Use reusable React components and a feature-based folder structure.
3. Use TypeScript interfaces for notebooks, pages, stickers, washi tapes, images and canvas elements.
4. Keep frontend state management separate from backend API communication.
5. Use Django REST Framework for persistent data, PostgreSQL for metadata, file storage for images, and versioned JSONB for page content.
6. Make every journal element independently editable, and keep cropping and image edits non-destructive by default.
7. Implement auto-save and reliable page restoration.
8. Avoid hardcoding data that should come from the backend, and keep the design system centralized.
9. Inspect the existing project structure before modifying files, reuse working components, and explain why before replacing any implementation.
10. Explain technical decisions in simple language when introducing new libraries or architecture.
11. Work in small, verifiable steps. Do not generate the entire application in one response.
For each implementation task, explain what the feature does, which files are created or modified, how it connects to existing features, what dependencies are required, and how to test it.
First milestone: frontend editor prototype with mock data
Start with the frontend only, without implementing the backend. The prototype should demonstrate:
1. A notebook containing multiple pages.
2. A central journal page canvas.
3. A left sidebar with sample stickers and washi tapes.
4. Dragging stickers onto the page.
5. Dragging washi tapes onto the page.
6. Adding photographs and uploaded images.
7. Moving assets around the page.
8. Resizing assets.
9. Rotating assets.
10. Selecting and deleting assets.
11. Adding editable text.
12. Drawing directly on the page.
13. Changing layer order.
14. Using the rectangular crop tool.
15. Using the freeform lasso tool.
16. Using the polygon lasso tool.
17. Extracting selected image areas with transparent backgrounds.
18. Undoing and redoing editing operations.
19. Preserving the original uploaded images.
20. Saving the page state locally.
Once these work correctly, integrate Django and implement persistent saving.