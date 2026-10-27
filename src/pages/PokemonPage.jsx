import { useEffect } from 'react'
import PokemonList from '../components/PokemonList.jsx'
import { usePokemon } from '../store/pokemon.context.jsx'

function PokemonPage() {
  const { pokemons, status, error, loadPokemons } = usePokemon()

  // The provider outlives this page, so coming back from a detail route
  // reuses the list already loaded instead of fetching it again.
  useEffect(() => {
    if (status === 'idle') loadPokemons()
  }, [status, loadPokemons])

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Pokédex Pro</h1>

      {(status === 'idle' || status === 'loading') && (
        <p role="status" className="text-slate-500">
          Loading Pokémon…
        </p>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-red-600">
            {error}
          </p>
          <button
            type="button"
            onClick={loadPokemons}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      )}

      {status === 'success' && <PokemonList pokemons={pokemons} />}
    </main>
  )
}

export default PokemonPage
