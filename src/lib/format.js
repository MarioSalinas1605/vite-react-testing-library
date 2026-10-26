export function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatPokedexNumber(id) {
  return `#${String(id).padStart(3, '0')}`
}

// PokeAPI slugs are kebab-case: 'special-attack' -> 'Special Attack'.
export function formatSlug(value) {
  if (!value) return ''
  return value.split('-').map(capitalize).join(' ')
}
