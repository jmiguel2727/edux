import React, { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "/src/assets/logo_edux_dark.png";
import supabase from "../helper/supabaseClient";

export default function Header() {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("categoria")
        .neq("categoria", null);

      if (!error && data) {
        const unicas = [...new Set(data.map((c) => c.categoria).filter(Boolean))];
        setCategorias(unicas);
      }
    };

    fetchCategorias();

    const closeDropdowns = (e) => {
      if (!e.target.closest(".user-menu")) setIsUserOpen(false);
      if (!e.target.closest(".category-menu")) setIsCategoryOpen(false);
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  const handleCategorySelect = (categoria) => {
    setIsCategoryOpen(false);
    navigate(`/categoria/${encodeURIComponent(categoria)}`);
  };

  return (
    <header 
      className="d-flex align-items-center justify-content-between p-3 w-100"
      style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" }}>

      <div className="ms-5">
        <Link to="/destaques">
          <img src={logo} alt="Edux Logo" className="rounded-circle" style={{ width: "75px", height: "auto" }} />
        </Link>
      </div>

      <div className="d-flex align-items-center gap-3 ms-5 me-5">
        <Link to="/destaques" className="text-dark text-decoration-none fw-medium">Destaques</Link>

        <div className="position-relative category-menu">
          <span className="text-dark fw-medium cursor-pointer" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
            Categorias
          </span>
          {isCategoryOpen && (
            <div className="position-absolute bg-dark text-white rounded shadow" style={{ top: "30px", left: "0", minWidth: "200px", zIndex: 1000 }}>
              {categorias.length === 0 ? (
                <div className="p-2 text-white">Sem categorias</div>
              ) : (
                categorias.map((cat) => (
                  <div
                    key={cat}
                    className="p-2 text-white text-decoration-none cursor-pointer"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="position-relative user-menu">
          <CiUser size={30} className="cursor-pointer" onClick={() => setIsUserOpen(!isUserOpen)} />
          {isUserOpen && (
            <div className="position-absolute bg-dark text-white rounded shadow" style={{ top: "40px", right: "0", width: "170px", zIndex: 1000, padding: "10px" }}>
              <Link to="/profile" className="d-block text-white text-decoration-none p-2">Perfil</Link>
              <Link to="/subscriptions" className="d-block text-white text-decoration-none p-2">Subscrições</Link>
              <Link to="/sell-course" className="d-block text-white text-decoration-none p-2">Cursos à venda</Link>
              <Link to="/logout" className="d-flex align-items-center gap-2 text-white text-decoration-none p-2">
                Logout <IoIosLogOut size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
