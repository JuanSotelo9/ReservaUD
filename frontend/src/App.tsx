import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { RecursosPage } from './pages/RecursosPage'
import { ReservarPage } from './pages/ReservarPage'
import { MiCuentaPage } from './pages/MiCuentaPage'
import { CalificarPage } from './pages/CalificarPage'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
