import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../helper/supabaseClient";
import { GoPaste } from "react-icons/go";
import { FaRegCirclePlay } from "react-icons/fa6";

function CourseContent() {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    document.title = "Conteúdo do Curso | EDUX";
    fetchConteudo();
  }, [id]);

  const fetchConteudo = async () => {
    setLoading(true);

    const { data: secData, error: secError } = await supabase
      .from("sections")
      .select("id, title")
      .eq("course_id", id);

    const { data: itemsData, error: itemsError } = await supabase
      .from("items")
      .select("id, section_id, title, video_path, file_path");

    if (secError || itemsError || !secData || !itemsData) {
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
  };

  const toggleSection = (sectionId) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  const handleItemClick = (item) => {
    setCurrentItem(item);
  };

  return (
    <>
      <Header />
      <div className="container py-5" style={{ minHeight: "70vh" }}>
        <h2 className="mb-4">Conteúdo do Curso</h2>

        {loading ? (
          <p>A carregar conteúdo...</p>
        ) : (
          <div className="d-flex bg-white shadow rounded" style={{ overflow: "hidden" }}>
            {/* Coluna do vídeo */}
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
                <p className="text-muted">Nenhum vídeo disponível.</p>
              )}
            </div>

            {/* Lista lateral */}
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
                        <ul className="list-group list-group-flush">
                          {sec.items.map((item) => (
                            <li
                              key={item.id}
                              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-3 ${currentItem?.id === item.id ? "active" : ""}`}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleItemClick(item)}
                            >
                              <span><FaRegCirclePlay size={12}/> {item.title}</span>
                              {item.file_path && (
                                <a
                                  href={item.file_path}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-muted small text-decoration-none"
                                >
                                  <GoPaste size={14}/>  anexo
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CourseContent;
