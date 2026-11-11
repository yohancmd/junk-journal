import { ToastProvider } from './components'
import { ComponentGallery } from './gallery/ComponentGallery'

/** Temporary: renders the component gallery until real screens exist. */
function App() {
  return (
    <ToastProvider>
      <ComponentGallery />
    </ToastProvider>
  )
}

export default App
