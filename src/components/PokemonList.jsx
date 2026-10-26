import { Link } from 'react-router'
import PokemonCard from './PokemonCard.jsx'

function PokemonList({ pokemons }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <Link
            to={`/pokemon/${pokemon.name}`}
            className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <PokemonCard id={pokemon.id} name={pokemon.name} imageUrl={pokemon.imageUrl} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
