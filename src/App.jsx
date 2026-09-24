import PokemonPage from './pages/PokemonPage.jsx'
import { PokemonProvider } from './store/pokemon.context.jsx'

function App() {
  return (
    <PokemonProvider>
      <PokemonPage />
    </PokemonProvider>
  )
}

export default App
