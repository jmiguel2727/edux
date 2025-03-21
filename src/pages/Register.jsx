import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../helper/supabaseClient";

function Register() {
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Definir título da página
  useEffect(() => {
    document.title = "Criar conta | Edux";
  }, []);

  // Submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // 👉 1. Criar utilizador na autenticação
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage(signUpError.message);
      return;
    }

    const userId = signUpData?.user?.id;

    if (!userId) {
      setMessage("Erro: não foi possível obter o ID do utilizador.");
      return;
    }

    // 👉 2. Criar perfil na tabela "profiles"
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        first_name: "",
        last_name: "",
        phone: "",
        birth_date: null,
      },
    ]);

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError.message);
      setMessage("Conta criada, mas ocorreu um erro ao criar o perfil.");
    } else {
      setMessage("Conta e perfil criados com sucesso!");
    }

    // Limpar formulário
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h2>Regista-te</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}> 

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /> <br />
        <button type="submit">Criar conta</button>
        
      </form>

      <p>Já tens conta? <Link to="/login">Iniciar sessão</Link></p>
    </div>
  );
}

export default Register;
