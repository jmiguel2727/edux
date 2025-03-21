import React, { useEffect } from "react";
import Header from "../components/Header";

function Destaques() {
  useEffect(() => {
    document.title = "Cursos em Destaques | Edux";
  }, []);

  return (
    <>
      <Header />
      <div style={{ marginTop: "100px", textAlign: "center" }}>
        <h1>Bem vindo(a) aos Destaques da EDUX</h1>
      </div>
    </>
  );
}

export default Destaques;
