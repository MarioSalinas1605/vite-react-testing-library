import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { fetchPokemon } from '../api/pokemon.api.js'
import { PokemonDetailProvider, usePokemonDetail } from './pokemon-detail.context.jsx'

vi.mock('../api/pokemon.api.js', () => ({ fetchPokemon: vi.fn() }))

const bulbasaur = { id: 1, name: 'bulbasaur' }
const ivysaur = { id: 2, name: 'ivysaur' }

function Consumer() {
  const { pokemon, status, error, loadPokemon } = usePokemonDetail()
  return (
    <div>
      <p>status: {status}</p>
      <p>error: {error ?? 'none'}</p>
      <p>name: {pokemon?.name ?? 'none'}</p>
      <button type="button" onClick={() => loadPokemon('bulbasaur')}>
        load bulbasaur
      </button>
      <button type="button" onClick={() => loadPokemon('ivysaur')}>
        load ivysaur
      </button>
    </div>
  )
}

function renderConsumer() {
  return render(
    <PokemonDetailProvider>
      <Consumer />
    </PokemonDetailProvider>,
  )
}

function deferred() {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

afterEach(() => {
  vi.resetAllMocks()
})

describe('PokemonDetailProvider', () => {
  it('starts idle with no pokemon', () => {
    renderConsumer()

    expect(screen.getByText('status: idle')).toBeTruthy()
    expect(screen.getByText('name: none')).toBeTruthy()
  })

  it('moves through loading to success and exposes the pokemon', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur)
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load bulbasaur' }))

    expect(screen.getByText('status: loading')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('status: success')).toBeTruthy())
    expect(screen.getByText('name: bulbasaur')).toBeTruthy()
    expect(fetchPokemon).toHaveBeenCalledWith('bulbasaur')
  })

  it('moves to not-found when the api responds 404', async () => {
    fetchPokemon.mockRejectedValue(
      Object.assign(new Error('Request failed: 404 Not Found'), { status: 404 }),
    )
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load bulbasaur' }))

    await waitFor(() => expect(screen.getByText('status: not-found')).toBeTruthy())
  })

  it('moves to error and exposes the message on any other failure', async () => {
    fetchPokemon.mockRejectedValue(
      Object.assign(new Error('Request failed: 500 Server Error'), { status: 500 }),
    )
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load bulbasaur' }))

    await waitFor(() => expect(screen.getByText('status: error')).toBeTruthy())
    expect(screen.getByText('error: Request failed: 500 Server Error')).toBeTruthy()
  })

  it('ignores a stale response that resolves after a newer request', async () => {
    const slow = deferred()
    fetchPokemon.mockReturnValueOnce(slow.promise).mockResolvedValueOnce(ivysaur)
    renderConsumer()

    fireEvent.click(screen.getByRole('button', { name: 'load bulbasaur' }))
    fireEvent.click(screen.getByRole('button', { name: 'load ivysaur' }))
    await waitFor(() => expect(screen.getByText('name: ivysaur')).toBeTruthy())

    slow.resolve(bulbasaur)
    await slow.promise

    expect(screen.getByText('name: ivysaur')).toBeTruthy()
  })
})

describe('usePokemonDetail', () => {
  it('throws when used outside a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Consumer />)).toThrow(
      'usePokemonDetail must be used within a PokemonDetailProvider',
    )

    consoleError.mockRestore()
  })
})
