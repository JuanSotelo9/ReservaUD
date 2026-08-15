import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecursosPage } from './RecursosPage'

vi.mock('../hooks/useRecursos', () => ({
  useRecursos: () => ({
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 5,
    },
    isLoading: false,
    isError: false,
  }),
  useTipos: () => ({ data: [] }),
}))

function renderRecursos() {
  return render(
    <MemoryRouter>
      <RecursosPage />
    </MemoryRouter>,
  )
}

describe('RecursosPage', () => {
  it('muestra el mensaje de lista vacía cuando no hay recursos', () => {
    renderRecursos()

    expect(screen.getByText('No hay recursos que coincidan.')).toBeInTheDocument()
  })

  it('muestra el título de la página', () => {
    renderRecursos()

    expect(screen.getByRole('heading', { name: 'Recursos' })).toBeInTheDocument()
  })

  it('muestra el selector de tipo con la opción "Todos los tipos"', () => {
    renderRecursos()

    expect(
      screen.getByRole('option', { name: 'Todos los tipos' }),
    ).toBeInTheDocument()
  })
})
