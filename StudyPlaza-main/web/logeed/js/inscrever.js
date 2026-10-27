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

const API_URL = "http://localhost:3500/api";
const selectCurso = document.getElementById("curso");
const formInscricao = document.getElementById("form-inscricao");

// Carregar cursos com duração incluída
async function carregarCursos(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) throw new Error(`Erro ao buscar cursos: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            selectCurso.innerHTML = `<option value="" disabled selected>Nenhum curso disponível</option>`;
            return;
        }

        selectCurso.innerHTML = `<option value="" disabled selected>Selecione um curso</option>`;

        data.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = `${curso.titulo}`;
            selectCurso.appendChild(option);
        });
    } catch (erro) {
        console.error("❌ Erro ao carregar cursos:", erro);
        selectCurso.innerHTML = `<option value="" disabled selected>Erro ao carregar cursos</option>`;
    }
}

carregarCursos("cursos");

// Enviar inscrição
formInscricao.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id_curso = selectCurso.value;

    // Verifica se usuário está logado
    const storedUser = JSON.parse(localStorage.getItem("studyplaza-user"));
    const token = localStorage.getItem("studyplaza-token");
    
    console.log(localStorage.getItem("studyplaza-token"));

    if (!storedUser || !token) {
        showToast("Você precisa fazer login para continuar.", "error");
        setTimeout(() => window.location.href = "login.html", 1500);
        return;
    }

    const payload = {
        id_usuario: storedUser.id,
        id_curso: parseInt(id_curso)
    };

    try {
        const response = await fetch(`${API_URL}/inscricoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 401) {
                showToast("Token inválido ou expirado. Faça login novamente.", "error");
                setTimeout(() => window.location.href = "login.html", 1500);
                return;
            }
            throw new Error(`Erro ao enviar inscrição: ${response.status}`);
        }

        showToast("✅ Inscrição realizada com sucesso!", "success");
        setTimeout(() => window.location.href = "cursosinscritos.html", 1500);

    } catch (erro) {
        console.error("❌ Falha no envio:", erro);
        showToast("Erro ao enviar inscrição.", "error");
    }
});

