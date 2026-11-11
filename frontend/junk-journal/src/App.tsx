import { RouterProvider } from 'react-router/dom'
import { ToastProvider } from './components'
import { AuthProvider } from './routes/AuthProvider'
import { router } from './routes/router'

/** App root: auth state and toasts wrap the router (routes live in src/routes/router.tsx). */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
