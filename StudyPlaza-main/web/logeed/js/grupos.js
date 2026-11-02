/* Toast helper: cria/mostra notificações breves (sucesso/erro) */
function showToast(message, type = 'success', duration = 3000) {
    if (!message) return;
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    container.appendChild(toast);

    // força reflow para animação
    window.getComputedStyle(toast).opacity;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

// ===============================================
// 0. Helper seguro de tradução (mesmo do painel.js)
// ===============================================
function t(key, fallback = "") {
    if (window.translationSystem && window.translationSystem.getTranslation) {
        const result = window.translationSystem.getTranslation(key);
        return result || fallback;
    }

    if (typeof getTranslation === "function") {
        return getTranslation(key, fallback);
    }

    return fallback;
}

const API_URL = "http://localhost:3500/api";

const storedUser = JSON.parse(localStorage.getItem('studyplaza-user'));
const storedToken = localStorage.getItem('studyplaza-token');

if (!storedUser || !storedToken) {
    window.location.href = "login.html";
}


// ===============================================
// 1. Mostrar total de grupos
// ===============================================
async function mostrarTotalGrupos() {
    const container = document.querySelector(".hero-destaque");

    container.innerHTML = `<p style="padding: 10px;">${t("grupos.total.loading", "Verificando...")}</p>`;

    try {
        const response = await fetch(`${API_URL}/grupos/totalGrupos`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar total");

        const data = await response.json();
        const total = data.total ?? 0;

        container.innerHTML = `
            <strong>+${total}</strong>
            <span data-translate="grupos.hero.stats.active">
                ${t("grupos.hero.stats.active", "Grupos Ativos")}
            </span>
        `;

    } catch (erro) {
        console.error("Erro ao carregar total:", erro);

        container.innerHTML = `
            <p>${t("grupos.total.error", "Erro ao carregar total.")}</p>
        `;
    }
}



// ===============================================
// 2. Carregar grupos recomendados
// ===============================================
async function carregarGruposRecomendados() {
    const container = document.querySelector(".cards-grupos");
    container.innerHTML = `<p style="padding: 10px;">${t("grupos.recomendados.loading", "Carregando grupos...")}</p>`;

    try {
        // ► 1. Buscar todos os grupos
        const responseGrupos = await fetch(`${API_URL}/grupos/comMembros`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });

        if (!responseGrupos.ok) throw new Error("Erro ao carregar grupos");
        const grupos = await responseGrupos.json();

        // ► 2. Buscar grupos do usuário
        const responseUsuarioGrupos = await fetch(`${API_URL}/usuarios_grupos/${storedUser.id}`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });

        if (!responseUsuarioGrupos.ok) throw new Error("Erro ao carregar grupos do usuário");
        const gruposUsuario = await responseUsuarioGrupos.json();

        const idsGruposUsuario = gruposUsuario.map(g => g.id_grupo);

        // ► 3. Filtrar grupos recomendados
        const gruposRecomendados = grupos.filter(g => !idsGruposUsuario.includes(g.id));

        // ► 4. Renderizar
        if (gruposRecomendados.length === 0) {
            container.innerHTML = `
                <p style="padding: 10px;">
                    ${t("grupos.recomendados.empty", "Nenhum grupo recomendado disponível.")}
                </p>`;
            return;
        }

        container.innerHTML = "";

        gruposRecomendados.forEach(g => {
            const card = document.createElement("article");
            card.classList.add("card-grupo");

            const dataFormatada = new Date(g.data_criacao).toLocaleDateString('pt-BR');

            card.innerHTML = `
                <div class="titulo-grupo">
                    <h3 id="grupo-${g.id}-titulo">${g.nome}</h3>
                </div>

                <p>${g.descricao}</p>

                <ul>
                    <li>
                        <i class="fa-solid fa-user-group" aria-hidden="true"></i>
                        ${Number(g.membros) || 0} ${t("grupos.info.membros", "membros")}
                    </li>

                    <li>
                        <i class="fa-solid fa-calendar" aria-hidden="true"></i>
                        ${dataFormatada}
                    </li>

                    <li>
                        <i class="fa-solid fa-language" aria-hidden="true"></i>
                        ${g.idioma || t("grupos.idioma.default", "Português")}
                    </li>
                </ul>

                <button 
                    type="button" 
                    class="btn-primario" 
                    aria-label="${t("grupos.recomendados.join.aria", "Participar do grupo")} ${g.nome}"
                    onclick="participarGrupo(${g.id})"
                >
                    ${t("grupos.recomendados.join", "Participar")}
                </button>
            `;

            container.appendChild(card);
        });

    } catch (erro) {
        console.error("❌ Erro ao carregar grupos:", erro);
        container.innerHTML = `
            <p style="padding: 10px;">
                ${t("grupos.recomendados.error", "Erro ao carregar grupos.")}
            </p>`;
    }
}



// ===============================================
// 3. Participar de grupo (com showToast)
// ===============================================
async function participarGrupo(id_grupo) {
    try {
        const id_usuario = storedUser.id;

        const response = await fetch(`${API_URL}/usuarios_grupos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                id_usuario,
                id_grupo,
                papel: "membro"
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                showToast("Token inválido ou expirado. Faça login novamente.", "error");
                setTimeout(() => window.location.href = "login.html", 1500);
                return;
            }
            throw new Error("Erro ao participar do grupo");
        }

        showToast(t("grupos.recomendados.join.success", "Você agora faz parte do grupo!"), "success");
        carregarGruposRecomendados();

    } catch (erro) {
        console.error("❌ Falha ao participar:", erro);
        showToast(t("grupos.recomendados.join.fail", "Não foi possível entrar no grupo. Tente novamente."), "error");
    }
}




// ===============================================
// 4. Inicialização
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
    carregarGruposRecomendados();
    mostrarTotalGrupos();
});
