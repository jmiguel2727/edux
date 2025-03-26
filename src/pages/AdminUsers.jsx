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
  const navigate = useNavigate();
  const formSectionRef = useRef(null);

  useEffect(() => {
    document.title = "Utilizadores | EDUX";
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

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

    setUsers(data);
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
      last: editUser.last_name,
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
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.birth_date || "-"}</td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</td>
                    <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Remover</button>
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
                Guardar alterações
              </button>
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
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
