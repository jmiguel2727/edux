import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Destaques from "./pages/Destaques";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home: Página principal  */}
        <Route path="/" element={<Home />} />

        {/* Registo */}
        <Route path="/register" element={<Register />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Destaques */}
        <Route path="/destaques" element={<Destaques />} />

        {/* Logout protegido: só acessível a utilizadores autenticados */}
        <Route path="/logout" element={<Wrapper> <Logout /> </Wrapper>} />

        {/* Profile protegido */}
        <Route path="/profile" element={ <Wrapper> <Profile /> </Wrapper>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
