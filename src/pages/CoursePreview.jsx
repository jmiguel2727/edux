import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { useUserRedirect } from "../components/UserRedirect";

function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [criador, setCriador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    document.title = "Visualização do Curso | EDUX";
    fetchCurso();
    checkIfSubscribed();
  }, [id]);

  const fetchCurso = async () => {
    setLoading(true);

    const { data: cursoData, error: cursoError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (cursoError || !cursoData) {
      console.error("Erro ao carregar curso:", cursoError?.message);
      setCurso(null);
      setLoading(false);
      return;
    }

    setCurso(cursoData);

    try {
      const { data: perfil, error: perfilError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", cursoData.creator_id)
        .maybeSingle();

      if (!perfilError && perfil) {
        setCriador(perfil);
      }
    } catch (e) {
      console.warn("Erro ao carregar criador:", e.message);
    }

    setLoading(false);
  };

  const checkIfSubscribed = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .maybeSingle();

    if (existing) setIsSubscribed(true);
  };

  const handleSubscribing = async () => {
    const ok = await useUserRedirect(navigate, `/curso/${id}`);
    if (!ok) return;

    setShowConfirm(true); // só abre modal se estiver autenticado
  };

  const confirmSubscription = async () => {
    setShowConfirm(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { error } = await supabase
      .from("subscriptions")
      .insert({ user_id: user.id, course_id: id });

    if (!error) setIsSubscribed(true);
  };

  const handleStartCourse = () => {
    navigate(`/curso/${id}/conteudo`);
  };

  return (
    <>
      <Header />
      <div className="container py-5" style={{ minHeight: "70vh" }}>
        {loading ? (
          <p className="text-center">A carregar curso...</p>
        ) : !curso ? (
          <p className="text-center text-danger">Curso não encontrado.</p>
        ) : (
          <>
            <h1 className="mb-3">{curso.title}</h1>
            {curso.thumbnail_url && (
              <img
                src={curso.thumbnail_url}
                alt="Banner"
                className="img-fluid rounded mb-4"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            )}
            <p className="text-muted">
              Criado por:{" "}
              {criador
                ? `${criador.first_name} ${criador.last_name}`
                : "Criador não disponível"}
            </p>
            <p>{curso.description}</p>

            <div className="text-end mt-4 d-flex flex-column align-items-end gap-2">
              {isSubscribed ? (
                <>
                  <button className="btn btn-success" disabled>
                    Subscrito
                  </button>
                  <button className="btn btn-primary" onClick={handleStartCourse}>
                    Começar curso
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleSubscribing}>
                  Subscrever curso
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow text-center"
            style={{ maxWidth: "400px" }}
          >
            <h5 className="mb-3">Confirmar subscrição</h5>
            <p className="text-muted">Queres subscrever este curso?</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-primary" onClick={confirmSubscription}>
                Sim, subscrever
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CoursePreview;
