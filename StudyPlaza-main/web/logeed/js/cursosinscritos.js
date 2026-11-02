const containercursos = document.getElementById("container-cursos");
const storage = localStorage.getItem("studyplaza-user");
const user = JSON.parse(storage);
const userid = user.id;

const API_URL = "http://localhost:3500/api";



// ===========================
// 1️⃣ Buscar INSCRIÇÕES do usuário
// ===========================
async function carregarInscricoes() {
    try {
        const res = await fetch(`${API_URL}/inscricoes`);
        if (!res.ok) throw new Error("Erro ao buscar inscrições");

        const inscricoes = await res.json();

        // 🔥 filtra só as do usuário logado
        return inscricoes.filter(i => i.id_usuario === userid);

    } catch (erro) {
        console.error("Erro nas inscrições:", erro);
        return [];
    }
}



// ===========================
// 2️⃣ Buscar CURSOS da API
// ===========================
async function carregarCursosAPI() {
    try {
        const res = await fetch(`${API_URL}/cursos`);
        if (!res.ok) throw new Error("Erro ao buscar cursos");
        return await res.json();
    } catch (erro) {
        console.error("Erro cursos:", erro);
        return [];
    }
}



// ===========================
// 3️⃣ Juntar cursos + inscrições
// ===========================
async function carregarCursosInscritos() {
    try {
        const inscricoes = await carregarInscricoes();
        const cursos = await carregarCursosAPI();

        if (inscricoes.length === 0) {
            containercursos.innerHTML += `<p>Você não está inscrito em nenhum curso.</p>`;
            return;
        }

        inscricoes.forEach(inscricao => {
            const curso = cursos.find(c => c.id === inscricao.id_curso);

            if (!curso) return; // segurança

            // Criar card
            const card = document.createElement("div");
            card.classList.add("status");

            card.innerHTML = `
                <div id="card">
                    <strong class="nomeCurso">
                        ${curso.titulo}
                    </strong>

                    <p><strong>Duração:</strong> ${curso.duracao_semestres} Semestres</p>

                    <p><strong>Situação:</strong> Em Andamento</p>

                    <div class="acoesCurso">
                        <button
                            class="btnCancelar"
                            onclick="cancelarInscricao(${inscricao.id})">
                            Cancelar Inscrição
                        </button>
                    </div>

                </div>
            `;

            containercursos.appendChild(card);
        });


    } catch (erro) {
        console.error("Erro geral:", erro);
        containercursos.innerHTML = `<p style="color:red;">Erro ao carregar cursos.</p>`;
    }
}



// ===========================
// 4️⃣ Carregar automaticamente
// ===========================
carregarCursosInscritos();

async function cancelarInscricao(idInscricao) {

    const confirmar = confirm(
        "Tem certeza que deseja cancelar sua inscrição?"
    );

    if (!confirmar) return;

    const token = localStorage.getItem("studyplaza-token");

    try {

        const response = await fetch(
            `${API_URL}/inscricoes/${idInscricao}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao cancelar inscrição");
        }

        alert("Inscrição cancelada com sucesso!");

        location.reload();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao cancelar inscrição.");
    }
}