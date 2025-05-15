import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { useUserRedirect } from "../components/UserRedirect";

function SellCourse() {
  const [myCourses, setMyCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const statusColorMap = {
    pendente: "#E48C11",
    aprovado: "#20B016",
    rejeitado: "#D72B2B",
  };

  useEffect(() => {
    document.title = "Cursos à venda | EDUX";

    const fetchMyCourses = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setMyCourses(courses);
      }
    };

    fetchMyCourses();
  }, []);

  const handleCreateCourseClick = async (e) => {
    e.preventDefault();
    const allowed = await useUserRedirect(navigate, "/sell-course");
    if (allowed) navigate("/create-course");
  };

  return (
    <>
      <Header />

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
          {/* Botão "Criar curso" */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="#"
              onClick={handleCreateCourseClick}
              className="text-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span className="fw-medium">+ Criar Curso</span>
            </Link>
          </div>

          {/* Conteúdo */}
          {!isAuthenticated ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "150px" }}
            >
              <p className="text-muted mb-0">
                Ainda não possui cursos à venda.
              </p>
            </div>
          ) : myCourses.length === 0 ? (
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
