import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ReservaUD
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/recursos">Recursos</NavLink>
            <NavLink to="/cuenta">Mi cuenta</NavLink>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <NavLink to="/registro">Registrarse</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}
