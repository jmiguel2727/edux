import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";

function Admin() {
  const [email, setEmail] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [pendingCourses, setPendingCourses] = useState(0);
  const [pendingReports, setPendingReports] = useState(0); // NOVO

  useEffect(() => {
    document.title = "Admin | EDUX";

    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) setEmail(session.user.email);

      const { data: total, error: totalError } = await supabase.rpc("contar_utilizadores");
      const { data: active, error: activeError } = await supabase.rpc("contar_utilizadores_ativos");

      if (!totalError && total !== null) setTotalUsers(total);
      if (!activeError && active !== null) setActiveUsers(active);

      const {
        count: courseCount,
        error: pendingError,
      } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      if (!pendingError && typeof courseCount === "number") {
        setPendingCourses(courseCount);
      }

      // buscar número de reports (denúncias)
      const {
        count: reportCount,
        error: reportError,
      } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      if (!reportError && typeof reportCount === "number") {
        setPendingReports(reportCount);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminSidebar>
      <h2 className="fw-bold mb-3">Painel de Administração</h2>
      <p className="text-muted">Bem-vindo, {email}</p>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-bg-primary mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Total de Utilizadores</h5>
              <p className="card-text fs-4">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-success mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Utilizadores Ativos</h5>
              <p className="card-text fs-4">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-warning mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Cursos por Aprovar</h5>
              <p className="card-text fs-4">{pendingCourses}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-danger mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Denúncias por Ver</h5>
              <p className="card-text fs-4">{pendingReports}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default Admin;
