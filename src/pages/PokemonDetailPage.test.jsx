import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { fetchPokemon } from '../api/pokemon.api.js'
import { PokemonDetailProvider } from '../store/pokemon-detail.context.jsx'
import PokemonDetailPage from './PokemonDetailPage.jsx'

vi.mock('../api/pokemon.api.js', () => ({ fetchPokemon: vi.fn() }))

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.test/1.png',
  heightM: 0.7,
  weightKg: 6.9,
  types: ['grass', 'poison'],
  abilities: ['overgrow'],
  stats: [{ name: 'hp', value: 45 }],
}

function renderPage(path = '/pokemon/bulbasaur') {
  return render(
    <PokemonDetailProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
        </Routes>
      </MemoryRouter>
    </PokemonDetailProvider>,
  )
}

afterEach(() => {
  vi.resetAllMocks()
})

describe('PokemonDetailPage', () => {
  it('shows a loading status before the pokemon arrives', () => {
    fetchPokemon.mockReturnValue(new Promise(() => {}))
    renderPage()

    expect(screen.getByRole('status').textContent).toBe('Loading Pokémon…')
  })

  it('loads the pokemon named in the url and renders it', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur)
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Bulbasaur' })).toBeTruthy()
    expect(fetchPokemon).toHaveBeenCalledWith('bulbasaur')
    expect(screen.queryByRole('status')).toBe(null)
  })

  it('links back to the list', () => {
    fetchPokemon.mockReturnValue(new Promise(() => {}))
    renderPage()

    expect(screen.getByRole('link', { name: /back to pokédex/i }).getAttribute('href')).toBe('/')
  })

  it('shows a not-found message for an unknown pokemon', async () => {
    fetchPokemon.mockRejectedValue(
      Object.assign(new Error('Request failed: 404 Not Found'), { status: 404 }),
    )
    renderPage('/pokemon/missingno')

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe('No Pokémon named “missingno”.')
    expect(screen.queryByRole('button', { name: 'Try again' })).toBe(null)
  })

  it('shows the error message and retries on demand', async () => {
    fetchPokemon.mockRejectedValueOnce(
      Object.assign(new Error('Request failed: 500 Server Error'), { status: 500 }),
    )
    renderPage()

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe('Request failed: 500 Server Error')

    fetchPokemon.mockResolvedValueOnce(bulbasaur)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Bulbasaur' })).toBeTruthy()
    expect(screen.queryByRole('alert')).toBe(null)
  })
})
