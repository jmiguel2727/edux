import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Destaques() {
  useEffect(() => {
    document.title = "Cursos em Destaque";
  }, []);

  return (
    <>
      <Header />
      <div style={{ marginTop: "100px", textAlign: "center" }}>
        <h1>Bem vindo(a) aos Destaques da EDUX</h1>
      </div>
      <Footer />
    </>
  );
}

export default Destaques;
