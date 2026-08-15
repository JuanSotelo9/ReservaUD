import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecurso } from '../hooks/useRecursos'
import {
  consultarDisponibilidad,
  crearReserva,
} from '../hooks/useReservas'
import { generarHoras } from '../utils/formatters'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'

export function ReservarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const recursoId = id ? Number(id) : null

  const { data: recurso, isLoading } = useRecurso(recursoId)

  const [dia, setDia] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFinal, setHoraFinal] = useState('')
  const [disponible, setDisponible] = useState<boolean | null>(null)
  const [mensaje, setMensaje] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [consultando, setConsultando] = useState(false)
  const [reservando, setReservando] = useState(false)

  const horasInicio = generarHoras(6, 19)
  const horasFinal = horaInicio
    ? generarHoras(Number(horaInicio.slice(0, 2)) + 1, 20)
    : []

  const handleConsultar = async () => {
    if (!recursoId || !dia || !horaInicio || !horaFinal) {
      setMensaje({ text: 'Selecciona fecha y horario.', type: 'error' })
      return
    }
    setConsultando(true)
    setMensaje(null)
    try {
      const ok = await consultarDisponibilidad(
        dia,
        horaInicio,
        horaFinal,
        recursoId,
      )
      setDisponible(ok)
      setMensaje(
        ok
          ? { text: 'El recurso está disponible.', type: 'success' }
          : { text: 'El recurso no está disponible en ese horario.', type: 'error' },
      )
    } catch {
      setMensaje({ text: 'No se pudo consultar la disponibilidad.', type: 'error' })
    } finally {
      setConsultando(false)
    }
  }

  const handleReservar = async () => {
    if (!recursoId) return
    setReservando(true)
    setMensaje(null)
    try {
      await crearReserva({
        horaInicio,
        horaFinal,
        dia,
        idRecurso: recursoId,
      })
      navigate('/cuenta')
    } catch {
      setMensaje({
        text: 'No se pudo realizar la reserva. El recurso puede haberse reservado.',
        type: 'error',
      })
      setDisponible(null)
    } finally {
      setReservando(false)
    }
  }

  if (isLoading) return <Spinner />
  if (!recurso) {
    return <p className="empty-message">Recurso no encontrado.</p>
  }

  return (
    <div className="page">
      <h1>Reservar {recurso.nombre}</h1>
      <p>{recurso.descripcion}</p>
      <p className="muted">
        Tipo: {recurso.nombreTipoRecurso} · Calificación:{' '}
        {recurso.calificacionPromedio || '—'}
      </p>

      <div className="card form reserva-form">
        <label className="field">
          Fecha
          <input
            type="date"
            value={dia}
            onChange={(e) => {
              setDia(e.target.value)
              setDisponible(null)
            }}
          />
        </label>
        <label className="field">
          Hora de inicio
          <select
            value={horaInicio}
            onChange={(e) => {
              setHoraInicio(e.target.value)
              setHoraFinal('')
              setDisponible(null)
            }}
          >
            <option value="">Seleccionar</option>
            {horasInicio.map((h) => (
              <option key={h} value={h}>
                {h.slice(0, 5)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Hora de finalización
          <select
            value={horaFinal}
            onChange={(e) => {
              setHoraFinal(e.target.value)
              setDisponible(null)
            }}
            disabled={!horaInicio}
          >
            <option value="">Seleccionar</option>
            {horasFinal.map((h) => (
              <option key={h} value={h}>
                {h.slice(0, 5)}
              </option>
            ))}
          </select>
        </label>

        <Button onClick={handleConsultar} disabled={consultando}>
          {consultando ? 'Consultando…' : 'Consultar disponibilidad'}
        </Button>

        {disponible && (
          <Button onClick={handleReservar} disabled={reservando}>
            {reservando ? 'Reservando…' : 'Reservar'}
          </Button>
        )}

        <Toast message={mensaje?.text ?? null} type={mensaje?.type} />
      </div>
    </div>
  )
}
