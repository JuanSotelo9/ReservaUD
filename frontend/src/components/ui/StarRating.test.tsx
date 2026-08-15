import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  it('llama onChange con el valor al hacer clic en una estrella', () => {
    const onChange = vi.fn()
    render(<StarRating value={0} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: '3 estrellas' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('resalta tantas estrellas como indique el valor', () => {
    const { container } = render(<StarRating value={4} onChange={() => {}} />)

    const activas = container.querySelectorAll('.star-active')
    expect(activas).toHaveLength(4)
  })

  it('cambia de valor correctamente al seleccionar otra estrella', () => {
    const onChange = vi.fn()
    const { rerender } = render(<StarRating value={2} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: '5 estrellas' }))
    expect(onChange).toHaveBeenCalledWith(5)

    rerender(<StarRating value={5} onChange={onChange} />)
    const activas = document.querySelectorAll('.star-active')
    expect(activas).toHaveLength(5)
  })
})
