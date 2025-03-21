import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "/src/assets/logo_edux.png";

export default function Header() {
  return (
    <header 
      className="d-flex align-items-center justify-content-between p-3 w-100"
      style={{
        backgroundColor: '#FFFFFF', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}
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
        <Link to="/destaques" className="text-dark text-decoration-none fw-medium">Destaques</Link>
        <Link to="#" className="text-dark text-decoration-none fw-medium">Categorias</Link>
        <Link to="/logout" className="text-dark text-decoration-none fw-medium">Logout</Link>
        <Link to="/profile" className="text-dark text-decoration-none fw-medium">Perfil</Link>
        <FaRegUserCircle size={30} />
      </div>
    </header>
  );
}
