// Local demo only: btoa is reversible encoding, not password encryption.
// users contains username/email/passwordEncoded/favorites; currentUser never contains a password.
// Remembered sessions use localStorage, other sessions use sessionStorage. Old guest favorites stay unassigned.
(() => {
  const usersKey = "users";
  const currentUserKey = "currentUser";

  function readJSON(storage, key, emptyValue) {
    const value = storage.getItem(key);
    if (value === null) return emptyValue;
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`本地 ${key} 数据无法读取，请先备份数据再清理损坏记录。`, { cause: error });
    }
  }

  function readUsers() {
    const users = readJSON(localStorage, usersKey, []);
    if (!Array.isArray(users) || users.some(user =>
      !user || typeof user.username !== "string" || typeof user.email !== "string" ||
      typeof user.passwordEncoded !== "string" || !Array.isArray(user.favorites) ||
      user.favorites.some(id => !Number.isInteger(id))
    )) {
      throw new Error("本地用户数据格式不正确，请先备份数据再处理，不能继续登录或保存收藏。");
    }
    return users;
  }

  function reportError(error) {
    console.error("绿港小贴士账号操作失败", error);
    let message = document.querySelector("#authMessage");
    if (!message) {
      message = document.querySelector("#accountNotice");
      if (!message) {
        message = document.createElement("p");
        message.id = "accountNotice";
        message.className = "account-notice";
        message.setAttribute("role", "alert");
        document.querySelector("main").before(message);
      }
    }
    message.textContent = error instanceof Error ? error.message : "账号操作失败，请检查浏览器存储权限。";
    message.hidden = false;
  }

  function getCurrentUser() {
    const current = readJSON(sessionStorage, currentUserKey, null) ||
      readJSON(localStorage, currentUserKey, null);
    if (current === null) return null;
    if (typeof current.email !== "string" || typeof current.username !== "string") {
      throw new Error("当前登录记录格式不正确，请先备份并清理 currentUser 记录。");
    }
    const user = readUsers().find(item => item.email === current.email && item.username === current.username);
    return user ? { username: user.username, email: user.email } : null;
  }

  function isLoggedIn() { return getCurrentUser() !== null; }

  function updateNavigation() {
    const user = getCurrentUser();
    document.querySelectorAll("[data-auth-guest]").forEach(element => { element.hidden = Boolean(user); });
    document.querySelectorAll("[data-auth-greeting]").forEach(element => {
      element.hidden = !user;
      element.textContent = user ? `你好，${user.username}` : "";
      element.title = user ? `你好，${user.username}` : "";
    });
    document.querySelectorAll("[data-auth-logout]").forEach(element => { element.hidden = !user; });
    const favoritesLogin = document.querySelector("#favoritesLogin");
    if (favoritesLogin) favoritesLogin.hidden = Boolean(user);
  }

  function notifyAccountChange() {
    updateNavigation();
    document.dispatchEvent(new CustomEvent("accountchange"));
  }

  function loginUser(user, remember) {
    const current = JSON.stringify({ username: user.username, email: user.email });
    if (remember) {
      localStorage.setItem(currentUserKey, current);
      sessionStorage.removeItem(currentUserKey);
    } else {
      sessionStorage.setItem(currentUserKey, current);
      localStorage.removeItem(currentUserKey);
    }
    notifyAccountChange();
  }

  function logout() {
    try {
      sessionStorage.removeItem(currentUserKey);
      localStorage.removeItem(currentUserKey);
      notifyAccountChange();
    } catch (error) {
      reportError(error);
    }
  }

  function requireLogin() {
    try {
      if (isLoggedIn()) return true;
      window.alert("请先登录");
      window.location.assign("login.html");
    } catch (error) {
      reportError(error);
    }
    return false;
  }

  function getFavoriteIds() {
    const user = getCurrentUser();
    return user ? [...readUsers().find(item => item.email === user.email).favorites] : [];
  }

  function saveFavoriteIds(ids) {
    const current = getCurrentUser();
    if (!current) throw new Error("请先登录，再保存收藏。");
    if (!Array.isArray(ids) || ids.some(id => !Number.isInteger(id))) {
      throw new Error("收藏编号无效，未保存修改。");
    }
    const users = readUsers();
    const user = users.find(item => item.email === current.email);
    user.favorites = [...new Set(ids)];
    localStorage.setItem(usersKey, JSON.stringify(users));
    notifyAccountChange();
  }

  function getFavoriteCounts() {
    const counts = {};
    readUsers().forEach(user => {
      [...new Set(user.favorites)].forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    });
    return counts;
  }

  function encodePassword(password) {
    const bytes = new TextEncoder().encode(password);
    return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""));
  }

  function normalizedEmail(input) {
    const email = input.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("请输入有效的邮箱地址。");
    return email;
  }

  function validatePassword(password) {
    if (password.length < 6 || password.length > 128) throw new Error("密码长度须为 6–128 个字符。");
  }

  function bindForm(id, submit) {
    const form = document.querySelector(id);
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      document.querySelector("#authMessage").hidden = true;
      try {
        if (window.location.protocol === "file:") {
          throw new Error("请通过本地 HTTP 服务器或 GitHub Pages 打开网站，再登录或注册；直接打开 HTML 文件无法可靠共享各页面的账号数据。");
        }
        submit(form);
        window.location.assign("index.html");
      } catch (error) {
        reportError(error);
        button.disabled = false;
      }
    });
  }

  window.isLoggedIn = isLoggedIn;
  window.getCurrentUser = getCurrentUser;
  window.logout = logout;
  window.requireLogin = requireLogin;
  window.GreenPortAuth = { getFavoriteIds, saveFavoriteIds, getFavoriteCounts, reportError };

  bindForm("#loginForm", form => {
    const email = normalizedEmail(form.elements.email);
    const password = form.elements.password.value;
    validatePassword(password);
    const user = readUsers().find(item => item.email === email && item.passwordEncoded === encodePassword(password));
    if (!user) throw new Error("邮箱或密码不正确；本地账号仅在注册时使用的浏览器和网站地址下有效。");
    loginUser(user, form.elements.remember.checked);
  });

  bindForm("#registerForm", form => {
    const username = form.elements.username.value.trim();
    if (!/^[\p{L}\p{N}_ -]{2,24}$/u.test(username)) {
      throw new Error("用户名须为 2–24 个字符，可使用中文、字母、数字、空格、下划线或短横线。");
    }
    const email = normalizedEmail(form.elements.email);
    const password = form.elements.password.value;
    validatePassword(password);
    if (password !== form.elements.confirmPassword.value) throw new Error("两次输入的密码不一致。");
    const users = readUsers();
    if (users.some(user => user.email === email)) throw new Error("这个邮箱已经注册，请前往登录。");
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("这个用户名已被使用，请换一个用户名。");
    }
    const user = { username, email, passwordEncoded: encodePassword(password), favorites: [] };
    users.push(user);
    localStorage.setItem(usersKey, JSON.stringify(users));
    loginUser(user, true);
  });

  document.querySelectorAll("[data-auth-logout]").forEach(button => button.addEventListener("click", logout));
  const forgot = document.querySelector("#forgotPassword");
  if (forgot) forgot.addEventListener("click", () => {
    const message = document.querySelector("#authMessage");
    message.textContent = "本地演示不提供邮箱验证或邮件找回密码。请勿使用真实账号密码；忘记演示账号密码时，可另注册一个演示账号，原账号收藏不会转移。";
    message.hidden = false;
  });

  window.addEventListener("storage", event => {
    if (![usersKey, currentUserKey, null].includes(event.key)) return;
    try {
      if (event.key === currentUserKey || event.key === null) sessionStorage.removeItem(currentUserKey);
      notifyAccountChange();
    } catch (error) {
      reportError(error);
    }
  });

  try {
    readUsers();
    updateNavigation();
    if (window.location.protocol === "file:") {
      reportError(new Error("账号跨页面功能需要通过本地 HTTP 服务器或 GitHub Pages 使用；直接打开 HTML 文件时，浏览器可能隔离各页面的存储。"));
    }
  } catch (error) {
    reportError(error);
  }
})();
