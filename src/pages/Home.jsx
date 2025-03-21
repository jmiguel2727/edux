import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    document.title = "Home | Edux";
  }, []);

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h1>Bem vindo ao Edux!</h1>
      <p>Por favor regista-te ou faz inicia sessão.</p>

      <Link to="/login">Iniciar sessão</Link><br />
      <Link to="/register">Criar utilizador</Link>

    </div>
  );
}

export default Home;

