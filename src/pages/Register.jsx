import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import logo from "../assets/logo_edux_dark.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/destaques";

  useEffect(() => {
    document.title = "Criar conta | EDUX";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setMessage(signUpError.message);
      return;
    }

    const user = signUpData?.user;
    if (!user) {
      setLoading(false);
      setMessage("Erro ao obter dados do utilizador.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: user.email,
        first_name: "",
        last_name: "",
        phone: "",
        birth_date: null,
      },
    ]);

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError.message);
      setMessage("Conta criada, mas ocorreu um erro ao criar o perfil.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      navigate(from); // Redireciona após criação de conta
    }, 1000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-5 border-0" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="EDUX" style={{ width: 80 }} className="mb-3" />
          <h2 className="fw-bold text-dark">Criar Conta</h2>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-dark" role="status"></div>
            <p className="mt-3 text-secondary">A criar a tua conta...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-dark">Email</label>
              <input type="email" className="form-control" required
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="text-dark">Password</label>
              <input type="password" className="form-control" required
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-dark w-100 shadow-sm">Criar Conta</button>
          </form>
        )}

        <p className="text-center mt-3 text-secondary">
          Já tens conta? <Link to="/login" state={{ from }} className="text-dark">Iniciar sessão</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
