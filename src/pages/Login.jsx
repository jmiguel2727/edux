import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Header from "../components/Header";
import logo from "../assets/logo_edux_dark.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/destaques";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    document.title = "Iniciar sessão";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setEmailExists(false);

    // Verificar se email existe
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError) {
      setMessage("Conta de utilizador inexistente.");
      setEmail("");
      setPassword("");
      return;
    }

    // Email existe
    setEmailExists(true);

    // Tentar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Palavra-passe incorreta.");
      setPassword(""); // Mantém o email preenchido
      return;
    }

    // Login OK
    if (data) {
      navigate(from);
    }
  };

  return (
    <>
      <Header />

      <div className="bg-light py-5">
        <div className="container">
          <div className="card shadow-lg p-5 border-0 position-relative mx-auto" style={{ maxWidth: "500px" }}>
            {/* Botão voltar no canto superior esquerdo da card */}
            <button
              onClick={() => navigate("/home")}
              className="btn btn-link position-absolute text-dark"
              style={{ top: "15px", left: "15px", fontSize: "1.5rem", textDecoration: "none" }}
            >
              <IoArrowBack />
            </button>

            <div className="text-center mb-4 mt-4">
              <img src={logo} alt="EDUX" style={{ width: 80 }} className="mb-3" />
              <h2 className="fw-bold text-dark">Iniciar Sessão</h2>
            </div>

            {message && <div className="alert alert-danger">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-dark">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="text-dark">Palavra-passe</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-dark w-100 shadow-sm">Entrar</button>
            </form>

            <p className="text-center mt-3 text-secondary">
              Ainda não tens conta?{" "}
              <Link to="/register" state={{ from }} className="text-dark">
                Registar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
