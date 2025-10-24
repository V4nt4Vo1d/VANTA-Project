import { useEffect, useMemo, useState } from "react";

type LanyardData = {
  success: boolean;
  data?: {
    discord_user: { id: string; username: string; global_name?: string };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      id: string;
      name: string;
      details?: string | null;
      state?: string | null;
      type: number;
    }>;
  };
};

function dotColor(
  s: LanyardData["data"] extends { discord_status: infer T }
    ? T | undefined
    : "online" | "idle" | "dnd" | "offline" | undefined
) {
  const map: Record<string, string> = {
    online: "bg-emerald-500",
    idle: "bg-amber-500",
    dnd: "bg-rose-500",
    offline: "bg-zinc-500",
  };
  return map[s ?? "offline"];
}


export default function DiscordStatus({ discordId }: { discordId: string }) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [err, setErr] = useState(false);

  const status = data?.data?.discord_status;
  const activities = data?.data?.activities ?? [];
  const primary = useMemo(
    () =>
      activities.find((a) =>
        (a.name || "").toLowerCase().includes("visual studio code")
      ) || activities[0],
    [activities]
  );

  useEffect(() => {
    async function pull() {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${discordId}`,
          { cache: "no-store" }
        );
        setData(await res.json());
        setErr(false);
      } catch {
        setErr(true);
      }
    }
    pull();
    const timer = setInterval(pull, 15000);
    return () => clearInterval(timer);
  }, [discordId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm max-w-full">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor(status)}`} />
        <span className="text-sm text-zinc-300">
          Discord – {status ?? "unknown"}
        </span>
      </div>

      {err && <p className="mt-2 text-xs text-zinc-400">Presence unavailable</p>}

      {!err && primary && (
        <div className="mt-2">
          <p className="text-sm font-medium text-zinc-200">{primary.name}</p>
          {(primary.details || primary.state) && (
            <p className="text-xs text-zinc-400">
              {[primary.details, primary.state].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
      )}

      {!err && !primary && (
        <p className="mt-2 text-xs text-zinc-400">No recent activity</p>
      )}
    </div>
  );
}
