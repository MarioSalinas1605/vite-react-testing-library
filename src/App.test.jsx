import { render, screen } from '@testing-library/react'
import { fetchPokemons } from './api/pokemon.api.js'
import App from './App.jsx'

vi.mock('./api/pokemon.api.js', () => ({ fetchPokemons: vi.fn() }))

const pokemons = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `pokemon-${index + 1}`,
  imageUrl: `https://example.test/${index + 1}.png`,
}))

afterEach(() => {
  vi.resetAllMocks()
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
})
