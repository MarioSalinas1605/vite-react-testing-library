import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { fetchPokemons } from '../api/pokemon.api.js'
import { PokemonProvider, usePokemon } from './pokemon.context.jsx'

vi.mock('../api/pokemon.api.js', () => ({ fetchPokemons: vi.fn() }))

const bulbasaur = { id: 1, name: 'bulbasaur', imageUrl: 'https://example.test/1.png' }

function Consumer() {
  const { pokemons, status, error, loadPokemons } = usePokemon()
  return (
    <div>
      <p>status: {status}</p>
      <p>error: {error ?? 'none'}</p>
      <p>names: {pokemons.map((pokemon) => pokemon.name).join(',')}</p>
      <button type="button" onClick={loadPokemons}>
        load
      </button>
    </div>
  )
}

function renderConsumer() {
  return render(
    <PokemonProvider>
      <Consumer />
    </PokemonProvider>,
  )
}

afterEach(() => {
  vi.resetAllMocks()
})

describe('PokemonProvider', () => {
  it('starts idle with no pokemon', () => {
    renderConsumer()

    expect(screen.getByText('status: idle')).toBeTruthy()
    expect(screen.getByText('names:')).toBeTruthy()
  })

  it('moves to success and exposes the loaded pokemon', async () => {
    fetchPokemons.mockResolvedValue([bulbasaur])
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load' }))

    await waitFor(() => expect(screen.getByText('status: success')).toBeTruthy())
    expect(screen.getByText('names: bulbasaur')).toBeTruthy()
    expect(fetchPokemons).toHaveBeenCalledTimes(1)
  })

  it('moves to error and exposes the message when the api throws', async () => {
    fetchPokemons.mockRejectedValue(new Error('Request failed: 500 Server Error'))
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load' }))

    await waitFor(() => expect(screen.getByText('status: error')).toBeTruthy())
    expect(screen.getByText('error: Request failed: 500 Server Error')).toBeTruthy()
  })
})

describe('usePokemon', () => {
  it('throws when used outside a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Consumer />)).toThrow(
      'usePokemon must be used within a PokemonProvider',
    )

    consoleError.mockRestore()
  })
})
