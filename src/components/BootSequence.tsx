import { useState, useEffect, useRef } from "react";
import "./boot-sequence.css";

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const bootText = [
    "VANTΔ-OS SECURE BOOT v1.4",
    "Initializing core system modules… OK",
    "Verifying cryptographic environment… OK",
    "Loading authentication services… OK",
    "Establishing secure uplink to AUTH NODE… STABLE",
    "Activating system monitoring… ENABLED",
    "Launching VANTΔ Secure Terminal…",
    "",
    "READY."
  ].join("\n");

  const [display, setDisplay] = useState("");
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skippedRef = useRef(false);

  useEffect(() => {
    let i = 0;

    intervalRef.current = setInterval(() => {
      i += 1;

      if (i <= bootText.length) {
        setDisplay(bootText.slice(0, i));
      } else {
        clear();
        setTimeout(() => onComplete(), 700);
      }
    }, 18);

    return () => clear();
  }, []);

  function clear() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function skipBoot() {
    if (skippedRef.current) return;
    skippedRef.current = true;

    clear();

    setDisplay(bootText);

    setTimeout(() => onComplete(), 600);
  }

  return (
    <div className="boot-screen" onClick={skipBoot}>
      <div className="scanlines"></div>
      <pre className="boot-text">{display}</pre>
    </div>
  );
}

