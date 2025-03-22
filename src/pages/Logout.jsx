import React, { useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terminar sessão";
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // volta para Home
      navigate("/");
    } else {
      console.error("Erro ao fazer logout:", error.message);
    }
  };

  return (
    <>
      <Header />

      <div style={{ marginTop: "80px", textAlign: "center" }}>
        <h1>Deseja terminar sessão ?</h1>
        <p>Clica no botão abaixo para confirmar logout</p>
        <button onClick={signOut}>Confirmar Logout</button>
      </div>
      <Footer />
    </>
  );
}

export default Logout;
