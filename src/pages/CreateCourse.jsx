import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";

function CreateCourse() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [message, setMessage] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [lastLocation, setLastLocation] = useState(location);
  const [creatingTest, setCreatingTest] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");

  const cardRef = useRef(null);

  useEffect(() => {
    document.title = "Criar Curso | EDUX";

    const stored = localStorage.getItem("novo_curso");
    if (stored) {
      const saved = JSON.parse(stored);
      setTitle(saved.title || "");
      setDescription(saved.description || "");
      if (saved.thumbnail_url) setPreviewUrl(saved.thumbnail_url);
      if (saved.sections) setSections(saved.sections);
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (location !== lastLocation && !showExitConfirm) {
      setShowExitConfirm(true);
      setPendingNavigation(() => () => {
        localStorage.removeItem("novo_curso");
        setShowExitConfirm(false);
        navigate(location.pathname);
      });
      setLastLocation(location);
    }
  }, [location, lastLocation, showExitConfirm, navigate]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      setTimeout(() => {
        setMessage("");
      }, 3500);
    }
  }, [message]);

  const saveToLocalStorage = () => {
    localStorage.setItem("novo_curso", JSON.stringify({
      title,
      description,
      thumbnail_url: previewUrl,
      sections,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setMessage("Seleciona um ficheiro de imagem válido.");
    }
  };

  const handleRemoveImage = () => {
    setThumbnailFile(null);
    setPreviewUrl(null);
  };

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const updated = [...sections, { title: newSectionTitle, items: [] }];
    setSections(updated);
    setNewSectionTitle("");
    saveToLocalStorage();
  };

  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
    saveToLocalStorage();
  };

  const addItemToSection = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].items.push({ title: "", video: null, file: null });
    setSections(updated);
    saveToLocalStorage();
  };

  const removeItemFromSection = (sectionIndex, itemIndex) => {
    const updated = [...sections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setSections(updated);
    saveToLocalStorage();
  };

  const updateItemField = (sectionIndex, itemIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].items[itemIndex][field] = value;
    setSections(updated);
    saveToLocalStorage();
  };

  const sanitizeFileName = (name) => {
    return name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "_");
  };

  const handleFinalizar = async () => {
    if (!title || !description || !thumbnailFile || sections.length === 0) {
      setMessage("Erro! Preenche todos os campos e adiciona alguma secção.");
      return;
    }

    for (const section of sections) {
      if (!section.items || section.items.length === 0) {
        setMessage("Erro! Cada secção deve conter pelo menos um item.");
        return;
      }
    }

    if (questions.length === 0) {
      setMessage("Erro! Deves adicionar pelo menos uma pergunta no teste.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      setMessage("Sessão inválida.");
      return;
    }

    try {
      // Upload thumbnail
      const ext = thumbnailFile.name.split(".").pop();
      const thumbFileName = sanitizeFileName(`${Date.now()}.${ext}`);
      const { error: thumbError } = await supabase
        .storage
        .from("course-thumbnails")
        .upload(thumbFileName, thumbnailFile);
      if (thumbError) {
        console.error("Erro no upload da thumbnail:", thumbError);
        setMessage("Erro no upload da thumbnail.");
        return;
      }
      const { data: thumbUrlData } = supabase
        .storage
        .from("course-thumbnails")
        .getPublicUrl(thumbFileName);
      const thumbnailUrl = thumbUrlData.publicUrl;

      // Cria o curso
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert({
          creator_id: user.id,
          title,
          description,
          thumbnail_url: thumbnailUrl,
          status: "pendente",
        })
        .select()
        .single();
      if (courseError || !course) throw courseError;
      console.log("Curso criado:", course);

      // Cria secções e items
      for (const section of sections) {
        const { data: sectionData, error: secError } = await supabase
          .from("sections")
          .insert({ course_id: course.id, title: section.title })
          .select()
          .single();
        if (secError || !sectionData) throw secError;
        console.log("Secção criada:", sectionData);

        for (const item of section.items) {
          if (!item.video) {
            setMessage("Erro! Cada item precisa de ter um vídeo associado.");
            return;
          }

          const videoName = sanitizeFileName(`${Date.now()}_${item.video.name}`);
          const { error: videoUploadError } = await supabase
            .storage
            .from("curso-conteudos")
            .upload(videoName, item.video);
          if (videoUploadError) {
            console.error("Erro no upload do vídeo:", videoUploadError);
            setMessage("Erro no upload do vídeo.");
            return;
          }
          const videoUrl = supabase.storage.from("curso-conteudos").getPublicUrl(videoName).data.publicUrl;

          let fileUrl = null;
          if (item.file) {
            const fileName = sanitizeFileName(`${Date.now()}_${item.file.name}`);
            const { error: fileUploadError } = await supabase
              .storage
              .from("curso-conteudos")
              .upload(fileName, item.file);
            if (fileUploadError) {
              console.error("Erro no upload do ficheiro:", fileUploadError);
              setMessage("Erro no upload do ficheiro.");
              return;
            }
            fileUrl = supabase.storage.from("curso-conteudos").getPublicUrl(fileName).data.publicUrl;
          }

          const { error: insertItemError } = await supabase.from("items").insert({
            section_id: sectionData.id,
            title: item.title,
            video_path: videoUrl,
            file_path: fileUrl,
          });
          if (insertItemError) {
            console.error("Erro ao inserir item:", insertItemError);
            setMessage("Erro ao inserir item.");
            return;
          }
          console.log("Item criado:", item.title);
        }
      }

      // Cria teste
      const { data: test, error: testError } = await supabase
        .from("course_tests")
        .insert({ course_id: course.id })
        .select()
        .single();
      if (testError || !test) throw testError;
      console.log("Teste criado:", test);

      // Cria perguntas e respostas
      for (const q of questions) {
        const { data: qData, error: qError } = await supabase
          .from("course_questions")
          .insert({ test_id: test.id, question: q.question })
          .select()
          .single();
        if (qError || !qData) throw qError;
        console.log("Pergunta criada:", qData);

        for (const a of q.answers) {
          const { error: aError } = await supabase.from("course_answers").insert({
            question_id: qData.id,
            answer: a.answer,
            is_correct: a.is_correct,
          });
          if (aError) {
            console.error("Erro ao inserir resposta:", aError);
            setMessage("Erro ao inserir resposta.");
            return;
          }
          console.log("Resposta criada:", a.answer);
        }
      }

      localStorage.removeItem("novo_curso");
      setMessage("Curso e teste submetidos com sucesso!");
      setTimeout(() => navigate("/sell-course"), 2000);

    } catch (error) {
      console.error("Erro no handleFinalizar:", error);
      setMessage("Erro ao submeter curso.");
    }
  };

  const handleCancelNavigation = () => {
    setShowExitConfirm(false);
    setPendingNavigation(null);
  };

  const handleConfirmExit = () => {
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        {/* Card principal com referência para scroll */}
        <div
          ref={cardRef}
          className="card shadow-lg p-5 border-0 w-100"
          style={{ maxWidth: "850px", marginTop: "80px", marginBottom: "80px" }}
        >
          <h2 className="fw-bold mb-4">Criar Curso</h2>

          {message && (
            <div className={`alert ${message.includes("Erro") ? "alert-danger" : "alert-success"}`}>
              {message}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Thumbnail</label>
            {!previewUrl ? (
              <div
                className="border rounded p-4 text-center bg-light"
                style={{ cursor: "pointer" }}
              >
                <label htmlFor="upload" className="text-muted" style={{ cursor: "pointer" }}>
                  <FiUpload size={32} className="mb-2" />
                  <div>Clica para selecionar imagem</div>
                </label>
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: "200px" }}
                />
                <br />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRemoveImage}
                >
                  Remover imagem
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Nova Secção</label>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Título da secção"
              />
              <button className="btn btn-success" type="button" onClick={addSection}>
                <FaPlus />
              </button>
            </div>
          </div>

          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4 border p-3 rounded bg-white position-relative">
              <h5 className="fw-bold d-flex justify-content-between align-items-center">
                <span>Secção: {section.title}</span>
                <IoTrashOutline
                  size={20}
                  onClick={() => removeSection(sectionIndex)}
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                />
              </h5>
              <button
                className="btn btn-sm btn-outline-success mb-3"
                type="button"
                onClick={() => addItemToSection(sectionIndex)}
              >
                + Adicionar Item
              </button>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border rounded p-3 mb-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Título do Item</label>
                    <IoTrashOutline
                      size={18}
                      onClick={() => removeItemFromSection(sectionIndex, itemIndex)}
                      style={{ cursor: "pointer" }}
                      className="text-danger"
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={item.title}
                    onChange={(e) => updateItemField(sectionIndex, itemIndex, "title", e.target.value)}
                  />
                  <label className="form-label">Vídeo (obrigatório)</label>
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control mb-2"
                    onChange={(e) => updateItemField(sectionIndex, itemIndex, "video", e.target.files[0])}
                    required
                  />
                  <label className="form-label">Ficheiro (opcional)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => updateItemField(sectionIndex, itemIndex, "file", e.target.files[0])}
                  />
                </div>
              ))}
            </div>
          ))}

          {creatingTest && (
            <div className="mt-4">
              <h4 className="fw-bold mb-3">Criar Teste Final</h4>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Texto da nova pergunta"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
              <button
                className="btn btn-outline-success mb-3"
                onClick={() => {
                  if (!newQuestionText.trim()) return;
                  setQuestions([
                    ...questions,
                    {
                      question: newQuestionText,
                      answers: [
                        { answer: "", is_correct: false },
                        { answer: "", is_correct: false },
                        { answer: "", is_correct: false },
                        { answer: "", is_correct: false },
                      ],
                    },
                  ]);
                  setNewQuestionText("");
                  saveToLocalStorage();
                }}
              >
                + Adicionar Pergunta
              </button>

              {questions.map((q, qIdx) => (
                <div key={qIdx} className="border rounded p-3 mb-3">
                  <h6>{q.question}</h6>
                  {q.answers.map((a, aIdx) => (
                    <div key={aIdx} className="d-flex align-items-center mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder={`Opção ${aIdx + 1}`}
                        value={a.answer}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].answers[aIdx].answer = e.target.value;
                          setQuestions(updated);
                          saveToLocalStorage();
                        }}
                      />
                      <input
                        type="checkbox"
                        checked={a.is_correct}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].answers = updated[qIdx].answers.map((opt, idx) => ({
                            ...opt,
                            is_correct: idx === aIdx ? e.target.checked : false, // só 1 pode ser true
                          }));
                          setQuestions(updated);
                          saveToLocalStorage();
                        }}
                      />
                      <span className="ms-1 small">Correta</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="text-end">
            {!creatingTest ? (
              <>
                <button
                  className="btn btn-primary px-4"
                  onClick={() => setCreatingTest(true)}
                >
                  Seguinte: Criar Teste
                </button>
                <button
                  className="btn btn-outline-danger ms-3"
                  onClick={() => {
                    setShowExitConfirm(true);
                    setPendingNavigation(() => () => {
                      localStorage.removeItem("novo_curso");
                      navigate("/sell-course");
                    });
                  }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-dark px-4"
                  onClick={handleFinalizar}
                >
                  Submeter Curso + Teste
                </button>
                <button
                  className="btn btn-outline-danger ms-3"
                  onClick={() => {
                    setShowExitConfirm(true);
                    setPendingNavigation(() => () => {
                      localStorage.removeItem("novo_curso");
                      navigate("/sell-course");
                    });
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showExitConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow text-center" style={{ maxWidth: "400px" }}>
            <h5 className="mb-3">Tens a certeza que queres sair?</h5>
            <p className="text-muted">Perderás os dados inseridos.</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-danger" onClick={handleConfirmExit}>
                Sim, sair
              </button>
              <button className="btn btn-secondary" onClick={handleCancelNavigation}>
                Cancelar
              </button>
            </div>
            <button
              className="btn btn-sm position-absolute top-0 end-0 m-2"
              onClick={handleCancelNavigation}
            >
              <IoClose size={18} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CreateCourse;

