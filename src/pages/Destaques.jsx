import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";

function Destaques() {
  const [cursos, setCursos] = useState([]);
  const [subscritos, setSubscritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cursos em Destaque";
    fetchCursosAprovados();
    fetchCursosSubscritos();
  }, []);

  const fetchCursosAprovados = async () => {
    const { data: coursesData, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cursos:", error.message);
      setLoading(false);
      return;
    }

    const cursosComAutores = await Promise.all(
      coursesData.map(async (curso) => {
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

    setCursos(cursosComAutores);
    setLoading(false);
  };

  const fetchCursosSubscritos = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("course_id")
      .eq("user_id", user.id);

    setSubscritos(subs?.map(s => s.course_id) || []);
  };

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: "100px", minHeight: "70vh" }}>
        <h1 className="text-center mb-5">Bem-vindo(a) aos Destaques da EDUX</h1>

        {loading ? (
          <p className="text-center">A carregar cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="text-center text-muted">Nenhum curso aprovado disponível de momento.</p>
        ) : (
          <div className="row">
            {cursos.map((curso) => {
              const isSubscribed = subscritos.includes(curso.id);
              return (
                <div key={curso.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm position-relative">
                    <Link to={`/curso/${curso.id}`}>
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
                      <Link to={`/curso/${curso.id}`} className="text-decoration-none text-dark">
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
                    {isSubscribed && (
                      <span className="badge bg-success position-absolute" style={{ bottom: "10px", right: "10px" }}>
                        Subscrito
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Destaques;
