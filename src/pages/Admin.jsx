import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import AdminSidebar from "../components/AdminSidebar";

export default function Admin() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Admin | EDUX";
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email);
      }
    };
    fetchSession();
  }, []);

  return (
    <AdminSidebar>
      <h2>Página de administradores</h2>
      <p>Bem-vindo, {email}</p>
    </AdminSidebar>
  );
}
