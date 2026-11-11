Digital Junk Journal — Technical Requirements

1. Stack and Architecture Overview
The app is a desktop-first web application built from a component-based React frontend, a Django REST backend, PostgreSQL for structured data and object storage for files. This document covers the technical side of the product described in the separate Product Requirements doc.
Layer
Choice
Notes
Frontend
React + TypeScript
React Router for navigation, Axios for API calls, CSS Modules for styling
Canvas
React-Konva or Fabric.js (to be evaluated)
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
The frontend uses React and TypeScript with a feature-based folder structure and reusable components.
src/
  assets/
  components/
    common/
    navigation/
    notebook/
    editor/
    sticker/
    washi-tape/
    image-editor/
  features/
    dashboard/
    notebook-management/
    sticker-studio/
    washi-tape-studio/
    journal-editor/
    asset-library/
  hooks/
  services/
  types/
  utils/
  styles/
  App.tsx
  main.tsx
Responsibilities
• React: UI rendering.
• TypeScript: type safety, with interfaces for notebooks, pages, stickers, washi tapes, images and canvas elements.
• React Router: navigation.
• State management: editor and notebook state, kept separate from backend API communication.
• Axios: backend communication.
• CSS Modules: component styling, with colors centralized as design tokens.
Canvas library — evaluate React-Konva and Fabric.js. The chosen library must support object selection, dragging, resizing, rotation, layer management, custom rendering, pointer and touch interaction, and clipping and masking. Do not assume it provides every required cropping operation out of the box. A separate drawing layer or canvas may be used for freehand strokes.
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
4. Data Model
The proposed initial schema has seven tables. Every table has created_at, and all except ImageEdit also have updated_at (User and the asset tables included). Foreign keys to the user enforce ownership.
Table
Fields
Relationships
User
id, username, email, password_hash, created_at, updated_at
One user has many notebooks
Notebook
id, user_id (FK), title, description, cover_image, theme, page_size, created_at, updated_at
One notebook has many pages
JournalPage
id, notebook_id (FK), title, page_number, background_config (JSONB), canvas_width, canvas_height, page_content (JSONB), created_at, updated_at
Belongs to a notebook
StickerAsset
id, user_id (FK), name, original_image, processed_image, preview_image, outline_config (JSONB), shadow_config (JSONB), category, created_at, updated_at
Belongs to a user
WashiTapeAsset
id, user_id (FK), name, pattern_image, preview_image, color, width, default_length, edge_style, opacity, created_at, updated_at
Belongs to a user
UploadedAsset
id, user_id (FK), name, original_file, preview_file, file_type, category, created_at, updated_at
Belongs to a user
ImageEdit
id, user_id (FK), source_asset_id, output_asset_id (optional), edit_type, crop_configuration (JSONB), mask_data (JSONB or file reference), created_at
Links a source asset to an optional extracted output
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
      "color": "#39332E"
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
• Coordinate system: each page has fixed logical dimensions (example: 1200 × 1600 units) that never change with zoom. The displayed canvas scales to fit the workspace at the correct aspect ratio, and object positions are stored in logical page units, not browser screen coordinates.
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
React-Konva or Fabric.js may help with selection, clipping and rendering, but custom logic is still needed for complete lasso and polygon behavior.
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