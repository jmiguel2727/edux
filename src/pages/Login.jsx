import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_edux_dark.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/destaques";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Iniciar sessão";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate(from); // Redireciona para a página original
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-5 border-0" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="EDUX" style={{ width: 80 }} className="mb-3" />
          <h2 className="fw-bold text-dark">Iniciar Sessão</h2>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-dark">Email</label>
            <input type="email" className="form-control" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="text-dark">Palavra-passe</label>
            <input type="password" className="form-control" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-dark w-100 shadow-sm">Entrar</button>
        </form>

        <p className="text-center mt-3 text-secondary">
          Ainda não tens conta? <Link to="/register" state={{ from }} className="text-dark">Registar</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
