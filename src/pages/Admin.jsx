import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";

function Admin() {
  const [email, setEmail] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [pendingCourses, setPendingCourses] = useState(0);

  useEffect(() => {
    document.title = "Admin | EDUX";

    const fetchData = async () => {
      // Obter a sessão do utilizador atual
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setEmail(session.user.email);
      }

      // Chamada à function contar_utilizadores
      const { data: total, error: totalError } = await supabase.rpc("contar_utilizadores");
      // Chamada à function contar_utilizadores_ativos
      const { data: active, error: activeError } = await supabase.rpc("contar_utilizadores_ativos");

      if (!totalError && total !== null) setTotalUsers(total);
      if (!activeError && active !== null) setActiveUsers(active);

      // Buscar número de cursos pendentes (status = 'pendente')
      // Usamos { count: 'exact', head: true } para só contar, sem trazer linhas
      const {
        count,
        error: pendingError,
      } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      if (!pendingError && typeof count === "number") {
        setPendingCourses(count);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminSidebar>
      <h2 className="fw-bold mb-3">Painel de Administração</h2>
      <p className="text-muted">Bem-vindo, {email}</p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Total de Utilizadores</h5>
              <p className="card-text fs-4">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Utilizadores Ativos</h5>
              <p className="card-text fs-4">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-warning mb-3 shadow">
            <div className="card-body">
              <h5 className="card-title">Cursos por Aprovar</h5>
              {/* Mostrar o número de cursos pendentes em vez de valor estático */}
              <p className="card-text fs-4">{pendingCourses}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default Admin;
