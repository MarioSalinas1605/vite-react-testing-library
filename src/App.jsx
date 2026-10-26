import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import PokemonDetailPage from './pages/PokemonDetailPage.jsx'
import PokemonPage from './pages/PokemonPage.jsx'
import { PokemonDetailProvider } from './store/pokemon-detail.context.jsx'
import { PokemonProvider } from './store/pokemon.context.jsx'

function App() {
  return (
    <PokemonProvider>
      <PokemonDetailProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<PokemonPage />} />
            <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PokemonDetailProvider>
    </PokemonProvider>
  )
}

export default App
