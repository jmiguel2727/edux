import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { useUserRedirect } from "../components/UserRedirect";
import { MdOutlineReport } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [criador, setCriador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [verMais, setVerMais] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [user, setUser] = useState(null);
  const [reportId, setReportId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Visualização do Curso | EDUX";
    fetchCurso();
    checkUser();
    checkIfSubscribed();
    fetchComentarios();
  }, [id]);

  const fetchCurso = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();
    if (!error && data) {
      setCurso(data);
      const { data: perfil } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", data.creator_id)
        .single();
      setCriador(perfil);
    }
    setLoading(false);
  };

  const checkUser = async () => {
    const { data: session } = await supabase.auth.getSession();
    setUser(session?.session?.user || null);
  };

  const checkIfSubscribed = async () => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;
    if (!user) return;
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .maybeSingle();
    if (existing) setIsSubscribed(true);
  };

  const fetchComentarios = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, user_id, content, created_at, is_visible, profiles(first_name, last_name)")
      .eq("course_id", id)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  const handleCommentSubmit = async () => {
    if (!user || !novoComentario.trim()) return;
    const { error } = await supabase
      .from("comments")
      .insert({ user_id: user.id, course_id: id, content: novoComentario, is_visible: true });
    if (!error) {
      setNovoComentario("");
      fetchComentarios();
    }
  };

  const handleReportClick = (commentId) => {
    if (!user) return;
    setReportId(commentId);
  };

  const confirmReport = async () => {
    if (!user || !reportId) return;
    await supabase.from("reports").insert({ user_id: user.id, comment_id: reportId });
    setReportId(null);
  };

  const confirmSubscription = async () => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;
    if (!user) return;

    // 1️⃣ Insere na subscriptions
    const { error: subError } = await supabase
      .from("subscriptions")
      .insert({ user_id: user.id, course_id: id });

    if (subError) {
      alert("Erro ao subscrever o curso.");
      return;
    }

    // 2️⃣ Calcula total de aulas
    const { data: sections } = await supabase
      .from("sections")
      .select("id")
      .eq("course_id", id);

    if (!sections || sections.length === 0) {
      alert("Erro: o curso não contém secções.");
      return;
    }

    const { data: items } = await supabase
      .from("items")
      .select("id")
      .in("section_id", sections.map(s => s.id));

    const totalItems = items ? items.length : 0;

    // 3️⃣ Cria na progress
    const { error: progError } = await supabase
      .from("progress")
      .insert({
        user_id: user.id,
        course_id: id,
        total_items: totalItems
      });

    if (progError) {
      alert("Erro ao criar o progresso do curso.");
      return;
    }

    // 4️⃣ Atualiza estado (sem alert extra)
    setIsSubscribed(true);
    setShowConfirm(false);
  };

  const comentariosVisiveis = verMais ? comments : comments.slice(0, 4);

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
            <div className="row align-items-start g-4 mb-4">
              <div className="col-md-5">
                {curso.thumbnail_url && (
                  <img
                    src={curso.thumbnail_url}
                    alt="Banner do curso"
                    className="img-fluid rounded shadow-sm"
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="col-md-7">
                <h1 className="fw-bold">{curso.title}</h1>
                <p className="text-dark mb-2">
                  <strong>Criado por:</strong> {criador ? `${criador.first_name} ${criador.last_name}` : "Criador não disponível"}
                </p>
                <p className="text-dark mb-2">
                  <strong>Categoria:</strong> {curso.categoria || "Não definida"}
                </p>
                <p className="text-dark mb-3">
                  <strong>Data de lançamento:</strong> {new Date(curso.created_at).toLocaleDateString("pt-PT")}
                </p>
                <p className="text-dark">
                  <strong>Descrição:</strong> {curso.description}
                </p>

                <div className="d-flex flex-wrap gap-3 mt-3">
                  {isSubscribed ? (
                    <>
                      <button className="btn btn-outline-success" disabled>
                        <i className="bi bi-check-circle-fill me-2"></i> Subscrito
                      </button>
                      <button className="btn btn-dark" onClick={() => navigate(`/curso/${id}/conteudo`)}>
                        <i className="bi bi-play-fill me-2"></i> Começar curso
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn text-white"
                      style={{ backgroundColor: "#7188B2", border: "none" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#384761")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#7188B2")}
                      onClick={async () => {
                        const ok = await useUserRedirect(navigate, `/curso/${id}`);
                        if (ok) setShowConfirm(true);
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i> Subscrever curso
                    </button>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-5" />
            <h4 className="mb-4">Comentários</h4>

            <div className="mb-4 position-relative">
              <textarea
                className="form-control pe-5"
                placeholder={user ? "Escreve o teu comentário..." : "É necessário iniciar sessão para comentar."}
                value={novoComentario}
                onChange={(e) => {
                  setNovoComentario(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                disabled={!user}
                style={{ overflow: "hidden", resize: "none", minHeight: "38px" }}
              ></textarea>

              {user && novoComentario.trim() && (
                <IoMdSend
                  size={24}
                  className="position-absolute"
                  style={{ right: 12, bottom: 12, cursor: "pointer", color: "#0d6efd" }}
                  title="Enviar"
                  onClick={handleCommentSubmit}
                />
              )}
            </div>

            {comentariosVisiveis.map((c) => (
              <div key={c.id} className="card mb-3">
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h6 className="mb-1">{c.profiles?.first_name} {c.profiles?.last_name}</h6>
                    <p className="mb-1">{c.content}</p>
                    <small className="text-muted">{new Date(c.created_at).toLocaleString("pt-PT")}</small>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <MdOutlineReport
                      size={22}
                      className="text-danger"
                      title="Denunciar comentário"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleReportClick(c.id)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {comments.length > 4 && !verMais && (
              <div className="text-center">
                <button className="btn btn-link" onClick={() => setVerMais(true)}>Ver mais</button>
              </div>
            )}
          </>
        )}
      </div>

      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="bg-white p-4 rounded shadow text-center" style={{ maxWidth: "400px" }}>
            <h5 className="mb-3">Confirmar subscrição</h5>
            <p className="text-muted">Queres subscrever este curso?</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-primary" onClick={confirmSubscription}>Sim, subscrever</button>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {reportId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="bg-white p-4 rounded shadow text-center" style={{ maxWidth: "400px" }}>
            <h5 className="mb-3">Denunciar comentário</h5>
            <p className="text-muted">Tens a certeza que queres denunciar este comentário?</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-danger" onClick={confirmReport}>Sim, denunciar</button>
              <button className="btn btn-secondary" onClick={() => setReportId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CoursePreview;
