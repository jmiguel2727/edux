import React, { useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terminar sessão | Edux";
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // volta para Home
      navigate("/");
    } else {
      console.error("Erro ao fazer sign out:", error.message);
    }
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h1>Deseja terminar sessão ?</h1>
      <p>Clica no botão abaixo para confirmar logout</p>
      <button onClick={signOut}>Confirmar Logout</button>
    </div>
  );
}

export default Logout;
