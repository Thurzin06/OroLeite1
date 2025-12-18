// auth.js — autenticação simples em localStorage (apenas para demonstração)

const AUTH_KEY = "ORO_USER";
const USERS_KEY = "ORO_USERS";

// Sistema simples de pop-ups (toasts)
function showToast(message, type = 'success', timeout = 4200) {
  // se o container não existir no DOM (ou foi inadvertidamente removido), criamos um dinamicamente
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.setAttribute('aria-live','polite');
    container.setAttribute('aria-atomic','true');
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : 'success'}`;
  el.innerHTML = `<div class="text">${message}</div><button class="close" aria-label="Fechar">×</button>`;
  const closeBtn = el.querySelector('.close');
  closeBtn.addEventListener('click', () => { el.remove(); });
  container.appendChild(el);
  const t = setTimeout(() => { el.remove(); }, timeout);
  // remove timer se clicar fechar
  el.addEventListener('remove', () => clearTimeout(t));
  return el;
}

// expõe globalmente para outras partes do código
window.showToast = showToast;

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
  users.push({ email, password, name, lastLogin: null, loginCount: 0 });
  saveUsers(users);
  return { ok: true };
}

function login(email, password) {
  const users = getUsers();
  const userByEmail = users.find((u) => u.email === email);
  if (!userByEmail) return { ok: false, msg: "E-mail não cadastrado.", code: 'email_not_found' };
  if (userByEmail.password !== password) return { ok: false, msg: "Senha incorreta.", code: 'wrong_password' };

  // atualiza histórico
  userByEmail.loginCount = (userByEmail.loginCount || 0) + 1;
  userByEmail.lastLogin = new Date().toISOString();
  saveUsers(users);

  // salva sessão com dados úteis
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      email: userByEmail.email,
      name: userByEmail.name,
      lastLogin: userByEmail.lastLogin,
      loginCount: userByEmail.loginCount,
    })
  );
  return { ok: true };
}

function logout() {
  localStorage.removeItem(AUTH_KEY);

  // fecha o menu móvel caso esteja aberto e atualiza a navegação
  try {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && menuToggle) {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      mobileMenu.setAttribute('aria-hidden','true');
    }
  } catch (e) {}

  try { initAuthLinks(); } catch (e) {}

  // atualiza preços na UI
  try { if (window.refreshProductPrices) window.refreshProductPrices(); } catch(e) {}
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
    // quando logado, escondemos o link 'Entrar' e exibimos 'Minha Conta'
    loginLink.style.display = 'none';
    accountLink.style.display = 'inline-block';
  } else {
    // quando não logado, mostramos 'Entrar' e escondemos 'Minha Conta'
    loginLink.style.display = 'inline-block';
    loginLink.textContent = 'Entrar';
    loginLink.href = 'login.html';
    accountLink.style.display = 'none';
  }

  // também atualiza menu móvel (se existir)
  try {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      const mobileLogin = mobileMenu.querySelector('a[data-page="login"]');
      const mobileAccount = mobileMenu.querySelector('a[data-page="account"]');
      if (user) {
        if (mobileLogin) mobileLogin.style.display = 'none';
        if (mobileAccount) mobileAccount.style.display = 'block';
      } else {
        if (mobileLogin) mobileLogin.style.display = 'block';
        if (mobileAccount) mobileAccount.style.display = 'none';
      }
    }
  } catch (e) {}
}

// Form handlers: cadastro e login com pop-ups
(function setupAuthForms(){
  // Cadastro
  const signUpForm = document.getElementById('signUpForm');
  const signupFeedback = document.getElementById('signupFeedback');
  const signupBtn = document.getElementById('signupBtn');
  if (signUpForm) {
    signUpForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = (document.getElementById('signupName')||{value:''}).value.trim();
      const email = (document.getElementById('signupEmail')||{value:''}).value.trim();
      const password = (document.getElementById('signupPassword')||{value:''}).value;

      // validações básicas
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        if (signupFeedback) signupFeedback.textContent = 'Insira um e-mail válido.';
        showToast('Digite um e-mail válido para se cadastrar.', 'error');
        return;
      }
      if (!password || password.length < 4) {
        if (signupFeedback) signupFeedback.textContent = 'Senha muito curta.';
        showToast('Senha muito curta. Use 4+ caracteres', 'error');
        return;
      }

      // tenta cadastrar
      const res = register(email, password, name);
      if (!res.ok) {
        if (signupFeedback) signupFeedback.textContent = res.msg || 'Erro ao cadastrar.';
        showToast(res.msg || 'Erro ao cadastrar.', 'error');
        return;
      }

      // sucesso
      if (signupFeedback) { signupFeedback.textContent = ''; }
      showToast('Cadastro realizado com sucesso. Faça login.', 'success');

      // volta para painel de login e preenche email
      const container = document.getElementById('container');
      if (container) container.classList.remove('right-panel-active');
      const signinEmail = document.getElementById('signinEmail');
      if (signinEmail) signinEmail.value = email;
    });
  }

  // Login (caso ainda não haja listener, garante notificação)
  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', (ev) => {
      try {
        // OBS: script.js também pode ter um listener para salvar e-mail no Firestore.
        // Aqui apenas tratamos a autenticação local e notificações.
        ev.preventDefault();
        console.log('[auth] submit login');
        const email = (document.getElementById('signinEmail')||{value:''}).value.trim();
        const password = (document.getElementById('signinPassword')||{value:''}).value || '';

        const res = login(email, password);
        const loginFeedback = document.getElementById('loginFeedback');

        if (!res.ok) {
          // Mensagens específicas para cada tipo de erro
          console.log('[auth] login failed', res);
          showToast(res.msg || 'Credenciais inválidas.', 'error');
          if (loginFeedback) loginFeedback.textContent = res.msg || 'Credenciais inválidas.';

          if (res.code === 'email_not_found') {
            // Sugere cadastro: preenche o e-mail no formulário de cadastro e abre o painel
            const signupEmail = document.getElementById('signupEmail');
            const container = document.getElementById('container');
            if (signupEmail) signupEmail.value = email;
            if (container) container.classList.add('right-panel-active');
          }

          if (res.code === 'wrong_password') {
            // limpa e foca no campo de senha
            const signinPassword = document.getElementById('signinPassword');
            if (signinPassword) { signinPassword.value = ''; signinPassword.focus(); }
          }

          return;
        }

        console.log('[auth] login successful');
        showToast('Login efetuado com sucesso. Redirecionando...', 'success');
        if (loginFeedback) loginFeedback.textContent = '';
        // atualiza a exibição de preços e links, e redireciona para a página de conta
        try { if (window.refreshProductPrices) window.refreshProductPrices(); } catch(e) {}
        initAuthLinks();
        setTimeout(() => { window.location.href = 'account.html'; }, 900);

      } catch (err) {
        console.error('[auth] login handler error', err);
        try { showToast('Erro inesperado. Veja o console.', 'error'); } catch(e) {}
      }
    });
  }
})();

// Auto init quando carregado com defer
document.addEventListener("DOMContentLoaded", () => {
  initAuthLinks();
});

// Export functions for other pages
window.OroAuth = { register, login, logout, currentUser, protectPage };

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

if (signUpButton && container) {
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });
}

if (signInButton && container) {
  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });
}
