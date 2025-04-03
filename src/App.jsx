import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Destaques from "./pages/Destaques";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import Subscriptions from "./pages/Subscriptions";
import AdminCourse from "./pages/AdminCourse";
import CreateCourse from "./pages/CreateCourse";
import Wrapper from "./components/Wrapper";
import Logout from "./components/Logout";

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
        <Route path="/about" element={<Wrapper><About /> </Wrapper>} />
        <Route path="/terms" element={<Wrapper><Terms /> </Wrapper>} />
        <Route path="/subscriptions" element={<Wrapper><Subscriptions /> </Wrapper>} />
        <Route path="/create-course" element={<Wrapper><CreateCourse /> </Wrapper>} />

        {/* Páginas exclusivas de administração */}
        <Route path="/admin" element={<Wrapper><Admin /></Wrapper>} />
        <Route path="/admin/users" element={<Wrapper><AdminUsers /></Wrapper>} />
        <Route path="/admin/course" element={<Wrapper><AdminCourse /></Wrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
