import PokemonCard from './PokemonCard.jsx'

function PokemonList({ pokemons }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCard id={pokemon.id} name={pokemon.name} imageUrl={pokemon.imageUrl} />
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
