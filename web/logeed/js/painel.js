// painel.js — integração real com API + tradução

const API_URL = "http://localhost:3500/api";

// ======================================================
// 0. Helper seguro de tradução (igual ao perfil.js)
// ======================================================
function t(key, fallback = "") {
    // Verifica se existe sistema global de tradução
    if (window.translationSystem && window.translationSystem.getTranslation) {
        const result = window.translationSystem.getTranslation(key);
        return result || fallback;
    }

    // Verifica se existe função global getTranslation()
    if (typeof getTranslation === "function") {
        return getTranslation(key, fallback);
    }

    return fallback; // fallback final
}


// ==========================
// 1. Verifica login / token
// ==========================
const storedUser = JSON.parse(localStorage.getItem('studyplaza-user'));
const storedToken = localStorage.getItem('studyplaza-token');

if (!storedUser || !storedToken) {
    window.location.href = "login.html";
}

const userId = storedUser.id;


// ==========================
// 2. Mostrar grupos ativos
// ==========================
async function mostrarGruposAtivosUsuario() {
    const container = document.querySelector(".hero-status div strong");
    container.textContent = "...";

    try {
        const response = await fetch(`${API_URL}/grupos/gruposAtivosUsuario/${storedUser.id}`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });

        const data = await response.json();
        const total = data.total ?? 0;

        container.textContent = total;

    } catch (erro) {
        console.error("Erro ao carregar grupos ativos:", erro);
        container.textContent = "0";
    }
}



// ==========================
// 3. Buscar grupos do usuário
// ==========================
async function carregarGrupos() {

    const tabelaAtivos = document.querySelector(".tabela-grupos-ativos");
    const tabelaTodos = document.querySelector(".tabela-todos-grupos");

    tabelaAtivos.innerHTML = "<p>Carregando...</p>";
    tabelaTodos.innerHTML = "<p>Carregando...</p>";

    try {

        const response = await fetch(
            `${API_URL}/usuarios_grupos/todosgruposusuarioparticipa/${userId}`,
            {
                headers: {
                    "Authorization": `Bearer ${storedToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao carregar grupos");
        }

        const grupos = await response.json();

        const gruposAtivos = grupos.filter(g => g.ativo == 1);

        const criarCabecalho = () => `
            <div class="tabela-cabecalho">
                <span>Grupo</span>
                <span>Membros</span>
                <span>Status</span>
            </div>
        `;

        tabelaAtivos.innerHTML = criarCabecalho();
        tabelaTodos.innerHTML = criarCabecalho();

        // ==========================
        // TABELA DE GRUPOS ATIVOS
        // ==========================

        if (gruposAtivos.length === 0) {

            tabelaAtivos.innerHTML += `
                <p style="padding:10px;">
                    Nenhum grupo ativo encontrado.
                </p>
            `;

        } else {

            gruposAtivos.forEach(g => {

                const linha = document.createElement("div");
                linha.classList.add("tabela-linha");

                linha.innerHTML = `
                    <p>${g.nome}</p>
                    <p>${g.membros}</p>

                    <p class="tag-sucesso">
                        Ativo
                    </p>
                `;

                tabelaAtivos.appendChild(linha);

            });
        }

        // ==========================
        // TABELA DE TODOS OS GRUPOS
        // ==========================

        if (grupos.length === 0) {

            tabelaTodos.innerHTML += `
                <p style="padding:10px;">
                    Você não participa de nenhum grupo.
                </p>
            `;

        } else {

            grupos.forEach(g => {

                const botoesAdmin = g.papel === "admin"
                    ? `
                        <button
                            aria-label="Editar grupo"
                            onclick="editarGrupo(${g.id}, '${g.nome}', ${g.ativo}, '${g.papel}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button
                            aria-label="Excluir grupo"
                            onclick="excluirGrupo(${g.id}, '${g.nome}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    `
                    : '';

                const linha = document.createElement("div");
                linha.classList.add("tabela-linha");

                linha.innerHTML = `
                    <p role="cell">${g.nome}</p>

                    <p role="cell">${g.membros || 0}</p>

                    <p role="cell"
                    class="${g.ativo == 1 ? 'tag-sucesso' : 'tag-neutra'}">
                    ${g.ativo == 1 ? 'Ativo' : 'Inativo'}
                    </p>

                    <article role="cell" class="acoes">

                        <button
                            aria-label="Abrir grupo"
                            onclick="abrirGrupo(${g.id})">

                            <i class="fa-solid fa-arrow-up-right-from-square"></i>

                        </button>

                        ${botoesAdmin}

                    </article>
                `;

                tabelaTodos.appendChild(linha);

            });
        }

    } catch (erro) {

        console.error(erro);

        tabelaAtivos.innerHTML =
            "<p>Erro ao carregar grupos ativos.</p>";

        tabelaTodos.innerHTML =
            "<p>Erro ao carregar grupos.</p>";
    }
}

// =========================================
// 4. Ações que verifica o papel do usuário
// =========================================


async function usuarioEhAdmin(idGrupo) {

    try {

        const response = await fetch(
            `${API_URL}/usuarios_grupos/papel/${storedUser.id}/${idGrupo}`,
            {
                headers: {
                    "Authorization": `Bearer ${storedToken}`
                }
            }
        );

        if (!response.ok) {
            return false;
        }

        const dados = await response.json();

        return dados.papel === "admin";

    } catch (erro) {

        console.error("Erro ao verificar permissão:", erro);
        return false;
    }
}


// ==========================
// 5. Ações dos botões
// ==========================
function abrirGrupo(id) {
    window.location.href = `meusgrupos.html?id=${id}`;
}

async function excluirGrupo(id, nomeGrupo) {
    
    const response = await fetch(
        `${API_URL}/usuarios_grupos/todosgruposusuarioparticipa/${userId}`,
        {
            headers: {
                "Authorization": `Bearer ${storedToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar grupos");
    }

    const grupos = await response.json();
    const grupo = grupos.find(g => g.id == id);

    if (!grupo || grupo.papel !== "admin") {

        alert(
            "Somente administradores podem excluir grupos."
        );

        return;
    }

    // 1. Pergunta de confirmação traduzida (com fallback em português)
    const textoConfirmacao = `${t("painel.grupos.confirmar_exclusao", "Tem certeza que deseja excluir o grupo")} "${nomeGrupo}"?`;

    if (!confirm(textoConfirmacao)) return; // Se o usuário cancelar, interrompe aqui

    try {
        // 2. Faz a chamada DELETE para a API
        const response = await fetch(`${API_URL}/grupos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json"
            }
        });

        // 3. Verifica se a sessão expirou no meio do caminho
        if (response.status === 401) {
            alert(t("painel.sessao.expirada", "Sua sessão expirou. Faça login novamente."));
            localStorage.clear();
            return window.location.href = "/index.html";
        }

        // 4. Se a resposta não for OK (status diferente de 2xx), lança erro
        if (!response.ok) {
            throw new Error("Erro ao deletar grupo do servidor.");
        }

        // 5. Sucesso! Alerta o usuário
        alert(t("painel.grupos.excluido_sucesso", "Grupo excluído com sucesso!"));

        // 6. Atualiza os dados na tela sem precisar recarregar a página inteira
        mostrarGruposAtivosUsuario(); // Atualiza o contador de grupos ativos
        carregarGrupos();             // Recarrega a tabela limpa

    } catch (erro) {
        console.error("❌ Erro ao excluir grupo:", erro);
        alert(t("painel.grupos.erro_excluir", "Não foi possível excluir o grupo. Tente novamente mais tarde."));
    }
}

function editarGrupo(id, nomeAtual, statusAtual, papel) {

    if (papel !== "admin") {

        alert(
            "Somente administradores podem editar grupos."
        );

        return;
    }

    // Pega os elementos do DOM
    const modal = document.getElementById("modal-editar-grupo");
    const inputNome = document.getElementById("input-editar-nome-grupo");
    const selectStatus = document.getElementById("select-editar-status-grupo");
    const btnSalvar = document.getElementById("btn-salvar-edicao");
    const btnCancelar = document.getElementById("btn-cancelar-edicao");

    if (!modal || !inputNome || !selectStatus) return;

    // 1. Abre o modal e preenche com os dados atuais do grupo
    inputNome.value = nomeAtual;
    selectStatus.value = statusAtual; // Define 1 para Ativo ou 0 para Inativo

    modal.style.display = "flex";
    inputNome.focus();

    // Função interna para fechar o modal limpando eventos antigos
    function fecharModal() {
        modal.style.display = "none";
        btnSalvar.replaceWith(btnSalvar.cloneNode(true));
        btnCancelar.replaceWith(btnCancelar.cloneNode(true));
    }

    // 2. Ação do botão Cancelar
    btnCancelar.addEventListener("click", fecharModal);

    // 3. Ação do botão Salvar
    document.getElementById("btn-salvar-edicao").addEventListener("click", async () => {
        const novoNome = inputNome.value.trim();
        const novoStatus = parseInt(selectStatus.value); // Pega 1 ou 0 do select

        if (!novoNome) {
            alert(t("painel.grupos.nome_vazio", "O nome do grupo não pode estar vazio."));
            return;
        }

        try {
            // Faz o PUT enviando o Nome e o Status modificados
            const response = await fetch(`${API_URL}/grupos/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${storedToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: novoNome,
                    ativo: novoStatus // Envia 1 ou 0 para a API tratar no banco
                })
            });

            if (response.status === 401) {
                alert(t("painel.sessao.expirada", "Sua sessão expirou. Faça login novamente."));
                localStorage.clear();
                return window.location.href = "/index.html";
            }

            if (!response.ok) throw new Error("Erro ao atualizar o grupo.");

            alert(t("painel.grupos.editado_sucesso", "Grupo atualizado com sucesso!"));

            fecharModal();
            mostrarGruposAtivosUsuario(); // Recarrega o contador (caso o grupo tenha sido desativado)
            carregarGrupos();             // Recarrega a tabela na mesma tela

        } catch (erro) {
            console.error("❌ Erro ao editar grupo:", erro);
            alert(t("painel.grupos.erro_editar", "Não foi possível atualizar o grupo. Tente novamente."));
        }
    });
}

// ==========================
// 6. Inicialização
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    mostrarGruposAtivosUsuario();
    carregarGrupos();
});