import { useNavigate } from 'react-router'
import type { NavKey } from '../../components'
import { useAuth } from '../../hooks/useAuth'
import { paths } from '../../routes/paths'
import { currentUser, currentUserName } from '../../services/mockData'

const NAV_PATHS: Record<NavKey, string> = {
  dashboard: paths.dashboard,
  notebooks: paths.notebooks,
  stickers: paths.stickerStudio('upload'),
  washi: paths.washiStudio('method'),
  library: paths.library,
}

/** NavRail props (user + navigation) shared by AppPage and the studio shells. */
export function useShellNav() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  return {
    user: { name: currentUserName, initials: currentUser.initials },
    onNavigate: (key: NavKey) => navigate(NAV_PATHS[key]),
    onAccountSettings: () => navigate(paths.account),
    onSignOut: async () => {
      await signOut()
      navigate(paths.signIn, { replace: true })
    },
  }
}
