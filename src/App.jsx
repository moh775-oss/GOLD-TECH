import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ROUTES } from './config/routes'
import AppLayout from './layout/AppLayout'

function Protected() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <AppLayout />
}

export default function App() {
  const publicRoutes = ROUTES.filter((r) => r.public)
  const privateRoutes = ROUTES.filter((r) => !r.public)

  return (
    <NotificationProvider>
      <AuthProvider>
        <Routes>
          {publicRoutes.map((r) => (
            <Route key={r.key} path={r.path} element={<r.component />} />
          ))}
          <Route element={<Protected />}>
            {privateRoutes.map((r) => (
              <Route key={r.key} path={r.path} element={<r.component />} />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </NotificationProvider>
  )
}