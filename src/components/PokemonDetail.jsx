import { capitalize, formatPokedexNumber, formatSlug } from '../lib/format.js'

// Base stats top out at 255 (Blissey's HP), so bars are scaled against that.
const MAX_STAT = 255

function PokemonDetail({ id, name, imageUrl, heightM, weightKg, types, abilities, stats }) {
  return (
    <article className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
      <div className="flex flex-col items-center gap-2 sm:w-1/2">
        <img src={imageUrl} alt={name} width="240" height="240" className="size-60 object-contain" />
        <span className="font-mono text-sm text-slate-400">{formatPokedexNumber(id)}</span>
        <h2 className="text-2xl font-bold text-slate-900">{capitalize(name)}</h2>
        <ul aria-label="Types" className="flex gap-2">
          {types.map((type) => (
            <li
              key={type}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {formatSlug(type)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6 sm:w-1/2">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Height</dt>
            <dd className="text-lg font-semibold text-slate-800">{heightM} m</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Weight</dt>
            <dd className="text-lg font-semibold text-slate-800">{weightKg} kg</dd>
          </div>
        </dl>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Abilities</h3>
          <ul className="flex flex-wrap gap-2">
            {abilities.map((ability) => (
              <li key={ability} className="text-sm text-slate-700">
                {formatSlug(ability)}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Base stats</h3>
          <dl className="flex flex-col gap-2">
            {stats.map((stat) => (
              <div key={stat.name} className="grid grid-cols-[8rem_2.5rem_1fr] items-center gap-2">
                <dt className="text-sm text-slate-500">{formatSlug(stat.name)}</dt>
                <dd className="text-right font-mono text-sm text-slate-800">{stat.value}</dd>
                <dd aria-hidden="true" className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-700"
                    style={{ width: `${Math.min(stat.value / MAX_STAT, 1) * 100}%` }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  )
}

export default PokemonDetail
