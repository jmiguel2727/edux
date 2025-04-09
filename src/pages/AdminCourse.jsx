import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import supabase from "../helper/supabaseClient";

function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  // Filtro de status começa em 'pendente'
  const [statusFilter, setStatusFilter] = useState("pendente");

  // Carrega os cursos (aqui busca todos e filtra no front, mas podes filtrar no back)
  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setMessage("Erro ao carregar cursos: " + error.message);
      } else {
        setCourses(data || []);
      }
    } catch (err) {
      console.error(err);
      setMessage("Ocorreu um erro inesperado ao carregar os cursos.");
    }
  };

  useEffect(() => {
    document.title = "Gestão de Cursos | EDUX";
    fetchCourses();
  }, []);

  // Atualiza status do curso para 'aprovado' ou 'rejeitado'
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error(error);
        setMessage("Erro ao atualizar o status do curso.");
      } else {
        setMessage(`Curso ${id} atualizado para '${newStatus}'.`);
        // Recarrega lista
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
      setMessage("Erro inesperado ao atualizar o curso.");
    }
  };

  // Filtra cursos no front com base no statusFilter
  const filteredCourses = courses.filter(
    (course) => course.status === statusFilter
  );

  return (
    <AdminSidebar>
      <div className="container p-4">
        {/* Cabeçalho */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Gestão de Cursos</h2>
          {/* Filtro de status no canto direito */}
          <div style={{ minWidth: "180px" }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="rejeitado">Rejeitados</option>
            </select>
          </div>
        </div>

        {/* Mensagem de info/erro */}
        {message && <div className="alert alert-info">{message}</div>}

        {/* Lista de cursos filtrados */}
        {filteredCourses.length === 0 ? (
          <p className="text-muted">
            Não há cursos {statusFilter} disponíveis no momento.
          </p>
        ) : (
          <div className="row">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  {course.thumbnail_url && (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text mb-1">
                      <strong>Data:</strong>{" "}
                      {new Date(course.created_at).toLocaleDateString("pt-PT")}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Status:</strong> {course.status}
                    </p>

                    {/* Botões para aprovar/rejeitar apenas se estiver pendente */}
                    {course.status === "pendente" && (
                      <div className="mt-3 d-flex gap-2">
                        <button
                          className="btn btn-success"
                          onClick={() => handleUpdateStatus(course.id, "aprovado")}
                        >
                          Aprovar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUpdateStatus(course.id, "rejeitado")}
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                    {/* Botão 'Ver detalhes' ou qualquer outra ação */}
                    <button className="btn btn-primary mt-3">
                      Ver 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminCourse;
