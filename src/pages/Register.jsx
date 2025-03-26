import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    // Sucesso: redirecionar após pequeno delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h2>Regista-te</h2>

      {message && <p className="text-danger">{message}</p>}

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">A criar a tua conta...</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/><br />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
            <button type="submit">Criar conta</button>
          </form>

          <p>Já tens conta? <Link to="/login">Iniciar sessão</Link></p>
        </>
      )}
    </div>
  );
}

export default Register;
