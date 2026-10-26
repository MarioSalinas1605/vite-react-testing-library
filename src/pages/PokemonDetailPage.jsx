import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import PokemonDetail from '../components/PokemonDetail.jsx'
import { usePokemonDetail } from '../store/pokemon-detail.context.jsx'

function PokemonDetailPage() {
  const { name } = useParams()
  const { pokemon, status, error, loadPokemon } = usePokemonDetail()

  useEffect(() => {
    loadPokemon(name)
  }, [name, loadPokemon])

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link to="/" className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900">
        ← Back to Pokédex
      </Link>

      {(status === 'idle' || status === 'loading') && (
        <p role="status" className="text-slate-500">
          Loading Pokémon…
        </p>
      )}

      {status === 'not-found' && (
        <p role="alert" className="text-slate-700">
          No Pokémon named “{name}”.
        </p>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-red-600">
            {error}
          </p>
          <button
            type="button"
            onClick={() => loadPokemon(name)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      )}

      {status === 'success' && <PokemonDetail {...pokemon} />}
    </main>
  )
}

export default PokemonDetailPage
