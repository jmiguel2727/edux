import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Iniciar sessão | Edux";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    // depois do login, vai para /destaques
    if (data) {
      navigate("/destaques");
    }
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h2>Iniciar sessão</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>

        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required/><br />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required/><br />
        <button type="submit">Login</button>

      </form>
      <p>Ainda não tens conta? <Link to="/register">Regista-te</Link></p>

    </div>
  );
}

export default Login;
