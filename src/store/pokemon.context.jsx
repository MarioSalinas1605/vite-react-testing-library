import { createContext, use, useCallback, useMemo, useState } from 'react'
import { fetchPokemons } from '../api/pokemon.api.js'

const PokemonContext = createContext(null)

export function PokemonProvider({ children }) {
  const [state, setState] = useState({ pokemons: [], status: 'idle', error: null })

  const loadPokemons = useCallback(async () => {
    setState((current) => ({ ...current, status: 'loading', error: null }))
    try {
      const pokemons = await fetchPokemons()
      setState({ pokemons, status: 'success', error: null })
    } catch (error) {
      setState({ pokemons: [], status: 'error', error: error.message })
    }
  }, [])

  const value = useMemo(() => ({ ...state, loadPokemons }), [state, loadPokemons])

  return <PokemonContext value={value}>{children}</PokemonContext>
}

export function usePokemon() {
  const ctx = use(PokemonContext)
  if (!ctx) throw new Error('usePokemon must be used within a PokemonProvider')
  return ctx
}
