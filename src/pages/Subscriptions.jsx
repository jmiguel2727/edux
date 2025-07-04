import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { useUserRedirect } from "../components/UserRedirect";

function Subscriptions() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "As Minhas Subscrições | EDUX";
    fetchCursosSubscritos();
  }, []);

  /* ──────────────────────────────────────────────────────────
     Obter todos os cursos subscritos + percentagem e resultado
  ────────────────────────────────────────────────────────── */
  const fetchCursosSubscritos = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    /* Ids de cursos subscritos */
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("course_id")
      .eq("user_id", user.id);

    if (!subs || subs.length === 0) {
      setCursos([]);
      setLoading(false);
      return;
    }

    const courseIds = subs.map((s) => s.course_id);

    /* Infos dos cursos */
    const { data: cursosData } = await supabase
      .from("courses")
      .select("id, title, thumbnail_url, creator_id")
      .in("id", courseIds);

    /* Juntar progresso + nome do criador + resultado do teste */
    const cursosComProgresso = await Promise.all(
      (cursosData || []).map(async (curso) => {
        /* Nome do criador */
        const { data: perfil } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", curso.creator_id)
          .single();

        /* Progresso */
        const { data: progresso } = await supabase
          .from("progress")
          .select("total_items, completed_items")
          .eq("course_id", curso.id)
          .eq("user_id", user.id)
          .maybeSingle();

        /* Teste associado (se existir) */
        const { data: test } = await supabase
          .from("course_tests")
          .select("id")
          .eq("course_id", curso.id)
          .limit(1);

        const testId = test?.[0]?.id;

        let passed = false;
        if (testId) {
          const { data: result } = await supabase
            .from("test_results")
            .select("passed")
            .eq("test_id", testId)
            .eq("user_id", user.id)
            .maybeSingle();
          passed = result?.passed || false;
        }

        /* Percentagem concluída */
        let percent = 0;
        if (progresso && progresso.total_items > 0) {
          percent = Math.round(
            (progresso.completed_items / progresso.total_items) * 100
          );
        }

        return {
          ...curso,
          creator: perfil || { first_name: "Desconhecido", last_name: "" },
          progressPercent: percent,
          passed,
        };
      })
    );

    setCursos(cursosComProgresso);
    setLoading(false);
  };

  /* ------------------------------------------------------------------ */

  const handleSubscribeClick = async (e) => {
    e.preventDefault();
    const ok = await useUserRedirect(navigate, "/subscriptions");
    if (ok) navigate("/destaques");
  };

  return (
    <>
      <Header />

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div
          className="bg-light border rounded"
          style={{
            backgroundColor: "#f8f2f2",
            width: "90%",
            padding: "30px",
            position: "relative",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Botão “Subscrever” (canto sup. direito) */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="#"
              onClick={handleSubscribeClick}
              className="text-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span className="fw-medium">+ Subscrever</span>
            </Link>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <p className="text-center">A carregar cursos...</p>
          ) : !isAuthenticated || cursos.length === 0 ? (
            <p className="text-center text-muted">
              Não existem cursos subscritos.
            </p>
          ) : (
            <div className="row">
              {cursos.map((curso) => (
                <div key={curso.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm position-relative d-flex flex-column">
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

                    <div className="card-body d-flex flex-column justify-content-between">
                      <Link
                        to={`/curso/${curso.id}/conteudo`}
                        className="text-decoration-none text-dark"
                      >
                        <h5
                          className="card-title"
                          style={{ transition: "0.2s" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {curso.title}
                        </h5>
                      </Link>

                      <p className="card-text text-muted mb-2">
                        Criado por: {curso.creator?.first_name}{" "}
                        {curso.creator?.last_name}
                      </p>

                      {/* ───── BOTÃO / INDICADOR DE ESTADO ───── */}
                      {curso.passed ? (
                        /* Já passou o teste */
                        <button
                          className="btn btn-success mb-2 mx-auto"
                          style={{ width: "85%" }}
                          disabled
                        >
                        <strong>Concluído</strong>
                        </button>
                      ) : curso.progressPercent === 100 ? (
                        /* Aulas concluídas, falta o teste */
                        <Link
                          to={`/curso/${curso.id}/teste/fazer`}
                          className="btn btn-warning mb-2 mx-auto text-decoration-none"
                          style={{ width: "85%" }}
                        >
                          <strong>Concluir</strong>
                        </Link>
                      ) : (
                        /* Progresso intermédio (só percentagem) */
                        <button
                          className="btn btn-secondary mb-2 mx-auto"
                          style={{ width: "85%" }}
                          disabled
                        >
                          {curso.progressPercent}% visto
                        </button>

                      )}
                      {/* ─────────────────────────────────────── */}
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

export default Subscriptions;
