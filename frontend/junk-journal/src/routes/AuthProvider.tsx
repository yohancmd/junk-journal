import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { authService } from '../services/authService'

/** Holds the signed-in state for the route guards and screens. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(authService.isSignedIn)

  const signIn = useCallback(async () => {
    await authService.signIn()
    setSignedIn(true)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setSignedIn(false)
  }, [])

  const value = useMemo(() => ({ signedIn, signIn, signOut }), [signedIn, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
