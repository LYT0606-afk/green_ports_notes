const notes = [
  { id: 1, type: "policy", label: "政策", title: "绿色港口等级评价指南", summary: "一张图看懂三星至五星级绿色港口的评价方向。", detail: "评价围绕节能降碳、清洁能源、污染防治和资源循环等方向展开。港口可以按年度自评并申请相应等级。", source: "交通运输部 · 2025", link: "https://www.mot.gov.cn/", uses: 86, color: "#cfe6f0", accent: "#26718b", tilt: "-1.8deg" },
  { id: 2, type: "policy", label: "政策", title: "岸电使用政策", summary: "靠港船舶优先接入岸电，减少辅机排放。", detail: "船舶靠泊具备受电条件时，应优先使用岸电。岸电能减少靠港期间的噪声、硫氧化物和颗粒物排放。", source: "港口绿色发展 · 2024", uses: 72, color: "#f7df9c", accent: "#9a721b", tilt: "1.3deg" },
  { id: 3, type: "term", label: "术语", title: "岸电 Shore Power", summary: "船舶靠港时关闭自身发电机，改用岸上电力。", detail: "通过船岸连接系统向船舶供电。它是港口减少船舶靠泊期间碳排放和空气污染物的重要方式。", source: "绿港词典 · 01", uses: 64, color: "#d8ebc9", accent: "#3e7b3c", tilt: "-1deg" },
  { id: 4, type: "term", label: "术语", title: "碳足迹 Carbon Footprint", summary: "港口运营过程中直接和间接产生的温室气体总量。", detail: "核算对象包括装卸设备、港区运输、建筑用能以及外购电力等，是制定减排路径的基础数据。", source: "绿港词典 · 02", uses: 51, color: "#ead8ee", accent: "#83508b", tilt: "2deg" },
  { id: 5, type: "job", label: "就业", title: "绿色港口管理师", summary: "从能源管理、环保合规到绿色项目，把港口变得更聪明。", detail: "常见工作包括能源数据分析、绿色港口认证、节能项目管理和环境风险排查。物流、环境、交通相关专业都可关注。", source: "职业地图 · 2026", uses: 48, color: "#f4c9b9", accent: "#ad5237", tilt: "-2.2deg" },
  { id: 6, type: "job", label: "就业", title: "碳排放核算专员", summary: "用数据找到每一吨碳排放的来处和去处。", detail: "负责温室气体盘查、排放因子应用、数据质量管理及减排报告编制，熟悉 Excel 和基础统计会很有帮助。", source: "职业地图 · 2026", uses: 39, color: "#f3d5b6", accent: "#a3622b", tilt: "1.5deg" }
];

const state = { filter: "all", search: "", saved: JSON.parse(localStorage.getItem("green-port-saved") || "[]"), uses: JSON.parse(localStorage.getItem("green-port-uses") || "{}") };
const wall = document.querySelector("#noteWall");
const rankingList = document.querySelector("#rankingList");
const emptyState = document.querySelector("#emptyState");
const toast = document.querySelector("#toast");

function visibleNotes() {
  return notes.filter(note => {
    const matchesFilter = state.filter === "all" || (state.filter === "saved" ? state.saved.includes(note.id) : note.type === state.filter);
    return matchesFilter && `${note.title} ${note.summary} ${note.label}`.toLowerCase().includes(state.search.toLowerCase());
  });
}
function useCount(note) { return note.uses + (state.uses[note.id] || 0); }
function renderNotes() {
  const current = visibleNotes();
  wall.innerHTML = current.map(note => `<article class="note-card ${state.saved.includes(note.id) ? "saved" : ""}" style="--note-bg:${note.color};--note-accent:${note.accent};--tilt:${note.tilt}" data-id="${note.id}" tabindex="0" aria-label="${note.title}，点击翻转查看详情"><div class="note-card-inner"><div class="note-face note-front"><span class="note-category">${note.label} / 0${note.id}</span><span class="note-tag">${state.saved.includes(note.id) ? "已收藏" : "可取用"}</span><div><h3>${note.title}</h3><p>${note.summary}</p></div><div class="note-footer"><span>${useCount(note)} 次取用</span><button class="heart" type="button" data-action="save" aria-label="${state.saved.includes(note.id) ? "取消收藏" : "收藏"}">${state.saved.includes(note.id) ? "♥" : "♡"}</button></div></div><div class="note-face note-back"><span class="note-category">DETAIL / ${note.label}</span>${note.image ? `<img class="note-image" src="${note.image}" alt="${note.title}配图">` : ""}<div><h3>${note.title}</h3><p>${note.detail}</p></div><div class="detail-source">来源：${note.source}</div>${note.link ? `<a class="source-link" href="${note.link}" target="_blank" rel="noreferrer">查看来源 →</a>` : ""}<button class="take-btn" type="button" data-action="take">取用这张便利贴　→</button></div></div></article>`).join("");
  emptyState.hidden = current.length > 0;
  document.querySelector("#resultsCount").textContent = `${String(current.length).padStart(2, "0")} NOTES`;
  wall.querySelectorAll(".note-card").forEach(card => {
    card.addEventListener("click", event => { if (!event.target.closest("button")) card.classList.toggle("flipped"); });
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.classList.toggle("flipped"); } });
    card.querySelector('[data-action="save"]').addEventListener("click", event => { event.stopPropagation(); toggleSave(Number(card.dataset.id)); });
    card.querySelector('[data-action="take"]').addEventListener("click", event => { event.stopPropagation(); takeNote(Number(card.dataset.id)); });
  });
}
function renderRanking() { rankingList.innerHTML = [...notes].sort((a, b) => useCount(b) - useCount(a)).slice(0, 4).map((note, index) => `<li><span class="rank-num">0${index + 1}</span><span class="rank-name">${note.title}<small>${note.label}</small></span><span class="rank-uses">${useCount(note)}</span></li>`).join(""); }
function toggleSave(id) { state.saved = state.saved.includes(id) ? state.saved.filter(savedId => savedId !== id) : [...state.saved, id]; localStorage.setItem("green-port-saved", JSON.stringify(state.saved)); document.querySelector("#savedCount").textContent = state.saved.length; renderNotes(); showToast(state.saved.includes(id) ? "已收藏到我的便利贴" : "已取消收藏"); }
function takeNote(id) { state.uses[id] = (state.uses[id] || 0) + 1; localStorage.setItem("green-port-uses", JSON.stringify(state.uses)); document.querySelector("#todayUses").textContent = 128 + Object.values(state.uses).reduce((sum, value) => sum + value, 0); renderNotes(); renderRanking(); showToast("已取用，这张知识现在属于你了"); }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200); }

document.querySelectorAll(".filter-tab").forEach(tab => tab.addEventListener("click", () => { document.querySelectorAll(".filter-tab").forEach(item => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); }); tab.classList.add("active"); tab.setAttribute("aria-selected", "true"); state.filter = tab.dataset.filter; renderNotes(); }));
document.querySelector("#searchInput").addEventListener("input", event => { state.search = event.target.value; renderNotes(); });
document.querySelector("#savedTrigger").addEventListener("click", () => { state.filter = "saved"; state.search = ""; document.querySelector("#searchInput").value = ""; renderNotes(); showToast(state.saved.length ? `已筛选 ${state.saved.length} 张收藏便利贴` : "还没有收藏便利贴"); });
document.querySelector("#feedbackTrigger").addEventListener("click", () => { document.querySelector("#feedbackModal").hidden = false; document.querySelector("#feedbackText").focus(); });
document.querySelector("[data-close-modal]").addEventListener("click", () => { document.querySelector("#feedbackModal").hidden = true; });
document.querySelector("#feedbackModal").addEventListener("click", event => { if (event.target.id === "feedbackModal") event.currentTarget.hidden = true; });
document.querySelector("#feedbackForm").addEventListener("submit", event => { event.preventDefault(); event.currentTarget.hidden = true; document.querySelector("#formSuccess").hidden = false; showToast("反馈已提交，谢谢你的建议"); });
document.querySelector("#savedCount").textContent = state.saved.length;
document.querySelector("#noteTotal").textContent = String(notes.length).padStart(2, "0");
document.querySelector("#todayUses").textContent = 128 + Object.values(state.uses).reduce((sum, value) => sum + value, 0);
renderNotes();
renderRanking();
