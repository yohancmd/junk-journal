import type { ReactNode } from 'react'
import { AccountSettingsScreen, CreateAccountScreen, ForgotPasswordScreen, ResetPasswordScreen, SignInScreen } from './account/AccountScreens'
import { DashboardScreen } from './dashboard/DashboardScreen'
import { NotebookWorkspaceScreen, PageOverviewScreen } from './notebook-management/NotebookScreens'
import { JournalEditorScreen } from './journal-editor/JournalEditorScreen'
import { StickerLibraryScreen, StickerStudioScreen } from './sticker-studio/StickerStudioScreens'
import { TapeLibraryScreen, WashiStudioScreen } from './washi-tape-studio/WashiStudioScreens'
import { AssetLibraryScreen } from './asset-library/AssetLibraryScreen'
import { NotFoundScreen } from './system/NotFoundScreen'

export interface ScreenEntry {
  /** Number from design system/screens.md; a letter suffix marks an extra state. */
  id: string
  area: string
  title: string
  render: () => ReactNode
}

/**
 * Every screen and state from design system/screens.md.
 * Temporary: the router (next step) will replace this catalogue with real routes.
 */
export const SCREENS: ScreenEntry[] = [
  { id: '1.1', area: 'Account', title: 'Sign in', render: () => <SignInScreen /> },
  { id: '1.1b', area: 'Account', title: 'Sign in · wrong credentials', render: () => <SignInScreen wrongCredentials /> },
  { id: '1.2', area: 'Account', title: 'Create account · email taken', render: () => <CreateAccountScreen emailTaken /> },
  { id: '1.3', area: 'Account', title: 'Forgot password', render: () => <ForgotPasswordScreen /> },
  { id: '1.3b', area: 'Account', title: 'Forgot password · check your inbox', render: () => <ForgotPasswordScreen sent /> },
  { id: '1.4', area: 'Account', title: 'Reset password', render: () => <ResetPasswordScreen /> },
  { id: '1.4b', area: 'Account', title: 'Reset password · link expired', render: () => <ResetPasswordScreen expired /> },
  { id: '1.5', area: 'Account', title: 'Account settings', render: () => <AccountSettingsScreen /> },

  { id: '2.1', area: 'Dashboard', title: 'Dashboard', render: () => <DashboardScreen /> },
  { id: '2.2', area: 'Dashboard', title: 'Dashboard · first time', render: () => <DashboardScreen state="empty" /> },

  { id: '3.1', area: 'Notebooks', title: 'Create notebook', render: () => <DashboardScreen overlay="create" /> },
  { id: '3.1b', area: 'Notebooks', title: 'Create notebook · title missing', render: () => <DashboardScreen overlay="create-error" /> },
  { id: '3.2', area: 'Notebooks', title: 'Notebook workspace', render: () => <NotebookWorkspaceScreen /> },
  { id: '3.3', area: 'Notebooks', title: 'Page overview', render: () => <PageOverviewScreen /> },
  { id: '3.3b', area: 'Notebooks', title: 'Page overview · reordering', render: () => <PageOverviewScreen reordering /> },
  { id: '3.4', area: 'Notebooks', title: 'Notebook settings', render: () => <NotebookWorkspaceScreen overlay="settings" /> },
  { id: '3.5', area: 'Notebooks', title: 'Delete notebook', render: () => <DashboardScreen overlay="delete" /> },
  { id: '3.6', area: 'Notebooks', title: 'Delete page', render: () => <PageOverviewScreen deletePage={3} /> },

  { id: '4.1', area: 'Editor', title: 'Nothing selected', render: () => <JournalEditorScreen mode="nothing" /> },
  { id: '4.1b', area: 'Editor', title: 'Empty page', render: () => <JournalEditorScreen mode="empty" /> },
  { id: '4.2', area: 'Editor', title: 'Image selected', render: () => <JournalEditorScreen mode="image" /> },
  { id: '4.3', area: 'Editor', title: 'Washi tape selected', render: () => <JournalEditorScreen mode="washi" /> },
  { id: '4.4', area: 'Editor', title: 'Text editing', render: () => <JournalEditorScreen mode="text" /> },
  { id: '4.5', area: 'Editor', title: 'Drawing mode', render: () => <JournalEditorScreen mode="drawing" /> },
  { id: '4.6', area: 'Editor', title: 'Crop mode · normal crop', render: () => <JournalEditorScreen mode="crop" /> },
  { id: '4.7', area: 'Editor', title: 'Crop mode · freeform lasso', render: () => <JournalEditorScreen mode="lasso" /> },
  { id: '4.8', area: 'Editor', title: 'Crop mode · polygon lasso', render: () => <JournalEditorScreen mode="polygon" /> },
  { id: '4.9', area: 'Editor', title: 'Selection actions', render: () => <JournalEditorScreen mode="selection-actions" /> },
  { id: '4.10', area: 'Editor', title: 'Save as sticker', render: () => <JournalEditorScreen mode="save-sticker" /> },
  { id: '4.11', area: 'Editor', title: 'Background & paper picker', render: () => <JournalEditorScreen mode="backgrounds" /> },
  { id: '4.12', area: 'Editor', title: 'Layers panel', render: () => <JournalEditorScreen mode="layers" /> },
  { id: '4.13', area: 'Editor', title: 'Image upload in progress', render: () => <JournalEditorScreen mode="uploading" /> },
  { id: '4.14', area: 'Editor', title: 'Save status · offline', render: () => <JournalEditorScreen saveStatus="offline" /> },
  { id: '4.14b', area: 'Editor', title: 'Save status · failed', render: () => <JournalEditorScreen saveStatus="failed" /> },
  { id: '4.15', area: 'Editor', title: 'Export', render: () => <JournalEditorScreen mode="export" /> },
  { id: '4.16', area: 'Editor', title: 'Two-page spread', render: () => <JournalEditorScreen mode="spread" /> },
  { id: '4.17', area: 'Editor', title: 'Keyboard shortcuts', render: () => <JournalEditorScreen mode="shortcuts" /> },

  { id: '5.1', area: 'Sticker Studio', title: 'Upload', render: () => <StickerStudioScreen step={0} /> },
  { id: '5.2', area: 'Sticker Studio', title: 'Remove background', render: () => <StickerStudioScreen step={1} /> },
  { id: '5.3', area: 'Sticker Studio', title: 'Crop & select', render: () => <StickerStudioScreen step={2} /> },
  { id: '5.4', area: 'Sticker Studio', title: 'Die-cut & shadow', render: () => <StickerStudioScreen step={3} /> },
  { id: '5.5', area: 'Sticker Studio', title: 'Preview & save', render: () => <StickerStudioScreen step={4} /> },
  { id: '5.5b', area: 'Sticker Studio', title: 'Saved', render: () => <StickerStudioScreen step={4} saved /> },
  { id: '5.6', area: 'Sticker Studio', title: 'Sticker library', render: () => <StickerLibraryScreen /> },
  { id: '5.6b', area: 'Sticker Studio', title: 'Sticker library · empty', render: () => <StickerLibraryScreen state="empty" /> },
  { id: '5.6c', area: 'Sticker Studio', title: 'Sticker library · no results', render: () => <StickerLibraryScreen state="no-results" /> },

  { id: '6.1', area: 'Washi Studio', title: 'Choose method', render: () => <WashiStudioScreen step={0} /> },
  { id: '6.2', area: 'Washi Studio', title: 'Pattern creator', render: () => <WashiStudioScreen step={1} /> },
  { id: '6.3', area: 'Washi Studio', title: 'Upload pattern', render: () => <WashiStudioScreen step={1} method="upload" /> },
  { id: '6.4', area: 'Washi Studio', title: 'Customise & preview', render: () => <WashiStudioScreen step={2} /> },
  { id: '6.5', area: 'Washi Studio', title: 'Save tape', render: () => <WashiStudioScreen step={3} /> },
  { id: '6.6', area: 'Washi Studio', title: 'Tape library', render: () => <TapeLibraryScreen /> },
  { id: '6.6b', area: 'Washi Studio', title: 'Tape library · empty', render: () => <TapeLibraryScreen state="empty" /> },

  { id: '7.1', area: 'Asset Library', title: 'All assets', render: () => <AssetLibraryScreen /> },
  { id: '7.2', area: 'Asset Library', title: 'Filtered / search results', render: () => <AssetLibraryScreen view="filtered" /> },
  { id: '7.2b', area: 'Asset Library', title: 'No results', render: () => <AssetLibraryScreen view="no-results" /> },
  { id: '7.3', area: 'Asset Library', title: 'Collection view', render: () => <AssetLibraryScreen collectionId="japan" /> },
  { id: '7.4', area: 'Asset Library', title: 'Asset detail', render: () => <AssetLibraryScreen assetId="as-temple" /> },
  { id: '7.5', area: 'Asset Library', title: 'Rename & move to collection', render: () => <AssetLibraryScreen overlay="rename" /> },
  { id: '7.6', area: 'Asset Library', title: 'Delete asset', render: () => <AssetLibraryScreen overlay="delete" /> },

  { id: '8.3', area: 'System', title: 'Loading & skeletons', render: () => <DashboardScreen state="loading" /> },
  { id: '8.5', area: 'System', title: 'Not found', render: () => <NotFoundScreen /> },
  { id: '8.5b', area: 'System', title: 'No access', render: () => <NotFoundScreen variant="no-access" /> },
  { id: '8.6', area: 'System', title: 'Unsaved-changes recovery', render: () => <JournalEditorScreen mode="recovery" /> },
]
