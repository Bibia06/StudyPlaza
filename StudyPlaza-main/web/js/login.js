/*
  login.js
  - Valida campos do formulário de login (e-mail e senha)
  - Mostra mensagens de erro/feedback em português fixo
  - Sem sistema de tradução
*/

// Flags de interação do usuário
let emailTouched = false;
let passwordTouched = false;

/**
 * toggleReviewMessage(inputElement, shouldShow, message)
 * - Cria/atualiza um <span> de erro após o input
 */
function toggleReviewMessage(inputElement, shouldShow, message = 'Revise o campo') {
  if (!inputElement) return;

  const reviewId = `${inputElement.id}-review`;
  let reviewSpan = document.getElementById(reviewId);

  if (!reviewSpan) {
    reviewSpan = document.createElement('span');
    reviewSpan.id = reviewId;
    reviewSpan.classList.add('error-message', 'review-message');
    reviewSpan.setAttribute('role', 'alert');
    reviewSpan.setAttribute('aria-live', 'assertive');
  }

  if (shouldShow) {
    reviewSpan.textContent = message;
  }

  inputElement.insertAdjacentElement('afterend', reviewSpan);
  reviewSpan.style.display = shouldShow ? 'block' : 'none';
}

/**
 * Validação do e-mail
 */
function validateEmail() {
  const emailInput = document.getElementById('input-email');
  const emailError = document.getElementById('email-error');
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailInput) return false;
  if (!emailTouched) return false;

  if (value === '') {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    emailError.style.display = 'block';
    toggleReviewMessage(emailInput, true, 'O campo E-mail é obrigatório.');
    return false;
  } else if (!emailPattern.test(value)) {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    emailError.style.display = 'block';
    toggleReviewMessage(emailInput, true, 'Por favor, insira um e-mail válido.');
    return false;
  } else {
    emailError.textContent = '';
    emailInput.classList.add('valid');
    emailInput.classList.remove('invalid');
    toggleReviewMessage(emailInput, false);
    return true;
  }
}

/**
 * Validação da senha
 */
function validatePassword() {
  const passwordInput = document.getElementById('input-password');
  const passwordError = document.getElementById('password-error');
  const value = passwordInput.value.trim();

  if (!passwordTouched) return;
  if (!passwordInput) return false;

  if (value === '') {
    passwordInput.classList.add('invalid');
    passwordInput.classList.remove('valid');
    passwordError.style.display = 'block';
    toggleReviewMessage(passwordInput, true, 'O campo Senha é obrigatório.');
    return false;
  } else if (value.length < 6) {
    passwordInput.classList.add('invalid');
    passwordInput.classList.remove('valid');
    passwordError.style.display = 'block';
    toggleReviewMessage(passwordInput, true, 'A senha deve ter pelo menos 6 caracteres.');
    return false;
  } else {
    passwordError.textContent = '';
    passwordInput.classList.add('valid');
    passwordInput.classList.remove('invalid');
    toggleReviewMessage(passwordInput, false);
    return true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('input-email');
  const passwordInput = document.getElementById('input-password');
  const loginForm = document.getElementById('login-form');

  function safeClear(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  }

  if (emailInput) {
    emailInput.addEventListener('focus', () => {
      emailTouched = true;
      safeClear('email-error');
      toggleReviewMessage(emailInput, false);
    });
    emailInput.addEventListener('blur', validateEmail);
  }

  if (passwordInput) {
    passwordInput.addEventListener('focus', () => {
      passwordTouched = true;
      safeClear('password-error');
      toggleReviewMessage(passwordInput, false);
    });
    passwordInput.addEventListener('blur', validatePassword);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (!isEmailValid || !isPasswordValid) {
        const msg = 'Por favor, corrija os erros antes de enviar o formulário.';
        if (typeof showToast === 'function') showToast(msg, 'error');
        else alert(msg);
        return;
      }

      const email = (emailInput && emailInput.value || '').trim();
      const password = (passwordInput && passwordInput.value || '').trim();

      try {
        const resp = await fetch('http://localhost:3500/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha: password })
        });

        if (resp.status === 200) {
          const user = await resp.json();
          try {
            localStorage.setItem('studyplaza-user', JSON.stringify(user));
            localStorage.setItem('studyplaza-token', user.token);
          } catch (e) {}

          if (typeof showToast === 'function') showToast('Login realizado com sucesso!', 'success');
          setTimeout(() => { window.location.href = 'logeed/painel.html'; }, 600);

        } else if (resp.status === 401) {
          const msg = 'Email ou senha inválidos.';
          if (typeof showToast === 'function') showToast(msg, 'error');
          else alert(msg);
        } else {
          const msg = 'Erro de conexão com o servidor.';
          if (typeof showToast === 'function') showToast(msg, 'error');
          else alert(msg);
        }

      } catch (err) {
        console.error('Erro ao autenticar:', err);
        const msg = 'Erro de conexão com o servidor.';
        if (typeof showToast === 'function') showToast(msg, 'error');
        else alert(msg);
      } 

    });
  }
});
