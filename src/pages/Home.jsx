import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import Header from "../components/Header";
import logo from "../assets/logo_edux_dark.png";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/destaques";

  useEffect(() => {
    document.title = "Home";
  }, []);

  const handleBack = () => {
    navigate(from);
  };

  return (
    <>
      <Header />

      <div className="bg-light py-5">
        <div className="container">
          <div className="card shadow-lg p-5 border-0 position-relative mx-auto" style={{ maxWidth: "500px" }}>
            {/* Ícone no canto superior esquerdo */}
            <div
              onClick={handleBack}
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "#6c757d"
              }}
              title="Voltar"
            >
              <AiFillHome />
            </div>

            <div className="text-center mb-4">
              <img src={logo} alt="EDUX" style={{ width: 80 }} className="mb-3" />
              <h1 className="mt-3 fw-bold text-dark">Bem-vindo ao Edux!</h1>
              <p className="text-secondary">A tua plataforma de aprendizagem online.</p>
            </div>

            <div className="d-grid gap-3">
              <Link to={`/login`} state={{ from }} className="btn btn-dark btn-lg shadow-sm">
                Iniciar Sessão
              </Link>
              <Link to={`/register`} state={{ from }} className="btn btn-outline-dark btn-lg shadow-sm">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
