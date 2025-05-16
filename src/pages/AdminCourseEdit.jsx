import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import supabase from "../helper/supabaseClient";

function AdminCourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  const categorias = [
    "Tecnologia", "Design", "Negócios", "Marketing", "Desenvolvimento Pessoal",
    "Saúde e Bem-Estar", "Educação", "Música", "Fotografia", "Idiomas",
    "Finanças", "Arte", "Culinária", "Moda", "Engenharia"
  ];

  useEffect(() => {
    document.title = "Editar Curso | Admin EDUX";
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setMessage("Erro ao carregar curso.");
    } else {
      setCourse(data);
    }
  };

  const handleUpdate = async (newStatus) => {
    const { error } = await supabase
      .from("courses")
      .update({
        title: course.title,
        description: course.description,
        categoria: course.categoria,
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      setMessage("Erro ao atualizar o curso.");
    } else {
      setMessage("Curso atualizado com sucesso!");
      setTimeout(() => navigate("/admin/course"), 1500);
    }
  };

  const handleChange = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminSidebar>
      <div className="container py-4">

        {/* Botão para ver conteúdo */}
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/admin/course-content/${id}`)}
          >
            Ver conteúdo do curso
          </button>
        </div>

        <h2 className="mb-4">Editar Curso</h2>

        {message && <div className="alert alert-info">{message}</div>}

        {!course ? (
          <p>A carregar...</p>
        ) : (
          <div className="card shadow-sm p-4">
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt="Thumbnail"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "250px", objectFit: "cover" }}
              />
            )}

            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                value={course.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                rows="4"
                value={course.description}
                onChange={(e) => handleChange("description", e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={course.categoria || ""}
                onChange={(e) => handleChange("categoria", e.target.value)}
              >
                <option value="">Seleciona uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-success" onClick={() => handleUpdate("aprovado")}>
                Aprovar e Atualizar
              </button>
              <button className="btn btn-danger" onClick={() => handleUpdate("rejeitado")}>
                Rejeitar Curso
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminCourseEdit;