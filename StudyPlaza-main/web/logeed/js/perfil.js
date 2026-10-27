/*
  perfil.js
  - Gerencia a navegação do perfil.
  - Carrega os dados do usuário.
  - Permite editar nome, e-mail e tipo de usuário.
  - Salva as alterações no backend.
*/

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".perfil-nav-item");
  const sections = document.querySelectorAll(".perfil-section");

  let currentUserId = null;
  let currentUser = null;

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  function changeSection(event) {
    // O botão Editar não é uma seção
    if (this.id === "btnEditar") {
      return;
    }

    event.preventDefault();

    const targetId = this.getAttribute("href").substring(1);

    navItems.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");

    sections.forEach((section) => {
      section.classList.remove("active-section");
    });

    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.classList.add("active-section");
    }
  }

  navItems.forEach((item) => {
    if (item.tagName.toLowerCase() === "a") {
      item.addEventListener("click", changeSection);
    }
  });

  // =========================================================
  // ELEMENTOS DO FORMULÁRIO
  // =========================================================

  const btnEditar = document.getElementById("btnEditar");
  const btnCancelar = document.getElementById("btnCancelar");
  const configView = document.getElementById("configView");
  const configForm = document.getElementById("configForm");

  const inputNome = document.getElementById("inputNome");
  const inputEmail = document.getElementById("inputEmail");
  const inputTipoUsuario = document.getElementById("inputTipoUsuario");

  // =========================================================
  // ABRIR MODO DE EDIÇÃO
  // =========================================================

  function abrirEdicao() {
    if (!currentUser) {
      return;
    }

    inputNome.value = currentUser.nome || "";
    inputEmail.value = currentUser.email || "";
    inputTipoUsuario.value = currentUser.tipo_usuario || "estudante";

    configView.style.display = "none";
    configForm.style.display = "block";

    inputNome.focus();
  }

  // =========================================================
  // CANCELAR EDIÇÃO
  // =========================================================

  function cancelarEdicao() {
    configForm.reset();

    configForm.style.display = "none";
    configView.style.display = "block";
  }

  // =========================================================
  // SALVAR ALTERAÇÕES
  // =========================================================

  async function salvarAlteracoes(event) {
    event.preventDefault();

    if (!currentUserId) {
      return;
    }

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const tipo_usuario = inputTipoUsuario.value;

    // Validações básicas

    if (!nome) {
      alert("Digite seu nome.");
      inputNome.focus();
      return;
    }

    if (!email) {
      alert("Digite seu e-mail.");
      inputEmail.focus();
      return;
    }

    const btnSalvar = document.getElementById("btnSalvar");

    // Evita múltiplos cliques
    btnSalvar.disabled = true;
    btnSalvar.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Salvando...
        `;

    try {
      const response = await fetch(
        `http://localhost:3500/api/usuarios/${currentUserId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome,
            email,
            tipo_usuario,
          }),
        },
      );

      if (!response.ok) {
        let mensagem = "Não foi possível atualizar o usuário.";

        try {
          const erro = await response.json();

          if (erro.message) {
            mensagem = erro.message;
          }
        } catch (e) {
          // Resposta não era JSON
        }

        throw new Error(mensagem);
      }

      // Tenta pegar o usuário atualizado retornado pelo backend
      let usuarioAtualizado = null;

      try {
        usuarioAtualizado = await response.json();
      } catch (e) {
        // Backend pode não retornar JSON
      }

      /*
       * Caso a API retorne:
       *
       * {
       *    id: 1,
       *    nome: "...",
       *    email: "...",
       *    tipo_usuario: "..."
       * }
       */

      if (usuarioAtualizado && usuarioAtualizado.nome) {
        currentUser = usuarioAtualizado;
      } else {
        // Caso o backend não retorne o usuário,
        // usamos os valores que acabamos de enviar.

        currentUser = {
          ...currentUser,
          nome,
          email,
          tipo_usuario,
        };
      }

      // Atualiza a tela
      populateProfile(currentUser);

      // Volta para o modo visualização
      configForm.style.display = "none";
      configView.style.display = "block";

      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);

      alert(error.message || "Ocorreu um erro ao atualizar seus dados.");
    } finally {
      btnSalvar.disabled = false;

      btnSalvar.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Salvar
            `;
    }
  }

  // =========================================================
  // EVENTOS
  // =========================================================

  if (btnEditar) {
    btnEditar.addEventListener("click", abrirEdicao);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicao);
  }

  if (configForm) {
    configForm.addEventListener("submit", salvarAlteracoes);
  }

  // =========================================================
  // CARREGAR USUÁRIO
  // =========================================================

  (async function loadUserProfile() {
    let stored = null;

    try {
      stored = JSON.parse(localStorage.getItem("studyplaza-user"));
    } catch (e) {
      stored = null;
    }

    if (!stored || !stored.id) {
      window.location.href = "/cadastro.html";

      return;
    }

    const userId = stored.id;

    currentUserId = userId;

    try {
      const response = await fetch(
        `http://localhost:3500/api/usuarios/${userId}`,
      );

      if (!response.ok) {
        alert("Erro ao carregar perfil do servidor.");

        return;
      }

      const rows = await response.json();

      const user = Array.isArray(rows) ? rows[0] : rows;

      if (!user) {
        alert("Usuário não encontrado no banco.");

        window.location.href = "/cadastro.html";

        return;
      }

      currentUser = user;

      populateProfile(user);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);

      alert("Erro ao carregar perfil do servidor.");
    }
  })();

  // =========================================================
  // PREENCHER PERFIL
  // =========================================================

  function populateProfile(user) {
    if (!user) {
      return;
    }

    // -----------------------------------------------------
    // Nome no cabeçalho
    // -----------------------------------------------------

    const nameEl = document.querySelector(".perfil-info-basica h1");

    if (nameEl) {
      nameEl.textContent = user.nome || "Usuário";
    }

    // -----------------------------------------------------
    // Username
    // -----------------------------------------------------

    const usernameEl = document.querySelector(".perfil-username");

    if (usernameEl) {
      if (user.nome) {
        const nick =
          "@" +
          user.nome
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, "")
            .slice(0, 16);

        usernameEl.textContent = nick;
      } else if (user.username) {
        usernameEl.textContent = user.username;
      }
    }

    // -----------------------------------------------------
    // Campos da configuração
    // -----------------------------------------------------

    const nameField = document.getElementById("nome");

    const emailField = document.getElementById("email");

    const tipoField = document.getElementById("tipo_usuario");

    if (nameField) {
      nameField.textContent = user.nome || "";
    }

    if (emailField) {
      emailField.textContent = user.email || "";
    }

    if (tipoField) {
      const tipo = user.tipo_usuario || "";

      tipoField.textContent = formatarTipoUsuario(tipo);
    }

    // -----------------------------------------------------
    // Atualiza também os inputs
    // -----------------------------------------------------

    if (inputNome) {
      inputNome.value = user.nome || "";
    }

    if (inputEmail) {
      inputEmail.value = user.email || "";
    }

    if (inputTipoUsuario) {
      inputTipoUsuario.value = user.tipo_usuario || "estudante";
    }
  }

  // =========================================================
  // FORMATA TIPO DE USUÁRIO
  // =========================================================

  function formatarTipoUsuario(tipo) {
    if (!tipo) {
      return "";
    }

    const tipoKey = `tipo.${tipo}`;

    const translated =
      window.translationSystem && window.translationSystem.getTranslation
        ? window.translationSystem.getTranslation(tipoKey)
        : null;

    if (translated) {
      return translated;
    }

    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }

  // =========================================================
  // TOPO DA PÁGINA
  // =========================================================

  window.scrollTo(0, 0);
});
