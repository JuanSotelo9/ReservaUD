import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { RecursosPage } from './pages/RecursosPage'
import { ReservarPage } from './pages/ReservarPage'
import { MiCuentaPage } from './pages/MiCuentaPage'
import { CalificarPage } from './pages/CalificarPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminRecursosPage } from './pages/admin/AdminRecursosPage'
import { AdminTiposPage } from './pages/admin/AdminTiposPage'
import { AdminDisponibilidadesPage } from './pages/admin/AdminDisponibilidadesPage'
import { AdminReservasPage } from './pages/admin/AdminReservasPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="recursos" element={<RecursosPage />} />
            <Route path="recursos/:id/reservar" element={<ReservarPage />} />
            <Route path="cuenta" element={<MiCuentaPage />} />
            <Route path="reservas/:id/calificar" element={<CalificarPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="recursos" element={<AdminRecursosPage />} />
              <Route path="tipos" element={<AdminTiposPage />} />
              <Route path="disponibilidades" element={<AdminDisponibilidadesPage />} />
              <Route path="reservas" element={<AdminReservasPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
