import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import PokemonList from './PokemonList.jsx'

const pokemons = [
  { id: 1, name: 'bulbasaur', imageUrl: 'https://example.test/1.png' },
  { id: 2, name: 'ivysaur', imageUrl: 'https://example.test/2.png' },
  { id: 3, name: 'venusaur', imageUrl: 'https://example.test/3.png' },
]

function renderList(pokemons) {
  return render(<PokemonList pokemons={pokemons} />, { wrapper: MemoryRouter })
}

describe('PokemonList', () => {
  it('renders one list item per pokemon', () => {
    renderList(pokemons)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders each pokemon name in order', () => {
    renderList(pokemons)

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headings).toEqual(['Bulbasaur', 'Ivysaur', 'Venusaur'])
  })

  it('renders an empty list when there are no pokemon', () => {
    renderList([])

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByRole('list')).toBeTruthy()
  })

  it('links each pokemon to its detail route', () => {
    renderList(pokemons)

    const link = screen.getByRole('link', { name: /ivysaur/i })
    expect(link.getAttribute('href')).toBe('/pokemon/ivysaur')
  })
})
