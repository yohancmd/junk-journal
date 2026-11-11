Digital Junk Journal — Product Requirements

1. Overview
Digital Junk Journal is a desktop-first web app where people create, customize and decorate their own digital notebooks, recreating the feel of physical junk journaling instead of plain text entry.
Users make their own materials (cut-out photos, die-cut stickers, washi tapes, handwritten notes) and arrange them freely on notebook pages. The experience should feel like a physical scrapbook filled with photographs, stickers, tapes, handwriting, paper textures and personal memories.
Core product philosophy
• Creative freedom: position, resize, rotate, crop and customize elements anywhere on a page, with no fixed layouts.
• Personalization: create your own stickers, washi tapes and decorative materials rather than relying only on premade assets.
• Physical journaling experience: paper-like textures, layered objects, torn edges, decorative materials and handwriting.
• Non-destructive editing: experiment freely without permanently damaging original images or reusable assets.
Six core modules, which work independently but share assets with the journal editor: Notebook Management, Sticker / Die-cut Creator, Washi Tape Creator, Journal Editor, Image Editing and Cropping, and Personal Asset Library.
2. Notebook Management
Users can create and manage multiple notebooks (Daily Journal, Travel Journal, Memory Book, Reading Journal, Art Journal, Monthly Recap and so on). Each notebook is a container of independently editable pages.
Creating a notebook — title, optional description, cover, color or theme, paper size, default page background, creation date.
Customizing notebooks — change cover, rename, change theme, add or remove pages, duplicate, delete, and reorder notebooks on the dashboard.
Pages — add blank pages, duplicate, delete, reorder, change backgrounds, navigate between pages, and view all pages in a thumbnail overview.
Navigation — the notebook should look like a physical open journal. Options: previous/next controls, thumbnail navigation, animated page-turning and a two-page spread view. Page-turning animation comes after the core editor works.
3. Sticker Studio and Washi Tape Studio
3.1 Digital sticker / die-cut creator
Users upload an image (PNG, JPG, JPEG, WEBP), remove the background, crop the subject and add a die-cut outline, producing a sticker with a transparent surround. Transparent PNGs work without background removal.
• Die-cut border: follows the subject's silhouette, not a rectangle. Adjustable thickness, color and opacity.
• Shadow (optional): blur, opacity, distance and direction.
• Cropping and selection: normal crop, freeform lasso and polygon lasso (see section 4.2).
• Rotation and preview: rotate the sticker; preview the final result with transparency shown correctly before saving.
• Saving: each sticker keeps a name, the original image, the processed transparent image, a preview, outline and shadow settings, a category and created/updated dates.
• Sticker library: previews, search by name, categories and collections, rename, delete, and reuse across notebooks.
• Using stickers on a page: drag from the library onto a page. Each placement is a separate instance (drag, resize, rotate, crop, duplicate, change opacity, reorder layers, lock/unlock, delete). Editing one placement never changes the original sticker.
3.2 Digital washi tape creator
Washi tapes are decorative adhesive tapes used in physical junk journals. The studio recreates the look of decorative paper tape that can be placed freely on pages.
Two creation methods
• Upload an image or repeating pattern.
• Use the built-in pattern creator: solid colors, polka dots, stripes, florals, gingham, grids, vintage paper textures, hand-drawn patterns, checkerboards and decorative illustrations.
Customization — color, pattern, width, length, opacity, rotation, texture and edge style. Edge styles: straight, torn paper, uneven handmade, and decorative scalloped.
Saving — each tape keeps a name, pattern or texture image, preview, color information, width, default length, edge style, opacity and created/updated dates.
Using tapes on a page — drag from the library, then resize, change length, rotate, adjust opacity, reposition, duplicate, reorder layers and delete. When the length changes, the pattern should repeat or scale sensibly rather than stretching.
4. Journal Editor, Image Editing and Asset Library
4.1 Journal editor
The central feature: a freeform workspace where users combine stickers, washi tapes, photographs, decorative images, handwritten notes, typed text, drawings, paper textures and backgrounds.
Layout (four areas)
• Top toolbar: undo, redo, save, zoom in/out, fit page, toggle alignment guides, export page, export notebook, previous/next page.
• Left sidebar: searchable tabs for Stickers, Washi Tapes, Backgrounds, Paper, Text, Uploaded Images and Recent Assets.
• Main canvas: freeform placement and manipulation of all elements.
• Right properties panel: controls change with the selected element.
Element
Properties shown
Sticker / image
X, Y, width, height, rotation, opacity, crop, layer position, lock
Washi tape
X, Y, width, length, rotation, opacity, edge style, layer position
Text
Font family, size, color, alignment, line spacing, letter spacing, rotation
Drawing
Brush type, brush size, color, opacity
Drag and drop — drag assets from the sidebar onto the page; each drop creates a new independent element that is immediately selectable and editable. Users can click to select, drag to move, use corner handles to resize, rotate with a handle, duplicate, delete and reorder layers. Multi-select is a future enhancement.
Transforming elements — applies to stickers, photos, uploaded images, illustrations and tapes.
• Move anywhere on the page, in front of or behind other elements.
• Resize with corner handles (aspect ratio locked by default, unlockable), type exact dimensions, or restore original size.
• Rotate with a handle, enter an exact angle, or reset to zero.
• Duplicate, copy and paste, delete, lock/unlock, change opacity and layer order.
Digital pen — standard pen, pencil, marker, highlighter and eraser, with adjustable size, color, opacity and thickness. Freehand, continuous strokes, erasing, undo/redo, and drawing over or under decorations. Supports mouse and stylus, with pressure sensitivity where available. Strokes are saved as permanent page content.
Text tool — text boxes behave as independent objects: edit, change font, size, color, alignment, line and letter spacing, bold/italic, resize, rotate and reposition. Font categories: handwriting, typewriter, serif, sans-serif, decorative. Text is placed freely, not in a document layout.
Backgrounds and paper — plain white, cream, grid, lined, dotted, vintage, kraft, floral, and custom uploads. Changing a background never deletes page content.
Layers — bring to front, send to back, forward, backward, lock/unlock. Stacking order is fully user-controlled. A typical order, bottom to top: background, decorative paper, photographs, handwritten notes, washi tapes, stickers, typed text.
Undo/redo — covers adding, deleting, moving, resizing, rotating, cropping, property changes, text edits, drawing and erasing strokes, and layer changes.
Auto-save — changes save automatically with visible saving and saved status, clear handling of network failures, and unsaved changes preserved locally. Users should never need to save manually.
4.2 Image editing and cropping
Available in both the Sticker Studio and the Journal Editor, so users can cut photos into shapes, extract objects and build scrapbook compositions.
Three selection and crop tools
1. Normal crop: rectangular crop with draggable handles, movable selection, locked or free aspect ratio, and apply/cancel. Ratios: freeform, 1:1, 4:5, 3:4, 16:9 and original.
2. Freeform lasso: click and hold to draw around an area; the path closes automatically on release. Includes selection preview, refinement where practical, clear, invert, apply and cancel.
3. Polygon lasso: click to place anchor points joined by straight lines; close by clicking the start point or double-clicking. Includes undo of the last point, cancel, apply, clear and invert. Suited to geometric objects and clearly defined edges.
Selection operations
• Crop to selection: remove everything outside the selection and keep transparency outside the shape where appropriate.
• Isolate selection: extract the selected part as a separate image with a transparent surround, which can be saved as a new sticker.
• Delete selected area: make the selected part transparent and keep the rest.
• Invert selection: swap selected and unselected areas.
All destructive operations must support undo and redo.
Non-destructive cropping — original uploads are never changed by default. The product distinguishes the original image, the edited result and each placed instance on a page. Example: a user places a flower photo on a page, isolates one flower with the polygon lasso, and the flower becomes its own transparent element while the original photo stays untouched. The user can also save the flower as a reusable sticker.
Contextual image toolbar — shown only when an image or sticker is selected: move/select, normal crop, lasso, polygon lasso, resize, rotate, flip horizontal, flip vertical, undo, redo. Text elements show text controls instead.
Crop mode — cropping is a separate mode so users don't crop by accident while moving an image. Click to select, drag to move, use corner handles to resize and the rotation handle to rotate. Double-click or choose Crop to enter crop mode, pick a tool, then apply or cancel. Escape exits the current mode. Crop mode must show a clear visual cue that the crop boundary, not the object, is being edited.
4.3 Personal asset library
A central collection of everything users create or upload: stickers, washi tapes, backgrounds, paper textures, photographs, uploaded images and extracted image elements.
• Search, filter by category, rename, delete, preview, organize into collections, and reuse across notebooks.
• Asset independence: the library keeps original assets separate from their placements. Each placement has its own position, size, rotation, opacity, crop and layer. Changing one placement never affects others, and editing a library asset must not unexpectedly change existing journal pages.
5. User Interface and Visual Direction
The app should feel warm, playful, personal and artistic, like a mix of a scrapbook, a stationery shop, a digital notebook and a creative workspace. It should not look like a corporate productivity dashboard, and the focus stays on the notebook pages and creative materials.
Suggested design elements: paper-like backgrounds and subtle textures, soft warm shadows, rounded stationery-style controls, decorative illustrations, handwritten headings for select titles, vintage scrapbook accents, torn-paper edges and layered paper effects. The interface must stay readable and functional despite the decoration.
Color palette (centralized as design tokens) — the design system replaces the original pastel suggestion. Full rules, contrast pairings and tokens are in design system/claude.md.
Name
Hex
La Salle Green (brand, structure and text)
#007633
Golden Yellow (highlights)
#FFDD00
Light Yellow (page and surfaces)
#FFFCE1
Jasper (accent, destructive and warning only)
#D84040
Ink (typed text and pen on pages)
#2E2A26
Typography — readable sans-serif for interface elements, serif for editorial headings, handwriting fonts for decorative accents. Decorative fonts should not be used for small labels or essential instructions. Until final typefaces are chosen, Nunito Sans, Fraunces and Caveat are used as stand-ins (see design system/claude.md).
Main pages
Page
What it shows
Dashboard
Welcome message, recently opened notebooks, all notebooks, create-notebook action, recently created stickers and washi tapes
Notebooks
Every notebook in one grid with search and sort (the "Notebooks" item in the navigation), plus the create-notebook action
Notebook workspace
Cover, title, page thumbnails, add-page button, open-editor action
Sticker Studio
Image upload and preview, crop tools, background removal, die-cut border and shadow customization, save action
Washi Tape Studio
Pattern selection, color customization, tape dimensions, edge styles, texture preview, save action
Journal Editor
Main canvas, left asset sidebar, top toolbar, right properties panel, contextual image toolbar
Asset Library
All user-created and uploaded assets
6. Key Editor Behavior and Quality Requirements
Editor behavior
• Object independence: every placed object is independent. Placing the same sticker five times creates five separate instances, and changing one instance's position, size or crop never affects the others.
• Selection and transformation: selected objects show a bounding box and handles for movement, resizing, rotation, cropping, layer changes and deletion.
• Undo and redo: all significant editing operations are reversible.
• Exact restoration: a saved page reopens exactly as it was, including element positions, dimensions, rotation, layer order, opacity, crop settings, text formatting, drawing strokes and background settings.
Performance
• The editor stays responsive during normal editing, including on pages with many objects.
• Drawing feels smooth and lag-free.
• Auto-save never interrupts the workflow.
• Uploads show loading feedback, and large images are optimized for previews.
• Image processing never freezes the editor.
Reliability
• Journal content survives page refreshes.
• Failed saves are clearly communicated.
• Interrupted connections don't immediately discard unsaved changes.
• Image editing operations are recoverable through undo and redo.
Security and privacy — users can only access their own notebooks and assets; uploaded files are validated; sign-in is handled securely.
Usability
• Controls are intuitive and common actions are easy to reach.
• Editing modes are visually distinguishable, and crop mode never interferes with normal object movement.
• Decorative UI must never get in the way of actual editing.
7. Roadmap, Future Features and Final Objective
The product is built in seven phases, one at a time. The first milestone is a working editor prototype with sample assets, before any persistent saving is added.
Phase
Goal
Key features
Expected outcome
1. Foundation
Establish the app structure
Accounts, dashboard, notebook creation and listing, page creation, basic navigation
Users can create accounts, notebooks and multiple pages
2. Basic journal editor
Make pages editable
Fixed-size canvas, zoom, selection, drag and drop, move/resize/rotate, text tool, basic layers, undo/redo
Pages with text and image elements
3. Image manipulation and cropping
Let users freely reshape images
Image uploads, normal crop, freeform and polygon lasso, selection operations, transparent extraction, flip, undo/redo for crops
Users crop photos into shapes and arrange them
4. Sticker creator
Reusable stickers
Transparent PNG support, background removal, die-cut outline, shadow, sticker library, drag into pages
Users create and reuse their own stickers
5. Washi tape creator
Reusable decorative tapes
Built-in colors and patterns, image uploads, dimensions, edge styles, pattern scaling, tape library
Users create custom tapes and use them across notebooks
6. Drawing tools
Handwriting and drawing
Pen, pencil, marker, highlighter, eraser, brush customization, drawing persistence, mouse and stylus
Users draw and write directly on pages
7. Enhanced experience
Feel like a complete junk journal
Page-turning animations, two-page spread, more textures and decorative assets, advanced typography, themes, page/notebook/PDF export, tablet support
A polished, complete journaling experience
Future features (optional, must not interfere with the MVP)
• AI-generated sticker designs and washi tape patterns
• Automatic background removal
• Handwriting-to-text conversion
• Custom font uploads
• Shared notebooks and public journal galleries
• Community asset marketplace and downloadable sticker packs
• Printable journal layouts and journal templates
• Animated stickers and custom notebook covers
• Mobile and tablet optimized editing
Final product objective
Users should be able to create multiple notebooks; design their own die-cut stickers and washi tapes; upload photos and decorative images; crop with rectangular, freeform lasso and polygon lasso tools; turn extracted image elements into reusable stickers; drag, resize, rotate and reposition assets; write, draw and type on pages; arrange elements in layers; and save and revisit their pages.
The product prioritizes creative freedom, asset reusability, non-destructive editing and an enjoyable scrapbook-inspired interface. It should feel less like a note-taking app and more like an entire physical junk journaling studio inside a digital notebook.