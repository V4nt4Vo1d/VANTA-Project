const API = {
  team: "./data/team.json",
  twitchLive: (logins) => `/api/twitch/live?logins=${encodeURIComponent(logins.join(","))}`,
  matches: "/api/ballchasing/recent",
  saveSnapshot: "/api/team/snapshot",
};

function qs(sel) { return document.querySelector(sel); }
function el(id) { return document.getElementById(id); }

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || url}`);
  }
  return res.json();
}

function safeText(s) { return (s ?? "").toString(); }

function computeAverages(players) {
  const mmr2s = [];
  const mmr3s = [];

  for (const p of players) {
    const m2 = p?.ranks?.["2v2"]?.mmr;
    const m3 = p?.ranks?.["3v3"]?.mmr;
    if (typeof m2 === "number") mmr2s.push(m2);
    if (typeof m3 === "number") mmr3s.push(m3);
  }

  const avg = (arr) => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : null;
  return { avg2: avg(mmr2s), avg3: avg(mmr3s) };
}

function renderRankRow(label, data) {
  if (!data) return "";
  const rank = safeText(data.rank || "Unranked");
  const mmr = data.mmr ?? "–";
  return `
    <div class="rank-row">
      <span class="label">${label}</span>
      <span class="value">${rank}</span>
      <span class="mmr">${mmr} MMR</span>
    </div>
  `;
}

function bestRank(p) {
  return (
    p?.ranks?.["3v3"]?.rank ||
    p?.ranks?.["2v2"]?.rank ||
    p?.ranks?.["1v1"]?.rank ||
    "Unranked"
  );
}

function twitchParent() {
  return window.location.hostname || "vantaproject.space";
}

function canUseTwitchEmbed() {
  return typeof window.Twitch !== "undefined" && window.Twitch?.Embed;
}

function renderPlayers(team, liveMap) {
  const grid = el("players-grid");
  grid.innerHTML = "";

  let liveCount = 0;

  for (const p of team.players) {
    const card = document.createElement("article");
    card.className = "player-card";

    const login = p.twitch ? safeText(p.twitch).toLowerCase() : null;
    const live = login && liveMap ? !!liveMap[login] : false;
    if (live) liveCount++;

    const badges = [];
    badges.push(`<span class="badge">${safeText(bestRank(p))}</span>`);
    if (login) {
      badges.push(`<span class="badge ${live ? "live" : "offline"}">${live ? "LIVE" : "offline"}</span>`);
    }

    const trackerLink = p.trackerUrl
      ? `<a href="${p.trackerUrl}" target="_blank" rel="noopener noreferrer" class="profile-link">Tracker</a>`
      : `<span class="mmr">No tracker linked</span>`;

    const twitchLink = login
      ? `<a href="https://twitch.tv/${login}" target="_blank" rel="noopener noreferrer" class="small-link">Twitch</a>`
      : `<span class="mmr">No Twitch</span>`;

    const embedId = login ? `twitch-${login}` : null;
    const embedShell = login
      ? `<div class="twitch-embed"><div class="embed-shell" id="${embedId}"></div></div>`
      : "";


    card.innerHTML = `
      <div class="player-header">
        <div>
          <div class="player-name">${safeText(p.name)}</div>
          <div class="player-role">${safeText(p.role || "Player")}</div>
        </div>
        <div class="badges">${badges.join("")}</div>
      </div>

      <div class="player-platform">
        <span>Platform: ${safeText(p.platform || "Unknown")}</span>
        <span class="muted tiny">${login ? "@" + login : ""}</span>
      </div>

      <div class="ranks">
        ${renderRankRow("1v1", p.ranks?.["1v1"])}
        ${renderRankRow("2v2", p.ranks?.["2v2"])}
        ${renderRankRow("3v3", p.ranks?.["3v3"])}
      </div>

      ${embedShell}

      <div class="player-footer">
        <div class="controls">
          ${trackerLink}
          ${twitchLink}
        </div>
      </div>
    `;

    grid.appendChild(card);

    if (login) {
      const tryStart = () => {
        if (!canUseTwitchEmbed()) return false;
        const target = document.getElementById(embedId);
        if (!target) return false;

        if (target.dataset.twitchMounted === "1") return true;
        target.dataset.twitchMounted = "1";

        new window.Twitch.Embed(embedId, {
          width: "100%",
          height: "100%",
          channel: login,
          parent: [twitchParent()],
          muted: true,
        });
        return true;
      };

      if (!tryStart()) {
        const iv = setInterval(() => {
          if (tryStart()) clearInterval(iv);
        }, 250);
        setTimeout(() => clearInterval(iv), 8000);
      }
    }
  }

  el("live-count").textContent = liveCount.toString();
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function renderMatches(payload) {
  const grid = el("matches-grid");
  const empty = el("matches-empty");
  const source = el("matches-source");

  grid.innerHTML = "";

  if (!payload || payload.ok !== true || !Array.isArray(payload.items) || payload.items.length === 0) {
    empty.style.display = "block";
    source.textContent = payload?.note ? payload.note : "";
    return;
  }

  empty.style.display = "none";
  source.textContent = payload.note || "Source: ballchasing.com replays";

  for (const m of payload.items) {
    const card = document.createElement("article");
    card.className = "match-card";

    const title = `${m.playlist || "Match"} • ${m.map || "Unknown Arena"}`;
    const when = m.date ? fmtDate(m.date) : "—";

    const score = (typeof m.blueGoals === "number" && typeof m.orangeGoals === "number")
      ? `${m.blueGoals}-${m.orangeGoals}`
      : "—";

    const resultPill = m.result
      ? `<span class="pill">${m.result.toUpperCase()}</span>`
      : "";

    const replayLink = m.url
      ? `<a class="small-link" href="${m.url}" target="_blank" rel="noopener noreferrer">Replay</a>`
      : "";

    const pills = [];
    if (m.duration) pills.push(`<span class="pill">${m.duration}</span>`);
    if (m.overtime) pills.push(`<span class="pill">OT</span>`);
    if (m.season) pills.push(`<span class="pill">${m.season}</span>`);
    if (m.teamSize) pills.push(`<span class="pill">${m.teamSize}v${m.teamSize}</span>`);

    card.innerHTML = `
      <div class="match-head">
        <div>
          <div class="match-title">${title}</div>
          <div class="match-meta">${when}</div>
        </div>
        <div class="pills">
          ${resultPill}
          <span class="pill">Score ${score}</span>
        </div>
      </div>

      <div class="kv">
        <span class="k">Top performer</span>
        <span class="v">${m.topPlayer || "—"}</span>
      </div>

      <div class="pills">
        ${pills.join("")}
      </div>

      <div class="player-footer">
        <span class="muted tiny">${m.note || ""}</span>
        ${replayLink}
      </div>
    `;

    grid.appendChild(card);
  }
}

async function getLiveMapNoBackend(logins) {
  const live = {};

  await Promise.all(
    logins.map(async (login) => {
      try {
        const url = `https://decapi.me/twitch/online/${encodeURIComponent(login)}`;
        const txt = await fetch(url, { cache: "no-store" }).then(r => r.text());
        live[login] = txt.trim().toLowerCase() === "true";
      } catch {
        live[login] = false;
      }
    })
  );

  return live;
}


async function load() {
  const team = await fetchJson(API.team);

  el("team-name").textContent = team.teamName || "Your Team";
  el("team-name-footer").textContent = team.teamName || "Your Team";
  el("team-region").textContent = team.region || "";
  el("year").textContent = new Date().getFullYear();

  const logoEl = el("team-logo");
  if (team.logo) {
    logoEl.src = team.logo;
    logoEl.style.display = "";
  } else {
    logoEl.style.display = "none";
  }

  const { avg2, avg3 } = computeAverages(team.players || []);
  el("avg-2v2-mmr").textContent = avg2 ?? "–";
  el("avg-3v3-mmr").textContent = avg3 ?? "–";

  const logins = (team.players || [])
    .map(p => (p.twitch ? safeText(p.twitch).toLowerCase() : null))
    .filter(Boolean);

  // let liveMap = {};
  // if (logins.length) {
  //   try {
  //     const res = await fetchJson(API.twitchLive(logins));
  //     liveMap = res?.live || {};
  //   } catch (e) {
  //     console.warn("Twitch live check failed:", e);
  //   }
  // }

  let liveMap = {};
if (logins.length) {
  liveMap = await getLiveMapNoBackend(logins);
}


  renderPlayers(team, liveMap);

  try {
    const matches = await fetchJson(API.matches);
    renderMatches(matches);
  } catch (e) {
    renderMatches({ ok: false, note: "Match endpoint unavailable." });
  }

  setupAdmin(team);
}

function setupAdmin(team) {
  const modal = el("modal-backdrop");
  const btn = el("admin-btn");
  const close = el("modal-close");
  const cancel = el("cancel-update");
  const save = el("save-update");
  const playerSel = el("modal-player");

  const open = () => { modal.style.display = "flex"; };
  const hide = () => { modal.style.display = "none"; };

  btn.addEventListener("click", open);
  close.addEventListener("click", hide);
  cancel.addEventListener("click", hide);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) hide();
  });

  playerSel.innerHTML = "";
  (team.players || []).forEach((p, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = p.name || `Player ${idx+1}`;
    playerSel.appendChild(opt);
  });

  const fillFromSelected = () => {
    const idx = Number(playerSel.value);
    const p = team.players[idx];
    el("rank-2v2").value = p?.ranks?.["2v2"]?.rank || "";
    el("mmr-2v2").value = (p?.ranks?.["2v2"]?.mmr ?? "").toString();
    el("rank-3v3").value = p?.ranks?.["3v3"]?.rank || "";
    el("mmr-3v3").value = (p?.ranks?.["3v3"]?.mmr ?? "").toString();
  };

  playerSel.addEventListener("change", fillFromSelected);
  fillFromSelected();

  save.addEventListener("click", async () => {
    const idx = Number(playerSel.value);
    const payload = {
      playerIndex: idx,
      ranks: {
        "2v2": {
          rank: el("rank-2v2").value.trim() || null,
          mmr: el("mmr-2v2").value.trim() ? Number(el("mmr-2v2").value.trim()) : null,
        },
        "3v3": {
          rank: el("rank-3v3").value.trim() || null,
          mmr: el("mmr-3v3").value.trim() ? Number(el("mmr-3v3").value.trim()) : null,
        }
      }
    };

    try {
      const res = await fetch(API.saveSnapshot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      hide();
      await load();
    } catch (e) {
      alert("Could not save snapshot. This only works when running the local server.\n\n" + e.message);
    }
  });
}

el("refresh-btn").addEventListener("click", () => load().catch(console.error));

load().catch((err) => {
  console.error("Failed to load app", err);
  el("matches-empty").style.display = "block";
});
