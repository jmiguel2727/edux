import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pendente");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Gestão de Denúncias | EDUX";
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select(`
        id,
        created_at,
        status,
        comment_id,
        comments (
          id,
          content,
          is_visible,
          created_at,
          profiles (
            first_name,
            last_name
          ),
          course_id
        )
      `)
      .eq("status", statusFilter)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Erro ao carregar denúncias: " + error.message);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  const resolverReport = async (reportId, commentId, manterVisivel) => {
    const { error: commentError } = await supabase
      .from("comments")
      .update({ is_visible: manterVisivel })
      .eq("id", commentId);

    if (commentError) {
      console.error("Erro ao atualizar comentário:", commentError.message);
      alert("Erro ao atualizar comentário.");
      return;
    }

    const { error: reportError } = await supabase
      .from("reports")
      .update({ status: "resolvido" })
      .eq("id", reportId);

    if (reportError) {
      console.error("Erro ao atualizar report:", reportError.message);
      alert("Erro ao atualizar denúncia.");
      return;
    }

    fetchReports();
  };

  return (
    <AdminSidebar>
      <div className="container p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Gestão de Denúncias</h2>
          <div style={{ minWidth: "180px" }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="pendente">Pendentes</option>
              <option value="resolvido">Resolvidas</option>
            </select>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        {loading ? (
          <p>A carregar denúncias...</p>
        ) : reports.length === 0 ? (
          <p className="text-muted">Não há denúncias {statusFilter} no momento.</p>
        ) : (
          <div className="row">
            {reports.map((report) => {
              const comentario = report.comments;

              return (
                <div key={report.id} className="col-md-6 mb-4">
                  <div className="card shadow">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">
                        Comentário de {comentario?.profiles?.first_name} {comentario?.profiles?.last_name}
                      </h6>
                      <p className="card-text">{comentario?.content}</p>

                      <p className="text-muted small mb-2">
                        Estado do comentário:{" "}
                        {comentario?.is_visible ? (
                          <span className="text-success">Visível</span>
                        ) : (
                          <span className="text-danger">Apagado</span>
                        )}
                      </p>

                      {statusFilter === "pendente" ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => resolverReport(report.id, comentario.id, false)}
                          >
                            Apagar comentário
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => resolverReport(report.id, comentario.id, true)}
                          >
                            Manter comentário
                          </button>
                        </div>
                      ) : (
                        <p className="text-end mb-0">
                          <span className="badge bg-secondary">Resolvido</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminReports;
