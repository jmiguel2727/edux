import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Destaques from "./pages/Destaques";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Sobre from "./pages/Sobre";
import Termos from "./pages/Termos";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminCursos from "./pages/AdminCursos";
import Wrapper from "./components/Wrapper"; // Unificado

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Páginas protegidas (user ou admin) */}
        <Route path="/destaques" element={<Wrapper><Destaques /></Wrapper>} />
        <Route path="/profile" element={<Wrapper><Profile /></Wrapper>} />
        <Route path="/sobre" element={<Wrapper><Sobre /> </Wrapper>} />
        <Route path="/termos" element={<Wrapper><Termos /> </Wrapper>} />

        {/* Páginas exclusivas de administração */}
        <Route path="/admin" element={<Wrapper><Admin /></Wrapper>} />
        <Route path="/admin/users" element={<Wrapper><AdminUsers /></Wrapper>} />
        <Route path="/admin/cursos" element={<Wrapper><AdminCursos /></Wrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
