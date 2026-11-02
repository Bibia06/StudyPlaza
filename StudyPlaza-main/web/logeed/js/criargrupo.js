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


const API_URL = "http://localhost:3500/api"; // URL da sua API
const formGrupo = document.getElementById("form-grupo");

// Função para enviar formulário em JSON
formGrupo.addEventListener("submit", async (event) => {
    event.preventDefault(); // evita submit padrão

    // Captura valores dentro do submit
    const nome = document.querySelector('#nome')?.value.trim();
    const descricao = document.querySelector('#descricao')?.value.trim();

    if ( !nome || !descricao) {
        showToast("Por favor, preencha todos os campos obrigatórios.", "error");
        return;
    }

    // Busca o id_usuario do localStorage
    const storedUser = JSON.parse(localStorage.getItem('studyplaza-user'));
    const token = localStorage.getItem('studyplaza-token');

    if (!storedUser || !token) {
        showToast("Você precisa fazer login para continuar.", "error");
        setTimeout(() => window.location.href = "login.html", 1500);
        return;
    }

    const payload = {
        nome: nome,
        descricao: descricao,
        criado_por: storedUser.id,
    };

    try {
        const response = await fetch(`${API_URL}/grupos`, {
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
            throw new Error(`Erro ao criar grupo: ${response.status}`);
        }

        const result = await response.json();
        showToast("✅ Grupo criado com sucesso!", "success");
        formGrupo.reset(); // limpa formulário
        setTimeout(() => window.location.href = "painel.html", 2000);

    } catch (erro) {
        console.error("❌ Falha no envio:", erro);
        showToast("Ocorreu um erro ao criar o grupo. Tente novamente.", "error");
    }
});
