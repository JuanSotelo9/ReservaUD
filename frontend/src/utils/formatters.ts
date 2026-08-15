import type { EstadoReserva } from '../types'

export function formatFecha(iso: string): string {
  if (!iso) return '-'
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}

export function formatHora(hora: string): string {
  if (!hora) return '-'
  return hora.slice(0, 5)
}

export function formatCalificacion(calificacion: number): string {
  if (!calificacion) return 'Sin calificar'
  return `${calificacion} / 5`
}

const ETIQUETAS: Record<EstadoReserva, string> = {
  reservado: 'Reservado',
  'en progreso': 'En progreso',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
}

export function estadoLabel(estado: EstadoReserva): string {
  return ETIQUETAS[estado] ?? estado
}

export function estadoClass(estado: EstadoReserva): string {
  return `badge-${estado.replace(' ', '-')}`
}

export function generarHoras(inicio: number, fin: number): string[] {
  const horas: string[] = []
  for (let h = inicio; h < fin; h += 1) {
    horas.push(`${String(h).padStart(2, '0')}:00:00`)
  }
  return horas
}

export function errorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    const { data } = error.response
    return (data as { message: string }).message
  }
  return 'Error inesperado'
}
