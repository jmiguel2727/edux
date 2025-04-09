import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";

function SellCourse() {
  const [myCourses, setMyCourses] = useState([]);
  const [message, setMessage] = useState("");

  // Mapeamento de cores por status
  const statusColorMap = {
    pendente: "#E48C11",
    aprovado: "#20B016",
    rejeitado: "#D72B2B"
  };

  useEffect(() => {
    document.title = "Cursos à venda | EDUX";

    const fetchMyCourses = async () => {
      // Obter sessão atual
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setMessage("Sessão inválida. Faz login novamente.");
        return;
      }

      // Buscar cursos do utilizador logado
      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setMessage("Erro ao carregar cursos.");
      } else {
        setMyCourses(courses);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <>
      <Header />

      {/* Container com margem no topo e em baixo */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh", marginTop: "80px", marginBottom: "80px" }}
      >
        <div
          className="bg-light border rounded"
          style={{
            backgroundColor: "#f8f2f2",
            width: "90%",
            minHeight: "250px",
            padding: "30px",
            position: "relative",
          }}
        >
          {/* Botão "Criar curso" no canto superior direito */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/create-course"
              className="text-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span className="fw-medium">+ Criar Curso</span>
            </Link>
          </div>

          {/* Mensagens de erro ou estado */}
          {message && (
            <div className="alert alert-warning mb-3">{message}</div>
          )}

          {/* Lista dos cursos do utilizador */}
          {myCourses.length === 0 && !message ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "150px" }}
            >
              <p className="text-muted mb-0">
                Ainda não possui cursos à venda.
              </p>
            </div>
          ) : (
            <div className="row">
              {myCourses.map((course) => (
                <div key={course.id} className="col-md-4 d-flex">
                  <div className="card mb-4 flex-grow-1 shadow">
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        className="card-img-top"
                        alt="Thumbnail do curso"
                        style={{ maxHeight: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title mb-2">{course.title}</h5>
                      <p className="card-text mb-1">
                        <strong>Criado em:</strong>{" "}
                        {new Date(course.created_at).toLocaleDateString("pt-PT")}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Status: </strong>
                        <span style={{ color: statusColorMap[course.status] }}>
                          {course.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SellCourse;
