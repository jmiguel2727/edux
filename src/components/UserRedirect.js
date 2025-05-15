import supabase from "../helper/supabaseClient";

/** Redireciona o user para "/home" se não estiver autenticado e guarda o caminho para redirecionar após login.*/
export async function useUserRedirect(navigate, fromPath) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    navigate("/home", { state: { from: fromPath } });
    return false;
  }

  return true;
}
