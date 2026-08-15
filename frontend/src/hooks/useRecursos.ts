import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import type { Page, Recurso, TipoRecurso } from '../types'

export function useRecursos(page: number, size: number) {
  return useQuery({
    queryKey: ['recursos', page, size],
    queryFn: async () => {
      const { data } = await api.get<Page<Recurso>>('/recursos', {
        params: { page, size },
      })
      return data
    },
  })
}

export function useRecurso(id: number | null) {
  return useQuery({
    queryKey: ['recurso', id],
    queryFn: async () => {
      const { data } = await api.get<Recurso>(`/recursos/${id}`)
      return data
    },
    enabled: id !== null,
  })
}

export function useTipos() {
  return useQuery({
    queryKey: ['tipos'],
    queryFn: async () => {
      const { data } = await api.get<Page<TipoRecurso>>('/tipos', {
        params: { size: 100 },
      })
      return data.content
    },
  })
}
