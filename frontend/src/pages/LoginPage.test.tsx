import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { LoginPage } from './LoginPage'

vi.mock('../api/client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { response: 'token', id: 2 } }),
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('muestra errores de validación al enviar el formulario vacío', async () => {
    renderLogin()

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(await screen.findByText('El usuario es requerido')).toBeInTheDocument()
    expect(
      await screen.findByText('La contraseña es requerida'),
    ).toBeInTheDocument()
  })

  it('no muestra errores cuando los campos están completos', async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'user' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(
        screen.queryByText('El usuario es requerido'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('La contraseña es requerida'),
      ).not.toBeInTheDocument()
    })
  })
})
