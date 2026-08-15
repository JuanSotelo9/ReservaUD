export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const PAGE_SIZE = 5

export const ESTADOS_RESERVA = {
  reservado: 'Reservado',
  'en progreso': 'En progreso',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
} as const
