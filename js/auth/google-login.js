/*
 * Pacote É Mato — entrada com Google (rascunho, desligado por padrão).
 *
 * Fluxo:
 *  1. Google Identity Services devolve um ID token (sem criar usuário no Firebase).
 *  2. O app envia o ID token ao Worker: POST {ENDPOINT}  body: { idToken }.
 *  3. O Worker valida o token com o Google, encontra a conta já vinculada
 *     (campo googleSub salvo no vínculo) e devolve { customToken }.
 *  4. O app entra com signInWithCustomToken.
 *
 * Só aparece quando HABILITADO = true e o Client ID estiver configurado.
 * Sem o endpoint pronto, nada é exibido ao usuário.
 */
(function () {
  'use strict';
  if (window.PEMATO_GOOGLE_LOGIN_V1) return;
  window.PEMATO_GOOGLE_LOGIN_V1 = true;

  const HABILITADO = false;                         // mantenha false até o Worker estar pronto
  const CLIENT_ID = window.PEMATO_GOOGLE_CLIENT_ID || ''; // Client ID OAuth (Google Cloud)
  const ENDPOINT = 'https://holy-frog-272c.joaovitor250p.workers.dev/auth/google';

  const MSG_NAO_VINCULADA = 'Esta conta Google ainda não está vinculada. Entre com seu WhatsApp e vincule o Google no app.';
  const MSG_INDISPONIVEL = 'Não foi possível entrar com Google agora. Tente novamente ou use WhatsApp e senha.';

  function mostrarMensagem(texto, erro) {
    const el = document.getElementById(erro ? 'msgErro' : 'msgSucessoAuth');
    if (!el) return;
    el.textContent = texto;
    el.style.display = 'block';
  }

  async function trocarTokenPorSessao(idToken) {
    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    if (resp.status === 404 || resp.status === 403) throw new Error(MSG_NAO_VINCULADA);
    if (!resp.ok) throw new Error(MSG_INDISPONIVEL);
    const dados = await resp.json();
    if (!dados || !dados.customToken) throw new Error(MSG_INDISPONIVEL);
    await firebase.auth().signInWithCustomToken(dados.customToken);
  }

  function aoReceberCredencial(resposta) {
    if (!resposta || !resposta.credential) return;
    trocarTokenPorSessao(resposta.credential).catch(erro => {
      mostrarMensagem(erro?.message || MSG_INDISPONIVEL, true);
    });
  }

  function carregarGsi(depois) {
    if (window.google?.accounts?.id) return depois();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = depois;
    s.onerror = () => mostrarMensagem(MSG_INDISPONIVEL, true);
    document.head.appendChild(s);
  }

  function iniciar() {
    if (!HABILITADO || !CLIENT_ID) return;
    carregarGsi(() => {
      const area = document.getElementById('googleLoginArea');
      if (!area || !window.google?.accounts?.id) return;
      google.accounts.id.initialize({ client_id: CLIENT_ID, callback: aoReceberCredencial });
      google.accounts.id.renderButton(area, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: 320 });
      area.hidden = false;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
