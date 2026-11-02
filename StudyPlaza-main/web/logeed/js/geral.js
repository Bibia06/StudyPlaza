let botaomenu = document.querySelector("header .hamburger");
botaomenu.addEventListener("click", abrirmenu);

let menu = document.querySelector("header .menu");

let botaofecharmenu = document.querySelector(".fecharMenu");
botaofecharmenu.addEventListener("click", fecharmenu);

function abrirmenu() {
  menu.style.right = "0";
  botaomenu.setAttribute("aria-expanded", "true");
}

function fecharmenu() {
  menu.style.right = "-100%";
  botaomenu.setAttribute("aria-expanded", "false");
}

// Funções de modal
function abrirModal() {
  document.getElementById("modalAviso").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalAviso").style.display = "none";
}


// Handler de logout: procura por botões/link com id 'logout-btn' ou classe 'logout-btn'
const logoutElements = Array.from(document.querySelectorAll('#logout-btn, .logout-btn'));
if (logoutElements.length) {
  const handleLogout = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Limpar dados locais relacionados à sessão
    try { localStorage.removeItem('studyplaza-user'); } catch (err) { /* ignore */ }
    try { localStorage.removeItem('studyplaza-token'); } catch (err) { /* ignore */ }
    try { sessionStorage.clear(); } catch (err) { /* ignore */ }

    // Tentar limpar cookies visíveis (não remove HttpOnly cookies)
    try {
      document.cookie.split(';').forEach(function (c) {
        const name = c.split('=')[0].trim();
        if (!name) return;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      });
    } catch (err) { /* ignore */ }

    const msg = (typeof getTranslation === 'function') ? getTranslation('menu.sair.success', 'Você saiu da sua conta.') : 'Você saiu da sua conta.';
    if (typeof showToast === 'function') showToast(msg, 'success');

    // Redireciona para a home pública (usando origin para ser robusto em diferentes rotas)
    setTimeout(() => { window.location.href = `${location.origin}/index.html`; }, 350);
  };

  logoutElements.forEach(el => el.addEventListener('click', handleLogout));
}

const perfilBtn = document.querySelector(".perfil-btn");
const dropdown = document.querySelector(".dropdown-conteudo");

perfilBtn.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Fecha o menu se clicar fora
document.addEventListener("click", (e) => {
  if (!document.querySelector(".dropdown-perfil").contains(e.target)) {
    dropdown.style.display = "none";
  }
});