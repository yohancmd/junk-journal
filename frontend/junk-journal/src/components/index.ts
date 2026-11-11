/**
 * Digital Junk Journal component library.
 * Specs: design system/components.md · Tokens: src/index.css (from design system/claude.md)
 */

// Shared constants & helpers
export { IMAGE_TYPES, PATTERN_OPTIONS, CROP_RATIOS, SIDEBAR_TABS, SHORTCUTS, scorePassword } from './constants'
export type { CropRatio, SidebarTab } from './constants'

// 1. Primitives
export { Button } from './primitives/Button'
export type { ButtonProps, ButtonVariant } from './primitives/Button'
export { IconButton } from './primitives/IconButton'
export type { IconButtonProps } from './primitives/IconButton'
export { TextField, PasswordField, SearchField, SelectField } from './primitives/TextField'
export type { TextFieldProps, SearchFieldProps, SelectFieldProps } from './primitives/TextField'
export {
  Checkbox,
  Toggle,
  Slider,
  NumberField,
  SegmentedControl,
  Tag,
  SwatchGroup,
  KeyCap,
  TextLink,
} from './primitives/Controls'
export type {
  CheckboxProps,
  ToggleProps,
  SliderProps,
  NumberFieldProps,
  SegmentOption,
  SegmentedControlProps,
  TagProps,
  Swatch,
  SwatchGroupProps,
  TextLinkProps,
} from './primitives/Controls'

// 2. Feedback
export { Toast, ToastProvider } from './feedback/Toast'
export { useToast } from './feedback/toastContext'
export type { ToastKind, ToastOptions } from './feedback/toastContext'
export { Banner, Tip, SaveStatusPill, Skeleton, ProgressBar, EmptyState } from './feedback/Feedback'
export type { BannerProps, SaveStatus, SkeletonProps, ProgressBarProps, EmptyStateProps } from './feedback/Feedback'

// 3. Overlays
export { Scrim, Modal, Drawer, ConfirmDialog, Menu, MenuAnchor } from './overlays/Overlays'
export type { ModalProps, DrawerProps, ConfirmDialogProps, MenuItem, MenuProps } from './overlays/Overlays'

// 4. Shell
export { AppShell, NavRail, PageHeader, Stepper, StudioShell } from './shell/Shell'
export type { NavKey, NavUser, NavRailProps, AppShellProps, PageHeaderProps, StepperProps, StudioShellProps } from './shell/Shell'

// 5. Cards
export {
  NotebookCard,
  PageThumbnail,
  AddPageTile,
  DropIndicator,
  TypeBadge,
  AssetCard,
  StickerTile,
  TapeCard,
  CollectionList,
  CollectionHeader,
  FilterBar,
} from './cards/Cards'
export type {
  CoverColor,
  NotebookCardProps,
  PageThumbnailProps,
  AssetType,
  AssetCardProps,
  StickerTileProps,
  TapeCardProps,
  Collection,
  CollectionListProps,
  CollectionHeaderProps,
  Filter,
  FilterBarProps,
} from './cards/Cards'

// 6. Editor
export {
  EditorToolbar,
  ToolbarButton,
  ToolbarDivider,
  AssetSidebar,
  SidebarAsset,
  SidebarAssetGrid,
  CanvasArea,
  Page,
  PageElement,
  SpreadView,
  PropertiesPanel,
  PropHead,
  PropGroup,
  PropRow,
  ElementActions,
  LayerButtons,
  IconToggleRow,
  LayerList,
  PaperSwatch,
  UploadItem,
} from './editor/EditorChrome'
export type {
  EditorToolbarProps,
  ToolbarButtonProps,
  AssetSidebarProps,
  PaperType,
  PageProps,
  PageElementProps,
  LayerMove,
  Layer,
  LayerListProps,
  PaperSwatchProps,
  UploadItemProps,
} from './editor/EditorChrome'
export {
  SelectionBox,
  FloatingToolbar,
  FloatingButton,
  FloatingDivider,
  ImageToolbar,
  TextToolbar,
  CropBar,
  PenRail,
  ModeBanner,
  CropOverlay,
  LassoOverlay,
  PolygonOverlay,
  SelectionActionsMenu,
} from './editor/EditorTools'
export type {
  Handle,
  SelectionBoxProps,
  ImageTool,
  FontOption,
  FontCategory,
  TextStyleValue,
  CropTool,
  PenTool,
  Rect,
} from './editor/EditorTools'
export { ShortcutsModal, ExportModal, RecoveryDialog, SaveAsStickerModal } from './editor/EditorDialogs'
export type { ExportOptions, ExportModalProps, RecoveryDialogProps, SaveAsStickerModalProps } from './editor/EditorDialogs'

// 7. Studio
export { DropZone, Checkerboard, BeforeAfter, DieCutSticker, PatternPicker, MethodCard, DirectionDial } from './studio/Studio'
export type { DropZoneProps, BeforeAfterProps, DieCutStickerProps, StickerShadow, PatternPickerProps, MethodCardProps, DirectionDialProps } from './studio/Studio'
export { WashiTape } from './studio/WashiTape'
export type { WashiTapeProps, TapePattern, TapeEdge } from './studio/WashiTape'

// 8. Auth
export { AuthLayout, AuthForm, PasswordStrength, DangerZone } from './auth/Auth'
export type { AuthLayoutProps, DangerZoneProps } from './auth/Auth'
