import { Routes, Route } from 'react-router-dom';
import Cocina from "./pages/Cocina";
import Mesa from './pages/Mesa';

function App() {
  return (
      <Routes>
          <Route path ="/cocina" element={<Cocina />} />
          <Route path ="/mesa" element={<Mesa />} />
      </Routes>
      )
}

export default App;