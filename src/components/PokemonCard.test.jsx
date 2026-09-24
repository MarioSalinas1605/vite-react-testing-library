import { render, screen } from '@testing-library/react'
import PokemonCard from './PokemonCard.jsx'

describe('PokemonCard', () => {
  it('renders the artwork with the pokemon name as alt text', () => {
    render(<PokemonCard id={1} name="bulbasaur" imageUrl="https://example.test/1.png" />)

    const image = screen.getByRole('img', { name: 'bulbasaur' })
    expect(image.getAttribute('src')).toBe('https://example.test/1.png')
  })

  it('renders the capitalized name and padded pokedex number', () => {
    render(<PokemonCard id={4} name="charmander" imageUrl="https://example.test/4.png" />)

    expect(screen.getByRole('heading', { name: 'Charmander' })).toBeTruthy()
    expect(screen.getByText('#004')).toBeTruthy()
  })
})
