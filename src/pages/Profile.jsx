import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Perfil | EDUX";

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/home");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("email, first_name, last_name, phone, birth_date")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        setMessage(`Erro ao buscar perfil: ${error.message}`);
        return;
      }

      if (data) {
        setEmail(data.email || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        if (data.birth_date) setBirthDate(data.birth_date);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      setMessage("Utilizador não encontrado ou sessão expirada.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      birth_date: birthDate || null,
    });

    if (error) {
      setMessage(`Erro ao atualizar perfil: ${error.message}`);
    } else {
      if (password) {
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) {
          setMessage(`Erro ao atualizar password: ${passError.message}`);
        } else {
          setMessage("Perfil e password atualizados com sucesso!");
        }
      } else {
        setMessage("Perfil atualizado com sucesso!");
      }
    }

    setPassword("");

    // Scroll para a mensagem
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Limpa a mensagem após 1.5 segundos
    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  return (
    <>
      <Header />

      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div ref={cardRef} className="card shadow-lg p-5 border-0" style={{ maxWidth: "550px", width: "100%", marginTop: "80px", marginBottom: "80px" }} >
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Perfil do Utilizador</h2>
          </div>

          {message && (
            <div className={`alert ${message.includes("Erro") ? "alert-danger" : "alert-success"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">Primeiro Nome</label>
              <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Último Nome</label>
              <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Telemóvel</label>
              <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Data de Nascimento</label>
              <input type="date" className="form-control" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="form-label">Alterar Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-dark w-100 shadow-sm">Guardar Alterações</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;
