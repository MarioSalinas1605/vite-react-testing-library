import { fireEvent, render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Get started' })).toBeTruthy()
  })

  it('increments the counter on click', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /count is 0/i }))
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeTruthy()
  })
})
