/**
 * Mock authentication (first milestone: no backend yet).
 * Replace with Axios calls to POST /api/auth/login/, /logout/ and GET /api/auth/me/
 * (claude/technical-claude.md §6). Screens never call this directly; they use useAuth().
 */
const KEY = 'jj.signedIn'

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function write(value: boolean) {
  try {
    if (value) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    /* storage blocked: stay signed in for this tab only */
  }
}

export const authService = {
  isSignedIn: read,
  async signIn(): Promise<void> {
    write(true)
  },
  async signOut(): Promise<void> {
    write(false)
  },
}
