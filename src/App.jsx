import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Destaques from "./pages/Destaques";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Wrapper from "./components/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/destaques" element={<Destaques />} />
        <Route path="/logout" element={<Wrapper><Logout /></Wrapper>} />
        <Route path="/profile" element={<Wrapper><Profile /></Wrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
