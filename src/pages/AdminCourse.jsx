import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import supabase from "../helper/supabaseClient";

function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("pendente");
  const navigate = useNavigate();

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

  const filteredCourses = courses.filter(
    (course) => course.status === statusFilter
  );

  return (
    <AdminSidebar>
      <div className="container p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Gestão de Cursos</h2>
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

        {message && <div className="alert alert-info">{message}</div>}

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
                      style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => navigate(`/admin/course-edit/${course.id}`)}
                    />
                  )}
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ cursor: "pointer", transition: "0.2s" }}
                      onClick={() => navigate(`/admin/course-edit/${course.id}`)}
                      onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      {course.title}
                    </h5>
                    <p className="card-text mb-1">
                      <strong>Data:</strong>{" "}
                      {new Date(course.created_at).toLocaleDateString("pt-PT")}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Status:</strong> {course.status}
                    </p>
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
  