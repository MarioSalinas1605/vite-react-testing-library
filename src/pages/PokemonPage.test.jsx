import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { fetchPokemons } from '../api/pokemon.api.js'
import { PokemonProvider } from '../store/pokemon.context.jsx'
import PokemonPage from './PokemonPage.jsx'

vi.mock('../api/pokemon.api.js', () => ({ fetchPokemons: vi.fn() }))

const pokemons = [
  { id: 1, name: 'bulbasaur', imageUrl: 'https://example.test/1.png' },
  { id: 2, name: 'ivysaur', imageUrl: 'https://example.test/2.png' },
]

function renderPage() {
  return render(
    <PokemonProvider>
      <MemoryRouter>
        <PokemonPage />
      </MemoryRouter>
    </PokemonProvider>,
  )
}

afterEach(() => {
  vi.resetAllMocks()
})

describe('PokemonPage', () => {
  it('shows a loading status before the pokemon arrive', () => {
    fetchPokemons.mockReturnValue(new Promise(() => {}))
    renderPage()

    expect(screen.getByRole('status').textContent).toBe('Loading Pokémon…')
  })

  it('loads the pokemon on mount and renders them', async () => {
    fetchPokemons.mockResolvedValue(pokemons)
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Bulbasaur' })).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByRole('status')).toBe(null)
  })

  it('shows the error message and retries on demand', async () => {
    fetchPokemons.mockRejectedValueOnce(new Error('Request failed: 500 Server Error'))
    renderPage()

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe('Request failed: 500 Server Error')

    fetchPokemons.mockResolvedValueOnce(pokemons)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Ivysaur' })).toBeTruthy()
    expect(screen.queryByRole('alert')).toBe(null)
  })
})
