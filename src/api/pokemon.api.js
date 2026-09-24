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
