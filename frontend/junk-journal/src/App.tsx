import { useState } from 'react'
import { ToastProvider } from './components'
import { ComponentGallery } from './gallery/ComponentGallery'
import { SCREENS } from './features/screenCatalog'
import { ScreenPicker } from './features/ScreenPicker'

/**
 * Temporary shell: shows one screen at a time, chosen with the picker.
 * React Router replaces this in the routing step.
 */
function App() {
  // ?screen=4.2 opens a screen directly (dev convenience for screenshots).
  const [current, setCurrent] = useState(() => new URLSearchParams(window.location.search).get('screen') ?? '2.1')
  const screen = SCREENS.find((s) => s.id === current)
  return (
    <ToastProvider>
      <div key={current}>{screen ? screen.render() : <ComponentGallery />}</div>
      <ScreenPicker screens={SCREENS} value={current} onChange={setCurrent} />
    </ToastProvider>
  )
}

export default App
