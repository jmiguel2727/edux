import React, { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "/src/assets/logo_edux_dark.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest(".user-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <header 
      className="d-flex align-items-center justify-content-between p-3 w-100"
      style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" }}>

      {/* Logo */}
      <div className="ms-5">
        <Link to="/destaques">
          <img src={logo} alt="Edux Logo" className="rounded-circle" style={{ width: "75px", height: "auto" }} />
        </Link>
      </div>

      {/* Menu de navegação */}
      <div className="d-flex align-items-center gap-3 ms-5 me-5">
        <Link to="/destaques" className="text-dark text-decoration-none fw-medium">Destaques</Link>
        <Link to="#" className="text-dark text-decoration-none fw-medium">Categorias</Link>

        {/* Ícone do utilizador */}
        <div className="position-relative user-menu">
          <CiUser size={30} className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />

          {/* Dropdown do utilizador */}
          {isOpen && (
            <div className="position-absolute bg-dark text-white rounded shadow" style={{ top: "40px", right: "0", width: "150px", zIndex: 1000, padding: "10px" }}>
              <Link to="/profile" className="d-block text-white text-decoration-none p-2">Perfil</Link>
              <Link to="/subscriptions" className="d-block text-white text-decoration-none p-2">Subscrições</Link>
              <Link to="/sell-course" className="d-block text-white text-decoration-none p-2">Cursos à venda</Link>
              <Link to="/logout" className="d-flex align-items-center gap-2 text-white text-decoration-none p-2">Logout<IoIosLogOut size={20} /></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
