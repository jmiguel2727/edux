import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_edux_dark.png";

function Home() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-5 border-0" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="EDUX" style={{ width: 80 }} className="mb-3" />
          <h1 className="mt-3 fw-bold text-dark">Bem-vindo ao Edux!</h1>
          <p className="text-secondary">A tua plataforma de aprendizagem online.</p>
        </div>
        <div className="d-grid gap-3">
          <Link to="/login" className="btn btn-dark btn-lg shadow-sm">Iniciar Sessão</Link>
          <Link to="/register" className="btn btn-outline-dark btn-lg shadow-sm">Criar Conta</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
