// alterarTemas.js
// - Recupera e aplica o tema (claro/escuro) salvo no localStorage.
// - Controla o botão de alternância de tema e atualiza o ícone visualmente.
// - Persiste a escolha do usuário no localStorage para sessões futuras.

// --- Restaurar tema salvo no localStorage ---
// Lê a preferência de tema previamente salva ('dark' ou 'light' / null)
const savedTheme = localStorage.getItem("theme");
// Referência ao botão que alterna o tema (assume existir no DOM)
const toggleBtn = document.getElementById("theme-toggle");
// Referência ao elemento de ícone que mostra lua/sol (assume existir no DOM)
const icon = document.getElementById("icon");

// Se o tema salvo for 'dark', adiciona a classe que aplica estilos escuros
// e ajusta o ícone; caso contrário garante que a classe não esteja presente.
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.textContent = "🌙";
} else {
    document.body.classList.remove("dark-theme");
    icon.textContent = "☀️";
}

// --- Alternar tema ---
// Ao clicar no botão toggla a classe 'dark-theme' no <body>, atualiza o localStorage
// e muda o ícone. Também dispara uma pequena animação no ícone.
toggleBtn.addEventListener("click", () => {
    // Alterna a classe que controla o tema escuro
    document.body.classList.toggle("dark-theme");

    // Salva a preferência atual do usuário no localStorage para persistência
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        icon.textContent = "🌙"; // ícone para modo escuro
    } else {
        localStorage.setItem("theme", "light");
        icon.textContent = "☀️"; // ícone para modo claro
    }

    // Efeito visual simples: aplica uma classe temporária para animar o ícone
    icon.classList.add("fade-out");
    setTimeout(() => {
        // Remove a classe após 300ms para permitir reuso da animação
        icon.classList.remove("fade-out");
    }, 300);
});