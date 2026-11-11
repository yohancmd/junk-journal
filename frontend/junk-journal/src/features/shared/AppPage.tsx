import type { ReactNode } from 'react'
import { AppShell } from '../../components'
import type { NavKey } from '../../components'
import { useShellNav } from './useShellNav'

/** AppShell with the signed-in user and router-backed navigation. */
export function AppPage({ active, children }: { active?: NavKey; children: ReactNode }) {
  const nav = useShellNav()
  return (
    <AppShell active={active} {...nav}>
      {children}
    </AppShell>
  )
}
