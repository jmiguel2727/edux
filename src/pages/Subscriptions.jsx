import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Subscriptions() {
  useEffect(() => {
    document.title = "As Minhas Subscrições | EDUX";
  }, []);

  return (
    <>
      <Header />

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div
          className="bg-light border rounded"
          style={{
            backgroundColor: "#f8f2f2",
            width: "90%",
            minHeight: "250px",
            padding: "30px",
            position: "relative",
          }}
        >
          {/* Botão "Criar curso" dentro da caixa no canto superior direito */}
          <div className="d-flex justify-content-end">
            <Link
              to="/create-course"
              className="text-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span className="fs-5 fw-bold">+</span>
              <span className="fw-medium">Criar curso</span>
            </Link>
          </div>

          {/* Conteúdo central */}
          <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
            <p className="text-muted mb-0">Ainda não possui cursos para venda.</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Subscriptions;
