import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Criar conta | Edux";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setMessage("User account created! Verifica o teu e-mail para confirmar a conta.");
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h2>Regista-te</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required /><br />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required /><br />
        <button type="submit">Criar conta</button>

      </form>
      <p>Já tens conta? <Link to="/login">Iniciar sessão</Link></p>

    </div>
  );
}

export default Register;
