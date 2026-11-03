import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import { ROUTES } from './config/routes'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {ROUTES.map((r) => (
          <Route key={r.key} path={r.path} element={<r.component />} />
        ))}
      </Route>
    </Routes>
  )
}