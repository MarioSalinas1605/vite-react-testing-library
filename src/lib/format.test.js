import { capitalize, formatPokedexNumber, formatSlug } from './format.js'

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur')
  })

  it('returns an empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('formatPokedexNumber', () => {
  it('pads to three digits', () => {
    expect(formatPokedexNumber(1)).toBe('#001')
    expect(formatPokedexNumber(25)).toBe('#025')
    expect(formatPokedexNumber(151)).toBe('#151')
  })

  it('does not truncate longer ids', () => {
    expect(formatPokedexNumber(1025)).toBe('#1025')
  })
})

describe('formatSlug', () => {
  it('turns a kebab-case slug into title case words', () => {
    expect(formatSlug('special-attack')).toBe('Special Attack')
    expect(formatSlug('hp')).toBe('Hp')
  })

  it('returns an empty string for empty input', () => {
    expect(formatSlug('')).toBe('')
  })
})
