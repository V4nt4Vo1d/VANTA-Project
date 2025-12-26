/**
 * Storage schema:
 * db = {
 *   users: [{id, name, email, passHash, avatar, createdAt}],
 *   items: [{id, sellerId, title, description, priceCents, status, createdAt}],
 *   orders: [{id, buyerId, itemId, priceCents, createdAt}]
 * }
 */

const STORAGE_KEY = "demo_marketplace_db_v1";
const SESSION_KEY = "demo_marketplace_session_v1";

const $ = (sel, root = document) => root.querySelector(sel);

const el = {
  view: $("#view"),
  viewTitle: $("#viewTitle"),
  search: $("#searchInput"),
  sort: $("#sortSelect"),
  notice: $("#notice"),
  statListings: $("#statListings"),
  statOrders: $("#statOrders"),
  statUsers: $("#statUsers"),
  btnAuth: $("#btnAuth"),
  btnLogout: $("#btnLogout"),
  btnSell: $("#btnSell"),
  btnGetStarted: $("#btnGetStarted"),
  // btnResetDemo: $("#btnResetDemo"),
  btnExport: $("#btnExport"),
  btnImport: $("#btnImport"),
  importFile: $("#importFile"),
  modal: $("#modal"),
  modalTitle: $("#modalTitle"),
  modalBody: $("#modalBody"),
  userChip: $("#userChip"),
  userAvatar: $("#userAvatar"),
  userName: $("#userName"),
  userEmail: $("#userEmail"),
};

const state = {
  route: "market",
  q: "",
  sort: "new",
};

function nowIso() {
  return new Date().toISOString();
}

function money(cents) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[m]);
}

function tinyHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function loadSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function nextId(arr) {
  let max = 0;
  for (const x of arr) max = Math.max(max, x.id);
  return max + 1;
}

function getDbOrSeed() {
  let db = loadDb();
  if (!db) {
    db = seedDb();
    saveDb(db);
  }
  return db;
}

function seedDb() {
  const users = [
    {
      id: 1,
      name: "Ben Dover",
      email: "ben@gmale.com",
      passHash: tinyHash("password"),
      avatar: "😑",
      createdAt: nowIso(),
    },
    {
      id: 2,
      name: "Phil McCraken",
      email: "phil@gmale.com",
      passHash: tinyHash("password"),
      avatar: "🫠",
      createdAt: nowIso(),
    },
    {
      id: 3,
      name: "Dixie Normous",
      email: "dixie@gmale.com",
      passHash: tinyHash("password"),
      avatar: "🙃",
      createdAt: nowIso(),
    },
    {
      id: 4,
      name: "Hugh Jass",
      email: "hugh@gmale.com",
      passHash: tinyHash("password"),
      avatar: "🧪",
      createdAt: nowIso(),
    },
    {
      id: 5,
      name: "Questionable Quality Cars",
      email: "sales@qqc.com",
      passHash: tinyHash("password"),
      avatar: "🗂️",
      createdAt: nowIso(),
    },
    {
      id: 6,
      name: "vanta",
      email: "vanta@vantaproject.space",
      passHash: tinyHash("unsecure-password"),
      avatar: "🤖",
      createdAt: nowIso(),
    }
  ];

  const items = [
    
    {
      id: 1,
      sellerId: 1,
      title: "Quantum Toaster (Schrödinger Edition)",
      description: "It is both toasted and not toasted until you open the lid. Warning: may collapse reality into crumbs.",
      priceCents: 25069,
      status: "available",
      createdAt: "2025-12-26T18:04:12.994Z"
    },
    {
      id: 2,
      sellerId: 2,
      title: "Bucket of Freshly Curated Opinions",
      description: "Organic, free-range opinions. Great for family dinners. May cause unstoppable rage.",
      priceCents: 1069,
      status: "available",
      createdAt: "2025-12-26T18:24:12.994Z"
    },
    {
      id: 3,
      sellerId: 3,
      title: "Left-Handed Screwdriver",
      description: "I am selling my left-handed screwdriver for screws that spin the wrong way.",
      priceCents: 2069,
      status: "available",
      createdAt: "2025-12-26T18:34:12.994Z"
    },
    {
      id: 4,
      sellerId: 4,
      title: "Extension Cord",
      description: "Always six inches short of where I need it. Selling because I refuse to rearrange furniture again.",
      priceCents: 1969,
      status: "available",
      createdAt: "2025-12-26T18:49:12.994Z"
    },
    {
      id: 5,
      sellerId: 3,
      title: "HDMI Cable",
      description: "Functions perfectly until someone important is watching. Selling because I don’t trust it during presentations.",
      priceCents: 2569,
      status: "sold",
      createdAt: "2025-12-26T19:09:12.994Z"
    },
    {
      id: 6,
      sellerId: 2,
      title: "Unsolicited Advice",
      description: "I keep giving this away for free and people keep asking me to stop. Figured I’d try monetizing it. No refunds, I will still have opinions. If you purchase this you can reach me to recieve your unsolicited advice at any time on instagram @vantaxxtv",
      priceCents: 269,
      status: "sold",
      createdAt: "2025-12-26T19:24:12.994Z"
    },
    {
      id: 7,
      sellerId: 3,
      title: "Invisible Ink Printer",
      description: "Technically works. Prints absolutely nothing, flawlessly. Great if you’re into minimalism or avoiding documentation.",
      priceCents: 2069,
      status: "available",
      createdAt: "2025-12-26T19:39:12.994Z"
    },
    {
      id: 8,
      sellerId: 4,
      title: "Keyboard With Only ‘Ctrl’ Keys",
      description: "Every single key is Ctrl. I assumed muscle memory would carry me through. It did not. Technically functional if your workflow is 90% undoing mistakes.",
      priceCents: 1569,
      status: "available",
      createdAt: "2025-12-26T19:54:12.994Z"
    },
    {
      id: 9,
      sellerId: 1,
      title: "Confidence (Slightly Used)",
      description: "Had more of this before meetings. Still functional, just quieter.",
      priceCents: 469,
      status: "sold",
      createdAt: "2025-12-26T19:54:12.994Z"
    },
    {
      id: 10,
      sellerId: 2,
      title: "Paper Shredder",
      description: "Shreds junk mail flawlessly. Jams immediately on anything important.",
      priceCents: 1069,
      status: "available",
      createdAt: "2025-12-26T19:54:12.994Z"
    },
    {
      id: 11,
      sellerId: 5,
      title: "2016 Volkswagen Passat",
      description: "Starts every morning after a brief pause to consider the day. AC works on settings 1 and 5 only. Check engine light comes on occasionally for self-expression. Selling because we’ve both grown and need different things now.",
      priceCents: 420000,
      status: "available",
      createdAt: "2025-12-26T19:54:12.994Z"
    },
    {
      id: 12,
      sellerId: 5,
      title: "2014 Ford Focus",
      description: "Smooth ride. Plenty of space. Dashboard lights up like a Christmas tree but the mechanic says “it’s fine.” I trust him more than the lights.",
      priceCents: 950000,
      status: "available",
      createdAt: "2025-12-26T19:54:12.994Z"
    },
    {
      id: 13,
      sellerId: 5,
      title: "2004 Ram 1500",
      description: "Not pretty. Not quiet. Has hauled things it probably shouldn’t have. Refuses to die out of spite.",
      priceCents: 560000,
      status: "available",
      createdAt: "2025-12-26T19:54:12.994Z"
    }
  ];

  const orders = [
    {
      id: 1,
      buyerId: 1,
      itemId: 6,
      priceCents: 299,
      createdAt: isoMinusMinutes(25),
    },
    {
      id: 2,
      buyerId: 2,
      itemId: 5,
      priceCents: 899,
      createdAt: isoMinusMinutes(18),
    },
  ];

  // Mark ordered items as sold
  const soldIds = new Set(orders.map(o => o.itemId));
  for (const it of items) {
    if (soldIds.has(it.id)) it.status = "sold";
  }

  return { users, items, orders };
}

function isoMinusMinutes(min) {
  const d = new Date(Date.now() - min * 60 * 1000);
  return d.toISOString();
}

// ---------- Auth ----------
function currentUser(db) {
  const session = loadSession();
  if (!session?.userId) return null;
  return db.users.find(u => u.id === session.userId) || null;
}

function requireAuth(db) {
  const u = currentUser(db);
  if (!u) {
    toast("Please log in to do that.", "warn");
    openAuthModal("login");
    return null;
  }
  return u;
}

function toast(message, kind = "warn") {
  el.notice.hidden = false;
  el.notice.textContent = message;

  const styles = {
    good: ["rgba(35,197,94,.35)", "rgba(35,197,94,.10)", "#dcfce7"],
    warn: ["rgba(245,158,11,.35)", "rgba(245,158,11,.12)", "#ffedd5"],
    bad:  ["rgba(239,68,68,.35)", "rgba(239,68,68,.10)", "#fee2e2"],
  }[kind] || styles?.warn;

  el.notice.style.borderColor = styles[0];
  el.notice.style.background = styles[1];
  el.notice.style.color = styles[2];

  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => (el.notice.hidden = true), 4200);
}

function openModal(title, html) {
  el.modalTitle.textContent = title;
  el.modalBody.innerHTML = html;
  el.modal.hidden = false;

  setTimeout(() => {
    const first = el.modalBody.querySelector("input, textarea, button, select");
    first?.focus?.();
  }, 0);
}

function closeModal() {
  el.modal.hidden = true;
  el.modalBody.innerHTML = "";
}

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nav(route) {
  state.route = route;
  render();
}

function setHeader(db) {
  const u = currentUser(db);
  const authed = !!u;

  el.btnAuth.hidden = authed;
  el.btnLogout.hidden = !authed;
  el.btnSell.disabled = !authed;
  el.userChip.hidden = !authed;

  if (u) {
    el.userAvatar.textContent = u.avatar || "🙂";
    el.userName.textContent = u.name;
    el.userEmail.textContent = u.email;
  }
}

function updateStats(db) {
  el.statUsers.textContent = db.users.length.toString();
  el.statListings.textContent = db.items.length.toString();
  el.statOrders.textContent = db.orders.length.toString();
}

function filteredSortedItems(db) {
  const q = state.q.trim().toLowerCase();
  let items = db.items.slice();

  if (q) {
    const byUserIdToName = new Map(db.users.map(u => [u.id, (u.name + " " + u.email).toLowerCase()]));
    items = items.filter(it => {
      const seller = byUserIdToName.get(it.sellerId) || "";
      return (
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        seller.includes(q)
      );
    });
  }

  // Sort
  if (state.sort === "price_asc") items.sort((a,b) => a.priceCents - b.priceCents);
  else if (state.sort === "price_desc") items.sort((a,b) => b.priceCents - a.priceCents);
  else items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return items;
}

function renderMarket(db) {
  el.viewTitle.textContent = "Marketplace";

  const items = filteredSortedItems(db);

  const u = currentUser(db);
  const userId = u?.id ?? null;

  const cards = items.map(it => {
    const seller = db.users.find(x => x.id === it.sellerId);
    const canBuy = it.status === "available" && userId && it.sellerId !== userId;
    const isMine = userId && it.sellerId === userId;

    const statusPill =
      it.status === "sold"
        ? `<span class="pill pill--bad">Sold</span>`
        : `<span class="pill pill--good">Available</span>`;

    const minePill = isMine ? `<span class="pill pill--soft">Yours</span>` : "";

    const buyBtn = it.status === "available"
      ? (canBuy
          ? `<button class="btn btn--primary" data-buy="${it.id}" type="button">Buy</button>`
          : (isMine
              ? `<button class="btn" disabled type="button">You can’t buy your own stuff 😅</button>`
              : `<button class="btn" data-login-to-buy="${it.id}" type="button">Log in to buy</button>`
            )
        )
      : `<button class="btn" disabled type="button">Sold</button>`;

    return `
      <article class="card">
        <div class="card__top">
          <div>
            <div class="card__title">${escapeHtml(it.title)}</div>
            <div class="card__meta">
              Sold by <strong>${escapeHtml(seller?.name ?? "Unknown Vendor")}</strong>
              <span class="pill pill--soft">${escapeHtml(seller?.email ?? "unknown")}</span>
              <div class="card__meta">Posted ${fmtTime(it.createdAt)}</div>
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:flex-start; flex-wrap:wrap;">
            ${statusPill} ${minePill}
          </div>
        </div>

        <div class="card__desc">${escapeHtml(it.description)}</div>

        <div class="card__footer">
          <div class="price">${money(it.priceCents)}</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn--ghost" data-view-item="${it.id}" type="button">Details</button>
            ${buyBtn}
          </div>
        </div>
      </article>
    `;
  }).join("");

  el.view.innerHTML = `
    <div class="grid">
      ${cards || `<div class="card"><div class="card__title">No results</div><div class="card__desc">Try a different search term. Or summon new items via “Sell Item”.</div></div>`}
    </div>
  `;

  // Bind events
  el.view.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => buyItem(db, Number(btn.dataset.buy)));
  });
  el.view.querySelectorAll("[data-login-to-buy]").forEach(btn => {
    btn.addEventListener("click", () => openAuthModal("login"));
  });
  el.view.querySelectorAll("[data-view-item]").forEach(btn => {
    btn.addEventListener("click", () => openItemDetails(db, Number(btn.dataset.viewItem)));
  });
}

function renderMyListings(db) {
  el.viewTitle.textContent = "My Listings";
  const u = requireAuth(db);
  if (!u) return;

  const mine = filteredSortedItems(db).filter(it => it.sellerId === u.id);

  el.view.innerHTML = `
    <div class="grid">
      ${
        mine.map(it => `
          <article class="card">
            <div class="card__top">
              <div>
                <div class="card__title">${escapeHtml(it.title)}</div>
                <div class="card__meta">Created ${fmtTime(it.createdAt)}</div>
              </div>
              ${
                it.status === "sold"
                  ? `<span class="pill pill--bad">Sold</span>`
                  : `<span class="pill pill--good">Available</span>`
              }
            </div>

            <div class="card__desc">${escapeHtml(it.description)}</div>

            <div class="card__footer">
              <div class="price">${money(it.priceCents)}</div>
              <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
                <button class="btn btn--ghost" data-view-item="${it.id}" type="button">Details</button>
                ${
                  it.status === "available"
                    ? `<button class="btn btn--danger" data-remove="${it.id}" type="button">Remove</button>`
                    : `<button class="btn" disabled type="button">Sold items can’t be removed</button>`
                }
              </div>
            </div>
          </article>
        `).join("") || `
          <article class="card">
            <div class="card__title">No listings yet</div>
            <div class="card__desc">Click <strong>Sell Item</strong> to add your first listing.</div>
          </article>
        `
      }
    </div>
  `;

  el.view.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeListing(db, Number(btn.dataset.remove)));
  });
  el.view.querySelectorAll("[data-view-item]").forEach(btn => {
    btn.addEventListener("click", () => openItemDetails(db, Number(btn.dataset.viewItem)));
  });
}

function renderMyOrders(db) {
  el.viewTitle.textContent = "My Orders";
  const u = requireAuth(db);
  if (!u) return;

  const rows = db.orders
    .slice()
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(o => o.buyerId === u.id)
    .map(o => orderRow(db, o))
    .join("");

  el.view.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>When</th>
          <th>Item</th>
          <th>Seller</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="4" class="muted">No orders yet. Go buy something irresponsible.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderRecentOrders(db) {
  el.viewTitle.textContent = "Recent Orders";

  const rows = db.orders
    .slice()
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 30)
    .map(o => orderRow(db, o, true))
    .join("");

  el.view.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>When</th>
          <th>Buyer</th>
          <th>Item</th>
          <th>Seller</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="5" class="muted">No orders in this DB yet.</td></tr>`}
      </tbody>
    </table>
  `;
}

function orderRow(db, o, showBuyer = false) {
  const item = db.items.find(i => i.id === o.itemId);
  const buyer = db.users.find(u => u.id === o.buyerId);
  const seller = db.users.find(u => u.id === item?.sellerId);

  if (showBuyer) {
    return `
      <tr>
        <td>${fmtTime(o.createdAt)}</td>
        <td><strong>${escapeHtml(buyer?.name ?? "Unknown")}</strong><div class="muted mono">${escapeHtml(buyer?.email ?? "")}</div></td>
        <td><strong>${escapeHtml(item?.title ?? "Deleted Item")}</strong></td>
        <td><strong>${escapeHtml(seller?.name ?? "Unknown")}</strong><div class="muted mono">${escapeHtml(seller?.email ?? "")}</div></td>
        <td><strong>${money(o.priceCents)}</strong></td>
      </tr>
    `;
  }

  return `
    <tr>
      <td>${fmtTime(o.createdAt)}</td>
      <td><strong>${escapeHtml(item?.title ?? "Deleted Item")}</strong></td>
      <td><strong>${escapeHtml(seller?.name ?? "Unknown")}</strong><div class="muted mono">${escapeHtml(seller?.email ?? "")}</div></td>
      <td><strong>${money(o.priceCents)}</strong></td>
    </tr>
  `;
}

function render() {
  const db = getDbOrSeed();

  setHeader(db);
  updateStats(db);

  if (state.route === "market") renderMarket(db);
  else if (state.route === "my-listings") renderMyListings(db);
  else if (state.route === "my-orders") renderMyOrders(db);
  else if (state.route === "recent-orders") renderRecentOrders(db);
  else renderMarket(db);
}

function buyItem(db, itemId) {
  const u = requireAuth(db);
  if (!u) return;

  const item = db.items.find(i => i.id === itemId);
  if (!item) return toast("Item not found.", "bad");
  if (item.status !== "available") return toast("That item is already sold.", "warn");
  if (item.sellerId === u.id) return toast("You can’t buy your own listing.", "warn");

  const seller = db.users.find(x => x.id === item.sellerId);
  openModal("Confirm purchase", `
    <div class="card" style="box-shadow:none; border-color: rgba(33,48,79,.55);">
      <div class="card__title">${escapeHtml(item.title)}</div>
      <div class="card__meta">Seller: <strong>${escapeHtml(seller?.name ?? "Unknown")}</strong></div>
      <div class="card__desc">${escapeHtml(item.description)}</div>
      <div class="card__footer">
        <div class="price">${money(item.priceCents)}</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
          <button class="btn btn--ghost" data-close="modal" type="button">Cancel</button>
          <button class="btn btn--primary" id="confirmBuyBtn" type="button">Buy now</button>
        </div>
      </div>
      <div class="small">Note: orders are stored in <span class="mono">localStorage</span> on this device.</div>
    </div>
  `);

  $("#confirmBuyBtn")?.addEventListener("click", () => {
    // Create order
    const order = {
      id: nextId(db.orders),
      buyerId: u.id,
      itemId: item.id,
      priceCents: item.priceCents,
      createdAt: nowIso(),
    };
    db.orders.push(order);
    item.status = "sold";
    saveDb(db);

    closeModal();
    toast("Purchase complete. A tiny confetti cannon fires somewhere in the distance.", "good");
    render();
  });
}

function removeListing(db, itemId) {
  const u = requireAuth(db);
  if (!u) return;

  const item = db.items.find(i => i.id === itemId);
  if (!item) return toast("Item not found.", "bad");
  if (item.sellerId !== u.id) return toast("Not your listing.", "bad");
  if (item.status === "sold") return toast("Sold listings can’t be removed.", "warn");

  openModal("Remove listing", `
    <div class="form">
      <div class="small">
        Remove <strong>${escapeHtml(item.title)}</strong>? This can’t be undone (unless you reset data).
      </div>
      <div class="form__actions">
        <button class="btn btn--ghost" data-close="modal" type="button">Cancel</button>
        <button class="btn btn--danger" id="confirmRemoveBtn" type="button">Remove</button>
      </div>
    </div>
  `);

  $("#confirmRemoveBtn")?.addEventListener("click", () => {
    db.items = db.items.filter(i => i.id !== itemId);
    saveDb(db);
    closeModal();
    toast("Listing removed. The marketplace sighs quietly.", "good");
    render();
  });
}

function openItemDetails(db, itemId) {
  const item = db.items.find(i => i.id === itemId);
  if (!item) return toast("Item not found.", "bad");
  const seller = db.users.find(u => u.id === item.sellerId);

  const u = currentUser(db);
  const canBuy = item.status === "available" && u && u.id !== item.sellerId;

  openModal("Item details", `
    <div class="card" style="box-shadow:none; border-color: rgba(33,48,79,.55);">
      <div class="card__top">
        <div>
          <div class="card__title">${escapeHtml(item.title)}</div>
          <div class="card__meta">
            Seller: <strong>${escapeHtml(seller?.name ?? "Unknown")}</strong>
            <span class="pill pill--soft">${escapeHtml(seller?.email ?? "")}</span>
          </div>
          <div class="card__meta">Posted ${fmtTime(item.createdAt)}</div>
        </div>
        ${
          item.status === "sold"
            ? `<span class="pill pill--bad">Sold</span>`
            : `<span class="pill pill--good">Available</span>`
        }
      </div>

      <div class="card__desc">${escapeHtml(item.description)}</div>

      <div class="card__footer">
        <div class="price">${money(item.priceCents)}</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
          <button class="btn btn--ghost" data-close="modal" type="button">Close</button>
          ${
            item.status === "available"
              ? (canBuy
                  ? `<button class="btn btn--primary" id="buyFromDetailsBtn" type="button">Buy</button>`
                  : (u ? `<button class="btn" disabled type="button">You can’t buy your own listing</button>`
                       : `<button class="btn btn--primary" id="loginFromDetailsBtn" type="button">Log in to buy</button>`)
                )
              : `<button class="btn" disabled type="button">Sold</button>`
          }
        </div>
      </div>
    </div>
  `);

  $("#buyFromDetailsBtn")?.addEventListener("click", () => {
    closeModal();
    buyItem(db, itemId);
  });
  $("#loginFromDetailsBtn")?.addEventListener("click", () => {
    closeModal();
    openAuthModal("login");
  });
}

function openSellModal() {
  const db = getDbOrSeed();
  const u = requireAuth(db);
  if (!u) return;

  openModal("Create listing", `
    <form class="form" id="sellForm">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" name="title" required maxlength="80" placeholder="e.g., Slightly Haunted HDMI Cable" />
      </div>

      <div class="row">
        <div class="field">
          <label for="price">Price (USD)</label>
          <input id="price" name="price" required inputmode="decimal" placeholder="19.99" />
        </div>
        <div class="field">
          <label for="emoji">Avatar (emoji)</label>
          <input id="emoji" name="emoji" maxlength="2" placeholder="${u.avatar || "🙂"}" />
        </div>
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" name="description" required maxlength="500"
          placeholder="Make it funny, informative, or ominously specific…"></textarea>
      </div>

      <div class="small">
        Tip: this site stores everything in your browser and is not a real marketplace. Nothing is for sale and nothing can be bought. Great for demonstration. Terrible for actual capitalism.
      </div>

      <div class="form__actions">
        <button class="btn btn--ghost" type="button" data-close="modal">Cancel</button>
        <button class="btn btn--primary" type="submit">Publish</button>
      </div>
    </form>
  `);

  $("#sellForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const title = String(fd.get("title") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const priceStr = String(fd.get("price") || "").trim().replace(/[^0-9.]/g, "");
    const emoji = String(fd.get("emoji") || "").trim();

    const priceNum = Number(priceStr);
    if (!title || !description || !Number.isFinite(priceNum)) return toast("Please fill all fields correctly.", "warn");

    const priceCents = clamp(Math.round(priceNum * 100), 1, 10_000_00);

    // Update avatar if provided
    if (emoji) {
      const me = db.users.find(x => x.id === u.id);
      if (me) me.avatar = emoji;
    }

    db.items.push({
      id: nextId(db.items),
      sellerId: u.id,
      title,
      description,
      priceCents,
      status: "available",
      createdAt: nowIso(),
    });

    saveDb(db);
    closeModal();
    toast("Listing published. The marketplace applauds politely.", "good");
    nav("market");
  });
}

function openAuthModal(mode = "login") {
  const isLogin = mode === "login";

  openModal(isLogin ? "Log in" : "Create account", `
    <form class="form" id="authForm">
      ${isLogin ? "" : `
        <div class="field">
          <label for="name">Display name</label>
          <input id="name" name="name" required maxlength="60" placeholder="e.g., Vanta the Magnificent" />
        </div>
      `}

      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" required type="email" placeholder="you@domain.com" />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input id="password" name="password" required type="password" minlength="4" placeholder="••••••••" />
      </div>

      <div class="small">
        Note: passwords are stored as a tiny hash in <span class="mono">localStorage</span>.
        Not production security.
      </div>

      <div class="form__actions">
        <button class="btn btn--ghost" type="button" data-close="modal">Cancel</button>
        <button class="btn btn--primary" type="submit">${isLogin ? "Log in" : "Create account"}</button>
      </div>

      <div class="small" style="text-align:right;">
        ${
          isLogin
            ? `No account? <button class="btn btn--ghost" type="button" id="switchToRegister">Create one</button>`
            : `Already have an account? <button class="btn btn--ghost" type="button" id="switchToLogin">Log in</button>`
        }
      </div>
    </form>
  `);

  $("#switchToRegister")?.addEventListener("click", () => openAuthModal("register"));
  $("#switchToLogin")?.addEventListener("click", () => openAuthModal("login"));

  $("#authForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const db = getDbOrSeed();
    const fd = new FormData(e.currentTarget);

    const email = String(fd.get("email") || "").trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();

    if (!email || !password) return toast("Missing email or password.", "warn");

    if (isLogin) {
      const u = db.users.find(x => x.email.toLowerCase() === email);
      if (!u) return toast("No account with that email.", "bad");
      if (u.passHash !== tinyHash(password)) return toast("Incorrect password.", "bad");

      saveSession({ userId: u.id, createdAt: nowIso() });
      closeModal();
      toast("Logged in. Welcome back to the chaos.", "good");
      render();
      return;
    }

    // register
    if (!name) return toast("Please choose a display name.", "warn");

    const exists = db.users.some(x => x.email.toLowerCase() === email);
    if (exists) return toast("That email is already registered.", "bad");

    const avatar = pickAvatarFromName(name);

    const newUser = {
      id: nextId(db.users),
      name,
      email,
      passHash: tinyHash(password),
      avatar,
      createdAt: nowIso(),
    };

    db.users.push(newUser);
    saveDb(db);
    saveSession({ userId: newUser.id, createdAt: nowIso() });
    closeModal();
    toast("Account created. You are now a certified marketscam user!", "good");
    render();
  });
}

function pickAvatarFromName(name) {
  const bank = ["🪐","🧠","🦾","🛰️","🧿","🦄","🦊","🐙","🧇","🧢","🧪","🧊","⚡","🔮","🗿"];
  const h = parseInt(tinyHash(name).slice(0, 6), 16);
  return bank[h % bank.length];
}

function logout() {
  clearSession();
  toast("Logged out. The marketplace misses you already.", "good");
  render();
}

// function resetDemoData() {
//   localStorage.removeItem(STORAGE_KEY);
//   localStorage.removeItem(SESSION_KEY);
//   toast("Demo data reset on this device.", "good");
//   render();
// }

function exportDb() {
  const db = getDbOrSeed();
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "demo_marketplace_export.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported database JSON.", "good");
}

function importDbFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed?.users || !parsed?.items || !parsed?.orders) {
        return toast("Invalid import file. Missing users/items/orders.", "bad");
      }
      saveDb(parsed);
      toast("Imported database.", "good");
      render();
    } catch {
      toast("Could not parse JSON.", "bad");
    }
  };
  reader.readAsText(file);
}

document.addEventListener("click", (e) => {
  const t = e.target;

  if (t?.dataset?.close === "modal") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.modal.hidden) closeModal();
});

document.querySelectorAll("[data-nav]").forEach(btn => {
  btn.addEventListener("click", () => nav(btn.dataset.nav));
});

el.search.addEventListener("input", () => {
  state.q = el.search.value;
  render();
});

el.sort.addEventListener("change", () => {
  state.sort = el.sort.value;
  render();
});

el.btnAuth.addEventListener("click", () => openAuthModal("login"));
el.btnLogout.addEventListener("click", logout);
el.btnSell.addEventListener("click", openSellModal);
el.btnGetStarted.addEventListener("click", () => {
  const db = getDbOrSeed();
  const u = currentUser(db);
  if (!u) openAuthModal("login");
  else openSellModal();
});
// el.btnResetDemo.addEventListener("click", resetDemoData);

el.btnExport.addEventListener("click", exportDb);
el.btnImport.addEventListener("click", () => el.importFile.click());
el.importFile.addEventListener("change", () => {
  const f = el.importFile.files?.[0];
  if (f) importDbFile(f);
  el.importFile.value = "";
});

// ---------- Boot ----------
render();
