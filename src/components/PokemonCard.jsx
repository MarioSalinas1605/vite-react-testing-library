import { capitalize, formatPokedexNumber } from '../lib/format.js'

function PokemonCard({ id, name, imageUrl }) {
  return (
    <article className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <img src={imageUrl} alt={name} width="96" height="96" className="size-24 object-contain" />
      <span className="font-mono text-xs text-slate-400">{formatPokedexNumber(id)}</span>
      <h2 className="text-base font-semibold text-slate-800">{capitalize(name)}</h2>
    </article>
  )
}

export default PokemonCard
