const factors = {
  walk: 0,
  bike: 0,
  subway: 0.05,
  bus: 0.05,
  highspeed: 0.04,
  train: 0.04,
  eBike: 0.011,
  car: 0.19,
  plane: 0.25
};

const distances = {
  "上海海事大学-洋山港": 45,
  "上海海事大学-外高桥港": 65,
  "上海海事大学-上海港国际客运中心": 70,
  "临港大道地铁站-洋山港": 40,
  "龙阳路地铁站-洋山港": 75
};

const modeNames = { walk: "步行", bike: "自行车", subway: "地铁", bus: "公交", highspeed: "高铁", train: "火车", eBike: "电动车", car: "汽车", plane: "飞机" };
const historyKey = "green-port-carbon-history";
const pointsKey = "green-port-carbon-points";
const electricityFactor = 0.57;
let carbonChart;
let trendChart;
let latestTrip;

const form = document.querySelector("#carbonForm");
const originSelect = document.querySelector("#originSelect");
const destinationSelect = document.querySelector("#destinationSelect");
const distanceHint = document.querySelector("#distanceHint");
const segmentsContainer = document.querySelector("#transportSegments");
const addSegmentButton = document.querySelector("#addSegment");
const result = document.querySelector("#carbonResult");
const chartPanel = document.querySelector("#chartPanel");
const impactRing = document.querySelector("#impactRing");
const shareButton = document.querySelector("#shareCarbon");
const shareStatus = document.querySelector("#shareStatus");
const error = document.querySelector("#carbonError");
const routeButton = document.querySelector("#routeDistanceButton");
const routeStatus = document.querySelector("#routeStatus");
let amapPromise;

function isCustomTrip() { return originSelect.value === "custom" || destinationSelect.value === "custom"; }
function selectedPlace(select, inputId) { return select.value === "custom" ? document.querySelector(`#${inputId}`).value.trim() || "自定义地点" : select.value; }
function presetDistance() { return distances[`${originSelect.value}-${destinationSelect.value}`] || null; }
function getSegments() { return [...segmentsContainer.querySelectorAll("[data-segment]")].map(row => ({ row, mode: row.querySelector(".segment-mode").value, distance: Number(row.querySelector(".segment-distance").value) })); }
function historyValues() {
  const values = JSON.parse(localStorage.getItem(historyKey) || "[]");
  if (!Array.isArray(values)) throw new Error("本地历史记录格式无效，请清空记录后重试。");
  return values;
}
function historyTotal() { return historyValues().reduce((total, item) => total + (Number.isFinite(Number(item.amount)) ? Number(item.amount) : 0), 0); }
function totalPoints() {
  const points = Number(localStorage.getItem(pointsKey) || 0);
  if (!Number.isFinite(points) || points < 0) throw new Error("本地碳积分格式无效，请清空记录后重试。");
  return Number(points.toFixed(2));
}
function showError(message) { error.textContent = message; error.hidden = false; }
function clearError() { error.textContent = ""; error.hidden = true; }

function renderTrend() {
  try {
    const values = historyValues();
    const points = totalPoints();
    document.querySelector("#historyPoints").textContent = points.toFixed(2);
    document.querySelector("#totalPoints").textContent = points.toFixed(2);
    document.querySelector("#historyValue").textContent = historyTotal().toFixed(2);
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setHours(0, 0, 0, 0);
      day.setDate(today.getDate() - (6 - index));
      return day;
    });
    const totals = days.map(day => values.reduce((sum, item) => {
      const time = Number(item.time);
      const itemDate = new Date(time);
      if (!Number.isFinite(time) || itemDate.toDateString() !== day.toDateString()) return sum;
      const amount = Number(item.amount);
      return sum + (Number.isFinite(amount) && amount >= 0 ? amount : 0);
    }, 0));
    const hasEntries = values.length > 0;
    document.querySelector("#trendEmpty").hidden = hasEntries;
    document.querySelector("#trendError").hidden = true;
    document.querySelector("#trendChartWrap").hidden = !hasEntries || typeof Chart !== "function";
    if (!hasEntries) return;
    if (typeof Chart !== "function") {
      document.querySelector("#trendError").hidden = false;
      return;
    }
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(document.querySelector("#carbonTrendChart"), {
      type: "line",
      data: {
        labels: days.map(day => day.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })),
        datasets: [{ label: "每日碳排放（kg CO₂）", data: totals, borderColor: "#0d9488", backgroundColor: "rgba(13,148,136,.12)", pointBackgroundColor: "#0d9488", pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.raw.toFixed(2)} kg CO₂` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#718078" } },
          y: { beginAtZero: true, grid: { color: "#e5edf1" }, title: { display: true, text: "kg CO₂ / 日" }, ticks: { color: "#718078" } }
        }
      }
    });
  } catch (historyError) {
    document.querySelector("#trendError").textContent = historyError.message;
    document.querySelector("#trendError").hidden = false;
    document.querySelector("#trendEmpty").hidden = true;
    document.querySelector("#trendChartWrap").hidden = true;
  }
}

function updateDistance() {
  const custom = isCustomTrip();
  document.querySelector("#originCustomField").hidden = originSelect.value !== "custom";
  document.querySelector("#destinationCustomField").hidden = destinationSelect.value !== "custom";
  if (!segmentsContainer.firstElementChild) return;
  const firstDistance = segmentsContainer.querySelector(".segment-distance");
  firstDistance.readOnly = false;
  firstDistance.placeholder = custom ? "请输入 0-10000 公里" : "路线预估，可修改";
  if (custom) {
    firstDistance.value = "";
    distanceHint.textContent = "自定义地点请手动输入距离（0-10000 km）";
    return;
  }
  const distance = presetDistance();
  firstDistance.value = distance || "";
  distanceHint.textContent = distance ? `按路线预估约 ${distance} km，可手动调整` : "这组地点暂无预设距离，请手动输入本段距离";
}

function setRouteStatus(message, isError = false) {
  routeStatus.textContent = message;
  routeStatus.classList.toggle("error", isError);
}

function loadAmap() {
  const config = window.AMAP_CONFIG || {};
  if (!config.key) return Promise.reject(new Error("请先在 js/map-config.js 填写高德地图 Key。"));
  if (window.AMap) return Promise.resolve(window.AMap);
  if (amapPromise) return amapPromise;
  if (config.securityJsCode) window._AMapSecurityConfig = { securityJsCode: config.securityJsCode };
  amapPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(config.key)}&plugin=AMap.Geocoder,AMap.Driving,AMap.Walking,AMap.Riding,AMap.Transfer`;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error("高德地图 SDK 加载失败，请检查 Key、域名白名单和网络连接。"));
    document.head.appendChild(script);
  });
  return amapPromise;
}

function geocode(AMap, address) {
  return new Promise((resolve, reject) => {
    new AMap.Geocoder({ city: window.AMAP_CONFIG?.city || "上海" }).getLocation(address, (status, result) => {
      const location = result?.geocodes?.[0]?.location;
      if (status === "complete" && location) resolve(location);
      else reject(new Error(`无法定位“${address}”，请检查地点名称。`));
    });
  });
}

function routeDistance(AMap, mode, origin, destination) {
  return new Promise((resolve, reject) => {
    const finish = (status, result) => {
      if (status !== "complete") return reject(new Error("高德路线规划失败，请尝试手动填写距离。"));
      const route = result?.routes?.[0] || result?.plans?.[0];
      if (!route?.distance) return reject(new Error("没有找到可用路线，请尝试手动填写距离。"));
      resolve(Number(route.distance));
    };
    if (mode === "walk") new AMap.Walking().search(origin, destination, finish);
    else if (mode === "bike" || mode === "eBike") new AMap.Riding().search(origin, destination, finish);
    else if (mode === "car") new AMap.Driving().search(origin, destination, finish);
    else if (["subway", "bus", "train", "highspeed"].includes(mode)) new AMap.Transfer({ city: window.AMAP_CONFIG?.city || "上海" }).search(origin, destination, finish);
    else reject(new Error("飞机路线请手动填写公里数。"));
  });
}

async function calculateRouteDistance() {
  const segments = [...segmentsContainer.querySelectorAll("[data-segment]")];
  if (!segments.length) return;
  const origin = selectedPlace(originSelect, "originCustom");
  const destination = selectedPlace(destinationSelect, "destinationCustom");
  if (origin === "自定义地点" || destination === "自定义地点") { setRouteStatus("请先填写自定义地点名称。", true); return; }
  routeButton.disabled = true;
  setRouteStatus("正在定位地点并规划路线……");
  try {
    const AMap = await loadAmap();
    const [originPoint, destinationPoint] = await Promise.all([geocode(AMap, origin), geocode(AMap, destination)]);
    const results = await Promise.allSettled(segments.map(async segment => {
      const mode = segment.querySelector(".segment-mode").value;
      const distanceField = segment.querySelector(".segment-distance");
      const meters = await routeDistance(AMap, mode, originPoint, destinationPoint);
      const kilometers = meters / 1000;
      distanceField.value = kilometers.toFixed(1);
      distanceField.readOnly = false;
      return `${modeNames[mode]} ${kilometers.toFixed(1)} km`;
    }));
    const successful = results.filter(item => item.status === "fulfilled").map(item => item.value);
    const failed = results.filter(item => item.status === "rejected").map(item => item.reason.message);
    if (successful.length) {
      distanceHint.textContent = `高德已分别计算：${successful.join("、")}，均可手动调整`;
      setRouteStatus(failed.length ? `部分路线未能计算：${failed.join("；")}` : `已完成 ${successful.length} 段交通路线计算。`, failed.length > 0);
    } else {
      setRouteStatus("没有成功获取路线，请检查交通方式或手动填写距离。", true);
    }
  } catch (routeError) {
    setRouteStatus(routeError.message, true);
  } finally {
    routeButton.disabled = false;
  }
}

function adviceFor(mode, amount, distance) {
  if (mode === "walk" || mode === "bike") return "太棒了！这次出行没有产生直接交通碳排放，继续保持绿色步伐。";
  if (mode === "car") return `如果改乘地铁，约可减少 ${Math.round((1 - factors.subway / factors.car) * 100)}% 的碳排放。`;
  if (mode === "plane") return `如果距离允许，改乘高铁可减少约 ${Math.round((1 - factors.highspeed / factors.plane) * 100)}% 的碳排放。`;
  if (mode === "bus") return "公交已经是不错的低碳选择，也可以和地铁组合出行。";
  if (mode === "eBike") return "电动车排放较低，记得规范充电并优先选择可再生能源电力。";
  return `本次约 ${distance} km，选择公共交通已经比燃油车更低碳。继续保持！`;
}

function renderChart(distance, selectedModes) {
  const comparisonModes = Object.keys(modeNames);
  const labels = comparisonModes.map(key => modeNames[key]);
  const values = comparisonModes.map(key => Number((distance * factors[key]).toFixed(3)));
  const colors = comparisonModes.map(key => selectedModes.includes(key) ? "#0b9877" : "#73bba5");
  chartPanel.hidden = false;
  document.querySelector("#chartDistance").textContent = `约 ${distance} km`;
  if (typeof Chart !== "function") return;
  if (carbonChart) carbonChart.destroy();
  carbonChart = new Chart(document.querySelector("#carbonChart"), { type: "bar", data: { labels, datasets: [{ label: "kg CO₂ / 人", data: values, backgroundColor: colors, borderRadius: 7, barThickness: 25 }] }, options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.raw} kg CO₂ / 人` } } }, scales: { x: { beginAtZero: true, grid: { color: "#e5edf1" }, title: { display: true, text: "kg CO₂ / 人" } }, y: { grid: { display: false }, ticks: { color: "#254b60", font: { weight: "600" } } } } } });
}

async function generateShareCard() {
  if (!latestTrip) return;
  shareButton.disabled = true;
  shareStatus.textContent = "正在生成分享图片……";
  try {
    if (typeof QRCode !== "function") throw new Error("二维码组件未能加载，请检查网络后重试。");
    if (typeof html2canvas !== "function") throw new Error("分享图片组件未能加载，请检查网络后重试。");
    document.querySelector("#shareRoute").textContent = `${latestTrip.origin} → ${latestTrip.destination}`;
    document.querySelector("#shareMode").textContent = `交通方式：${latestTrip.label}`;
    document.querySelector("#shareEmission").textContent = latestTrip.amount.toFixed(2);
    document.querySelector("#shareSlogan").textContent = latestTrip.amount < 1 ? "这次出行很环保，继续把绿色带在路上！" : "每一次低碳选择，都在为城市减轻负担。";
    const qrElement = document.querySelector("#shareQr");
    qrElement.replaceChildren();
    new QRCode(qrElement, { text: new URL("index.html", window.location.href).href, width: 96, height: 96, colorDark: "#164b3b", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    const qrImage = qrElement.querySelector("img");
    if (qrImage && !qrImage.complete) {
      await new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error("二维码生成超时，请重试。")), 5000);
        qrImage.addEventListener("load", () => { window.clearTimeout(timeout); resolve(); }, { once: true });
        qrImage.addEventListener("error", () => { window.clearTimeout(timeout); reject(new Error("二维码生成失败，请重试。")); }, { once: true });
      });
    }
    if (!qrElement.querySelector("canvas, img")) throw new Error("二维码未能生成，请刷新页面后重试。");
    const canvas = await html2canvas(document.querySelector("#shareCard"), { backgroundColor: "#ffffff", scale: 2, useCORS: true, logging: false });
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(file => file ? resolve(file) : reject(new Error("图片编码失败，请重试。")), "image/png");
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `绿港小贴士-碳足迹-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    shareStatus.textContent = "分享卡片已生成，图片已开始下载。";
  } catch (shareError) {
    shareStatus.textContent = shareError.message || "分享卡片生成失败，请稍后重试。";
  } finally {
    shareButton.disabled = false;
  }
}

function calculate(event) {
  event.preventDefault();
  clearError();
  const segments = getSegments();
  if (segments.some(segment => !Number.isFinite(segment.distance) || segment.distance < 0 || segment.distance > 10000)) { showError("每段交通请输入 0 到 10000 之间的有效公里数。"); return; }
  if (!isCustomTrip() && !presetDistance()) { showError("这组地点暂无预设距离，请选择一个自定义地点后手动输入。"); return; }
  const distance = segments.reduce((total, segment) => total + segment.distance, 0);
  const amount = Number(segments.reduce((total, segment) => total + segment.distance * factors[segment.mode], 0).toFixed(2));
  const selectedModes = segments.map(segment => segment.mode);
  const resultLabel = selectedModes.length > 1 ? "多种交通方式" : modeNames[selectedModes[0]];
  const origin = selectedPlace(originSelect, "originCustom");
  const destination = selectedPlace(destinationSelect, "destinationCustom");
  const earned = Number((100 / (1 + amount)).toFixed(2));
  try {
    const values = historyValues();
    const previousHistory = localStorage.getItem(historyKey);
    const updatedPoints = Number((totalPoints() + earned).toFixed(2));
    values.push({ amount, time: Date.now(), modes: selectedModes, distance, origin, destination, points: earned });
    localStorage.setItem(historyKey, JSON.stringify(values));
    try {
      localStorage.setItem(pointsKey, String(updatedPoints));
    } catch (pointsError) {
      if (previousHistory === null) localStorage.removeItem(historyKey);
      else localStorage.setItem(historyKey, previousHistory);
      throw pointsError;
    }
  } catch (storageError) {
    showError(storageError.message || "本地记录保存失败，请检查浏览器存储空间后重试。");
    return;
  }
  latestTrip = { amount, origin, destination, label: resultLabel };
  const grade = amount < 1 ? "green" : amount <= 5 ? "yellow" : "red";
  const progress = Math.min(amount, 1);
  result.classList.remove("impact-green", "impact-yellow", "impact-red");
  result.classList.add(`impact-${grade}`);
  impactRing.style.setProperty("--ring-progress", `${progress * 360}deg`);
  impactRing.setAttribute("aria-label", `本次排放 ${amount.toFixed(2)} kg CO₂，占 1 kg 低碳目标的 ${Math.round(progress * 100)}%`);
  document.querySelector("#targetPercent").textContent = `${Math.round(progress * 100)}%`;
  document.querySelector("#resultMode").textContent = resultLabel;
  document.querySelector("#emissionValue").textContent = amount.toFixed(2);
  document.querySelector("#treeValue").textContent = String(Math.ceil(amount / 18.3));
  document.querySelector("#carDistanceValue").textContent = (amount / factors.car).toFixed(2);
  document.querySelector("#electricityValue").textContent = (amount / electricityFactor).toFixed(2);
  document.querySelector("#earnedPoints").textContent = earned.toFixed(2);
  document.querySelector("#impactRating").textContent = amount < 1 ? "这次出行很环保！" : "可以试试更低碳的方式";
  document.querySelector("#impactCopy").textContent = amount === 0 ? "这是一趟零直接排放的绿色出行。" : `从${origin}到${destination}，这次出行产生了约 ${amount.toFixed(2)} kg CO₂。`;
  document.querySelector("#adviceText").textContent = selectedModes.length > 1 ? "组合出行可以把不同交通方式的排放拆开观察，优先增加步行、骑行和公共交通路段。" : adviceFor(selectedModes[0], amount, distance);
  result.hidden = false;
  document.querySelector("#shareStatus").textContent = "";
  renderTrend();
  renderChart(distance, selectedModes);
}

originSelect.addEventListener("change", updateDistance);
destinationSelect.addEventListener("change", updateDistance);
form.addEventListener("submit", calculate);
function updateRemoveButtons() { segmentsContainer.querySelectorAll(".remove-segment").forEach(button => { button.hidden = segmentsContainer.children.length === 1; }); }
addSegmentButton.addEventListener("click", () => {
  const template = segmentsContainer.firstElementChild.cloneNode(true);
  template.querySelector(".segment-distance").value = "";
  template.querySelector(".segment-distance").readOnly = false;
  segmentsContainer.appendChild(template);
  updateRemoveButtons();
});
segmentsContainer.addEventListener("click", event => { if (event.target.closest(".remove-segment")) { event.target.closest("[data-segment]").remove(); updateRemoveButtons(); } });
document.querySelector("#clearHistory").addEventListener("click", () => {
  if (!window.confirm("确定清空全部碳足迹记录和累计积分吗？此操作无法撤销。")) return;
  try {
    localStorage.removeItem(historyKey);
    localStorage.removeItem(pointsKey);
    renderTrend();
  } catch (clearError) {
    showError(clearError.message || "清空记录失败，请稍后重试。");
  }
});
shareButton.addEventListener("click", generateShareCard);
routeButton.addEventListener("click", calculateRouteDistance);
updateDistance();
updateRemoveButtons();
renderTrend();
