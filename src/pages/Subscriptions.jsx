import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { Link } from "react-router-dom";

function Subscriptions() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "As Minhas Subscrições | EDUX";
    fetchCursosSubscritos();
  }, []);

  const fetchCursosSubscritos = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select("course_id")
      .eq("user_id", user.id);

    if (error || !subs || subs.length === 0) {
      setCursos([]);
      setLoading(false);
      return;
    }

    const courseIds = subs.map((s) => s.course_id);

    const { data: cursosData } = await supabase
      .from("courses")
      .select("id, title, thumbnail_url, creator_id")
      .in("id", courseIds);

    const cursosComCriadores = await Promise.all(
      (cursosData || []).map(async (curso) => {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", curso.creator_id)
          .single();

        return {
          ...curso,
          creator: perfil || { first_name: "Desconhecido", last_name: "" }
        };
      })
    );

    setCursos(cursosComCriadores);
    setLoading(false);
  };

  return (
    <>
      <Header />

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div
          className="bg-light border rounded"
          style={{
            backgroundColor: "#f8f2f2",
            width: "90%",
            padding: "30px",
            position: "relative",
          }}
        >
          {/* Botão "Subscrever" no canto superior direito */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/destaques"
              className="text-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span className="fw-medium">+ Subscrever</span>
            </Link>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <p className="text-center">A carregar cursos...</p>
          ) : cursos.length === 0 ? (
            <p className="text-center text-muted">Ainda não possui cursos subscritos.</p>
          ) : (
            <div className="row">
              {cursos.map((curso) => (
                <div key={curso.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm position-relative">
                    <Link to={`/curso/${curso.id}/conteudo`}>
                      {curso.thumbnail_url && (
                        <img
                          src={curso.thumbnail_url}
                          alt={curso.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                    </Link>
                    <div className="card-body">
                      <Link to={`/curso/${curso.id}/conteudo`} className="text-decoration-none text-dark">
                        <h5
                          className="card-title"
                          style={{ transition: "0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                          onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                          {curso.title}
                        </h5>
                      </Link>
                      <p className="card-text text-muted">
                        Criado por: {curso.creator?.first_name} {curso.creator?.last_name}
                      </p>
                    </div>
                    <span className="badge bg-success position-absolute" style={{ bottom: "10px", right: "10px" }}>
                      Subscrito
                    </span>
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

export default Subscriptions;
