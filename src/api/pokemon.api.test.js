import { fetchPokemon, fetchPokemons } from './pokemon.api.js'

const listPayload = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
}

function stubFetch(response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchPokemons', () => {
  it('requests the first 10 pokemon by default', async () => {
    const fetchMock = stubFetch({ ok: true, json: async () => listPayload })

    await fetchPokemons()

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://pokeapi.co/api/v2/pokemon?limit=10')
    expect(options.method).toBe('GET')
    expect(options.body).toBe(undefined)
  })

  it('honours an explicit limit', async () => {
    const fetchMock = stubFetch({ ok: true, json: async () => listPayload })

    await fetchPokemons(2)

    expect(fetchMock.mock.calls[0][0]).toBe('https://pokeapi.co/api/v2/pokemon?limit=2')
  })

  it('maps the server shape into the app shape', async () => {
    stubFetch({ ok: true, json: async () => listPayload })

    const pokemons = await fetchPokemons()

    expect(pokemons).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
      {
        id: 2,
        name: 'ivysaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      },
    ])
  })

  it('throws a normalized error on a failed response', async () => {
    stubFetch({ ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) })

    await expect(fetchPokemons()).rejects.toThrow('Request failed: 404 Not Found')
  })
})

const detailPayload = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { other: { 'official-artwork': { front_default: 'https://example.test/art/1.png' } } },
  types: [
    { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
    { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
  ],
  abilities: [
    { is_hidden: false, slot: 1, ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' } },
    { is_hidden: true, slot: 3, ability: { name: 'chlorophyll', url: 'https://pokeapi.co/api/v2/ability/34/' } },
  ],
  stats: [
    { base_stat: 45, effort: 0, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } },
    { base_stat: 49, effort: 0, stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' } },
  ],
}

describe('fetchPokemon', () => {
  it('requests a single pokemon by name', async () => {
    const fetchMock = stubFetch({ ok: true, json: async () => detailPayload })

    await fetchPokemon('bulbasaur')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://pokeapi.co/api/v2/pokemon/bulbasaur')
    expect(options.method).toBe('GET')
  })

  it('maps the server shape into the app shape', async () => {
    stubFetch({ ok: true, json: async () => detailPayload })

    const pokemon = await fetchPokemon('bulbasaur')

    expect(pokemon).toEqual({
      id: 1,
      name: 'bulbasaur',
      imageUrl: 'https://example.test/art/1.png',
      heightM: 0.7,
      weightKg: 6.9,
      types: ['grass', 'poison'],
      abilities: ['overgrow', 'chlorophyll'],
      stats: [
        { name: 'hp', value: 45 },
        { name: 'attack', value: 49 },
      ],
    })
  })

  it('falls back to the artwork url derived from the id', async () => {
    stubFetch({ ok: true, json: async () => ({ ...detailPayload, sprites: {} }) })

    const pokemon = await fetchPokemon('bulbasaur')

    expect(pokemon.imageUrl).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    )
  })

  it('throws a normalized error with the status on a failed response', async () => {
    stubFetch({ ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) })

    await expect(fetchPokemon('missingno')).rejects.toMatchObject({
      message: 'Request failed: 404 Not Found',
      status: 404,
    })
  })
})
