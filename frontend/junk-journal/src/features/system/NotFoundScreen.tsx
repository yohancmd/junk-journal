import { ArrowLeft, LayoutGrid, Lock } from 'lucide-react'
import { Button } from '../../components'
import { AppPage } from '../shared/AppPage'
import s from '../shared/screens.module.css'

/* ---------- 8.5 Not found / no access ---------- */
export function NotFoundScreen({ variant = 'not-found' }: { variant?: 'not-found' | 'no-access' }) {
  const noAccess = variant === 'no-access'
  return (
    <AppPage>
      <section className={s.emptyFrame} style={{ border: 0 }} aria-labelledby="nf-title">
        <div className={s.stack} style={{ alignItems: 'center', textAlign: 'center' }}>
          <div
            aria-hidden
            style={{ display: 'grid', placeItems: 'center', width: 300, height: 220, background: 'var(--paper-white)', border: '2px solid var(--color-green)', boxShadow: 'var(--shadow-md)', transform: 'rotate(-4deg)', font: '700 96px/1 var(--font-heading)' }}
          >
            {noAccess ? <Lock size={96} /> : '404'}
          </div>
          <p style={{ font: 'var(--text-accent)', fontSize: 32, color: 'var(--accent)' }} aria-hidden>
            {noAccess ? 'this one’s someone else’s' : 'hmm, that page isn’t in your journal'}
          </p>
          <h1 id="nf-title" style={{ font: 'var(--text-h1)' }}>
            {noAccess ? 'This notebook is private' : 'We couldn’t find that page'}
          </h1>
          <p style={{ maxWidth: 480 }}>
            {noAccess
              ? 'Notebooks can only be opened by the person who made them.'
              : 'It may have been deleted, or the link is from someone else’s notebook.'}
          </p>
          <div className={s.row} style={{ justifyContent: 'center' }}>
            <Button variant="primary" icon={LayoutGrid}>Back to dashboard</Button>
            <Button icon={ArrowLeft}>Go back</Button>
          </div>
        </div>
      </section>
    </AppPage>
  )
}
