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

// MD5 implementation (Paul Johnston's minimal port)
function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }
  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue) {
    var WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = '0' + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  var x = [], k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  string = unescape(encodeURIComponent(string));
  x = ConvertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}

function getGravatarUrl(email, size=200){
  if (!email) return '';
  const h = md5(String(email).trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${h}?s=${size}&d=identicon`;
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
      avatar: userByEmail.avatar || getGravatarUrl(userByEmail.email)
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
    // exibe avatar no header (se disponível)
    try {
      let headerAvatar = accountLink.querySelector('.header-avatar');
      if (!headerAvatar) {
        headerAvatar = document.createElement('img');
        headerAvatar.className = 'header-avatar';
        headerAvatar.alt = 'Avatar';
        headerAvatar.width = 28;
        headerAvatar.height = 28;
        headerAvatar.style.borderRadius = '50%';
        headerAvatar.style.marginLeft = '8px';
        accountLink.appendChild(headerAvatar);
      }
      const avatarUrl = user.avatar || getGravatarUrl(user.email);
      headerAvatar.src = avatarUrl;
    } catch (e) {}
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
    // Validação em tempo real do e-mail de cadastro
    const signupEmailInput = document.getElementById('signupEmail');
    const signupEmailError = document.getElementById('signupEmailError');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateSignupEmail(){
      const val = (signupEmailInput||{value:''}).value.trim();
      if (!val) {
        if (signupEmailError) signupEmailError.textContent = '';
        if (signupBtn) signupBtn.disabled = true;
        if (signupEmailInput) signupEmailInput.classList.remove('invalid');
        return false;
      }
      if (!emailRe.test(val)) {
        if (signupEmailError) signupEmailError.textContent = 'E-mail inválido';
        if (signupBtn) signupBtn.disabled = true;
        if (signupEmailInput) signupEmailInput.classList.add('invalid');
        return false;
      }
      if (signupEmailError) signupEmailError.textContent = '';
      if (signupBtn) signupBtn.disabled = false;
      if (signupEmailInput) signupEmailInput.classList.remove('invalid');
      return true;
    }

    if (signupEmailInput){
      signupEmailInput.addEventListener('input', validateSignupEmail);
      // checa no carregamento para ajustar estado inicial
      validateSignupEmail();
    }

    signUpForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = (document.getElementById('signupName')||{value:''}).value.trim();
      const email = (document.getElementById('signupEmail')||{value:''}).value.trim();
      const password = (document.getElementById('signupPassword')||{value:''}).value;

      // validações básicas
      if (!validateSignupEmail()) {
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
  // injeta comportamento de login via Google se disponível
  try { setupGoogleSignIn(); } catch(e) {}
});

// Configura o botão de login com Google (usa Firebase Auth quando configurado)
function setupGoogleSignIn(){
  const googleButtons = Array.from(document.querySelectorAll('.google-btn')) || [];

  function setLoading(state){
    googleButtons.forEach(b=>{
      if (state){
        b.classList.add('loading');
        b.disabled = true;
        b.setAttribute('aria-busy','true');
      } else {
        b.classList.remove('loading');
        b.disabled = false;
        b.removeAttribute('aria-busy');
      }
    });
  }

  async function doGoogleSignIn(ev){
    if (ev && ev.preventDefault) ev.preventDefault();

    // mostra carregamento
    setLoading(true);

    if (!window.firebase || !window.FIREBASE_CONFIG) {
      setLoading(false);
      showToast('Firebase não está configurado. Cole o config em login.html', 'error');
      return;
    }

    try {
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      const auth = firebase.auth();
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await auth.signInWithPopup(provider);
      const user = res.user;
      if (!user) throw new Error('Não foi possível obter usuário do Firebase.');

      const email = user.email;
      const name = user.displayName || (email || '').split('@')[0];
      const avatar = user.photoURL || getGravatarUrl(email);

      // atualiza/insere usuário localmente (sem senha)
      const users = getUsers();
      let u = users.find(x=>x.email === email);
      if (u) {
        u.name = name;
        u.avatar = avatar;
        u.lastLogin = new Date().toISOString();
        u.loginCount = (u.loginCount||0) + 1;
      } else {
        users.push({ email, password: '', name, avatar, lastLogin: new Date().toISOString(), loginCount: 1 });
      }
      saveUsers(users);

      // salva sessão
      localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name, lastLogin: new Date().toISOString(), loginCount: (u && u.loginCount) ? u.loginCount : 1, avatar }));

      showToast('Login com Google efetuado. Redirecionando...', 'success');
      try { initAuthLinks(); } catch(e) {}
      try { if (window.refreshProductPrices) window.refreshProductPrices(); } catch(e) {}
      setTimeout(()=> window.location.href = 'account.html', 900);

    } catch (err) {
      console.error('[google-auth] error', err);
      // Tratamento amigável para domínio não autorizado (auth/unauthorized-domain)
      if (err && err.code === 'auth/unauthorized-domain') {
        const detected = location.hostname || location.origin || 'seu domínio';
        console.warn('[google-auth] origem detectada:', location.origin, 'hostname:', location.hostname);
        showToast(
          'Este domínio não está autorizado no Firebase. Vá em Firebase Console → Authentication → Authorized domains e adicione: ' + detected,
          'error',
          9000
        );
      } else {
        showToast('Erro no login com Google: ' + (err.message || err.code || ''), 'error');
      }
    } finally {
      // garante que o botão volte ao estado normal
      setLoading(false);
    }
  }

  const hintEl = document.getElementById('googleHint');
  // atualiza hint conforme disponibilidade
  if (!window.firebase || !window.FIREBASE_CONFIG) {
    if (hintEl) hintEl.textContent = 'Google sign-in não configurado. Cole o config do Firebase em login.html.';
    console.warn('[google-auth] Firebase não configurado (window.FIREBASE_CONFIG ausente)');
  } else {
    if (hintEl) hintEl.textContent = 'Clique no ícone do Google para entrar.';
    console.info('[google-auth] Firebase configurado. Pronto para Google sign-in.');
  }

  // acopla todos os botões do Google
  if (googleButtons && googleButtons.length) {
    googleButtons.forEach(b=>{
      b.style.cursor = 'pointer';
      b.addEventListener('click', (ev)=>{
        console.log('[google-auth] google button clicked', b.dataset && b.dataset.role);
        doGoogleSignIn(ev);
      });
    });
  }
}

// Gerencia avatar do usuário e utilitários
function saveUserAvatar(email, avatarUrl){
  if (!email) return false;
  const users = getUsers();
  const u = users.find(x=>x.email === email);
  if (!u) return false;
  u.avatar = avatarUrl;
  saveUsers(users);
  // sincroniza sessão atual se for o mesmo usuário
  const sess = currentUser();
  if (sess && sess.email === email){
    sess.avatar = avatarUrl;
    localStorage.setItem(AUTH_KEY, JSON.stringify(sess));
    try { initAuthLinks(); } catch(e) {}
    try { if (window.refreshProductPrices) window.refreshProductPrices(); } catch(e) {}
  }
  return true;
}

function removeUserAvatar(email){
  if (!email) return false;
  const users = getUsers();
  const u = users.find(x=>x.email === email);
  if (!u) return false;
  delete u.avatar;
  saveUsers(users);
  const sess = currentUser();
  if (sess && sess.email === email){
    delete sess.avatar;
    localStorage.setItem(AUTH_KEY, JSON.stringify(sess));
    try { initAuthLinks(); } catch(e) {}
  }
  return true;
}

function getAvatarFor(email){
  if (!email) return '';
  const users = getUsers();
  const u = users.find(x=>x.email === email);
  if (u && u.avatar) return u.avatar;
  return getGravatarUrl(email);
}

// Export functions for other pages
window.OroAuth = { register, login, logout, currentUser, protectPage, saveUserAvatar, removeUserAvatar, getAvatarFor };

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
