import { fetchPokemons } from './pokemon.api.js'

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
