import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import logo from "/src/assets/logo_edux_dark.png";

function Destaques() {
  const [recentes, setRecentes] = useState([]);
  const [populares, setPopulares] = useState([]);
  const [comentados, setComentados] = useState([]);
  const [subscritos, setSubscritos] = useState([]);
  const [startRecent, setStartRecent] = useState(0);
  const [startPop, setStartPop] = useState(0);
  const [startComent, setStartComent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cursos em Destaque";

    const carregarTudo = async () => {
      await Promise.all([
        fetchCursosRecentes(),
        fetchCursosPopulares(),
        fetchCursosComentados(),
        fetchCursosSubscritos()
      ]);
      setLoading(false);
    };

    carregarTudo();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCursosPorSlide = () => {
    if (windowWidth >= 1400) return 4;
    if (windowWidth >= 992) return 3;
    if (windowWidth >= 768) return 2;
    return 1;
  };

  const cursosPorSlide = getCursosPorSlide();

  const fetchCursosRecentes = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false });

    if (error) return;

    const cursosComAutores = await Promise.all(
      data.slice(0, 15).map(async (curso) => {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", curso.creator_id)
          .single();

        return {
          ...curso,
          creator: perfil || { first_name: "Desconhecido", last_name: "" },
        };
      })
    );

    setRecentes(cursosComAutores);
  };

  const fetchCursosPopulares = async () => {
    const { data: subsData, error } = await supabase
      .from("subscriptions")
      .select("course_id");

    if (error || !subsData) return;

    const contagens = {};
    subsData.forEach(({ course_id }) => {
      contagens[course_id] = (contagens[course_id] || 0) + 1;
    });

    const ordenado = Object.entries(contagens)
      .sort(([, a], [, b]) => b - a)
      .map(([course_id]) => course_id)
      .slice(0, 15);

    const { data: cursosPop } = await supabase
      .from("courses")
      .select("*")
      .in("id", ordenado)
      .eq("status", "aprovado");

    const cursosComAutores = await Promise.all(
      cursosPop.map(async (curso) => {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", curso.creator_id)
          .single();

        return {
          ...curso,
          creator: perfil || { first_name: "Desconhecido", last_name: "" },
        };
      })
    );

    const ordenadosFinal = ordenado
      .map((id) => cursosComAutores.find((c) => c.id === id))
      .filter(Boolean);

    setPopulares(ordenadosFinal);
  };

  const fetchCursosComentados = async () => {
    const { data: commentsData, error } = await supabase
      .from("comments")
      .select("course_id");

    if (error || !commentsData) return;

    const contagens = {};
    commentsData.forEach(({ course_id }) => {
      contagens[course_id] = (contagens[course_id] || 0) + 1;
    });

    const ordenado = Object.entries(contagens)
      .sort(([, a], [, b]) => b - a)
      .map(([course_id]) => course_id)
      .slice(0, 15);

    const { data: cursosComentados } = await supabase
      .from("courses")
      .select("*")
      .in("id", ordenado)
      .eq("status", "aprovado");

    const cursosComAutores = await Promise.all(
      cursosComentados.map(async (curso) => {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", curso.creator_id)
          .single();

        return {
          ...curso,
          creator: perfil || { first_name: "Desconhecido", last_name: "" },
        };
      })
    );

    const ordenadosFinal = ordenado
      .map((id) => cursosComAutores.find((c) => c.id === id))
      .filter(Boolean);

    setComentados(ordenadosFinal);
  };

  const fetchCursosSubscritos = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("course_id")
      .eq("user_id", user.id);

    setSubscritos(subs?.map((s) => s.course_id) || []);
  };

  const renderCarrossel = (titulo, cursos, startIndex, setStartIndex) => (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">{titulo}</h4>
        <div className="d-flex gap-3">
          <FaChevronLeft
            className="text-dark"
            size={22}
            style={{ cursor: startIndex > 0 ? "pointer" : "not-allowed", opacity: startIndex > 0 ? 1 : 0.3 }}
            onClick={() => setStartIndex(Math.max(startIndex - 1, 0))}
          />
          <FaChevronRight
            className="text-dark"
            size={22}
            style={{
              cursor: startIndex + cursosPorSlide < cursos.length ? "pointer" : "not-allowed",
              opacity: startIndex + cursosPorSlide < cursos.length ? 1 : 0.3,
            }}
            onClick={() =>
              setStartIndex((prev) =>
                prev + cursosPorSlide < cursos.length ? prev + 1 : prev
              )
            }
          />
        </div>
      </div>

      <div className="row g-4">
        {cursos.slice(startIndex, startIndex + cursosPorSlide).map((curso) => (
          <div key={curso.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card h-100 shadow-sm border-0 position-relative">
              <Link to={`/curso/${curso.id}`}>
                {curso.thumbnail_url && (
                  <img
                    src={curso.thumbnail_url}
                    alt={curso.title}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
              </Link>
              <div className="card-body">
                <Link to={`/curso/${curso.id}`} className="text-decoration-none text-dark">
                  <h5
                    className="card-title"
                    style={{ transition: "0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    {curso.title}
                  </h5>
                </Link>
                <p className="card-text text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Criado por: {curso.creator?.first_name} {curso.creator?.last_name}
                </p>
              </div>
              {subscritos.includes(curso.id) && (
                <span className="badge bg-success position-absolute" style={{ bottom: "10px", right: "10px" }}>
                  Subscrito
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <img src={logo} alt="A carregar..." style={{ width: "150px", opacity: 0.6 }} />
        </div>
      ) : (
        <div className="container py-5" style={{ minHeight: "70vh" }}>
          <h1 className="text-center mb-5 fw-bold text-dark">Bem-vindo(a) aos Destaques da EDUX</h1>

          {recentes.length > 0 &&
            renderCarrossel("Lançados recentemente", recentes, startRecent, setStartRecent)}

          {populares.length > 0 &&
            renderCarrossel("Mais subscritos", populares, startPop, setStartPop)}

          {comentados.length > 0 &&
            renderCarrossel("Mais comentados", comentados, startComent, setStartComent)}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Destaques;
