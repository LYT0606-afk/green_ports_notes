const authState = { user: null, client: null };
const authModal = document.querySelector("#authModal");
const authStatus = document.querySelector("#authStatus");
const authButton = document.querySelector("#authButton");
const authForm = document.querySelector("#authForm");
const authMessage = document.querySelector("#authMessage");
const phoneInput = document.querySelector("#phoneInput");
const otpInput = document.querySelector("#otpInput");
const otpLabel = document.querySelector("#otpLabel");
const authSubmit = document.querySelector("#authSubmit");
const authResend = document.querySelector("#authResend");
let pendingPhone = "";
let codeSent = false;

function supabaseReady() {
  return Boolean(window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey && window.supabase?.createClient);
}

function showAuthModal(message = "登录后可以收藏和取用便利贴") {
  authMessage.textContent = message;
  authModal.hidden = false;
  (codeSent ? otpInput : phoneInput).focus();
}

function closeAuthModal() { authModal.hidden = true; }

function resetAuthForm() {
  codeSent = false;
  pendingPhone = "";
  otpInput.value = "";
  otpInput.hidden = true;
  otpLabel.hidden = true;
  authResend.hidden = true;
  phoneInput.readOnly = false;
  authSubmit.innerHTML = "发送验证码 <span>→</span>";
}

async function refreshAuthUser() {
  if (!authState.client) return;
  const { data } = await authState.client.auth.getUser();
  setAuthUser(data.user || null);
}

function setAuthUser(user) {
  authState.user = user;
  if (user) {
    authStatus.textContent = user.phone || user.email || "已登录";
    authButton.textContent = "退出登录";
    authButton.dataset.action = "logout";
  } else {
    authStatus.textContent = "游客浏览中";
    authButton.textContent = "登录";
    authButton.dataset.action = "login";
  }
}

async function sendPhoneCode(phone) {
  if (!authState.client) {
    authMessage.textContent = "请先在 js/supabase-config.js 填写项目配置，当前仍可游客浏览。";
    return;
  }
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    authMessage.textContent = "手机号请使用国际格式，例如中国大陆号码 +8613800000000。";
    return;
  }
  const { error } = await authState.client.auth.signInWithOtp({ phone });
  if (error) {
    authMessage.textContent = error.message;
    return;
  }
  pendingPhone = phone;
  codeSent = true;
  phoneInput.readOnly = true;
  otpInput.hidden = false;
  otpLabel.hidden = false;
  authResend.hidden = false;
  authSubmit.innerHTML = "验证并登录 <span>→</span>";
  authMessage.textContent = `验证码已发送至 ${phone}，请输入短信中的验证码。`;
  otpInput.focus();
}

async function verifyPhoneCode(token) {
  if (!authState.client || !pendingPhone) return;
  const { data, error } = await authState.client.auth.verifyOtp({ phone: pendingPhone, token, type: "sms" });
  if (error) {
    authMessage.textContent = error.message;
    return;
  }
  setAuthUser(data.user || null);
  closeAuthModal();
  resetAuthForm();
}

async function signOut() {
  if (authState.client) await authState.client.auth.signOut();
  setAuthUser(null);
}

window.requireLogin = function requireLogin(action) {
  if (authState.user) return true;
  showAuthModal(action === "favorite" ? "登录后才能收藏便利贴" : "登录后才能记录取用次数");
  return false;
};

if (supabaseReady()) {
  authState.client = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  authState.client.auth.onAuthStateChange((_event, session) => setAuthUser(session?.user || null));
  refreshAuthUser();
} else {
  setAuthUser(null);
}

authButton.addEventListener("click", () => {
  if (authButton.dataset.action === "logout") signOut();
  else showAuthModal();
});
document.querySelector("#authClose").addEventListener("click", closeAuthModal);
authModal.addEventListener("click", event => { if (event.target === authModal) closeAuthModal(); });
authForm.addEventListener("submit", event => {
  event.preventDefault();
  if (codeSent) verifyPhoneCode(otpInput.value.trim());
  else sendPhoneCode(phoneInput.value.replace(/[\s()-]/g, ""));
});
authResend.addEventListener("click", () => sendPhoneCode(pendingPhone));
authModal.addEventListener("keydown", event => { if (event.key === "Escape") closeAuthModal(); });
