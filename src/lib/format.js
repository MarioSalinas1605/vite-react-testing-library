export function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatPokedexNumber(id) {
  return `#${String(id).padStart(3, '0')}`
}
