const typeMeta = {
  policy: { label: "政策", color: "#26718b", background: "#cfe6f0" },
  term: { label: "术语", color: "#3e7b3c", background: "#d8ebc9" },
  job: { label: "就业", color: "#ad5237", background: "#f4c9b9" }
};

const statsVersion = "launch-zero-20260924";
if (localStorage.getItem("green-port-stats-version") !== statsVersion) {
  ["green-port-saved", "green-port-uses", "green-port-favorites", "green-port-usage-log"].forEach(key => localStorage.removeItem(key));
  localStorage.setItem("green-port-stats-version", statsVersion);
}

const state = {
  filter: "all",
  search: "",
  saved: JSON.parse(localStorage.getItem("green-port-saved") || "[]"),
  uses: JSON.parse(localStorage.getItem("green-port-uses") || "{}"),
  favorites: JSON.parse(localStorage.getItem("green-port-favorites") || "{}"),
  usageLog: JSON.parse(localStorage.getItem("green-port-usage-log") || "[]"),
  rankingMode: "week"
};

const wall = document.querySelector("#noteWall");
const rankingList = document.querySelector("#rankingList");
const categoryRankingList = document.querySelector("#categoryRankingList");
const emptyState = document.querySelector("#emptyState");
const toast = document.querySelector("#toast");
const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `<button class="lightbox-close" type="button" aria-label="关闭大图">✕</button><img class="lightbox-image" alt="便利贴大图">`;
document.body.appendChild(lightbox);
const lightboxImage = lightbox.querySelector(".lightbox-image");

function metaFor(note) { return typeMeta[note.type] || typeMeta.term; }
function viewCount(note) { return note.views + (state.uses[note.id] || 0); }
function favoriteCount(note) { return note.favorites + (state.favorites[note.id] || 0); }
function visibleNotes() {
  return noteData.filter(note => {
    const matchesFilter = state.filter === "all" || (state.filter === "saved" ? state.saved.includes(note.id) : note.type === state.filter);
    const searchable = `${note.title} ${note.detail} ${note.type}`.toLowerCase();
    return matchesFilter && searchable.includes(state.search.toLowerCase());
  });
}
function optionalImage(note) { return note.image ? `<img class="note-image" src="${note.image}" alt="${note.title}配图" loading="lazy">` : ""; }
function frontImage(note) { return note.image ? `<div class="front-image-wrap"><button class="image-preview" type="button" data-action="image" aria-label="查看${note.title}大图"><img class="note-thumbnail" src="${note.image}" alt="${note.title}缩略图" loading="lazy"></button><button class="image-view-button" type="button" data-action="image">🔍 查看图片</button></div>` : ""; }
function linkAttributes(link) {
  const isExternal = /^(https?:\/\/|\/\/)/i.test(link);
  return isExternal ? `target="_blank" rel="noopener noreferrer"` : "";
}
function noteLinks(note) {
  if (Array.isArray(note.links) && note.links.length) return note.links.filter(item => item.url);
  return note.link ? [{ label: /^(https?:\/\/|\/\/)/i.test(note.link) ? "查看原文" : "查看详情", url: note.link }] : [];
}
function optionalLink(note) { return noteLinks(note).map(item => `<a class="source-link" href="${item.url}" ${linkAttributes(item.url)}>${item.label} →</a>`).join(""); }
function qrMarkup(note) { return note.qrLink ? `<div class="qr-area"><span>扫码查看</span><div class="qr-code" data-qr="${note.qrLink}" aria-label="${note.title}二维码"></div></div>` : `<div class="qr-empty">暂无二维码</div>`; }

function openLightbox(note) {
  lightboxImage.src = note.image;
  lightboxImage.alt = `${note.title}大图`;
  lightbox.hidden = false;
}
function closeLightbox() { lightbox.hidden = true; lightboxImage.removeAttribute("src"); }

function renderNotes() {
  const current = visibleNotes();
  wall.innerHTML = current.map((note, index) => {
    const meta = metaFor(note);
    const saved = state.saved.includes(note.id);
    return `<article class="note-card ${saved ? "saved" : ""}" style="--note-bg:${meta.background};--note-accent:${meta.color};--tilt:${index % 2 ? "1.3deg" : "-1.2deg"}" data-id="${note.id}" tabindex="0" aria-label="${note.title}，点击翻转查看详情">
      <div class="note-card-inner">
        <div class="note-face note-front"><span class="note-category">${meta.label} / ${String(note.id).padStart(2, "0")}</span><span class="note-tag">${saved ? "已收藏" : "可取用"}</span><div class="note-front-content">${frontImage(note)}<span class="note-icon" aria-hidden="true">${note.icon}</span><h3>${note.title}</h3></div><div class="note-footer"><span>${viewCount(note)} 次取用</span><button class="heart" type="button" data-action="favorite" aria-label="${saved ? "取消收藏" : "收藏"}">${saved ? "♥" : "♡"}</button></div></div>
        <div class="note-face note-back"><span class="note-category">DETAIL / ${meta.label}</span>${optionalImage(note)}<div class="note-detail"><h3>${note.title}</h3><p>${note.detail}</p></div><div class="detail-source">${note.date} · ${favoriteCount(note)} 人收藏</div><div class="note-actions">${optionalLink(note)}${qrMarkup(note)}<button class="take-btn" type="button" data-action="take">取用这张便利贴　→</button></div></div>
      </div>
    </article>`;
  }).join("");

  emptyState.hidden = current.length > 0;
  document.querySelector("#resultsCount").textContent = `${String(current.length).padStart(2, "0")} NOTES`;
  document.querySelector("#noteTotal").textContent = String(noteData.length).padStart(2, "0");
  document.querySelectorAll("[data-filter-count]").forEach(item => {
    const type = item.dataset.filterCount;
    item.textContent = type === "all" ? String(noteData.length).padStart(2, "0") : String(noteData.filter(note => note.type === type).length).padStart(2, "0");
  });

  wall.querySelectorAll(".qr-code").forEach(qr => {
    if (typeof QRCode === "function") new QRCode(qr, { text: qr.dataset.qr, width: 52, height: 52, colorDark: "#18332b", colorLight: "#ffffff" });
    else qr.textContent = "二维码加载失败";
  });
  wall.querySelectorAll(".note-card").forEach(card => {
    const cardNote = noteData.find(item => item.id === Number(card.dataset.id));
    card.addEventListener("click", event => { if (!event.target.closest("button, a")) card.classList.toggle("flipped"); });
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.classList.toggle("flipped"); } });
    card.querySelectorAll('[data-action="image"]').forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openLightbox(cardNote); }));
    card.querySelector('[data-action="favorite"]').addEventListener("click", event => { event.stopPropagation(); toggleFavorite(Number(card.dataset.id)); });
    card.querySelector('[data-action="take"]').addEventListener("click", event => { event.stopPropagation(); takeNote(Number(card.dataset.id)); });
  });
}

lightbox.addEventListener("click", event => { if (event.target === lightbox || event.target.classList.contains("lightbox-close")) closeLightbox(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !lightbox.hidden) closeLightbox(); });

function countInPeriod(note, mode) {
  if (mode === "favorites") return favoriteCount(note);
  const days = mode === "week" ? 7 : 30;
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return state.usageLog.filter(entry => entry.id === note.id && entry.time >= since).length;
}
function renderRanking() {
  const sorted = [...noteData].sort((a, b) => countInPeriod(b, state.rankingMode) - countInPeriod(a, state.rankingMode));
  rankingList.innerHTML = sorted.slice(0, 4).map((note, index) => `<li><span class="rank-num">0${index + 1}</span><span class="rank-name">${note.title}<small>${metaFor(note).label}</small></span><span class="rank-uses">${countInPeriod(note, state.rankingMode)}</span></li>`).join("");
  const categoryCounts = Object.entries(typeMeta).map(([type, meta]) => ({ type, label: meta.label, color: meta.color, count: noteData.filter(note => note.type === type).reduce((total, note) => total + countInPeriod(note, state.rankingMode), 0) })).sort((a, b) => b.count - a.count);
  document.querySelector("#categoryRankingLabel").textContent = state.rankingMode === "favorites" ? "收藏次数" : `${state.rankingMode === "week" ? "本周" : "本月"}取用`;
  categoryRankingList.innerHTML = categoryCounts.map(item => `<div class="category-ranking-row"><span class="category-dot" style="--category-color:${item.color}"></span><span>${item.label}</span><strong>${item.count}</strong></div>`).join("");
}
function toggleFavorite(id) {
  if (typeof window.requireLogin === "function" && !window.requireLogin("favorite")) return;
  const saved = state.saved.includes(id);
  state.saved = saved ? state.saved.filter(savedId => savedId !== id) : [...state.saved, id];
  state.favorites[id] = Math.max(0, (state.favorites[id] || 0) + (saved ? -1 : 1));
  localStorage.setItem("green-port-saved", JSON.stringify(state.saved));
  localStorage.setItem("green-port-favorites", JSON.stringify(state.favorites));
  document.querySelector("#savedCount").textContent = state.saved.length;
  renderNotes();
  showToast(saved ? "已取消收藏" : "已收藏到我的便利贴");
}
function takeNote(id) {
  if (typeof window.requireLogin === "function" && !window.requireLogin("take")) return;
  state.uses[id] = (state.uses[id] || 0) + 1;
  state.usageLog.push({ id, time: Date.now() });
  localStorage.setItem("green-port-uses", JSON.stringify(state.uses));
  localStorage.setItem("green-port-usage-log", JSON.stringify(state.usageLog));
  document.querySelector("#todayUses").textContent = Object.values(state.uses).reduce((sum, value) => sum + value, 0);
  renderNotes();
  renderRanking();
  showToast("已取用，这张知识现在属于你了");
}
function showToast(message) { toast.textContent = message; toast.classList.add("show"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200); }

document.querySelectorAll(".ranking-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".ranking-tab").forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  state.rankingMode = tab.dataset.ranking;
  renderRanking();
}));

document.querySelectorAll(".filter-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".filter-tab").forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
  tab.classList.add("active"); tab.setAttribute("aria-selected", "true"); state.filter = tab.dataset.filter; renderNotes();
}));
document.querySelector("#searchInput").addEventListener("input", event => { state.search = event.target.value; renderNotes(); });
document.querySelector("#savedTrigger").addEventListener("click", () => { state.filter = "saved"; state.search = ""; document.querySelector("#searchInput").value = ""; renderNotes(); showToast(state.saved.length ? `已筛选 ${state.saved.length} 张收藏便利贴` : "还没有收藏便利贴"); });
document.querySelector("#feedbackTrigger").addEventListener("click", () => { document.querySelector("#feedbackModal").hidden = false; document.querySelector("#feedbackText").focus(); });
document.querySelector("[data-close-modal]").addEventListener("click", () => { document.querySelector("#feedbackModal").hidden = true; });
document.querySelector("#feedbackModal").addEventListener("click", event => { if (event.target.id === "feedbackModal") event.currentTarget.hidden = true; });
document.querySelector("#feedbackForm").addEventListener("submit", event => { event.preventDefault(); event.currentTarget.hidden = true; document.querySelector("#formSuccess").hidden = false; showToast("反馈已提交，谢谢你的建议"); });

document.querySelector("#savedCount").textContent = state.saved.length;
document.querySelector("#todayUses").textContent = Object.values(state.uses).reduce((sum, value) => sum + value, 0);
renderNotes();
renderRanking();
