// Dados de exemplo — substitua por dados reais ou resultado de uma API
const BRANDS = [
  {
    id: 1,
    name: "BAUDUCCO",
    img: "./img/bauducco.png",
    category: "Bauducco",
    desc: "Clássicos da panificação e confeitaria que levam tradição e sabor para sua mesa.",
  },
  {
    id: 2,
    name: "NESTLÉ",
    img: "./img/nestle.png",
    category: "Nestle",
    desc: "Alimentos e bebidas de qualidade reconhecida, feitos para nutrir e acompanhar todos os momentos.",
  },
  {
    id: 3,
    name: "PURI",
    img: "./img/puri.png",
    category: "Puri",
    desc: "Água de coco integral, pura e refrescante, direto da natureza para você.",
  },
  {
    id: 4,
    name: "LIFE",
    img: "./img/life.png",
    category: "Life",
    desc: "Sucos naturais feitos com frutas selecionadas, sabor leve e ideal para o dia a dia.",
  },
  {
    id: 5,
    name: "PECCIN",
    img: "./img/peccin.png",
    category: "Peccin",
    desc: "Chicletes, balas e chocolates com sabores que conquistam todas as idades.",
  },
  {
    id: 6,
    name: "VISCONT",
    img: "./img/viscont.png",
    category: "Viscont",
    desc: "Produtos irresistíveis de confeitaria que tornam qualquer momento mais especial.",
  },
  {
    id: 7,
    name: "ZINHO",
    img: "./img/zinho.png",
    category: "Zinho",
    desc: "Pães de alho e acompanhamentos que são destaque em qualquer churrasco.",
  },
];

const grid = document.getElementById("brandsGrid");
const featuredEl = document.getElementById("featuredProducts");
const productsGrid = document.getElementById("productsGrid");
const countEl = document.getElementById("count");
const productCountEl = document.getElementById("productCount");
const yearEl = document.getElementById("year");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// Ano automático no footer
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Dados de exemplo para produtos (mais itens por marca)
const PRODUCTS = [
  // Bauducco
  {
    id: 101,
    name: "Biscoito Integral",
    brand: "Bauducco",
    img: "./img/bauducco.png",
    price: "R$ 6,50",
    desc: "Biscoito crocante e integral, ideal para lanches.",
  },
  {
    id: 102,
    name: "Bolo de Fubá",
    brand: "Bauducco",
    img: "./img/bauducco.png",
    price: "R$ 8,00",
    desc: "Bolo pronto com sabor caseiro.",
  },
  {
    id: 103,
    name: "Panettone Tradicional 500g",
    brand: "Bauducco",
    img: "./img/bauducco.png",
    price: "R$ 29,99",
    desc: "Panettone tradicional com frutas cristalizadas.",
  },

  // Nestlé
  {
    id: 201,
    name: "Achocolatado em Pó",
    brand: "Nestle",
    img: "./img/nestle.png",
    price: "R$ 7,20",
    desc: "Bebida achocolatada instantânea.",
  },
  {
    id: 202,
    name: "Leite UHT 1L",
    brand: "Nestle",
    img: "./img/nestle.png",
    price: "R$ 5,80",
    desc: "Leite pasteurizado integral.",
  },
  {
    id: 203,
    name: "Chocolate em Barra 90g",
    brand: "Nestle",
    img: "./img/nestle.png",
    price: "R$ 6,90",
    desc: "Chocolate ao leite.",
  },

  // Puri
  {
    id: 301,
    name: "Água de Coco 1L",
    brand: "Puri",
    img: "./img/puri.png",
    price: "R$ 5,90",
    desc: "Água de coco natural refrescante.",
  },
  {
    id: 302,
    name: "Água de Coco 200ml",
    brand: "Puri",
    img: "./img/puri.png",
    price: "R$ 3,20",
    desc: "Prática para levar.",
  },

  // Life
  {
    id: 401,
    name: "Suco Natural Laranja 1L",
    brand: "Life",
    img: "./img/life.png",
    price: "R$ 6,00",
    desc: "Suco de frutas pronto, sem conservantes.",
  },
  {
    id: 402,
    name: "Suco 300ml",
    brand: "Life",
    img: "./img/life.png",
    price: "R$ 3,50",
    desc: "Porção individual.",
  },

  // Peccin
  {
    id: 501,
    name: "Chiclete Menta",
    brand: "Peccin",
    img: "./img/peccin.png",
    price: "R$ 3,50",
    desc: "Chiclete com sabor prolongado.",
  },
  {
    id: 502,
    name: "Bala Sortida",
    brand: "Peccin",
    img: "./img/peccin.png",
    price: "R$ 2,80",
    desc: "Pacote de balas sortidas.",
  },

  // Viscont
  {
    id: 601,
    name: "Doce Confeiteiro",
    brand: "Viscont",
    img: "./img/viscont.png",
    price: "R$ 4,80",
    desc: "Acompanhamento ideal para sobremesas.",
  },
  {
    id: 602,
    name: "Cobertura para Bolos",
    brand: "Viscont",
    img: "./img/viscont.png",
    price: "R$ 7,60",
    desc: "Cobertura pronta para decorar bolos.",
  },

  // Zinho
  {
    id: 701,
    name: "Pão de Alho 400g",
    brand: "Zinho",
    img: "./img/zinho.png",
    price: "R$ 9,50",
    desc: "Pão de alho congelado para churrasco.",
  },
  {
    id: 702,
    name: "Pão de Queijo 300g",
    brand: "Zinho",
    img: "./img/zinho.png",
    price: "R$ 11,00",
    desc: "Salgadinho para o lanche.",
  },
];

// Função para renderizar as marcas
function renderBrands(list) {
  if (!grid) return;
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; padding: 24px; color: #666; text-align:center">Nenhuma marca encontrada.</div>';
    countEl.textContent = 0;
    return;
  }

  list.forEach((b) => {
    const card = document.createElement("article");
    card.className = "brand-card";

    card.innerHTML = `
      <img loading="lazy" src="${b.img}" alt="${b.name} logo" />
      <h3>${b.name}</h3>
      <p class="desc">${b.desc}</p>
      <div style="display:flex;gap:8px;width:100%;justify-content:center;margin-top:auto">
        <a href="produtos.html?brand=${encodeURIComponent(
          b.category
        )}" class="view-products">Ver produtos</a>
        <a href="#" data-id="${b.id}" class="open-brand">Detalhes</a>
      </div>
    `;

    grid.appendChild(card);
  });

  countEl.textContent = list.length;
}

// Função para criar um card de produto (reutilizável)
function createProductCard(p) {
  const card = document.createElement("article");
  card.className = "brand-card product-card";

  // checa se o usuário está logado (seguro)
  const isLogged = window.OroAuth && OroAuth.currentUser();
  const priceText = isLogged ? p.price : "Ver preço";
  const lockedClass = isLogged ? "" : " locked";

  card.innerHTML = `
    <img loading="lazy" src="${p.img}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <p class="desc">${p.desc}</p>
    <div style="display:flex;gap:8px;width:100%;justify-content:center;margin-top:auto">
      <a href="#" data-id="${p.id}" class="open-product">Detalhes</a>
      <button class="price-btn add-cart${lockedClass}" data-id="${p.id}">${priceText}</button>
    </div>
  `;

  return card;
}

// Função para renderizar produtos na página de produtos normal
function renderProducts(list) {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  if (!list.length) {
    productsGrid.innerHTML =
      '<div style="grid-column: 1/-1; padding: 24px; color: #666; text-align:center">Nenhum produto encontrado.</div>';
    if (productCountEl) productCountEl.textContent = 0;
    return;
  }

  list.forEach((p) => {
    const card = createProductCard(p);
    productsGrid.appendChild(card);
  });

  // atualiza contadores
  if (productCountEl) productCountEl.textContent = list.length;

  // atualiza os preços caso o usuário mude de estado de login
  refreshProductPrices();

  if (productCountEl) productCountEl.textContent = list.length;
}

// Inicializa com todas as marcas ou produtos conforme a página
if (grid) renderBrands(BRANDS);

// Se existir a seção de produtos em destaque, mostra os primeiros 6
if (featuredEl) {
  const featured = PRODUCTS.slice(0, 6);
  featuredEl.innerHTML = "";
  featured.forEach((p) => featuredEl.appendChild(createProductCard(p)));
  // garante que os preços sejam atualizados conforme estado de auth
  refreshProductPrices();
}

if (productsGrid) {
  // se houver parâmetro brand, filtra por ele
  const params = new URLSearchParams(window.location.search);
  const brandParam = params.get("brand");
  if (brandParam) {
    const filtered = PRODUCTS.filter(
      (p) => p.brand.toLowerCase() === brandParam.toLowerCase()
    );
    renderProducts(filtered);
  } else {
    renderProducts(PRODUCTS);
  }
}

// Busca
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();

    if (grid) {
      const filtered = BRANDS.filter(
        (b) =>
          b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)
      );
      renderBrands(filtered);
    }

    if (productsGrid) {
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
      renderProducts(filtered);
    }
  });
} else {
  // não há campo de busca nesta página
}

// Filtros
const filterButtons = document.querySelectorAll(".filter button");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.cat;

    if (grid) {
      if (cat === "all") renderBrands(BRANDS);
      else renderBrands(BRANDS.filter((b) => b.category === cat));
    }

    if (productsGrid) {
      if (cat === "all") renderProducts(PRODUCTS);
      else renderProducts(PRODUCTS.filter((p) => p.brand === cat));
    }
  });
});

// Abrir modal
function openBrandModal(id) {
  const brand = BRANDS.find((b) => b.id === id);
  if (!brand) return;

  modalContent.innerHTML = `
    <h2>${brand.name}</h2>
    <img src="${brand.img}" alt="${brand.name}" style="max-width:280px; display:block; margin:12px 0" />
    <p>${brand.desc}</p>
    <p><small>Conteúdo ilustrativo — substitua com produtos reais.</small></p>
  `;

  modal.style.display = "flex";
}

// Abrir modal de produto
function openProductModal(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product || !modalContent) return;

  const isLogged = window.OroAuth && OroAuth.currentUser();
  const priceHtml = isLogged
    ? `<p><strong>Preço:</strong> ${product.price}</p>`
    : `<p><strong>Preço:</strong> <em>Entre para ver o preço</em> <button class="primary" onclick="window.location.href='login.html'">Entrar</button></p>`;

  modalContent.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.img}" alt="${product.name}" style="max-width:280px; display:block; margin:12px 0" />
    <p><strong>Marca:</strong> ${product.brand}</p>
    ${priceHtml}
    <p>${product.desc}</p>
  `;

  if (modal) modal.style.display = "flex";
}

// Delegação de eventos
window.addEventListener("click", (ev) => {
  const t = ev.target;

  // Abrir modal de marca
  if (t.classList.contains("open-brand")) {
    ev.preventDefault();
    const id = Number(t.dataset.id);
    openBrandModal(id);
  }

  // Abrir modal de produto
  if (t.classList.contains("open-product")) {
    ev.preventDefault();
    const id = Number(t.dataset.id);
    openProductModal(id);
  }

  // Fechar modal ao clicar fora
  if (t === modal) {
    modal.style.display = "none";
  }
});

// Botão fechar
if (closeModal) {
  closeModal.addEventListener("click", () => {
    if (modal) modal.style.display = "none";
  });
}

/* =========================
   CARROSSEL SLIDE LATERAL
   ========================= */

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const nextBtn = document.querySelector(".carousel-btn.next");
const prevBtn = document.querySelector(".carousel-btn.prev");

let index = 0;
const totalSlides = slides.length;

// Protege a lógica do carrossel para páginas que não têm carrossel
if (track && slides.length && nextBtn && prevBtn) {
  // debounce helper
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // atualiza o background de cada slide com a imagem escolhida pelo navegador (suporta srcset/currentSrc)
  function updateSlideBackgrounds() {
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const srcForBg = img.currentSrc || img.src;
      if (srcForBg) slide.style.backgroundImage = `url(${srcForBg})`;
      img.style.objectFit = "contain";
      img.style.background = "transparent";
    });
  }

  // roda inicialmente e em resize; também quando a imagem carrega
  updateSlideBackgrounds();
  window.addEventListener("resize", debounce(updateSlideBackgrounds, 150));
  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    if (img) img.addEventListener("load", updateSlideBackgrounds);

    // se o slide estiver associado a um produto, torne-o clicável para abrir o modal
    slide.addEventListener("click", (ev) => {
      // evita reagir ao clique nos botões de navegação
      if (ev.target.closest(".carousel-btn")) return;
      const pid = Number(slide.dataset.productId);
      if (pid) {
        openProductModal(pid);
      }
    });
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  // autoplay suave
  setInterval(() => {
    index = (index + 1) % totalSlides;
    updateCarousel();
  }, 4000);
}

// Marca automaticamente o link de navegação correspondente à página atual
(function setActiveNavLink() {
  const links = document.querySelectorAll("nav a");
  if (!links.length) return;

  // obtém o nome do arquivo atual (ex: 'login.html' ou 'index.html')
  let current = (window.location.pathname || "").split("/").pop() || "";
  current = current.toLowerCase();
  if (!current) current = "index.html";

  links.forEach((a) => {
    const rawHref = a.getAttribute("href") || "";
    const pageAttr = (a.dataset.page || "").toLowerCase();

    // ignora anchors vazios
    if (!rawHref || rawHref === "#") {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
      return;
    }

    // extrai o arquivo tanto do href relativo quanto do href absoluto
    const hrefFile = (rawHref.split("/").pop() || "").toLowerCase();
    let absFile = "";
    try {
      absFile = new URL(a.href, window.location.href).pathname
        .split("/")
        .pop()
        .toLowerCase();
    } catch (e) {}

    // compara: primeiro tenta o data-page, depois o nome do arquivo
    const isMatch =
      (pageAttr && pageAttr === current.replace(".html", "")) ||
      hrefFile === current ||
      absFile === current ||
      rawHref.toLowerCase().includes(current);

    if (isMatch) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    }
  });
})();

// Mobile menu: clona o nav para o container móvel e controla abertura/fechamento
(function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const nav = document.querySelector("nav");
  if (!menuToggle || !mobileMenu || !nav) return;

  // clona nav e insere
  const clone = nav.cloneNode(true);
  clone.classList.add("mobile-nav");
  mobileMenu.appendChild(clone);

  // abre/fecha ao clicar no toggle
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("open", !open);
    mobileMenu.setAttribute("aria-hidden", String(open));
  });

  // fecha ao clicar em um link dentro do menu móvel
  mobileMenu.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (a) {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  });

  // fecha ao clicar fora
  document.addEventListener("click", (ev) => {
    if (!mobileMenu.classList.contains("open")) return;
    if (mobileMenu.contains(ev.target) || menuToggle.contains(ev.target))
      return;
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  });

  // marca link ativo dentro do menu móvel
  const active = document.querySelector("nav a.active");
  if (active) {
    const mobileActive = mobileMenu.querySelector(
      `a[href="${active.getAttribute("href")}"]`
    );
    if (mobileActive) mobileActive.classList.add("active");
  }
})();

// Atualiza exibição de preços nos cards (chame quando o estado de login mudar)
function refreshProductPrices() {
  try {
    const isLogged = window.OroAuth && OroAuth.currentUser();

    // combina grids a serem atualizadas (produtos / destaque)
    const targets = [];
    if (productsGrid) targets.push(productsGrid);
    if (featuredEl) targets.push(featuredEl);
    if (!targets.length) return;

    // Atualiza os botões de preço em todas as seções
    targets.forEach((tg) => {
      const cards = tg.querySelectorAll(".brand-card.product-card");
      cards.forEach((card) => {
        const a = card.querySelector("a.open-product");
        if (!a) return;
        const id = Number(a.dataset.id);
        const btn = card.querySelector(".price-btn");
        if (!btn) return;
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) return;
        if (isLogged) {
          btn.textContent = product.price;
          btn.classList.remove("locked");
          btn.onclick = null;
        } else {
          btn.textContent = "Ver preço";
          btn.classList.add("locked");
          btn.onclick = () => {
            window.location.href = "login.html";
          };
        }
      });
    });

    // Mostra/oculta aviso geral acima da primeira seção de produtos encontrada
    let notice = document.querySelector(".price-notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "price-notice";
      notice.setAttribute("role", "status");
    }

    const anchor = featuredEl || productsGrid;
    if (!isLogged) {
      notice.innerHTML =
        '🔒 <strong>Preços visíveis apenas para usuários.</strong> <a href="login.html">Entre para ver os preços</a>';
      // insere antes do primeiro container de produtos se ainda não estiver presente
      if (
        anchor &&
        (!anchor.previousElementSibling ||
          !anchor.previousElementSibling.classList.contains("price-notice"))
      ) {
        anchor.parentNode.insertBefore(notice, anchor);
      }
    } else {
      // remove aviso se existir
      if (notice && notice.parentNode) notice.parentNode.removeChild(notice);
    }
  } catch (e) {
    console.warn("[refreshProductPrices] error", e);
  }
}

// chama automaticamente após carregamento para sincronizar estado de preços
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(refreshProductPrices, 80);
});

// expõe para uso externo
window.refreshProductPrices = refreshProductPrices;


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("waFloatBtn");
  const modal = document.getElementById("waModal");
  const close = document.getElementById("waCloseBtn");

  btn.onclick = () => modal.style.display = "flex";
  close.onclick = () => modal.style.display = "none";

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
});
