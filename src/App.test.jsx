import { fireEvent, render, screen } from '@testing-library/react'
import { fetchPokemon, fetchPokemons } from './api/pokemon.api.js'
import App from './App.jsx'

vi.mock('./api/pokemon.api.js', () => ({ fetchPokemons: vi.fn(), fetchPokemon: vi.fn() }))

const pokemons = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `pokemon-${index + 1}`,
  imageUrl: `https://example.test/${index + 1}.png`,
}))

afterEach(() => {
  vi.resetAllMocks()
  window.history.pushState({}, '', '/')
})

describe('App', () => {
  it('renders the page heading', () => {
    fetchPokemons.mockReturnValue(new Promise(() => {}))
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Pokédex', level: 1 })).toBeTruthy()
  })

  it('renders the first 10 pokemon inside the provider', async () => {
    fetchPokemons.mockResolvedValue(pokemons)
    render(<App />)

    expect(await screen.findByRole('list')).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(10)
  })

  it('navigates from the list to a pokemon detail and back', async () => {
    fetchPokemons.mockResolvedValue(pokemons)
    fetchPokemon.mockResolvedValue({
      id: 3,
      name: 'pokemon-3',
      imageUrl: 'https://example.test/3.png',
      heightM: 1,
      weightKg: 10,
      types: ['grass'],
      abilities: ['overgrow'],
      stats: [{ name: 'hp', value: 80 }],
    })
    render(<App />)

    fireEvent.click(await screen.findByRole('link', { name: /pokemon-3/i }))

    expect(await screen.findByText('1 m')).toBeTruthy()
    expect(fetchPokemon).toHaveBeenCalledWith('pokemon-3')
    expect(window.location.pathname).toBe('/pokemon/pokemon-3')

    fireEvent.click(screen.getByRole('link', { name: /back to pokédex/i }))

    expect(await screen.findAllByRole('listitem')).toHaveLength(10)
    expect(fetchPokemons).toHaveBeenCalledTimes(1)
  })
})
