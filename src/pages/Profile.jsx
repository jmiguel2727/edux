import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

function Profile() {
  const navigate = useNavigate();

  // Estado dos campos do perfil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Obter dados do utilizador ao carregar a página
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, birth_date")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        setMessage(`Erro ao buscar perfil: ${error.message}`);
        return;
      }

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        if (data.birth_date) setBirthDate(data.birth_date);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Guardar alterações no perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      setMessage("Utilizador não encontrado ou sessão expirada.");
      return;
    }

    // Atualizar ou criar perfil
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        phone,
        birth_date: birthDate || null,
      });

    if (error) {
      setMessage(`Erro ao atualizar perfil: ${error.message}`);
      return;
    }

    // Atualizar password se for preenchida
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) {
        setMessage(`Erro ao atualizar password: ${passError.message}`);
        return;
      }
    }

    setMessage("Perfil atualizado com sucesso!");
    setPassword("");
  };

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <h2>Perfil do Utilizador</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleUpdateProfile}>
        <label>Primeiro Nome:</label> <br />
        <input type="text"value={firstName}onChange={(e) => setFirstName(e.target.value)}/> <br /><br />

        <label>Segundo Nome:</label> <br />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /> <br /><br />

        <label>Telemóvel:</label> <br />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /> <br /><br />

        <label>Data de Nascimento:</label> <br />
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /> <br /><br /> <hr />

        <label>Redefinir Password (opcional):</label> <br />
        <input type="password" placeholder="Nova password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br /><br />

        <button type="submit">Guardar Alterações</button>

      </form>
    </div>
  );
}

export default Profile;
