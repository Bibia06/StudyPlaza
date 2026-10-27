//---------------------Formulário de cadastro---------------------------------
/*
  cadastro.js
  - Valida campos do formulário de registro (nome, e-mail, senha, confirmar senha).
  - Mostra mensagens de erro inline e spans de "revisão" (toggleReviewMessage) para dar
    feedback adicional ao usuário e permitir re-tradução via TranslationSystem.
  - Também contém lógica para abrir/fechar o modal de login usado na página de cadastro.
  - Comentários explicativos em português para facilitar manutenção e acessibilidade.
*/

/**
 * clearMessage(id)
 * - Limpa o texto de erro do elemento identificado por id (ex.: 'nameError').
 * - Uso: chamado quando o usuário foca no campo para remover mensagens antigas.
 * - Não lança erro se o elemento não existir.
 */
function clearMessage(id) {
  const errorElem = document.getElementById(id);
  if (errorElem) {
    errorElem.textContent = '';
  }
}

/**
 * getTranslation(key, fallback)
 * - Retorna a tradução para a chave informada usando window.translationSystem, se disponível.
 * - Se o sistema de tradução não existir, retorna a string fallback fornecida.
 * - Permite que as mensagens sejam multilíngues sem hardcode espalhado.
 */
function getTranslation(key, fallback) {
  return window.translationSystem?.getTranslation(key) || fallback;
}

/**
 * toggleReviewMessage(inputElement, shouldShow, messageKey, fallback)
 * - Cria ou atualiza um <span> de revisão/erro justo após o input.
 * - Parâmetros:
 *    inputElement: elemento <input> alvo (obrigatório)
 *    shouldShow: boolean — se true exibe a mensagem, se false oculta
 *    messageKey: chave de tradução para o texto (opcional)
 *    fallback: texto a usar se não houver tradução
 * - Comportamento:
 *    * Usa id baseado no input (ex.: input.id + '-review') para reaproveitar o elemento.
 *    * Usa aria-live e role="alert" para que leitores de tela notifiquem alterações.
 *    * Procura inserir o span após um wrapper de senha quando presente (insertionTarget)
 *      — isso evita quebrar o layout quando existem ícones/controles junto ao input.
 */
function toggleReviewMessage(inputElement, shouldShow, messageKey = 'validation.review-field', fallback = 'revise o campo') {
  if (!inputElement) return;

  const reviewId = `${inputElement.id}-review`;
  let reviewSpan = document.getElementById(reviewId);
  // Se o input estiver dentro de um wrapper (ex.: ícone de mostrar senha), insere após o wrapper
  const insertionTarget = inputElement.closest('.password-wrapper') || inputElement;

  // Cria o elemento caso ainda não exista
  if (!reviewSpan) {
    reviewSpan = document.createElement('span');
    reviewSpan.id = reviewId;
    reviewSpan.classList.add('error-message', 'review-message');
    reviewSpan.setAttribute('role', 'alert');
    reviewSpan.setAttribute('aria-live', 'assertive');
  }

  // Define conteúdo da mensagem (prioriza chave de tradução)
  if (shouldShow) {
    if (messageKey) {
      reviewSpan.setAttribute('data-translate', messageKey);
      reviewSpan.textContent = getTranslation(messageKey, fallback);
    } else {
      reviewSpan.removeAttribute('data-translate');
      reviewSpan.textContent = fallback;
    }
  }

  // Insere (ou move) o span logo após o target escolhido
  insertionTarget.insertAdjacentElement('afterend', reviewSpan);
  reviewSpan.style.display = shouldShow ? 'block' : 'none';
}

/* ---------------------------
   Validações de campos
   --------------------------- */

/**
 * validateName()
 * - Valida o campo de Nome:
 *    * verifica se não está vazio
 * - Atualiza classes CSS ('valid' / 'invalid') e mensagens de erro no DOM.
 * - Retorna true quando válido, false caso contrário.
 */
function validateName() {
  const nameInput = document.getElementById('name');
  const nameError = document.getElementById('nameError');
  const name = nameInput.value.trim();

  if (name === '') {
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    nameError.textContent = getTranslation('cadastro.error-message.name', 'O campo Nome é obrigatório.');
    toggleReviewMessage(nameInput, true, 'cadastro.error-message.name', 'O campo Nome é obrigatório.');
    return false;
  } else {
    nameInput.classList.remove('invalid');
    nameInput.classList.add('valid');
    nameError.textContent = '';
    toggleReviewMessage(nameInput, false);
    return true;
  }
}

/**
 * validateEmail()
 * - Valida o campo E-mail:
 *    * não vazio
 *    * formato básico com regex
 * - Atualiza classes e mensagens de erro.
 * - Retorna true quando válido, false caso contrário.
 */
function validateEmail() {
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (value === '') {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    emailError.textContent = getTranslation('cadastro.error-message.email', 'O campo E-mail é obrigatório.');
    toggleReviewMessage(emailInput, true, 'cadastro.error-message.email', 'O campo E-mail é obrigatório.');
    return false;
  } else if (!emailPattern.test(value)) {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    emailError.textContent = getTranslation('cadastro.invalid-message.email', 'Por favor, insira um e-mail válido.');
    toggleReviewMessage(emailInput, true, 'cadastro.invalid-message.email', 'Por favor, insira um e-mail válido.');
    return false;
  } else {
    emailInput.classList.remove('invalid');
    emailInput.classList.add('valid');
    emailError.textContent = '';
    toggleReviewMessage(emailInput, false);
    return true;
  }
}

/**
 * validatePassword()
 * - Valida o campo Senha:
 *    * não vazio
 *    * comprimento mínimo (6 caracteres)
 * - Atualiza classes e mensagens de erro.
 * - Retorna true quando válido, false caso contrário.
 */
function validatePassword() {
  const passwordInput = document.getElementById('senha');
  const passwordError = document.getElementById('passwordError');
  const value = passwordInput.value.trim();

  if (value === '') {
    passwordInput.classList.add('invalid');
    passwordInput.classList.remove('valid');
    passwordError.textContent = getTranslation('cadastro.error-message.password', 'O campo Senha é obrigatório.');
    toggleReviewMessage(passwordInput, true, 'cadastro.error-message.password', 'O campo Senha é obrigatório.');
    return false;
  } else if (value.length < 6) {
    passwordInput.classList.add('invalid');
    passwordInput.classList.remove('valid');
    passwordError.textContent = getTranslation('cadastro.invalid-message.password', 'A senha deve ter pelo menos 6 caracteres.');
    toggleReviewMessage(passwordInput, true, 'cadastro.invalid-message.password', 'A senha deve ter pelo menos 6 caracteres.');
    return false;
  } else {
    passwordInput.classList.remove('invalid');
    passwordInput.classList.add('valid');
    passwordError.textContent = '';
    toggleReviewMessage(passwordInput, false);
    return true;
  }
}

/**
 * validateConfirmPassword()
 * - Valida o campo Confirmar Senha:
 *    * não vazio
 *    * deve coincidir com o campo 'senha'
 * - Atualiza classes e mensagens de erro.
 * - Retorna true quando válido, false caso contrário.
 */
function validateConfirmPassword() {
  const confirmPasswordInput = document.getElementById('confirm-password');
  const confirmPasswordError = document.getElementById('confirmPassword-error');
  const passwordInput = document.getElementById('senha');
  const value = confirmPasswordInput.value.trim();

  if (value === '') {
    confirmPasswordInput.classList.add('invalid');
    confirmPasswordInput.classList.remove('valid');
    confirmPasswordError.textContent = getTranslation('cadastro.error-message.confirm-password', 'O campo Confirmar Senha é obrigatório.');
    toggleReviewMessage(confirmPasswordInput, true, 'cadastro.error-message.confirm-password', 'O campo Confirmar Senha é obrigatório.');
    return false;
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.classList.add('invalid');
    confirmPasswordInput.classList.remove('valid');
    confirmPasswordError.textContent = getTranslation('cadastro.invalid-message.confirm-password', 'As senhas não coincidem.');
    toggleReviewMessage(confirmPasswordInput, true, 'cadastro.invalid-message.confirm-password', 'As senhas não coincidem.');
    return false;
  } else {
    confirmPasswordInput.classList.remove('invalid');
    confirmPasswordInput.classList.add('valid');
    confirmPasswordError.textContent = '';
    toggleReviewMessage(confirmPasswordInput, false);
    return true;
  }
}

/* ---------------------------
   Event listeners para validação em tempo real
   --------------------------- */
/*
  - Blur: valida quando o usuário sai do campo (feedback imediato).
  - Focus: limpa mensagens antigas e remove spans de review.
*/
// Registra listeners de forma segura (somente se os elementos existirem)
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const senhaEl = document.getElementById('senha');
const confirmEl = document.getElementById('confirm-password');
const profissaoEl = document.getElementById('profissao');

if (nameEl) nameEl.addEventListener('blur', validateName);
if (emailEl) emailEl.addEventListener('blur', validateEmail);
if (senhaEl) senhaEl.addEventListener('blur', validatePassword);
if (confirmEl) confirmEl.addEventListener('blur', validateConfirmPassword);
if (profissaoEl) profissaoEl.addEventListener('blur', validateProfissao);

if (nameEl) nameEl.addEventListener('focus', () => {
  clearMessage('nameError');
  toggleReviewMessage(nameEl, false);
});
if (emailEl) emailEl.addEventListener('focus', () => {
  clearMessage('emailError');
  toggleReviewMessage(emailEl, false);
});
if (senhaEl) senhaEl.addEventListener('focus', () => {
  clearMessage('passwordError');
  toggleReviewMessage(senhaEl, false);
});
if (confirmEl) confirmEl.addEventListener('focus', () => {
  clearMessage('confirmPassword-error');
  toggleReviewMessage(confirmEl, false);
});
if (profissaoEl) profissaoEl.addEventListener('focus', () => {
  clearMessage('profissaoError');
  toggleReviewMessage(profissaoEl, false);
});

/**
 * validateProfissao()
 * - Valida o select de profissão (não pode ser vazio)
 */
function validateProfissao() {
  const select = document.getElementById('profissao');
  if (!select) return false;
  const value = select.value && select.value.trim();
  const errorEl = document.getElementById('profissaoError');

  if (!value) {
    select.classList.add('invalid');
    select.classList.remove('valid');
    if (errorEl) errorEl.textContent = getTranslation('cadastro.error-message.profissao', 'Selecione sua profissão.');
    toggleReviewMessage(select, true, 'cadastro.error-message.profissao', 'Selecione sua profissão.');
    return false;
  } else {
    select.classList.remove('invalid');
    select.classList.add('valid');
    if (errorEl) errorEl.textContent = '';
    toggleReviewMessage(select, false);
    return true;
  }
}

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

const API_URL = "http://localhost:3500/api/usuarios"; // <-- ajuste aqui o endpoint correto

const form = document.getElementById("register-form");
const formError = document.getElementById("form-error");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formError) formError.textContent = ""; // limpa erros anteriores

    // Executa validações usando as funções já implementadas
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isProfissaoValid = validateProfissao();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid || !isProfissaoValid) {
      if (formError) {
        formError.textContent = getTranslation('cadastro.form.error', 'Por favor, corrija os erros antes de enviar o formulário.');
      }
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const profissao = document.getElementById("profissao").value.trim();

    // 📦 Corpo enviado para API (inclui tipo_usuario conforme schema do DB)
    const payload = {
      nome: name,
      email: email,
      senha: senha,
      tipo_usuario: profissao
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (formError) {
          formError.textContent = errorData?.mensagem || getTranslation('cadastro.error.submit', 'Erro ao enviar cadastro. Tente novamente.');
        }
        return;
      }

      const result = await response.json();
      console.log("Usuário cadastrado:", result);

      // 🎉 Sucesso — mostrar toast em vez de alert
      showToast(getTranslation('cadastro.success', 'Cadastro realizado com sucesso!'), 'success');
      // Reseta o formulário
      form.reset();
      window.location.href = "index.html"; // redireciona para home

    } catch (error) {
      console.error("Erro de conexão:", error);
      if (formError) formError.textContent = getTranslation('cadastro.error.connection', 'Erro de conexão com servidor.');
    }
  });
}
