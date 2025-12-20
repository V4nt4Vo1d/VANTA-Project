const BC_BASE = "https://ballchasing.com/api";

function requireKey() {
  const key = process.env.BALLCHASING_API_KEY;
  if (!key) throw new Error("Missing BALLCHASING_API_KEY");
  return key;
}

function fmtDuration(seconds) {
  if (typeof seconds !== "number") return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function getRecentReplays({ groupId, count = 10 }) {
  const key = requireKey();

  const url = new URL(`${BC_BASE}/replays`);
  if (groupId) url.searchParams.set("group", groupId);
  url.searchParams.set("count", String(count));

  const res = await fetch(url.toString(), {
    headers: { "Authorization": key }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ballchasing request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const list = json?.list || [];

  const items = list.map(r => {
    const blue = r.blue || {};
    const orange = r.orange || {};
    const date = r.date || r.created || null;

    const blueGoals = blue.goals ?? null;
    const orangeGoals = orange.goals ?? null;

    let result = null;
    if (typeof blueGoals === "number" && typeof orangeGoals === "number") {
      result = blueGoals > orangeGoals ? "win" : (blueGoals < orangeGoals ? "loss" : "draw");
    }

    const players = [];
    for (const team of [blue, orange]) {
      for (const p of (team.players || [])) {
        players.push({
          name: p.name,
          score: p?.stats?.core?.score ?? 0,
          goals: p?.stats?.core?.goals ?? 0,
          assists: p?.stats?.core?.assists ?? 0,
          saves: p?.stats?.core?.saves ?? 0,
          shots: p?.stats?.core?.shots ?? 0,
        });
      }
    }
    players.sort((a,b)=> (b.score - a.score) || (b.goals-a.goals) || (b.assists-a.assists));

    return {
      id: r.id,
      url: r.link || (r.id ? `https://ballchasing.com/replay/${r.id}` : null),
      date,
      map: r.map_name || r.map || null,
      playlist: r.playlist_name || r.playlist || null,
      teamSize: r.team_size || null,
      season: r.season ? `Season ${r.season}` : null,
      overtime: !!r.overtime,
      duration: fmtDuration(r.duration),
      blueGoals,
      orangeGoals,
      result,
      topPlayer: players[0]?.name || null,
      note: players[0] ? `${players[0].score} score • ${players[0].goals}G ${players[0].assists}A ${players[0].saves}S` : "",
    };
  });

  return {
    ok: true,
    note: groupId ? "Source: ballchasing.com (group filtered)" : "Source: ballchasing.com (latest uploads)",
    items
  };
}
