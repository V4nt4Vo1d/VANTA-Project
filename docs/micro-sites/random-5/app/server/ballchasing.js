const BC_BASE = "https://ballchasing.com/api";

function normalizeText(value) {
  return (value || "").toString().trim().toLowerCase();
}

function playerMatchesAlias(player, aliases) {
  if (!player || !(aliases instanceof Set) || aliases.size === 0) return false;

  const candidateValues = [];

  if (player.name) candidateValues.push(player.name);

  if (player.id && typeof player.id === "object") {
    for (const value of Object.values(player.id)) {
      if (typeof value === "string" || typeof value === "number") {
        candidateValues.push(value);
      }
    }
  }

  for (const value of candidateValues) {
    const normalized = normalizeText(value);
    if (normalized && aliases.has(normalized)) return true;
  }

  return false;
}

function resolveTeamSideByAliases(bluePlayers, orangePlayers, aliases) {
  if (!(aliases instanceof Set) || aliases.size === 0) return null;

  const inBlue = (bluePlayers || []).some((p) => playerMatchesAlias(p, aliases));
  const inOrange = (orangePlayers || []).some((p) => playerMatchesAlias(p, aliases));

  if (inBlue && !inOrange) return "blue";
  if (inOrange && !inBlue) return "orange";
  return null;
}

function resolveKey() {
  const key = (
    process.env.BALLCHASING_API_KEY ||
    process.env.BALLCHASING_TOKEN ||
    process.env.BC_API_KEY ||
    ""
  ).trim();

  if (!key) {
    throw new Error("Missing Ballchasing API key. Set BALLCHASING_API_KEY (or BALLCHASING_TOKEN).");
  }

  return key.replace(/^Bearer\s+/i, "");
}

async function requestJson(url, token) {
  const res = await fetch(url, {
    headers: { "Authorization": token }
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(`Ballchasing request failed: ${res.status} ${text}`);
  }

  if (!text) return {};
  return JSON.parse(text);
}

async function fetchReplayDetailsById(id, token) {
  if (!id) return null;
  try {
    return await requestJson(`${BC_BASE}/replays/${encodeURIComponent(id)}`, token);
  } catch {
    return null;
  }
}

function fmtDuration(seconds) {
  if (typeof seconds !== "number") return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function mapPlayer(p) {
  return {
    name: p.name,
    score: p?.stats?.core?.score ?? 0,
    goals: p?.stats?.core?.goals ?? 0,
    assists: p?.stats?.core?.assists ?? 0,
    saves: p?.stats?.core?.saves ?? 0,
    shots: p?.stats?.core?.shots ?? 0,
    demos: p?.stats?.demo?.inflicted ?? 0,
  };
}

function sortPlayers(players) {
  return [...players].sort((a, b) => {
    return (b.score - a.score) || (b.goals - a.goals) || (b.assists - a.assists) || (b.saves - a.saves);
  });
}

export async function getRecentReplays({ groupId, count = 10, focusPlayerAliases = [] }) {
  const key = resolveKey();

  const aliasSet = new Set(
    (Array.isArray(focusPlayerAliases) ? focusPlayerAliases : [])
      .map((x) => normalizeText(x))
      .filter(Boolean)
  );

  const safeCount = Number.isFinite(count) ? Math.min(Math.max(Number(count), 1), 200) : 10;

  const primary = new URL(`${BC_BASE}/replays`);
  if (groupId) primary.searchParams.set("group", groupId);
  primary.searchParams.set("count", String(safeCount));

  let json;
  try {
    json = await requestJson(primary.toString(), key);
  } catch (primaryErr) {
    if (!groupId) throw primaryErr;

    const fallback = new URL(`${BC_BASE}/groups/${encodeURIComponent(groupId)}/replays`);
    fallback.searchParams.set("count", String(safeCount));

    try {
      json = await requestJson(fallback.toString(), key);
    } catch (fallbackErr) {
      throw new Error(`${primaryErr.message} | Fallback failed: ${fallbackErr.message}`);
    }
  }
  const list = json?.list || [];

  const detailList = await Promise.all(
    list.map(async (r) => {
      const detailed = await fetchReplayDetailsById(r?.id, key);
      return detailed || r;
    })
  );

  const items = detailList.map(r => {
    const blue = r.blue || {};
    const orange = r.orange || {};
    const date = r.date || null;

    const rawBluePlayers = Array.isArray(blue.players) ? blue.players : [];
    const rawOrangePlayers = Array.isArray(orange.players) ? orange.players : [];

    const bluePlayers = sortPlayers(rawBluePlayers.map(mapPlayer));
    const orangePlayers = sortPlayers(rawOrangePlayers.map(mapPlayer));

    const derivedBlueGoals = bluePlayers.reduce((sum, p) => sum + (Number.isFinite(p.goals) ? p.goals : 0), 0);
    const derivedOrangeGoals = orangePlayers.reduce((sum, p) => sum + (Number.isFinite(p.goals) ? p.goals : 0), 0);

    const blueGoals = typeof blue.goals === "number" ? blue.goals : derivedBlueGoals;
    const orangeGoals = typeof orange.goals === "number" ? orange.goals : derivedOrangeGoals;

    let winnerSide = null;
    if (typeof blueGoals === "number" && typeof orangeGoals === "number") {
      winnerSide = blueGoals > orangeGoals ? "blue" : (blueGoals < orangeGoals ? "orange" : "draw");
    }

    const myTeamSide = resolveTeamSideByAliases(rawBluePlayers, rawOrangePlayers, aliasSet);

    let result = null;
    if (winnerSide === "draw") {
      result = "draw";
    } else if (myTeamSide && winnerSide) {
      result = myTeamSide === winnerSide ? "win" : "loss";
    }

    return {
      id: r.id,
      url: r.id ? `https://ballchasing.com/replay/${r.id}` : (r.link || null),
      date,
      blueTeamName: blue.name || "Blue",
      orangeTeamName: orange.name || "Orange",
      bluePlayers,
      orangePlayers,
      blueTopPerformer: bluePlayers[0]?.name || null,
      orangeTopPerformer: orangePlayers[0]?.name || null,
      map: r.map_name || r.map || null,
      playlist: r.playlist_name || r.playlist || null,
      teamSize: r.team_size || null,
      season: r.season ? `Season ${r.season}` : null,
      overtime: !!r.overtime,
      duration: fmtDuration(r.duration),
      blueGoals,
      orangeGoals,
      result,
      myTeamSide,
    };
  });

  return {
    ok: true,
    note: groupId ? "Source: ballchasing.com (group filtered)" : "Source: ballchasing.com (latest uploads)",
    items
  };
}
