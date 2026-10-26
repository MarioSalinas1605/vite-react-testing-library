import { render, screen, within } from '@testing-library/react'
import PokemonDetail from './PokemonDetail.jsx'

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.test/1.png',
  heightM: 0.7,
  weightKg: 6.9,
  types: ['grass', 'poison'],
  abilities: ['overgrow', 'chlorophyll'],
  stats: [
    { name: 'hp', value: 45 },
    { name: 'special-attack', value: 65 },
  ],
}

describe('PokemonDetail', () => {
  it('renders the artwork, capitalized name and pokedex number', () => {
    render(<PokemonDetail {...bulbasaur} />)

    expect(screen.getByRole('img', { name: 'bulbasaur' }).getAttribute('src')).toBe(
      'https://example.test/1.png',
    )
    expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeTruthy()
    expect(screen.getByText('#001')).toBeTruthy()
  })

  it('renders the types in order', () => {
    render(<PokemonDetail {...bulbasaur} />)

    const types = within(screen.getByRole('list', { name: 'Types' }))
      .getAllByRole('listitem')
      .map((item) => item.textContent)
    expect(types).toEqual(['Grass', 'Poison'])
  })

  it('renders height and weight with units', () => {
    render(<PokemonDetail {...bulbasaur} />)

    expect(screen.getByText('0.7 m')).toBeTruthy()
    expect(screen.getByText('6.9 kg')).toBeTruthy()
  })

  it('renders abilities and base stats with readable labels', () => {
    render(<PokemonDetail {...bulbasaur} />)

    expect(screen.getByText('Chlorophyll')).toBeTruthy()
    expect(screen.getByText('Special Attack')).toBeTruthy()
    expect(screen.getByText('65')).toBeTruthy()
  })
})
