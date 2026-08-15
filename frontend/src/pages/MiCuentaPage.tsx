import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useUsuario, cancelarReserva } from '../hooks/useReservas'
import { errorMessage, formatCalificacion, formatFecha, formatHora, estadoClass, estadoLabel } from '../utils/formatters'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { Button } from '../components/ui/Button'
import type { Column } from '../components/ui/DataTable'
import type { Reserva } from '../types'

export function MiCuentaPage() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: usuario, isLoading, isError } = useUsuario(userId)

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ['usuario', userId] })
  }

  const handleCancelar = async (id: string) => {
    try {
      await cancelarReserva(id)
    } catch (err) {
      alert(errorMessage(err))
    } finally {
      refrescar()
    }
  }

  const columns: Column<Reserva>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'fecha', header: 'Fecha', render: (r) => formatFecha(r.fecha) },
    { key: 'inicio', header: 'Inicio', render: (r) => formatHora(r.horaInicio) },
    { key: 'fin', header: 'Fin', render: (r) => formatHora(r.horaFinal) },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => (
        <span className={`badge ${estadoClass(r.estado)}`}>
          {estadoLabel(r.estado)}
        </span>
      ),
    },
    {
      key: 'calificacion',
      header: 'Calificación',
      render: (r) => formatCalificacion(r.calificacion),
    },
    {
      key: 'acciones',
      header: '',
      render: (r) => {
        if (r.estado === 'reservado') {
          return (
            <Button variant="danger" onClick={() => handleCancelar(r.id)}>
              Cancelar
            </Button>
          )
        }
        if (r.estado === 'finalizado' && r.calificacion === 0) {
          return (
            <Button onClick={() => navigate(`/reservas/${r.id}/calificar`)}>
              Calificar
            </Button>
          )
        }
        return null
      },
    },
  ]

  if (isLoading) return <Spinner />
  if (isError || !usuario) {
    return <p className="empty-message">No se pudo cargar tu cuenta.</p>
  }

  return (
    <div className="page">
      <h1>Mi cuenta</h1>
      <Card className="profile">
        <p>
          <strong>Nombre:</strong> {usuario.nombre}
        </p>
        <p>
          <strong>Usuario:</strong> {usuario.usuario}
        </p>
        <p>
          <strong>Email:</strong> {usuario.email}
        </p>
      </Card>

      <h2>Historial de reservas</h2>
      <Card>
        <DataTable
          columns={columns}
          data={usuario.historial}
          keyField={(r) => r.id}
          emptyMessage="No tienes reservas."
        />
      </Card>
    </div>
  )
}
