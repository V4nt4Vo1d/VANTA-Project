
const SUPABASE_URL = "https://qpraoumykzkbfygopggf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcmFvdW15a3prYmZ5Z29wZ2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTg1MjUsImV4cCI6MjA3OTkzNDUyNX0.MfTXva2szbPAkZmMBYkee2_pcPLzDEyYUKjghf45Zd";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const bootText = `
Δ SECURE TERMINAL v3.0
Link: VANTA-PROJECT // AUTH NODE
Cipher suites online...
Key exchange stable...
READY FOR OPERATOR LOGIN.
`;

const bootElement = document.getElementById("boot-text");
let i = 0;

function typeBoot() {
  if (i < bootText.length) {
    bootElement.textContent += bootText.charAt(i);
    i++;
    setTimeout(typeBoot, 20);
  }
}
typeBoot();

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || "/"; // default to site root
}

// ====== Handle login ======
const form = document.getElementById("login-form");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  result.textContent = "";
  result.style.color = "#00faff";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    result.style.color = "#ff3355";
    result.textContent = "MISSING CREDENTIALS — Provide Operator ID and Access Key.";
    return;
  }

  result.textContent = "VALIDATING CREDENTIALS…";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    result.style.color = "#ff3355";
    result.textContent = "ACCESS DENIED — Unauthorized credentials.";
    return;
  }

  result.style.color = "#00ff88";
  result.textContent = "ACCESS GRANTED — Welcome to the VANTΔ Project.";

  setTimeout(() => {
    const target = getRedirectTarget();
    window.location.href = target;
  }, 800);
});
