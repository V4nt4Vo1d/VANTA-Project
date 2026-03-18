import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { getLiveMap } from "./twitch.js";
import { getRecentReplays } from "./ballchasing.js";
import { fetchTrackerRoster } from "./tracker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.join(__dirname, "..");
const random5Root = path.join(appRoot, "..");

dotenv.config({ path: path.join(appRoot, ".env") });
dotenv.config({ path: path.join(random5Root, ".env"), override: false });

const app = express();
app.use(express.json({ limit: "1mb" }));

function normalizeIdentity(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getTrackedIdentitiesFromTeam(team) {
  const players = Array.isArray(team?.players) ? team.players : [];
  const values = [];

  for (const p of players) {
    values.push(p?.name, p?.twitch, p?.tracker?.id);
  }

  return [...new Set(values.map(normalizeIdentity).filter(Boolean))];
}

function normalizeOriginValue(value) {
  return (value || "").toString().trim().toLowerCase().replace(/\/+$/, "");
}

function toHostname(value) {
  const input = normalizeOriginValue(value);
  if (!input) return "";
  try {
    return new URL(input).hostname.toLowerCase();
  } catch {
    return input.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
  }
}

const strictCors = process.env.STRICT_CORS === "true";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((s) => normalizeOriginValue(s))
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes("*")) return true;

  const normalizedOrigin = normalizeOriginValue(origin);
  const requestHost = toHostname(normalizedOrigin);

  return allowedOrigins.some((allowed) => {
    if (allowed === normalizedOrigin) return true;
    return toHostname(allowed) === requestHost;
  });
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!strictCors) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, TRN-Api-Key");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const publicDir = path.join(__dirname, "..", "public");
const teamPath = path.join(publicDir, "data", "team.json");

app.use(express.static(publicDir, { extensions: ["html"] }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/team", (req, res) => {
  try {
    const raw = fs.readFileSync(teamPath, "utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.type("json").send(raw);
  } catch (e) {
    res.status(500).json({ ok: false, error: "Could not read team.json", details: String(e) });
  }
});

app.post("/api/team/snapshot", (req, res) => {
  try {
    const { playerIndex, ranks } = req.body || {};
    if (typeof playerIndex !== "number" || !ranks) {
      return res.status(400).json({ ok: false, error: "Invalid payload" });
    }

    const raw = fs.readFileSync(teamPath, "utf-8");
    const team = JSON.parse(raw);

    if (!Array.isArray(team.players) || !team.players[playerIndex]) {
      return res.status(404).json({ ok: false, error: "Player not found" });
    }

    const now = new Date().toISOString();
    const p = team.players[playerIndex];
    p.ranks = p.ranks || {};
    for (const key of Object.keys(ranks)) {
      const r = ranks[key];
      if (!r) continue;
      p.ranks[key] = {
        ...(p.ranks[key] || {}),
        ...(r.rank ? { rank: r.rank } : {}),
        ...(typeof r.mmr === "number" && !Number.isNaN(r.mmr) ? { mmr: r.mmr } : {}),
      };
    }

    team.snapshots = team.snapshots || [];
    team.snapshots.push({
      createdAt: now,
      player: p.name || `Player ${playerIndex}`,
      ranks: ranks,
    });

    fs.writeFileSync(teamPath, JSON.stringify(team, null, 2), "utf-8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Could not write snapshot", details: String(e) });
  }
});


app.get("/api/twitch/live", async (req, res) => {
  const logins = (req.query.logins || "").toString().split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!logins.length) return res.json({ ok: true, live: {}, channels: {} });

  try {
    const data = await getLiveMap(logins);
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, ...data });
  } catch (e) {
    res.status(503).json({ ok: false, error: "Twitch not configured or request failed", details: String(e) });
  }
});

app.get("/api/ballchasing/recent", async (req, res) => {
  try {
    let groupId = process.env.BALLCHASING_GROUP_ID || "";
    let trackedIdentities = ["fahxey", "v4nt4vo1d"];

    if (!groupId) {
      try {
        const raw = fs.readFileSync(teamPath, "utf-8");
        const team = JSON.parse(raw);
        groupId = team?.ballchasing?.groupId || "";
        const rosterIdentities = getTrackedIdentitiesFromTeam(team);
        if (rosterIdentities.length) trackedIdentities = rosterIdentities;
      } catch {}
    } else {
      try {
        const raw = fs.readFileSync(teamPath, "utf-8");
        const team = JSON.parse(raw);
        const rosterIdentities = getTrackedIdentitiesFromTeam(team);
        if (rosterIdentities.length) trackedIdentities = rosterIdentities;
      } catch {}
    }

    const payload = await getRecentReplays({
      groupId,
      count: 10,
      trackedIdentities,
    });

    res.setHeader("Cache-Control", "no-store");
    res.json(payload);
  } catch (e) {
    res.status(503).json({ ok: false, note: "Ballchasing not configured or request failed.", details: String(e) });
  }
});

app.get("/api/tracker/roster", async (req, res) => {
  try {
    const raw = fs.readFileSync(teamPath, "utf-8");
    const team = JSON.parse(raw);

    const payload = await fetchTrackerRoster(team);
    res.setHeader("Cache-Control", "no-store");
    res.json(payload);
  } catch (e) {
    res.status(503).json({ ok: false, note: "Tracker not configured or request failed.", details: String(e) });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = process.env.PORT ? Number(process.env.PORT) : 5173;
app.listen(port, () => {
  console.log(`Rocket League Team Tracker running at http://localhost:${port}`);
});
