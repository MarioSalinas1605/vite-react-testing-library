import { render, screen } from '@testing-library/react'
import PokemonList from './PokemonList.jsx'

const pokemons = [
  { id: 1, name: 'bulbasaur', imageUrl: 'https://example.test/1.png' },
  { id: 2, name: 'ivysaur', imageUrl: 'https://example.test/2.png' },
  { id: 3, name: 'venusaur', imageUrl: 'https://example.test/3.png' },
]

describe('PokemonList', () => {
  it('renders one list item per pokemon', () => {
    render(<PokemonList pokemons={pokemons} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders each pokemon name in order', () => {
    render(<PokemonList pokemons={pokemons} />)

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headings).toEqual(['Bulbasaur', 'Ivysaur', 'Venusaur'])
  })

  it('renders an empty list when there are no pokemon', () => {
    render(<PokemonList pokemons={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByRole('list')).toBeTruthy()
  })
})
