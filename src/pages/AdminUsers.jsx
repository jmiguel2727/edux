import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";

function AdminUsers() {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();
  const formSectionRef = useRef(null);

  useEffect(() => {
    document.title = "Utilizadores | EDUX";
    checkSession();
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchUsers();
    }
  }, [sortField, sortOrder]);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      navigate("/");
      return;
    }

    setSession(session);
    setAuthorized(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase.rpc("get_all_profiles");

    if (error) {
      console.error("Erro ao buscar perfis:", error.message);
      setLoading(false);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    setUsers(sortedData);
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!userId) return;

    const confirmed = window.confirm("Tens a certeza que queres remover este utilizador?");
    if (!confirmed) return;

    const { error } = await supabase.rpc("desativar_utilizador", {
      user_id: userId,
    });

    if (error) {
      console.error("Erro ao desativar:", error.message);
      alert("Erro ao desativar utilizador.");
    } else {
      alert("Utilizador desativado com sucesso.");
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleUpdate = async () => {
    if (!editUser) return;

    const { error } = await supabase.rpc("atualizar_utilizador", {
      user_id: editUser.id,
      first: editUser.first_name,
      last: null, // remove last_name, or set it to empty
      phone_input: editUser.phone,
      birth: editUser.birth_date,
    });

    if (error) {
      alert("Erro ao atualizar utilizador.");
      console.error(error.message);
    } else {
      alert("Utilizador atualizado com sucesso.");
      setEditUser(null);
      fetchUsers();
    }
  };

  if (!authorized) return null;

  return (
    <AdminSidebar>
      <h2 className="mb-4">Gestão de Utilizadores</h2>

      {loading ? (
        <p className="text-center">A carregar utilizadores...</p>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3 gap-3">
            <div>
              <label className="form-label me-2">Ordenar por:</label>
              <select
                className="form-select"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="first_name">Nome</option>
                <option value="email">Email</option>
                <option value="created_at">Criado em</option>
                <option value="last_sign_in_at">Último login</option>
              </select>
            </div>
            <div>
              <label className="form-label me-2">Ordem:</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Email</th>
                  <th>Primeiro Nome</th>
                  <th>Telefone</th>
                  <th>Data de Nascimento</th>
                  <th>Criado em</th>
                  <th>Último login</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.first_name || "-"}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.birth_date || "-"}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editUser && (
            <div ref={formSectionRef} className="border p-4 rounded bg-light">
              <h4>Editar Utilizador</h4>
              <div className="mb-2">
                <label>Primeiro Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.first_name || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, first_name: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Telemóvel:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label>Data de Nascimento:</label>
                <input
                  type="date"
                  className="form-control"
                  value={editUser.birth_date || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, birth_date: e.target.value })
                  }
                />
              </div>
              <button
                className="btn btn-success me-2"
                onClick={handleUpdate}
              >
                Guardar alterações
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditUser(null)}
              >
                Cancelar
              </button>
            </div>
          )}
        </>
      )}
    </AdminSidebar>
  );
}

export default AdminUsers;
