import React, { useEffect, useState } from "react";
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
        setRole(null);
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

  const path = location.pathname;

  // Rotas públicas (corrigidas com "/")
  const publicRoutes = [
    "/",
    "/home",
    "/login",
    "/register",
    "/destaques",
    "/categoria",
    "/coursepreview",
    "/profile",
    "/subscriptions",
    "/sellcourse"
  ];
  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  // Rotas da área de administração
  const adminRoutes = [
    "/admin",
    "/admin/users",
    "/admin/course",
    "/admin/course-edit",
    "/logout"
  ];
  const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(route + "/"));

  // user (não autenticado)
  if (!authenticated) {
    if (isAdminRoute) return <Navigate to="/home" />; // Protege rotas de admin
    if (isPublic) return <>{children}</>;
    return <Navigate to="/home" />;
  }

  // user autenticado normal
  if (authenticated && role !== "admin") {
    if (isAdminRoute) return <Navigate to="/destaques" />; // bloqueia admin
    return <>{children}</>;
  }

  // Admin autenticado
  if (authenticated && role === "admin") {
    if (!isAdminRoute) return <Navigate to="/admin" />;
    return <>{children}</>;
  }

  return null;
}
