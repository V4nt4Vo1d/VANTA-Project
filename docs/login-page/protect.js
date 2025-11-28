// protect.js
const SUPABASE_URL = "https://qpraoumykzkbfygopggf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcmFvdW15a3prYmZ5Z29wZ2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTg1MjUsImV4cCI6MjA3OTkzNDUyNX0.MfTXva2szbPAkZmMBYkee2_pcPLzDEyYUKjghf45Zd";

const supabaseProtectClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function enforceAuth() {
  const { data, error } = await supabaseProtectClient.auth.getSession();

  if (error) {
    console.error("Error checking session:", error);
  }

  const session = data?.session;

  if (!session) {
    const currentPath = window.location.pathname + window.location.search;
    const encoded = encodeURIComponent(currentPath);
    window.location.href = `/auth/index.html.html?redirect=${encoded}`;
  }
}

async function vantaLogout() {
  await supabaseProtectClient.auth.signOut();
  window.location.href = "/auth/index.html";
}

enforceAuth();
window.vantaLogout = vantaLogout;
