import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function CriarCurso() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setMessage("Tens de estar autenticado.");
      return;
    }

    const { error } = await supabase.from("courses").insert([
      {
        creator_id: user.id,
        title,
        description,
        thumbnail_url: thumbnail,
        status: "pendente",
      },
    ]);

    if (error) {
      setMessage("Erro ao criar curso: " + error.message);
    } else {
      setMessage("Curso criado com sucesso! Aguarda aprovação.");
      setTimeout(() => navigate("/subscriptions"), 2000);
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5" style={{ maxWidth: "700px" }}>
        <h2 className="mb-4">Criar Novo Curso</h2>

        {message && <p className="alert alert-info">{message}</p>}

        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label className="form-label">Título do Curso</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrição do Curso</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">upload do banner</label>
            <input
              type="text"
              className="form-control"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="btn btn-primary">Avançar</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CriarCurso;
