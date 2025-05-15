import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      navigate("/");
    };

    logout();
  }, [navigate]);

  return null; // não mostra nada
}

export default Logout;
