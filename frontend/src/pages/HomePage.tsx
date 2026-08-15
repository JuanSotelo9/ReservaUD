import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero-section">
        <h1>Reserva de recursos universitarios</h1>
        <p>
          Reserva laboratorios, aulas, tabletas y más, de forma rápida y
          sencilla.
        </p>
        {isAuthenticated ? (
          <Link to="/recursos" className="btn btn-primary">
            Ver recursos
          </Link>
        ) : (
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="btn btn-secondary">
              Registrarse
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
