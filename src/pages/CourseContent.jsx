import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { GoPaste } from "react-icons/go";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSectionId, setOpenSectionId] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [completedLoaded, setCompletedLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [progressId, setProgressId] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [testPassed, setTestPassed] = useState(false);

  useEffect(() => {
    document.title = "Conteúdo do Curso | EDUX";
    fetchConteudo();
  }, [id]);

  const fetchConteudo = async () => {
    setLoading(true);

    const { data: secData } = await supabase
      .from("sections")
      .select("id, title")
      .eq("course_id", id);

    const { data: itemsData } = await supabase
      .from("items")
      .select("id, section_id, title, video_path, file_path");

    if (!secData || !itemsData) {
      setSections([]);
      setLoading(false);
      return;
    }

    const mappedSections = secData.map((sec) => ({
      ...sec,
      items: itemsData.filter((item) => item.section_id === sec.id),
    }));

    setSections(mappedSections);
    setOpenSectionId(mappedSections[0]?.id || null);
    setCurrentItem(mappedSections[0]?.items[0] || null);
    setLoading(false);

    await fetchProgresso();
    await fetchTestResult();
  };

  const fetchProgresso = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data: prog } = await supabase
      .from("progress")
      .select("id, total_items")
      .eq("course_id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!prog) {
      alert("Este curso não foi subscrito corretamente. Por favor subscreva antes de aceder ao conteúdo.");
      return;
    }

    setProgressId(prog.id);
    setTotalItems(prog.total_items);

    const { data: items } = await supabase
      .from("progress_items")
      .select("item_id")
      .eq("progress_id", prog.id)
      .eq("completed", true);

    setCompletedItems(items?.map(i => i.item_id) || []);
    setCompletedLoaded(true);
  };

  const fetchTestResult = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data: tests } = await supabase
      .from("course_tests")
      .select("id")
      .eq("course_id", id)
      .limit(1);

    if (!tests || tests.length === 0) {
      setTestPassed(false);
      return;
    }

    const testId = tests[0].id;

    const { data: result } = await supabase
      .from("test_results")
      .select("passed")
      .eq("test_id", testId)
      .eq("user_id", userId)
      .maybeSingle();

    setTestPassed(result?.passed === true);
  };

  const toggleSection = (sectionId) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  const handleItemClick = (item) => {
    setCurrentItem(item);
  };

  const openCheckModal = (itemId, action) => {
    setModalItem(itemId);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmModal = async () => {
    if (!progressId || !modalItem) {
      setShowModal(false);
      return;
    }

    const completed = modalAction === "check";

    const { data: existing } = await supabase
      .from("progress_items")
      .select("*")
      .eq("progress_id", progressId)
      .eq("item_id", modalItem)
      .maybeSingle();

    if (existing) {
      if (completed) {
        await supabase
          .from("progress_items")
          .update({
            completed: true,
            completed_at: new Date()
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("progress_items")
          .delete()
          .eq("id", existing.id);
      }
    } else if (completed) {
      await supabase
        .from("progress_items")
        .insert({
          progress_id: progressId,
          item_id: modalItem,
          completed: true,
          completed_at: new Date()
        });
    }

    const { count } = await supabase
      .from("progress_items")
      .select("id", { count: "exact", head: true })
      .eq("progress_id", progressId)
      .eq("completed", true);

    await supabase
      .from("progress")
      .update({ completed_items: count })
      .eq("id", progressId);

    setCompletedItems(prev => {
      if (completed) {
        return [...prev, modalItem];
      } else {
        return prev.filter(id => id !== modalItem);
      }
    });

    setShowModal(false);
  };

  const percent = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;

  // Se completou todas as aulas
  const allCompleted = totalItems > 0 && completedItems.length === totalItems;

  return (
    <>
      <Header />
      <div className="container py-5" style={{ minHeight: "70vh" }}>
        <h2 className="mb-4">Conteúdo do Curso</h2>

        {/* Botão Concluir Curso aparece logo acima da barra de progresso */}
        {allCompleted && !testPassed && (
          <div className="mb-3 d-flex justify-content-center">
            <Button
              variant="success"
              onClick={() => navigate(`/curso/${id}/teste/fazer`)}
            >
              Concluir Curso
            </Button>
          </div>
        )}

        {testPassed && (
          <div className="mb-3 d-flex justify-content-center">
            <span className="badge bg-success fs-5">Curso concluído ✔️</span>
          </div>
        )}

        <ProgressBar
          now={percent}
          label={`${percent}% concluído`}
          className="mb-4"
        />

        {loading ? (
          <p>A carregar conteúdo...</p>
        ) : (
          <div className="d-flex bg-white shadow rounded" style={{ overflow: "hidden" }}>
            <div className="p-4" style={{ flex: "0 0 70%", borderRight: "1px solid #dee2e6" }}>
              <h5 className="mb-3">{currentItem?.title}</h5>
              {currentItem?.video_path ? (
                <video
                  key={currentItem.id}
                  controls
                  className="w-100 rounded"
                  style={{ maxHeight: "420px" }}
                >
                  <source src={currentItem.video_path} type="video/mp4" />
                  O teu navegador não suporta vídeo embutido.
                </video>
              ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  <p className="text-muted mb-0">Nenhum vídeo disponível para este item.</p>
                </div>
              )}
            </div>

            <div className="p-3" style={{ flex: "0 0 30%", background: "#f9f9f9" }}>
              <h6 className="mb-3">Secções</h6>
              <div className="accordion" id="courseAccordion">
                {sections.map((sec) => (
                  <div className="accordion-item mb-2 border-0" key={sec.id}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${openSectionId === sec.id ? "" : "collapsed"}`}
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                      >
                        {sec.title}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${openSectionId === sec.id ? "show" : ""}`}>
                      <div className="accordion-body p-2">
                        {completedLoaded ? (
                          <ul className="list-group list-group-flush">
                            {sec.items.map((item) => (
                              <li
                                key={item.id} 
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-3 ${currentItem?.id === item.id ? "active" : ""}`}
                              >
                                <span onClick={() => handleItemClick(item)} style={{ cursor: "pointer" }}>
                                  <FaRegCirclePlay size={12} /> {item.title}
                                </span>
                                <div>
                                  <Button
                                    size="sm"
                                    variant={completedItems.includes(item.id) ? "success" : "warning"}
                                    onClick={() => openCheckModal(item.id, completedItems.includes(item.id) ? "uncheck" : "check")}
                                  >
                                    {completedItems.includes(item.id) ? (
                                      <AiFillEye />
                                    ) : (
                                      <AiFillEyeInvisible color="white" />
                                    )}
                                  </Button>
                                  {item.file_path && (
                                    <a
                                      href={item.file_path}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-muted small text-decoration-none ms-2"
                                    >
                                      <GoPaste size={14} /> anexo
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">A carregar progresso...</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem a certeza que pretende {modalAction === "check" ? "marcar" : "remover"} esta aula como concluída?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmModal}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default CourseContent;
