// auth.js — autenticação simples em localStorage (apenas para demonstração)

const AUTH_KEY = "ORO_USER";
const USERS_KEY = "ORO_USERS";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function register(email, password, name) {
  const users = getUsers();
  if (users.find((u) => u.email === email))
    return { ok: false, msg: "Email já cadastrado." };
  users.push({ email, password, name });
  saveUsers(users);
  return { ok: true };
}

function login(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: "Credenciais inválidas." };
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ email: user.email, name: user.name })
  );
  return { ok: true };
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

// Helpers para páginas
function protectPage() {
  if (!currentUser()) {
    window.location.href = "login.html";
  }
}

function initAuthLinks() {
  const user = currentUser();
  const loginLink = document.getElementById("loginLink");
  const accountLink = document.getElementById("accountLink");
  if (!loginLink || !accountLink) return;

  if (user) {
    loginLink.textContent = "Sair";
    loginLink.href = "#";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      window.location.reload();
    });
    accountLink.style.display = "inline-block";
  } else {
    loginLink.textContent = "Entrar";
    loginLink.href = "login.html";
    accountLink.style.display = "none";
  }
}

// Auto init quando carregado com defer
document.addEventListener("DOMContentLoaded", () => {
  initAuthLinks();
});

// Export functions for other pages
window.OroAuth = { register, login, logout, currentUser, protectPage };

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
