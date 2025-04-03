import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../helper/supabaseClient";

export default function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!error && profile) {
        setRole(profile.role);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Não autenticado
  if (!authenticated) return <Navigate to="/login" />;

  const isAdmin = role === "admin";
  const path = location.pathname;

  const adminRoutes = ["/admin", "/admin/users", "/admin/course", "/logout"];

  // Se for admin mas tentou ir a página normal → redireciona para /admin
  if (isAdmin && !adminRoutes.includes(path)) {
    return <Navigate to="/admin" />;
  }

  // Se for user e tentou ir a uma página admin → redireciona para /destaques
  if (!isAdmin && path.startsWith("/admin")) {
    return <Navigate to="/destaques" />;
  }

  return <>{children}</>;
}
