import { Navigate, createBrowserRouter, redirect } from 'react-router'
import type { RouteObject } from 'react-router'
import { AccountSettingsScreen, CreateAccountScreen, ForgotPasswordScreen, ResetPasswordScreen, SignInScreen } from '../features/account/AccountScreens'
import { DashboardScreen } from '../features/dashboard/DashboardScreen'
import { StickerLibraryScreen } from '../features/sticker-studio/StickerStudioScreens'
import { TapeLibraryScreen } from '../features/washi-tape-studio/WashiStudioScreens'
import { NotFoundScreen } from '../features/system/NotFoundScreen'
import { GuestOnly, RequireAuth, RootLayout } from './layouts'
import type { RouteHandle } from './layouts'
import {
  DevComponentsRoute,
  DevIndex,
  DevScreenRoute,
  EditorRoute,
  LibraryRoute,
  NewNotebookRoute,
  NotebookListRoute,
  NotebookRoute,
  PageOverviewRoute,
  RouteError,
  StickerStudioRoute,
  WashiStudioRoute,
} from './routeScreens'
import { paths } from './paths'

const title = (t: string): RouteHandle => ({ title: t })

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'dev',
        handle: title('Dev'),
        children: [
          { index: true, Component: DevIndex },
          { path: 'screens/:screenId', Component: DevScreenRoute, handle: title('Screen preview') },
          { path: 'components', Component: DevComponentsRoute, handle: title('Component gallery') },
        ],
      },
    ]
  : []

/**
 * App routes (design system/screens.md numbers in comments).
 * Created once at module level, as React Router recommends.
 */
export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RouteError,
    children: [
      // 1 · Account — signed-out only
      {
        Component: GuestOnly,
        children: [
          { path: 'sign-in', Component: SignInScreen, handle: title('Sign in') }, // 1.1
          { path: 'sign-up', Component: CreateAccountScreen, handle: title('Create account') }, // 1.2
          { path: 'forgot-password', Component: ForgotPasswordScreen, handle: title('Forgot password') }, // 1.3
        ],
      },
      // 1.4 opened from the email link, signed in or not
      { path: 'reset-password/:token', Component: ResetPasswordScreen, handle: title('Reset password') },

      // Everything else needs a signed-in user
      {
        Component: RequireAuth,
        children: [
          { index: true, element: <Navigate to={paths.dashboard} replace /> },
          { path: 'dashboard', Component: DashboardScreen, handle: title('Dashboard') }, // 2.1 / 2.2
          { path: 'account', Component: AccountSettingsScreen, handle: title('Account settings') }, // 1.5

          // 3 · Notebooks + 4 · Editor
          {
            path: 'notebooks',
            children: [
              { index: true, Component: NotebookListRoute, handle: title('Notebooks') },
              { path: 'new', Component: NewNotebookRoute, handle: title('New notebook') }, // 3.1
              {
                // 3.2 workspace; /settings opens the drawer (3.4) without remounting the page
                path: ':notebookId',
                Component: NotebookRoute,
                handle: title('Notebook'),
                children: [{ path: 'settings', handle: title('Notebook settings') }],
              },
              { path: ':notebookId/pages', Component: PageOverviewRoute, handle: title('All pages') }, // 3.3
              { path: ':notebookId/pages/:pageNumber', Component: EditorRoute, handle: title('Editor') }, // 4.x
            ],
          },

          // 5 · Sticker Studio
          {
            path: 'stickers',
            children: [
              { index: true, Component: StickerLibraryScreen, handle: title('Sticker library') }, // 5.6
              { path: 'new', loader: () => redirect(paths.stickerStudio('upload')) },
              { path: 'new/:step', Component: StickerStudioRoute, handle: title('Sticker Studio') }, // 5.1–5.5
            ],
          },

          // 6 · Washi Tape Studio
          {
            path: 'washi-tapes',
            children: [
              { index: true, Component: TapeLibraryScreen, handle: title('Tape library') }, // 6.6
              { path: 'new', loader: () => redirect(paths.washiStudio('method')) },
              { path: 'new/:step', Component: WashiStudioRoute, handle: title('Washi Tape Studio') }, // 6.1–6.5
            ],
          },

          // 7 · Asset Library — one mounted screen; child URLs only change the collection / open asset
          {
            path: 'library',
            Component: LibraryRoute,
            handle: title('Asset Library'),
            children: [
              { index: true },
              { path: 'collections/:collectionId', handle: title('Collection') }, // 7.3
              { path: 'assets/:assetId', handle: title('Asset') }, // 7.4
            ],
          },

          // 8.5 Not found (signed in)
          { path: '*', Component: NotFoundScreen, handle: title('Not found') },
        ],
      },

      ...devRoutes,
    ],
  },
])
