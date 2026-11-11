import { useNavigate } from 'react-router'
import type { MouseEvent } from 'react'

/**
 * Props for a real <a href> that navigates inside the SPA.
 * Modifier clicks (Ctrl/⌘/Shift, middle button) keep the browser's default,
 * so "open in new tab" still works.
 *
 *   <TextLink {...link(paths.signUp)}>Create an account</TextLink>
 */
export function useLinkProps() {
  const navigate = useNavigate()
  return (to: string) => ({
    href: to,
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      navigate(to)
    },
  })
}
