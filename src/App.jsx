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
import AdminReports from "./pages/AdminReports";
import CreateCourse from "./pages/CreateCourse";
import SellCourse from "./pages/SellCourse";
import CoursePreview from "./pages/CoursePreview";
import CourseContent from "./pages/CourseContent"; 
import AdminCourseEdit from "./pages/AdminCourseEdit";
import CategoriaCursos from "./pages/CategoriaCursos";
import AdminCourseContent from "./pages/AdminCourseContent";
import Wrapper from "./components/Wrapper";
import Logout from "./components/Logout";
import CourseTest from "./pages/CourseTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Destaques />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />

        {/* Páginas exclusivas de user */}
        <Route path="/destaques" element={<Wrapper><Destaques /></Wrapper>} />
        <Route path="/profile" element={<Wrapper><Profile /></Wrapper>} />
        <Route path="/about" element={<Wrapper><About /> </Wrapper>} />
        <Route path="/terms" element={<Wrapper><Terms /> </Wrapper>} />
        <Route path="/subscriptions" element={<Wrapper><Subscriptions /> </Wrapper>} />
        <Route path="/create-course" element={<Wrapper><CreateCourse /> </Wrapper>} />
        <Route path="/sell-course" element={<Wrapper><SellCourse /> </Wrapper>} />
        <Route path="/curso/:id" element={<Wrapper><CoursePreview /></Wrapper>} />
        <Route path="/curso/:id/conteudo" element={<Wrapper><CourseContent /></Wrapper>} />
        <Route path="/curso/:id/teste/fazer" element={<Wrapper><CourseTest /></Wrapper>} />
        <Route path="/categoria/:nome" element={<Wrapper><CategoriaCursos /></Wrapper>} />

        {/* Páginas exclusivas de administração */}
        <Route path="/admin" element={<Wrapper><Admin /></Wrapper>} />
        <Route path="/admin/users" element={<Wrapper><AdminUsers /></Wrapper>} />
        <Route path="/admin/course" element={<Wrapper><AdminCourse /></Wrapper>} />
        <Route path="/admin/reports" element={<Wrapper><AdminReports /></Wrapper>} />
        <Route path="/admin/course-edit/:id" element={<Wrapper><AdminCourseEdit /></Wrapper>} />
        <Route path="/admin/course-content/:id" element={<Wrapper><AdminCourseContent /></Wrapper>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
