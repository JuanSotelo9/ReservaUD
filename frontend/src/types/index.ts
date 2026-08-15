export type EstadoReserva = 'reservado' | 'en progreso' | 'finalizado' | 'cancelado'

export interface AuthResponse {
  response: string
  id: number | null
}

export interface Recurso {
  id: number
  nombre: string
  descripcion: string
  idTipoRecurso: number
  nombreTipoRecurso: string
  calificacionPromedio: number
  caracteristicas: string[]
}

export interface TipoRecurso {
  id: number
  nombre: string
  descripcion: string
  imagen: string
}

export interface Reserva {
  id: string
  horaInicio: string
  horaFinal: string
  fecha: string
  estado: EstadoReserva
  idUsuario: number
  idRecurso: number
  calificacion: number
}

export interface Usuario {
  id: number
  nombre: string
  usuario: string
  email: string
  historial: Reserva[]
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ErrorResponse {
  message: string
  status: number
}
