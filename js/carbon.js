const factors = {
  walk: 0,
  bike: 0,
  subway: 0.05,
  bus: 0.05,
  eBike: 0.011,
  car: 0.19
};

// GCJ-02 coordinates verified with AMap; port names refer to the locations described in the form.
const placeCoordinates = {
  "上海海事大学": [121.89848, 30.878098],
  "临港大道地铁站": [121.909761, 30.924189],
  "龙阳路地铁站": [121.557634, 31.203575],
  "洋山港": [122.071122, 30.621912],
  "外高桥港": [121.579543, 31.367159],
  "上海港国际客运中心": [121.497142, 31.247575]
};

const modeNames = { walk: "步行", bike: "自行车", subway: "地铁", bus: "公交", eBike: "电动车", car: "驾车" };
const historyKey = "green-port-carbon-history";
const pointsKey = "green-port-carbon-points";
const electricityFactor = 0.57;
const routeFailureMessage = "暂时无法计算该路线，请换一种交通方式";
const amapPlugins = ["AMap.Geocoder", "AMap.Driving", "AMap.Transfer", "AMap.Walking", "AMap.Riding"];
let carbonChart;
let trendChart;
let latestTrip;
let isCalculating = false;

const form = document.querySelector("#carbonForm");
const originSelect = document.querySelector("#originSelect");
const destinationSelect = document.querySelector("#destinationSelect");
const distanceHint = document.querySelector("#distanceHint");
const transportSelect = document.querySelector("#transportMode");
const submitButton = form.querySelector('[type="submit"]');
const result = document.querySelector("#carbonResult");
const chartPanel = document.querySelector("#chartPanel");
const impactRing = document.querySelector("#impactRing");
const shareButton = document.querySelector("#shareCarbon");
const shareStatus = document.querySelector("#shareStatus");
const error = document.querySelector("#carbonError");
const routeStatus = document.querySelector("#routeStatus");
let amapPromise;

function selectedPlace(select, inputId) { return select.value === "custom" ? document.querySelector(`#${inputId}`).value.trim() : select.selectedOptions[0].textContent; }
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

function updateTrip() {
  document.querySelector("#originCustomField").hidden = originSelect.value !== "custom";
  document.querySelector("#destinationCustomField").hidden = destinationSelect.value !== "custom";
  latestTrip = null;
  result.hidden = true;
  chartPanel.hidden = true;
  clearError();
  setRouteStatus("");
  distanceHint.textContent = "无需填写距离，点击计算后自动查询所选交通方式的高德路线。";
}

function setRouteStatus(message, isError = false) {
  routeStatus.textContent = message;
  routeStatus.classList.toggle("error", isError);
}

function amapRequest(start, message) {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), 15000);
    const finish = (error, value) => {
      window.clearTimeout(timeout);
      if (error) reject(error);
      else resolve(value);
    };
    try {
      start(finish);
    } catch (error) {
      finish(error);
    }
  });
}

async function loadAmap() {
  if (amapPromise) return amapPromise;
  const config = window.AMAP_CONFIG || {};
  const loadMessage = "高德地图加载失败或超时，请检查网络、地图 Key 和域名白名单后重试。";
  amapPromise = (async () => {
    if (!window.AMap) {
      if (!config.key) throw new Error("尚未配置高德地图 Key，请在地图配置中填写后重试。");
      if (config.securityJsCode) window._AMapSecurityConfig = { securityJsCode: config.securityJsCode };
      const script = document.createElement("script");
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(config.key)}&plugin=${amapPlugins.join(",")}`;
      try {
        await amapRequest(finish => {
          script.onload = () => finish(null);
          script.onerror = () => finish(new Error(loadMessage));
          document.head.appendChild(script);
        }, loadMessage);
      } finally {
        script.onload = null;
        script.onerror = null;
        script.remove();
      }
    }
    const AMap = window.AMap;
    if (!AMap || typeof AMap.plugin !== "function") throw new Error(loadMessage);
    await amapRequest(finish => {
      AMap.plugin(amapPlugins, () => {
        const ready = amapPlugins.every(name => typeof AMap[name.split(".")[1]] === "function");
        finish(ready ? null : new Error(loadMessage), AMap);
      });
    }, loadMessage);
    return AMap;
  })();
  try {
    return await amapPromise;
  } catch (loadError) {
    amapPromise = null;
    throw loadError;
  }
}

function geocode(AMap, address) {
  const message = `无法定位“${address}”，请填写完整地址（含城市）后重试。`;
  return amapRequest(finish => {
    new AMap.Geocoder({ city: window.AMAP_CONFIG?.city || "上海" }).getLocation(address, (status, result) => {
      const location = result?.geocodes?.[0]?.location;
      if (status === "complete" && location) finish(null, location);
      else finish(new Error(message));
    });
  }, message);
}

function coordinatesFor(AMap, select, address) {
  if (select.value === "custom") return geocode(AMap, address);
  const coordinates = placeCoordinates[select.value];
  if (!coordinates) throw new Error("所选地点尚未配置坐标，请选择自定义输入并填写完整地址。");
  return new AMap.LngLat(coordinates[0], coordinates[1]);
}

function routeDistance(AMap, mode, origin, destination) {
  return amapRequest(finish => {
    const complete = (status, result) => {
      if (status !== "complete") {
        finish(new Error(routeFailureMessage));
        return;
      }
      const route = mode === "bus" || mode === "subway" ? result?.plans?.[0] : result?.routes?.[0];
      const meters = route?.distance;
      if (typeof meters !== "number" || !Number.isFinite(meters) || meters <= 0) {
        finish(new Error(routeFailureMessage));
        return;
      }
      finish(null, meters / 1000);
    };
    if (mode === "walk") new AMap.Walking().search(origin, destination, complete);
    else if (mode === "bike" || mode === "eBike") new AMap.Riding().search(origin, destination, complete);
    else if (mode === "car") new AMap.Driving().search(origin, destination, complete);
    else if (mode === "subway" || mode === "bus") {
      new AMap.Transfer({
        city: window.AMAP_CONFIG?.city || "上海",
        policy: mode === "bus" ? AMap.TransferPolicy.NO_SUBWAY : AMap.TransferPolicy.LEAST_TIME
      }).search(origin, destination, complete);
    } else {
      finish(new Error("请选择受支持的交通方式。"));
    }
  }, routeFailureMessage);
}

function adviceFor(mode, distance) {
  if (mode === "walk" || mode === "bike") return "太棒了！这次出行没有产生直接交通碳排放，继续保持绿色步伐。";
  if (mode === "car") return `如果改乘地铁，约可减少 ${Math.round((1 - factors.subway / factors.car) * 100)}% 的碳排放。`;
  if (mode === "bus") return "公交已经是不错的低碳选择，短距离也可以考虑步行或骑行。";
  if (mode === "eBike") return "电动车排放较低，记得规范充电并优先选择可再生能源电力。";
  return `本次约 ${distance.toFixed(2)} km，选择公共交通已经比燃油车更低碳。继续保持！`;
}

function renderChart(distance, selectedMode) {
  const comparisonModes = Object.keys(modeNames);
  const labels = comparisonModes.map(key => modeNames[key]);
  const values = comparisonModes.map(key => Number((distance * factors[key]).toFixed(3)));
  const colors = comparisonModes.map(key => selectedMode === key ? "#0b9877" : "#73bba5");
  chartPanel.hidden = false;
  document.querySelector("#chartDistance").textContent = `约 ${distance.toFixed(2)} km`;
  if (typeof Chart !== "function") return;
  if (carbonChart) carbonChart.destroy();
  carbonChart = new Chart(document.querySelector("#carbonChart"), { type: "bar", data: { labels, datasets: [{ label: "kg CO₂ / 人", data: values, backgroundColor: colors, borderRadius: 7, barThickness: 25 }] }, options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.raw} kg CO₂ / 人` } } }, scales: { x: { beginAtZero: true, grid: { color: "#e5edf1" }, title: { display: true, text: "kg CO₂ / 人" } }, y: { grid: { display: false }, ticks: { color: "#254b60", font: { weight: "600" } } } } } });
}

async function generateShareCard() {
  if (!latestTrip) {
    shareStatus.textContent = "请先成功计算路线，再生成分享卡片。";
    return;
  }
  shareButton.disabled = true;
  shareStatus.textContent = "正在生成分享图片……";
  try {
    if (typeof QRCode !== "function") throw new Error("二维码组件未能加载，请检查网络后重试。");
    if (typeof html2canvas !== "function") throw new Error("分享图片组件未能加载，请检查网络后重试。");
    document.querySelector("#shareRoute").textContent = `${latestTrip.origin} → ${latestTrip.destination}`;
    document.querySelector("#shareMode").textContent = `交通方式：${latestTrip.label} · 距离：${latestTrip.distance.toFixed(2)} km`;
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

async function calculate(event) {
  event.preventDefault();
  if (isCalculating) return;
  clearError();
  result.hidden = true;
  chartPanel.hidden = true;
  latestTrip = null;
  setRouteStatus("");
  const mode = transportSelect.value;
  const origin = selectedPlace(originSelect, "originCustom");
  const destination = selectedPlace(destinationSelect, "destinationCustom");
  if (!origin || !destination) { showError("请填写出发地和目的地的完整地址。"); return; }
  if (!Object.prototype.hasOwnProperty.call(factors, mode)) { showError("请选择受支持的交通方式。"); return; }
  isCalculating = true;
  form.setAttribute("aria-busy", "true");
  form.querySelectorAll("input, select, button").forEach(control => { control.disabled = true; });
  submitButton.textContent = "正在计算路线……";
  setRouteStatus("正在查询高德路线，请稍候……");
  let distance;
  try {
    const AMap = await loadAmap();
    const [originPoint, destinationPoint] = await Promise.all([
      coordinatesFor(AMap, originSelect, origin),
      coordinatesFor(AMap, destinationSelect, destination)
    ]);
    distance = await routeDistance(AMap, mode, originPoint, destinationPoint);
    setRouteStatus(`高德${modeNames[mode]}路线：${distance.toFixed(2)} km`);
  } catch (routeError) {
    const message = routeError.message || routeFailureMessage;
    showError(message);
    setRouteStatus(message, true);
    return;
  } finally {
    isCalculating = false;
    form.setAttribute("aria-busy", "false");
    form.querySelectorAll("input, select, button").forEach(control => { control.disabled = false; });
    submitButton.innerHTML = "计算碳足迹 <span>→</span>";
  }
  const amount = Number((distance * factors[mode]).toFixed(2));
  const resultLabel = modeNames[mode];
  const earned = Number((100 / (1 + amount)).toFixed(2));
  try {
    const values = historyValues();
    const previousHistory = localStorage.getItem(historyKey);
    const updatedPoints = Number((totalPoints() + earned).toFixed(2));
    values.push({ amount, time: Date.now(), modes: [mode], distance, origin, destination, points: earned, distanceSource: "amap" });
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
  latestTrip = { amount, origin, destination, label: resultLabel, distance };
  const grade = amount < 1 ? "green" : amount <= 5 ? "yellow" : "red";
  const progress = Math.min(amount, 1);
  result.classList.remove("impact-green", "impact-yellow", "impact-red");
  result.classList.add(`impact-${grade}`);
  impactRing.style.setProperty("--ring-progress", `${progress * 360}deg`);
  impactRing.setAttribute("aria-label", `本次排放 ${amount.toFixed(2)} kg CO₂，占 1 kg 低碳目标的 ${Math.round(progress * 100)}%`);
  document.querySelector("#targetPercent").textContent = `${Math.round(progress * 100)}%`;
  document.querySelector("#resultMode").textContent = resultLabel;
  document.querySelector("#resultDistance").textContent = `${distance.toFixed(2)} km`;
  document.querySelector("#emissionValue").textContent = amount.toFixed(2);
  document.querySelector("#treeValue").textContent = String(Math.ceil(amount / 18.3));
  document.querySelector("#carDistanceValue").textContent = (amount / factors.car).toFixed(2);
  document.querySelector("#electricityValue").textContent = (amount / electricityFactor).toFixed(2);
  document.querySelector("#earnedPoints").textContent = earned.toFixed(2);
  document.querySelector("#impactRating").textContent = amount < 1 ? "这次出行很环保！" : "可以试试更低碳的方式";
  document.querySelector("#impactCopy").textContent = `从${origin}到${destination}，高德路线约 ${distance.toFixed(2)} km，估算排放 ${amount.toFixed(2)} kg CO₂。`;
  document.querySelector("#adviceText").textContent = adviceFor(mode, distance);
  result.hidden = false;
  document.querySelector("#shareStatus").textContent = "";
  renderTrend();
  renderChart(distance, mode);
}

originSelect.addEventListener("change", updateTrip);
destinationSelect.addEventListener("change", updateTrip);
transportSelect.addEventListener("change", updateTrip);
document.querySelector("#originCustom").addEventListener("input", updateTrip);
document.querySelector("#destinationCustom").addEventListener("input", updateTrip);
form.addEventListener("submit", calculate);
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
updateTrip();
renderTrend();
