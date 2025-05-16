import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";
import { FiTrash } from "react-icons/fi";
import { FaPencil } from "react-icons/fa6";
import { TbArrowsUpDown } from "react-icons/tb";

function AdminUsers() {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [mensagem, setMensagem] = useState("");
  const [userParaRemover, setUserParaRemover] = useState(null);

  const navigate = useNavigate();
  const formSectionRef = useRef(null);
  const tabelaRef = useRef(null);

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

  const handleDelete = async () => {
    if (!userParaRemover?.id) return;

    const { error } = await supabase.rpc("desativar_utilizador", {
      user_id: userParaRemover.id,
    });

    if (error) {
      console.error("Erro ao desativar:", error.message);
    } else {
      setMensagem("Utilizador removido com sucesso.");
      tabelaRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensagem(""), 2000);
      fetchUsers();
    }

    setUserParaRemover(null);
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
      last: editUser.last_name,
      phone_input: editUser.phone,
      birth: editUser.birth_date,
    });

    if (error) {
      console.error("Erro ao atualizar:", error.message);
    } else {
      setMensagem("Alterações guardadas com sucesso.");
      tabelaRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setMensagem(""), 2000);
      setEditUser(null);
      fetchUsers();
    }
  };

  if (!authorized) return null;

  return (
    <AdminSidebar>

      {loading ? (
        <p className="text-center">A carregar utilizadores...</p>
      ) : (
        <>
          {mensagem && (
            <div ref={tabelaRef} className="alert alert-success text-center fw-semibold">
              {mensagem}
            </div>
          )}

          <div className="d-flex justify-content-end align-items-end mb-3 gap-2">
            <div>
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
            <button
              className="btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Ordem: ${sortOrder === "asc" ? "Ascendente" : "Descendente"}`}
            >
              <TbArrowsUpDown size={20} />
            </button>
          </div>

          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Email</th>
                  <th>Nome</th>
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
                    <td>{`${user.first_name || ""} ${user.last_name || ""}`.trim() || "-"}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.birth_date || "-"}</td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</td>
                    <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning me-2" title="Editar" onClick={() => handleEdit(user)}>
                        <FaPencil />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" title="Remover" onClick={() => setUserParaRemover(user)}>
                        <FiTrash />
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
                <label>Último Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.last_name || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, last_name: e.target.value })
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
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Guardar
              </button>
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
                Cancelar
              </button>
            </div>
          )}

          {/* Modal de confirmação de remoção */}
          {userParaRemover && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirmar remoção</h5>
                    <button type="button" className="btn-close" onClick={() => setUserParaRemover(null)}></button>
                  </div>
                  <div className="modal-body">
                    <p>Queres mesmo remover o utilizador <strong>{userParaRemover.email}</strong>?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleDelete}>Sim, remover</button>
                    <button className="btn btn-secondary" onClick={() => setUserParaRemover(null)}>Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminSidebar>
  );
}

export default AdminUsers;
