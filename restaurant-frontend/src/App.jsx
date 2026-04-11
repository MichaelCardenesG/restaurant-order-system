import { Routes, Route } from 'react-router-dom';
import Cocina from "./pages/Cocina";
import Mesa from './pages/Mesa';
import Camarero from './pages/Camarero';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
      <Routes>
          <Route path ="/cocina" element={<Cocina />} />
          <Route path ="/mesa" element={<Mesa />} />
           <Route path="/camarero" element={<Camarero />} />
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/admin" element={<Admin />} />
      </Routes>
      )
}

export default App;