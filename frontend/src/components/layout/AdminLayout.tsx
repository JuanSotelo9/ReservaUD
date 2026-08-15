import { NavLink, Outlet } from 'react-router-dom'

const enlaces = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/recursos', label: 'Recursos' },
  { to: '/admin/tipos', label: 'Tipos' },
  { to: '/admin/disponibilidades', label: 'Disponibilidades' },
  { to: '/admin/reservas', label: 'Reservas' },
]

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        {enlaces.map((e) => (
          <NavLink key={e.to} to={e.to} end={e.end}>
            {e.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
