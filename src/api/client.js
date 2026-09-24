const BASE_URL = 'https://pokeapi.co/api/v2'

export async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...rest,
  })

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status} ${response.statusText}`)
    error.status = response.status
    throw error
  }

  return response.json()
}
