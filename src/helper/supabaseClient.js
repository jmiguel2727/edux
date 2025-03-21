import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://meqdozmogepgylluvpwx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcWRvem1vZ2VwZ3lsbHV2cHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTkzMTQsImV4cCI6MjA1ODA3NTMxNH0.6g5dsKESEnIBnbxj3l0dd0PU3xGlX_etijnXKv33OV8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;