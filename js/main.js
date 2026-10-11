const typeMeta = {
  policy: { label: "政策", color: "#26718b", background: "#cfe6f0" },
  term: { label: "术语", color: "#3e7b3c", background: "#d8ebc9" },
  industry: { label: "行业黄页", color: "#ad5237", background: "#f4c9b9" },
  job: { label: "岗位观察", color: "#84621b", background: "#f7edbd" },
  law: { label: "普法", color: "#73519b", background: "#e9ddf5" }
};

const statsVersion = "launch-zero-20260924";
if (localStorage.getItem("green-port-stats-version") !== statsVersion) {
  ["green-port-saved", "green-port-uses", "green-port-favorites", "green-port-usage-log"].forEach(key => localStorage.removeItem(key));
  localStorage.setItem("green-port-stats-version", statsVersion);
}

const state = {
  filter: "all",
  search: "",
  saved: [],
  uses: JSON.parse(localStorage.getItem("green-port-uses") || "{}"),
  favorites: JSON.parse(localStorage.getItem("green-port-favorites") || "{}"),
  usageLog: JSON.parse(localStorage.getItem("green-port-usage-log") || "[]"),
  rankingMode: "week",
  userFavorites: {}
};

const favoritesPage = document.body.dataset.page === "favorites";
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
function favoriteCount(note) { return note.favorites + (state.favorites[note.id] || 0) + (state.userFavorites[note.id] || 0); }
function visibleNotes() {
  return noteData.filter(note => {
    if (favoritesPage && !state.saved.includes(note.id)) return false;
    const matchesFilter = state.filter === "all" || (state.filter === "saved" ? state.saved.includes(note.id) : note.type === state.filter);
    const profile = note.type === "industry" ? note.organization : (note.type === "job" ? note.jobProfile : null);
    const profileText = `${Object.values(profile || {}).flat().join(" ")} ${note.type === "job" ? note.date : ""}`;
    const searchable = `${note.title} ${note.detail} ${note.type} ${metaFor(note).label} ${note.basis || ""} ${profileText}`.toLowerCase();
    return matchesFilter && searchable.includes(state.search.toLowerCase());
  });
}
function noteImages(note) {
  if (Array.isArray(note.images) && note.images.length) return note.images.filter(url => url.trim());
  return note.image ? [note.image] : [];
}
function optionalImage(note) {
  const images = noteImages(note);
  if (images.length <= 1) return images.length ? `<img class="note-image" src="${images[0]}" alt="${note.title}配图" loading="lazy">` : "";
  return `<div class="note-image-gallery">${images.map((url, index) => `<button class="image-preview" type="button" data-action="image" data-image-index="${index}" aria-label="查看${note.title}第 ${index + 1} 张大图"><img class="note-image" src="${url}" alt="${note.title}配图 ${index + 1}" loading="lazy"></button>`).join("")}</div>`;
}
function frontImage(note) {
  const images = noteImages(note);
  return images.map((url, index) => {
    const suffix = images.length > 1 ? `第 ${index + 1} 张` : "";
    return `<div class="front-image-wrap"><button class="image-preview" type="button" data-action="image" data-image-index="${index}" aria-label="查看${note.title}${suffix}大图"><img class="note-thumbnail" src="${url}" alt="${note.title}${suffix}缩略图" loading="lazy"></button><button class="image-view-button" type="button" data-action="image" data-image-index="${index}">🔍 查看图片${images.length > 1 ? ` ${index + 1}` : ""}</button></div>`;
  }).join("");
}
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

function escapeHtml(text) {
  const element = document.createElement("span");
  element.textContent = text;
  return element.innerHTML;
}
function profileValue(profile, key, pending) {
  const value = (profile || {})[key];
  return value && value.trim() ? value.trim() : pending;
}
function organizationValue(note, key, hint) {
  return profileValue(note.organization, key, note.isTemplate ? hint : "待补充");
}
function directionTags(directions, label) {
  return `<ul class="organization-tags" aria-label="${label}">${directions.map(tag => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;
}
function profileDetails(fields, readValue) {
  return `<dl class="organization-details">${fields.map(([key, label, hint]) => `<div><dt>${label}</dt><dd>${escapeHtml(readValue(key, hint))}</dd></div>`).join("")}</dl>`;
}
function organizationFront(note) {
  if (note.type !== "industry") return "";
  const directions = ((note.organization || {}).greenDirections || []).map(text => text.trim()).filter(Boolean).slice(0, 3);
  const tags = directions.length ? directions : (note.isTemplate ? ["方向一（待填）", "方向二（待填）", "方向三（待填）"] : []);
  return `<div class="organization-front"><p class="organization-english">${escapeHtml(organizationValue(note, "englishName", "英文名／简称待填写"))}</p><p class="organization-type">${escapeHtml(organizationValue(note, "organizationType", "机构类型待填写"))}</p><p class="organization-summary">${escapeHtml(organizationValue(note, "summary", "一句话介绍：服务谁、提供什么业务。"))}</p>${directionTags(tags, "绿色航运方向")}</div>`;
}
function organizationDetail(note) {
  if (note.type !== "industry") return "";
  const fields = [
    ["mainBusiness", "主营业务", "用 30–50 字说明核心业务与服务对象。"],
    ["greenLayout", "绿色布局", "列出有依据的绿色航运方向，最多 3 项。"],
    ["representativeProject", "代表举措", "填写一个项目／服务名称、具体做法及时间。"],
    ["projectStage", "项目阶段", "区分目标／规划、研究、试点与已投入运营。"],
    ["newcomerFocus", "新人关注点", "说明行业新人可以从公开资料中学到什么。"],
    ["source", "资料依据", "填写官方页面／报告名称及对应章节。"]
  ];
  if (noteImages(note).length) fields.push(["imageSource", "配图来源", "填写图片来源，并确认可以使用。"]);
  return profileDetails(fields, (key, hint) => organizationValue(note, key, hint));
}
function jobFront(note) {
  if (note.type !== "job") return "";
  const directions = ((note.jobProfile || {}).directions || []).map(text => text.trim()).filter(Boolean).slice(0, 3);
  return `<div class="organization-front"><p class="organization-summary">从岗位样本认识专业与技能需求</p><p class="job-status">${escapeHtml(profileValue(note.jobProfile, "recruitmentStatus", "招聘状态待核实，以具体公告为准。"))}</p>${directionTags(directions, "岗位方向")}</div>`;
}
function jobDetail(note) {
  if (note.type !== "job") return "";
  const fields = [
    ["employer", "招聘单位", "具体招聘单位待核实"],
    ["requirements", "岗位要求", "待补充"],
    ["duties", "工作方向", "待补充"],
    ["newcomerFocus", "新人关注点", "待补充"],
    ["source", "资料来源", "待补充"],
    ["recruitmentStatus", "招聘状态", "待核实，以具体公告为准"],
    ["deadline", "截止日期", "待核实"]
  ];
  if (noteImages(note).length) fields.push(["imageSource", "配图来源", "待补充"]);
  return profileDetails(fields, (key, pending) => profileValue(note.jobProfile, key, pending));
}

function openLightbox(note, index = 0) {
  const images = noteImages(note);
  if (!images[index]) throw new RangeError(`Invalid image index ${index} for note ${note.id}`);
  lightboxImage.src = images[index];
  lightboxImage.alt = `${note.title}${images.length > 1 ? `第 ${index + 1} 张` : ""}大图`;
  lightbox.hidden = false;
}
function closeLightbox() { lightbox.hidden = true; lightboxImage.removeAttribute("src"); }

function renderNotes() {
  if (!wall) return;
  const current = visibleNotes();
  wall.innerHTML = current.map((note, index) => {
    const meta = metaFor(note);
    const saved = state.saved.includes(note.id);
    const basisRow = note.type === "policy" || note.type === "law" ? `<div class="note-basis"><span class="basis-label">依据位置：</span><span class="basis-text"></span></div>` : "";
    const pendingJob = note.type === "job" && !profileValue(note.jobProfile, "verifiedDate", "");
    const tag = note.isTemplate ? "填写模板" : (saved ? "已收藏" : (pendingJob ? "待核实" : "可取用"));
    const source = note.type === "industry" ? `资料核验：${escapeHtml(organizationValue(note, "verifiedDate", "待核验"))}` : (note.type === "job" ? `资料日期：${note.date} · 核验：${escapeHtml(profileValue(note.jobProfile, "verifiedDate", "待核验"))}` : note.date);
    const linkHint = note.type === "industry" && !noteLinks(note).length ? `<p class="organization-link-hint">机构官网、项目／报告链接待补充</p>` : "";
    return `<article class="note-card ${saved ? "saved" : ""} ${note.type === "job" ? "job-card" : ""}" style="--note-bg:${meta.background};--note-accent:${meta.color};--tilt:${index % 2 ? "1.3deg" : "-1.2deg"}" data-id="${note.id}" tabindex="0" aria-label="${note.title}，点击翻转查看详情">
      <div class="note-card-inner">
        <div class="note-face note-front"><span class="note-category">${meta.label} / ${String(note.id).padStart(2, "0")}</span><span class="note-tag">${tag}</span><div class="note-front-content">${frontImage(note)}<span class="note-icon" aria-hidden="true">${note.icon}</span><h3>${note.title}</h3>${organizationFront(note)}${jobFront(note)}</div><div class="note-footer"><span>${note.isTemplate ? "示例模板 · 不计取用" : `${viewCount(note)} 次取用`}</span><button class="heart" type="button" data-action="favorite" ${note.isTemplate ? "disabled" : ""} aria-label="${note.isTemplate ? "填写完成后可收藏" : (saved ? "取消收藏" : "收藏")}">${saved ? "♥" : "♡"}</button></div></div>
        <div class="note-face note-back"><span class="note-category">DETAIL / ${meta.label}</span>${optionalImage(note)}<div class="note-detail"><h3>${note.title}</h3><p>${note.detail}</p>${organizationDetail(note)}${jobDetail(note)}${basisRow}</div><div class="detail-source">${source}${note.isTemplate ? "" : ` · ${favoriteCount(note)} 人收藏`}</div><div class="note-actions">${optionalLink(note)}${linkHint}${qrMarkup(note)}<button class="take-btn" type="button" data-action="take" ${note.isTemplate ? "disabled" : ""}>${note.isTemplate ? "填写并核验后可取用" : "取用这张便利贴　→"}</button></div></div>
      </div>
    </article>`;
  }).join("");

  emptyState.hidden = current.length > 0;
  document.querySelector("#resultsCount").textContent = `${String(current.length).padStart(2, "0")} NOTES`;
  setText("#noteTotal", String(noteData.length).padStart(2, "0"));
  const countedNotes = favoritesPage ? noteData.filter(note => state.saved.includes(note.id)) : noteData;
  document.querySelectorAll("[data-filter-count]").forEach(item => {
    const type = item.dataset.filterCount;
    item.textContent = String(type === "all" ? countedNotes.length : countedNotes.filter(note => note.type === type).length).padStart(2, "0");
  });

  wall.querySelectorAll(".qr-code").forEach(qr => {
    if (typeof QRCode === "function") new QRCode(qr, { text: qr.dataset.qr, width: 52, height: 52, colorDark: "#18332b", colorLight: "#ffffff" });
    else qr.textContent = "二维码加载失败";
  });
  wall.querySelectorAll(".note-card").forEach(card => {
    const cardNote = noteData.find(item => item.id === Number(card.dataset.id));
    const basisText = card.querySelector(".basis-text");
    if (basisText) {
      const basis = cardNote.basis === undefined ? "" : cardNote.basis.trim();
      basisText.textContent = basis || "待补充";
    }
    card.addEventListener("click", event => { if (!event.target.closest("button, a")) card.classList.toggle("flipped"); });
    card.addEventListener("keydown", event => { if (event.target === card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); card.classList.toggle("flipped"); } });
    card.querySelectorAll('[data-action="image"]').forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openLightbox(cardNote, Number(button.dataset.imageIndex || 0)); }));
    if (!cardNote.isTemplate) {
      card.querySelector('[data-action="favorite"]').addEventListener("click", event => { event.stopPropagation(); toggleFavorite(Number(card.dataset.id)); });
      card.querySelector('[data-action="take"]').addEventListener("click", event => { event.stopPropagation(); takeNote(Number(card.dataset.id)); });
    }
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
  if (!rankingList || !categoryRankingList) return;
  const published = noteData.filter(note => !note.isTemplate);
  const sorted = [...published].sort((a, b) => countInPeriod(b, state.rankingMode) - countInPeriod(a, state.rankingMode));
  const limit = rankingList.dataset.full === "true" ? sorted.length : 4;
  rankingList.innerHTML = sorted.slice(0, limit).map((note, index) => `<li><span class="rank-num">${String(index + 1).padStart(2, "0")}</span><span class="rank-name">${note.title}<small>${metaFor(note).label}</small></span><span class="rank-uses">${countInPeriod(note, state.rankingMode)}</span></li>`).join("");
  const categoryCounts = Object.entries(typeMeta).map(([type, meta]) => ({ type, label: meta.label, color: meta.color, count: published.filter(note => note.type === type).reduce((total, note) => total + countInPeriod(note, state.rankingMode), 0) })).sort((a, b) => b.count - a.count);
  document.querySelector("#categoryRankingLabel").textContent = state.rankingMode === "favorites" ? "收藏次数" : `${state.rankingMode === "week" ? "本周" : "本月"}取用`;
  categoryRankingList.innerHTML = categoryCounts.map(item => `<div class="category-ranking-row"><span class="category-dot" style="--category-color:${item.color}"></span><span>${item.label}</span><strong>${item.count}</strong></div>`).join("");
}
function toggleFavorite(id) {
  if (!window.requireLogin("favorite")) return;
  const saved = state.saved.includes(id);
  try {
    window.GreenPortAuth.saveFavoriteIds(saved ? state.saved.filter(savedId => savedId !== id) : [...state.saved, id]);
    showToast(saved ? "已取消收藏" : "已收藏到我的便利贴");
  } catch (error) {
    window.GreenPortAuth.reportError(error);
  }
}
function takeNote(id) {
  if (!window.requireLogin("take")) return;
  state.uses[id] = (state.uses[id] || 0) + 1;
  state.usageLog.push({ id, time: Date.now() });
  localStorage.setItem("green-port-uses", JSON.stringify(state.uses));
  localStorage.setItem("green-port-usage-log", JSON.stringify(state.usageLog));
  setText("#todayUses", Object.values(state.uses).reduce((sum, value) => sum + value, 0));
  renderNotes();
  renderRanking();
  showToast("已取用，这张知识现在属于你了");
}
function showToast(message) { toast.textContent = message; toast.classList.add("show"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200); }
function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}
function listen(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) element.addEventListener(event, handler);
}
function refreshAccount() {
  try {
    state.saved = window.GreenPortAuth.getFavoriteIds().filter(id => noteData.some(note => note.id === id && !note.isTemplate));
    state.userFavorites = window.GreenPortAuth.getFavoriteCounts();
    setText("#savedCount", state.saved.length);
    const user = window.getCurrentUser();
    setText("#favoritesOwner", user ? `${user.username}的知识收藏夹` : "登录后查看你的知识收藏夹");
    if (favoritesPage) {
      setText("#emptyTitle", user ? "暂时没有匹配的收藏" : "请先登录");
      setText("#emptyDescription", user ? "到便利贴墙点击爱心收藏，或换个关键词试试。" : "收藏按账号保存，登录后才能查看。");
    }
    renderNotes();
    renderRanking();
  } catch (error) {
    window.GreenPortAuth.reportError(error);
  }
}
document.addEventListener("accountchange", refreshAccount);

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
listen("#searchInput", "input", event => { state.search = event.target.value; renderNotes(); });
listen("#savedTrigger", "click", () => { if (!window.requireLogin("favorite")) return; state.filter = "saved"; state.search = ""; document.querySelector("#searchInput").value = ""; renderNotes(); showToast(state.saved.length ? `已筛选 ${state.saved.length} 张收藏便利贴` : "还没有收藏便利贴"); });
listen("#feedbackTrigger", "click", () => { document.querySelector("#feedbackModal").hidden = false; document.querySelector("#feedbackText").focus(); });
listen("[data-close-modal]", "click", () => { document.querySelector("#feedbackModal").hidden = true; });
listen("#feedbackModal", "click", event => { if (event.target.id === "feedbackModal") event.currentTarget.hidden = true; });
listen("#feedbackForm", "submit", event => { event.preventDefault(); event.currentTarget.hidden = true; document.querySelector("#formSuccess").hidden = false; showToast("反馈已提交，谢谢你的建议"); });

setText("#todayUses", Object.values(state.uses).reduce((sum, value) => sum + value, 0));
refreshAccount();
