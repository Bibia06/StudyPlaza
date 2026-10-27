/*
  geral.js
  - Script responsável por comportamentos gerais da interface:
    * abertura/fechamento do menu hambúrguer no header
    * abertura/fechamento do modal de login (overlay)
    * exibição temporária de um aviso/modal
  - Comentários explicativos adicionados para facilitar manutenção e acessibilidade.
*/

/* ---------------------------
   Menu hamburger (header)
   --------------------------- */
// botão que abre/fecha o menu (ícone hamburger no header)
const botaomenu = document.querySelector("header .hamburger");
// elemento que contém o menu lateral/overlay
const menu = document.querySelector("header .menu") || document.querySelector('.menu');
// botão que fecha o menu (ícone/elemento dentro do menu)
const botaofecharmenu = document.querySelector(".fecharMenu");

// Adiciona event listeners apenas se os elementos existirem (evita erros em páginas sem header)
if (botaomenu) botaomenu.addEventListener("click", abrirmenu);
if (botaofecharmenu) botaofecharmenu.addEventListener("click", fecharmenu);

/**
 * abrirmenu()
 * - Move o menu para a posição visível (right: 0)
 * - Atualiza o atributo aria-expanded no botão do menu para indicar estado aos leitores de tela
 */
function abrirmenu() {
  menu.style.right = "0";
  botaomenu.setAttribute("aria-expanded", "true");
}

/**
 * fecharmenu()
 * - Move o menu para fora da tela (right: -100%)
 * - Atualiza aria-expanded para 'false'
 */
function fecharmenu() {
  menu.style.right = "-100%";
  botaomenu.setAttribute("aria-expanded", "false");
}

/* ---------------------------
   Modal de login
   --------------------------- */
/*
  - Espera o DOM carregar para garantir que os elementos existam antes de adicionar listeners.
  - Trabalha com classes CSS ('active') e aria-hidden para controle de visibilidade e acessibilidade.
  - Bloqueia o scroll do body enquanto o modal estiver aberto.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Seletores flexíveis: permite usar id "abrir-login" (header) ou uma classe alternativa
  const loginLink = document.getElementById('abrir-login') || document.querySelector('.abrir-login');
  const overlay = document.querySelector('.overlay');                 // overlay que escurece a página
  const formLogin = document.querySelector('.formLogin');             // container do formulário de login
  const closeBtn = document.querySelector('.close-login');            // botão que fecha o modal

  function openLogin() {
    if (overlay) overlay.classList.add('active');
    if (formLogin) {
      formLogin.classList.add('active');
      formLogin.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden'; // trava o scroll da página
  }

  function closeLogin() {
    if (overlay) overlay.classList.remove('active');
    if (formLogin) {
      formLogin.classList.remove('active');
      formLogin.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = ''; // libera o scroll da página
  }

  // Ao clicar no link de abrir login, previne comportamento padrão e abre o modal
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLogin();

      // Em telas pequenas, fecha o menu lateral para evitar sobreposição
      if (window.innerWidth <= 600 && menu) {
        menu.style.right = "-100%";
      }
    });
  }

  // Fechar modal por botão, clique no overlay ou tecla Escape (se os elementos existirem)
  if (closeBtn) closeBtn.addEventListener('click', closeLogin);
  if (overlay) overlay.addEventListener('click', closeLogin);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && formLogin && formLogin.classList.contains('active')) {
      closeLogin();
    }
  });

});

// Inclusão do ano dinamicamente

// Capturar o span que receberá a informação
let spanAno = document.querySelector('#anoAtual');

//Nova instância de um objeto do tipo Data.
let novadata = new Date();

//Captura da instância o ano de 4 dígitos.
let ano = novadata.getFullYear();

//Injetar o ano atual no span.
spanAno.innerHTML = ano;