import { request } from './client.js'

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

function toPokemon({ name, url }) {
  const id = Number(url.match(/\/(\d+)\/?$/)[1])
  return { id, name, imageUrl: `${ARTWORK_BASE_URL}/${id}.png` }
}

export async function fetchPokemons(limit = 10) {
  const body = await request(`/pokemon?limit=${limit}`)
  return body.results.map(toPokemon)
}

// PokeAPI reports height in decimetres and weight in hectograms.
function toPokemonDetail(body) {
  return {
    id: body.id,
    name: body.name,
    imageUrl:
      body.sprites?.other?.['official-artwork']?.front_default ?? `${ARTWORK_BASE_URL}/${body.id}.png`,
    heightM: body.height / 10,
    weightKg: body.weight / 10,
    types: body.types.map(({ type }) => type.name),
    abilities: body.abilities.map(({ ability }) => ability.name),
    stats: body.stats.map(({ stat, base_stat }) => ({ name: stat.name, value: base_stat })),
  }
}

export async function fetchPokemon(name) {
  const body = await request(`/pokemon/${encodeURIComponent(name)}`)
  return toPokemonDetail(body)
}
