import type { ReactNode } from 'react'
import { AppShell } from '../../components'
import type { NavKey } from '../../components'
import { currentUser, currentUserName } from '../../services/mockData'

/**
 * AppShell with the signed-in user. Navigation handlers are no-ops for now;
 * they will be wired to React Router in the routing step.
 */
export function AppPage({ active, children }: { active?: NavKey; children: ReactNode }) {
  const noop = () => {}
  return (
    <AppShell
      active={active}
      onNavigate={noop}
      user={{ name: currentUserName, initials: currentUser.initials }}
      onAccountSettings={noop}
      onShortcuts={noop}
      onHelp={noop}
      onSignOut={noop}
    >
      {children}
    </AppShell>
  )
}
