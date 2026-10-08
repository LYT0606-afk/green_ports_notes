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
let carbonChart;

const form = document.querySelector("#carbonForm");
const originSelect = document.querySelector("#originSelect");
const destinationSelect = document.querySelector("#destinationSelect");
const distanceHint = document.querySelector("#distanceHint");
const segmentsContainer = document.querySelector("#transportSegments");
const addSegmentButton = document.querySelector("#addSegment");
const result = document.querySelector("#carbonResult");
const chartPanel = document.querySelector("#chartPanel");
const error = document.querySelector("#carbonError");
const routeButton = document.querySelector("#routeDistanceButton");
const routeStatus = document.querySelector("#routeStatus");
let amapPromise;

function isCustomTrip() { return originSelect.value === "custom" || destinationSelect.value === "custom"; }
function selectedPlace(select, inputId) { return select.value === "custom" ? document.querySelector(`#${inputId}`).value.trim() || "自定义地点" : select.value; }
function presetDistance() { return distances[`${originSelect.value}-${destinationSelect.value}`] || null; }
function getSegments() { return [...segmentsContainer.querySelectorAll("[data-segment]")].map(row => ({ row, mode: row.querySelector(".segment-mode").value, distance: Number(row.querySelector(".segment-distance").value) })); }
function historyValues() { return JSON.parse(localStorage.getItem(historyKey) || "[]"); }
function historyTotal() { return historyValues().reduce((total, item) => total + Number(item.amount || 0), 0); }
function showError(message) { error.textContent = message; error.hidden = false; }
function clearError() { error.textContent = ""; error.hidden = true; }

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

function calculate(event) {
  event.preventDefault();
  clearError();
  const segments = getSegments();
  if (segments.some(segment => !Number.isFinite(segment.distance) || segment.distance < 0 || segment.distance > 10000)) { showError("每段交通请输入 0 到 10000 之间的有效公里数。"); return; }
  if (!isCustomTrip() && !presetDistance()) { showError("这组地点暂无预设距离，请选择一个自定义地点后手动输入。"); return; }
  const distance = segments.reduce((total, segment) => total + segment.distance, 0);
  const amount = segments.reduce((total, segment) => total + segment.distance * factors[segment.mode], 0);
  const selectedModes = segments.map(segment => segment.mode);
  const resultLabel = selectedModes.length > 1 ? "多种交通方式" : modeNames[selectedModes[0]];
  const values = historyValues();
  values.push({ amount, time: Date.now(), modes: selectedModes, distance });
  localStorage.setItem(historyKey, JSON.stringify(values));
  document.querySelector("#resultMode").textContent = resultLabel;
  document.querySelector("#emissionValue").textContent = amount.toFixed(2);
  document.querySelector("#treeValue").textContent = Math.ceil(amount / 18.3);
  document.querySelector("#impactCopy").textContent = amount === 0 ? "这是一趟零直接排放的绿色出行。" : `从${selectedPlace(originSelect, "originCustom")}到${selectedPlace(destinationSelect, "destinationCustom")}，这次出行产生了约 ${amount.toFixed(2)} kg CO₂。`;
  document.querySelector("#adviceText").textContent = selectedModes.length > 1 ? "组合出行可以把不同交通方式的排放拆开观察，优先增加步行、骑行和公共交通路段。" : adviceFor(selectedModes[0], amount, distance);
  document.querySelector("#historyValue").textContent = historyTotal().toFixed(2);
  result.hidden = false;
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
document.querySelector("#clearHistory").addEventListener("click", () => { localStorage.removeItem(historyKey); document.querySelector("#historyValue").textContent = "0.00"; });
routeButton.addEventListener("click", calculateRouteDistance);
updateDistance();
updateRemoveButtons();
