import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "/src/assets/logo_edux.png";

export default function Header() {
  return (
    <header 
      className="d-flex align-items-center justify-content-between p-3 w-100 fixed-top" 
      style={{ backgroundColor: '#FAFFD5' }}
    >
      {/* Logo */}
      <div className="ms-5">
        <img 
          src={logo} 
          alt="Edux Logo" 
          className="rounded-circle" 
          style={{ width: '90px', height: 'auto' }} 
        />
      </div>
      
      {/* Menu de navegação */}
      <div className="d-flex align-items-center gap-3 ms-5 me-5">
        {/* Exemplos de links (por enquanto '#' só como placeholders) */}
        <a href="#" className="text-dark text-decoration-none fw-medium">Destaques</a>
        <a href="#" className="text-dark text-decoration-none fw-medium">Categorias</a>
        <Link to="/logout" className="text-dark text-decoration-none fw-medium">Logout</Link>

        <FaRegUserCircle size={30} />
      </div>
    </header>
  );
}
