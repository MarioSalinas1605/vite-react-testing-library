# CLAUDE.md

React 19 + Vite 8 playground. JavaScript (`.jsx`), no TypeScript. Tailwind v4 via the Vite plugin. Tests run on Vitest + React Testing Library in jsdom.

## Commands

```bash
bun run dev        # dev server
bun run build      # production build
bun run test       # vitest watch
bun run test:run   # vitest single run (use this in CI / when verifying a change)
bun run lint       # oxlint
```

Vitest config lives in `vite.config.js` (`test.globals: true`, `environment: 'jsdom'`), so `describe` / `it` / `expect` are global — do not import them.

`@testing-library/jest-dom` is **not** installed and there is no setup file. Assert with plain Vitest matchers (`expect(...).toBeTruthy()`, `expect(el.textContent).toBe(...)`), not `toBeInTheDocument()`. If a test needs jest-dom, install it and wire a `setupFiles` entry first — don't assume it exists.

## Architecture: three layers, one direction

Data flows **api → store → view**. Dependencies point the same way and never backwards.

```
src/
  api/          data access layer — talks to the server, nothing else
  store/        global state — React Context providers + their hooks
  components/   view layer — presentational, props in / callbacks out
  pages/        composition — wires store hooks to components
  hooks/        reusable local hooks that are not global state
  lib/          framework-free helpers (formatting, guards, constants)
```

### 1. Data access layer — `src/api/`

Plain async functions. **No React in this folder**: no imports from `react`, no hooks, no components, no context.

- One module per resource: `src/api/users.api.js`, `src/api/orders.api.js`.
- Shared transport lives in `src/api/client.js` — base URL, headers, JSON parsing, error normalization. Every resource module goes through it; never call `fetch` directly from a resource module.
- Functions take plain arguments and return plain domain objects. Map the server's response shape into the app's shape here, so a backend rename never reaches a component.
- Throw a normalized error on failure. Do not return `{ data, error }` tuples and do not swallow errors — the store decides what to do with them.

```js
// src/api/users.api.js
import { request } from './client.js'

export async function fetchUsers() {
  const body = await request('/users')
  return body.items.map(toUser)
}

export function createUser(input) {
  return request('/users', { method: 'POST', body: input })
}
```

### 2. Global store — `src/store/`

Context for now. One context per domain — **no single god context**, since every consumer of a context re-renders when any part of its value changes.

- Each domain gets a file exporting a provider and a hook: `UsersProvider` + `useUsers()` from `src/store/users.context.jsx`.
- The hook throws if used outside its provider. That turns a wiring mistake into a clear test failure instead of `undefined`.
- The store is the **only** layer that calls `src/api/`. It owns loading/error/data state and exposes actions (`loadUsers`, `addUser`), never raw fetch calls.
- Memoize the context value with `useMemo` and actions with `useCallback`.
- Keep derived data out of state — compute it in the hook or the view.
- Do not export the raw `Context` object from the module; export only the provider and the hook, so consumers can't bypass the guard.

```jsx
// src/store/users.context.jsx
const UsersContext = createContext(null)

export function UsersProvider({ children }) {
  const [state, setState] = useState({ users: [], status: 'idle', error: null })

  const loadUsers = useCallback(async () => { /* calls usersApi, sets state */ }, [])

  const value = useMemo(() => ({ ...state, loadUsers }), [state, loadUsers])
  return <UsersContext value={value}>{children}</UsersContext>
}

export function useUsers() {
  const ctx = use(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within a UsersProvider')
  return ctx
}
```

React 19: `<Context>` works as the provider (no `.Provider`) and `use(Context)` reads it. Prefer both.

### 3. View layer — `src/components/`

Presentational only.

- No imports from `src/api/` — ever. That is the rule that keeps this layer testable.
- Prefer no imports from `src/store/` either: receive data and callbacks as props. A component that needs global state is a sign it belongs in `src/pages/`, or that a small container wrapper should sit above it.
- Local UI state (`useState` for an open menu, an input's value) is fine and belongs here.
- Styling is Tailwind utility classes in the markup. `App.css` / `index.css` are template leftovers; don't grow them.

### 4. Composition — `src/pages/`

Where the layers meet. A page calls the store hooks, handles loading/error branches, and renders components with plain props. Providers are mounted here or in `App.jsx`, not inside components.

## When adding a feature

Build bottom-up and stop at each boundary:

1. `src/api/<resource>.api.js` — the request + response mapping.
2. `src/store/<domain>.context.jsx` — state, actions, the api call.
3. `src/components/` — the dumb view, driven by props.
4. `src/pages/` — wire them together, mount the provider.

If a step needs something from a layer above it, the design is wrong — fix the direction rather than adding the import.

## Testing per layer

- **api** — unit tests with `fetch` stubbed via `vi.stubGlobal('fetch', ...)`. Assert the URL, method, body, and the mapped return shape.
- **store** — render the provider with a throwaway consumer component (or a minimal harness), stub the api module with `vi.mock('../api/users.api.js')`, and assert state transitions through actions.
- **components** — render with props only, no providers needed. Query by role and accessible name (`getByRole('button', { name: /save/i })`); fall back to `getByLabelText`, then `getByText`. Avoid `data-testid` and never query by class.
- **pages** — render inside real providers with the api layer mocked. This is the closest thing to an integration test here.

Co-locate tests next to the file under test (`users.api.test.js` beside `users.api.js`), matching the existing `App.test.jsx`.
