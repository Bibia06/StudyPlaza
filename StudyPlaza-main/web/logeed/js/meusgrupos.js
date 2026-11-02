function voltarPagina() {
    window.location.href = "painel.html";
}

const papeis = {
    admin: "👑 Administrador",
    moderador: "🛡️ Moderador",
    membro: "👤 Membro"
};

const API_URL = "http://localhost:3500/api";

const storedToken = localStorage.getItem("studyplaza-token");

if (!storedToken) {
    window.location.href = "login.html";
}

const usuarioLogado = JSON.parse(
    localStorage.getItem("studyplaza-user")
);

const urlParams = new URLSearchParams(window.location.search);
const grupoId = urlParams.get("id");

if (!grupoId) {
    alert("ID do grupo não encontrado.");
    window.location.href = "painel.html";
}

// =========================================
// Ações que verifica o papel do usuário
// =========================================


async function usuarioEhAdmin(grupoId) {
    try {
        const response = await fetch(
            `${API_URL}/usuarios_grupos/papel/${usuarioLogado.id}/${grupoId}`,
            {
                headers: {
                    Authorization: `Bearer ${storedToken}`
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

async function removerMembro(id) {

    const ehAdmin = await usuarioEhAdmin(grupoId);

    if (!ehAdmin) {
        alert(
            "Somente administradores podem remover membros."
        );
        return;
    }

    const confirmar = confirm(
        "Deseja realmente remover este membro?"
    );

    if (!confirmar) return;

    try {

        const response = await fetch(
            `${API_URL}/usuarios_grupos/${grupoId}/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao remover membro");
        }

        alert("Membro removido com sucesso!");

        carregarMembros();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao remover membro.");
    }
}

async function carregarMembros() {

    const container =
        document.getElementById("membros-container");

    container.innerHTML =
        "<p class='sem-membros'>Carregando membros...</p>";

    try {

        const response = await fetch(
            `${API_URL}/grupos/membros/${grupoId}`,
            {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            }
        );

        if (response.status === 401) {

            localStorage.removeItem("studyplaza-token");

            alert("Sua sessão expirou.");

            window.location.href = "login.html";

            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao carregar membros");
        }

        const membros = await response.json();

        container.innerHTML = "";

        if (membros.length === 0) {

            container.innerHTML = `
                    <p class="sem-membros">
                        Nenhum membro encontrado neste grupo.
                    </p>
                `;

            return;
        }

        // Verifica se o usuário logado é admin do grupo
        const meuRegistro = membros.find(
            membro =>
                membro.id_usuario === usuarioLogado.id ||
                membro.id === usuarioLogado.id
        );

        const usuarioEhAdminGrupo =
            meuRegistro?.papel === "admin";

        membros.forEach(m => {

            console.log(m);

            const idMembro = m.id_usuario || m.id;

            const card = document.createElement("div");

            card.classList.add("card-membro");

            card.innerHTML = `
                    <div class="avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="nome">
                        ${m.nome}
                    </div>

                    <div class="email">
                        ${m.email}
                    </div>

                    <span class="papel">
                        ${papeis[m.papel] || m.papel}
                    </span>

                    ${usuarioEhAdminGrupo &&
                    m.papel !== "admin" &&
                    idMembro !== usuarioLogado.id_usuario
                    ?
                    `
                        <button
                            class="btn-remover"
                            onclick="removerMembro(${m.id_usuario})">
                            <i class="fa-solid fa-user-minus"></i>
                            Remover
                        </button>
                        `
                    :
                    ""
                }
                `;

            container.appendChild(card);
        });

    } catch (erro) {

        console.error(erro);

        container.innerHTML = `
                <p class="sem-membros">
                    Erro ao carregar membros.
                </p>
            `;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    carregarMembros
);