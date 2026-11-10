import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ROUTES } from './config/routes'
import AppLayout from './layout/AppLayout'

function Protected() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <AppLayout />
}

function PublicWithLayout() {
  return <AppLayout />
}

export default function App() {
  const barePublic = ROUTES.filter((r) => r.public && !r.withLayout)
  const publicWithLayout = ROUTES.filter((r) => r.public && r.withLayout)
  const privateRoutes = ROUTES.filter((r) => !r.public)

  return (
    <AuthProvider>
      <Routes>
        {barePublic.map((r) => (
          <Route key={r.key} path={r.path} element={<r.component />} />
        ))}

        <Route element={<PublicWithLayout />}>
          {publicWithLayout.map((r) => (
            <Route key={r.key} path={r.path} element={<r.component />} />
          ))}
        </Route>

        <Route element={<Protected />}>
          {privateRoutes.map((r) => (
            <Route key={r.key} path={r.path} element={<r.component />} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}