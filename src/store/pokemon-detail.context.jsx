import { createContext, use, useCallback, useMemo, useRef, useState } from 'react'
import { fetchPokemon } from '../api/pokemon.api.js'

const PokemonDetailContext = createContext(null)

export function PokemonDetailProvider({ children }) {
  const [state, setState] = useState({ pokemon: null, status: 'idle', error: null })
  // Only the latest request may write state, so a slow response for a
  // previous pokemon can't overwrite the one now on screen.
  const latestRequest = useRef(0)

  const loadPokemon = useCallback(async (name) => {
    const requestId = ++latestRequest.current
    setState({ pokemon: null, status: 'loading', error: null })
    try {
      const pokemon = await fetchPokemon(name)
      if (requestId !== latestRequest.current) return
      setState({ pokemon, status: 'success', error: null })
    } catch (error) {
      if (requestId !== latestRequest.current) return
      setState({
        pokemon: null,
        status: error.status === 404 ? 'not-found' : 'error',
        error: error.message,
      })
    }
  }, [])

  const value = useMemo(() => ({ ...state, loadPokemon }), [state, loadPokemon])

  return <PokemonDetailContext value={value}>{children}</PokemonDetailContext>
}

export function usePokemonDetail() {
  const ctx = use(PokemonDetailContext)
  if (!ctx) throw new Error('usePokemonDetail must be used within a PokemonDetailProvider')
  return ctx
}
