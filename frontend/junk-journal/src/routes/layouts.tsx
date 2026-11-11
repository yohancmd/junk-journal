import { useEffect } from 'react'
import { Navigate, Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { paths } from './paths'

export interface RouteHandle {
  /** Page title shown in the browser tab: "<title> · Junk Journal". */
  title?: string
}

/** Root layout: keeps the document title in sync and restores scroll on navigation. */
export function RootLayout() {
  const matches = useMatches()
  const title = [...matches].reverse().map((m) => (m.handle as RouteHandle | undefined)?.title).find(Boolean)

  useEffect(() => {
    document.title = title ? `${title} · Junk Journal` : 'Junk Journal'
  }, [title])

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

/** Only for signed-in users. Others go to sign-in, remembering where they were headed. */
export function RequireAuth() {
  const { signedIn } = useAuth()
  const location = useLocation()
  if (!signedIn) return <Navigate to={paths.signIn} replace state={{ from: location }} />
  return <Outlet />
}

/**
 * Sign-in / sign-up pages. Once signed in, users go back to the page RequireAuth
 * redirected them from (location.state.from), or to the dashboard.
 * This guard owns that redirect so it wins the race with the sign-in screen.
 */
export function GuestOnly() {
  const { signedIn } = useAuth()
  const location = useLocation()
  if (signedIn) {
    const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from
    return <Navigate to={from ? `${from.pathname}${from.search ?? ''}` : paths.dashboard} replace />
  }
  return <Outlet />
}
