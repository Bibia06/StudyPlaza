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

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('.abrir-login');
    const botaoAbrirLogin = document.getElementById("abrir-login-footer");
    const modalBtnLogin = document.getElementById("abrir-login-modal");
    const overlay = document.querySelector('.overlay');
    const formLogin = document.querySelector('.formLogin');
    const closeBtn = document.querySelector('.close-login');

    function openLogin() {
        overlay.classList.add('active');
        formLogin.classList.add('active');
        formLogin.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // trava o scroll da página
    }

    function closeLogin() {
        overlay.classList.remove('active');
        formLogin.classList.remove('active');
        formLogin.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // libera o scroll da página
    }

    loginLink.addEventListener('click', (e) => {
        e.preventDefault(); // previne o redirecionamento
        openLogin();

        // Fecha o menu se a resolução for menor ou igual a 600px
        if (window.innerWidth <= 600) {
            menu.style.right = "-100%";
        }
    });

    botaoAbrirLogin.addEventListener("click", (e) => {
        e.preventDefault();
        openLogin();
    });

    modalBtnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        openLogin();
        fecharModal();
    });

    closeBtn.addEventListener('click', closeLogin);

    // Fecha clicando no overlay
    overlay.addEventListener('click', closeLogin);

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && formLogin.classList.contains('active')) {
            closeLogin();
        }
    });

    const toggleBtn = document.getElementById("theme-toggle");
    const icon = document.getElementById("icon"); toggleBtn.addEventListener("click", () => {
        // alterna tema 
        document.body.classList.toggle("dark-theme");
        // animação do ícone 
        icon.classList.add("fade-out"); setTimeout(() => {
            if (document.body.classList.contains("dark-theme")) {
                icon.textContent = "🌙";

            } else {
                icon.textContent = "☀️";
            }
            icon.classList.remove("fade-out");
        }, 300);
    });
});

function abrirModal() {
    document.getElementById("modalAviso").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalAviso").style.display = "none";
}

