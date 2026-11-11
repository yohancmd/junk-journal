import { useId } from 'react'
import type { ScreenEntry } from './screenCatalog'

/**
 * Temporary dev control for browsing screens before routing exists.
 * Remove when React Router is added.
 */
export function ScreenPicker({ screens, value, onChange }: { screens: ScreenEntry[]; value: string; onChange: (id: string) => void }) {
  const id = useId()
  const areas = Array.from(new Set(screens.map((s) => s.area)))
  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        border: '2px solid var(--color-green)',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-cream)',
        boxShadow: 'var(--shadow-lg)',
        font: 'var(--text-label)',
      }}
    >
      <label htmlFor={id}>Screen</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={{ font: 'var(--text-small)', color: 'var(--color-green)', background: 'transparent', border: 0 }}>
        <option value="gallery">Component gallery</option>
        {areas.map((area) => (
          <optgroup key={area} label={area}>
            {screens
              .filter((s) => s.area === area)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.title}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
