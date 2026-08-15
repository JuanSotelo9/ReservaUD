import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { calificarReserva } from '../hooks/useReservas'
import { errorMessage } from '../utils/formatters'
import { StarRating } from '../components/ui/StarRating'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'

export function CalificarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [calificacion, setCalificacion] = useState(0)
  const [mensaje, setMensaje] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [enviando, setEnviando] = useState(false)

  const handleEnviar = async () => {
    if (!id || calificacion === 0) {
      setMensaje({ text: 'Selecciona una calificación de 1 a 5.', type: 'error' })
      return
    }
    setEnviando(true)
    setMensaje(null)
    try {
      await calificarReserva(id, calificacion)
      setMensaje({ text: 'Reserva calificada correctamente.', type: 'success' })
      setTimeout(() => navigate('/cuenta'), 1200)
    } catch (err) {
      setMensaje({ text: errorMessage(err), type: 'error' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page">
      <h1>Calificar reserva</h1>
      <div className="card form calificar-form">
        <p>¿Cómo calificarías la experiencia con este recurso?</p>
        <StarRating value={calificacion} onChange={setCalificacion} />
        <Button onClick={handleEnviar} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar calificación'}
        </Button>
        <Toast message={mensaje?.text ?? null} type={mensaje?.type} />
      </div>
    </div>
  )
}
