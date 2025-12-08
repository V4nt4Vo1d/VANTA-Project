import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./vanta-login.css";

export default function VantaLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [boot, setBoot] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const bootText = [
    "Δ SECURE TERMINAL v3.0",
    "Link: VANTΔ-PROJECT // AUTH NODE",
    "Cipher suites online...",
    "Key exchange stable...",
    "READY FOR OPERATOR LOGIN."
  ].join("\n");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i <= bootText.length) {
        setBoot(bootText.slice(0, i));
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [bootText]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("VALIDATING CREDENTIALS…");

    const emailClean = email.trim().toLowerCase();
    const passwordClean = password.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email: emailClean,
      password: passwordClean,
    });

    if (error) {
      setStatus("ACCESS DENIED — Unauthorized credentials.");
      return;
    }

    setStatus("ACCESS GRANTED — Welcome, Operator.");
    setTimeout(() => onAuthenticated(), 800);
  }

  return (
    <div className="vanta-login-wrapper min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="scanlines"></div>

      <div className="terminal">
        <div className="boot-text">{boot}</div>

        <form onSubmit={handleLogin} className="login-form">
          <label>Operator ID (email):</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Access Key:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">INITIATE LOGIN</button>
        </form>

        {status && <div className="status">{status}</div>}
      </div>

      <footer className="mt-10 py-6 text-center text-sm leading-relaxed max-w-lg px-6 border-t border-red-500/40 text-red-400 font-medium tracking-wide">
        <p>RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY</p>
        <p className="mt-2 text-red-300/80">
          This system is monitored. Unauthorized use may result in administrative,
          civil, or criminal penalties.
        </p>
      </footer>
    </div>
  );
}
