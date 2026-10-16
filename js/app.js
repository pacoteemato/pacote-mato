function tocarIntroPs2Audio() {
            try {
                let ctx = getAudioContext();
                let now = ctx.currentTime;

                let oscBase = ctx.createOscillator();
                let gainBase = ctx.createGain();
                oscBase.type = 'sine';
                oscBase.frequency.setValueAtTime(55, now);
                oscBase.frequency.exponentialRampToValueAtTime(110, now + 1.8);
                gainBase.gain.setValueAtTime(0.01, now);
                gainBase.gain.linearRampToValueAtTime(0.25, now + 0.6);
                gainBase.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
                oscBase.connect(gainBase);
                gainBase.connect(ctx.destination);
                oscBase.start(now);
                oscBase.stop(now + 2.5);

                let oscHarm = ctx.createOscillator();
                let gainHarm = ctx.createGain();
                oscHarm.type = 'triangle';
                oscHarm.frequency.setValueAtTime(220, now + 0.5);
                oscHarm.frequency.exponentialRampToValueAtTime(440, now + 1.6);
                gainHarm.gain.setValueAtTime(0.001, now + 0.5);
                gainHarm.gain.linearRampToValueAtTime(0.12, now + 1.0);
                gainHarm.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
                oscHarm.connect(gainHarm);
                gainHarm.connect(ctx.destination);
                oscHarm.start(now + 0.5);
                oscHarm.stop(now + 2.5);
            } catch (e) {}
        }

        function dispararAberturaPs2() {
            tocarIntroPs2Audio();
            setTimeout(() => {
                let splash = document.getElementById('splashScreenPs2');
                if (splash) {
                    splash.style.opacity = '0';
                    splash.style.transform = 'scale(1.08)';
                    setTimeout(() => { splash.style.display = 'none'; }, 800);
                }
            }, 2400);
        }

    const traducoes = {
      pt: {
        download_app: "Baixar App no Celular",
        brand_subtitle: "Plataforma de Logística",
        whatsapp_label: "WhatsApp / Acesso",
        password_label: "Sua Senha Pessoal",
        whatsapp_placeholder: "Número com DDD",
        password_placeholder: "Crie ou digite sua senha",
        btn_enter: "Entrar no Sistema",
        btn_trial: "Testar 10 Dias Grátis",
        choose_plan: "Planos de Acesso",
        plan_weekly_name: "Plano Semanal",
        plan_weekly_meta: "7 dias de acesso total",
        plan_monthly_name: "Plano Mensal (1 Mês)",
        plan_monthly_meta: "30 dias • Melhor custo-benefício",
        plan_quarterly_name: "Plano Trimestral (3 Meses)",
        plan_quarterly_meta: "90 dias com desconto",
        most_popular: "Popular",
        generate_pix: "Gerar Pagamento Pix",
        secure_payment: "Pagamento Seguro Pix",
        waiting_confirmation: "Aguardando confirmação... ",
        auto_unlock: "O sistema destrava sozinho após o pagamento.",
        copy_pix: "Copiar Código Pix",
        cancel: "Cancelar",
        menu: "Menu",
        language_label: "Idioma",
        theme_label: "Tema de Cor",
        voice_label: "Voz do Sintetizador",
        logout: "Desconectar Conta",
        logistics_system: "SISTEMA INTELIGENTE DE LOGÍSTICA",
        saved_route_found: " ROTA ANTERIOR IDENTIFICADA",
        resume_route: "Retomar Rota Onde Parei",
        load_pdf_title: "Carregar Rota em PDF",
        load_pdf_subtitle: "Importe a folha da sua rota para sincronizar as paradas",
        choose_pdf: "Escolher Arquivo PDF",
        metric_scanned: "Bipados",
        metric_stops: "Paradas",
        metric_remaining: "Faltam",
        cam_flip: "Virar",
        flash_txt: "Flash",
        manual_placeholder: "Digite o código manualmente...",
        same_address_alert: " MESMO ENDEREÇO! Pacotes neste ponto: ",
        pdf_erro: " Não consegui ler este PDF. Verifique se o arquivo não está corrompido e tente novamente.",
        login_bloqueado: " Muitas tentativas erradas. Aguarde 30 segundos e tente de novo.",
        tutorial_btn: "Como Usar (Tutorial Interativo)"
      },
      es: {
        download_app: "Descargar App en el Móvil",
        brand_subtitle: "Plataforma de Logística",
        whatsapp_label: "WhatsApp / Acceso",
        password_label: "Tu Contraseña",
        whatsapp_placeholder: "Número com código de área",
        password_placeholder: "Crea o escribe tu contraseña",
        btn_enter: "Entrar al Sistema",
        btn_trial: "Probar 10 Días Gratis",
        choose_plan: "Planes de Acceso",
        plan_weekly_name: "Plan Semanal",
        plan_weekly_meta: "7 días de acesso total",
        plan_monthly_name: "Plan Mensual (1 Mes)",
        plan_monthly_meta: "30 días • Melhor relação qualidade-preço",
        plan_quarterly_name: "Plan Trimestral (3 Meses)",
        plan_quarterly_meta: "90 días con desconto",
        most_popular: "Popular",
        generate_pix: "Generar Pago Pix",
        secure_payment: "Pago Seguro Pix",
        waiting_confirmation: "Esperando confirmación... ",
        auto_unlock: "El sistema se desbloquea solo tras el pago.",
        copy_pix: "Copiar Código Pix",
        cancel: "Cancelar",
        menu: "Menú",
        language_label: "Idioma",
        theme_label: "Tema de Color",
        voice_label: "Voz del Sintetizador",
        logout: "Cerrar Sesión",
        logistics_system: "SISTEMA INTELIGENTE DE LOGÍSTICA",
        saved_route_found: " ROTA ANTERIOR ENCONTRADA",
        resume_route: "Reanudar Ruta Donde Me Quedé",
        load_pdf_title: "Cargar Ruta en PDF",
        load_pdf_subtitle: "Importa la hoja de tu rota para sincronizar las paradas",
        choose_pdf: "Elegir Archivo PDF",
        metric_scanned: "Escaneados",
        metric_stops: "Paradas",
        metric_remaining: "Faltam",
        cam_flip: "Girar",
        flash_txt: "Flash",
        manual_placeholder: "Escribe el código manualmente...",
        same_address_alert: " ¡MISMA DIRECCIÓN! Paquetes en este punto: ",
        pdf_erro: " No pude leer este PDF. Verifica que el archivo no esté dañado e intenta de nuevo.",
        login_bloqueado: " Demasiados intentos fallidos. Espera 30 segundos e intenta de nuevo.",
        tutorial_btn: "Cómo Usar (Tutorial)"
      },
      en: {
        download_app: "Download App on Phone",
        brand_subtitle: "Logistics Platform",
        whatsapp_label: "WhatsApp / Access",
        password_label: "Your Password",
        whatsapp_placeholder: "Number with area code",
        password_placeholder: "Create or type your password",
        btn_enter: "Sign In",
        btn_trial: "Try 10 Days Free",
        choose_plan: "Access Plans",
        plan_weekly_name: "Weekly Plan",
        plan_weekly_meta: "7 days full access",
        plan_monthly_name: "Monthly Plan (1 Month)",
        plan_monthly_meta: "30 days • Best value",
        plan_quarterly_name: "Quarterly Plan (3 Months)",
        plan_quarterly_meta: "90 days with discount",
        most_popular: "Popular",
        generate_pix: "Generate Pix Payment",
        secure_payment: "Secure Pix Payment",
        waiting_confirmation: "Waiting for confirmation... ",
        auto_unlock: "The system unlocks automatically after payment.",
        copy_pix: "Copy Pix Code",
        cancel: "Cancel",
        menu: "Menu",
        language_label: "Language",
        theme_label: "Color Theme",
        voice_label: "Synthesizer Voice",
        logout: "Log Out",
        logistics_system: "SMART LOGISTICS SYSTEM",
        saved_route_found: " PREVIOUS ROUTE FOUND",
        resume_route: "Resume Route Where I Left",
        load_pdf_title: "Upload Route PDF",
        load_pdf_subtitle: "Import your route sheet to sync stops",
        choose_pdf: "Choose PDF File",
        metric_scanned: "Scanned",
        metric_stops: "Stops",
        metric_remaining: "Remaining",
        cam_flip: "Flip",
        flash_txt: "Flash",
        manual_placeholder: "Type code manually...",
        same_address_alert: " SAME ADDRESS! Packages at this stop: ",
        pdf_erro: "Could not read this PDF. Check that the file isn't corrupted and try again.",
        login_bloqueado: " Too many failed attempts. Wait 30 seconds and try again.",
        tutorial_btn: "How to Use (Tutorial)"
      }
    };

    function mudarIdioma(lang) {
      localStorage.setItem('idioma_preferido', lang);
      let dict = traducoes[lang] || traducoes.pt;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        let key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerText = dict[key];
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        let key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
      });

      let txtFlash = document.getElementById('txt-flash');
      if (txtFlash && !flashLigado) txtFlash.innerText = dict.flash_txt;

      ['pt', 'es', 'en'].forEach(l => {
        let btn = document.getElementById('lang_' + l);
        if (btn) {
          if (l === lang) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
    }

    const paletas = {
      black_Preto: { 
        bg_body: "#000000", 
        surface_1: "#0b0b0d", 
        surface_2: "#141417", 
        border: "rgba(255, 255, 255, 0.12)", 
        text_main: "#ffffff", 
        text_muted: "#888888", 
        shadow: "0 16px 36px -10px rgba(16, 185, 129, 0.1), 0 0 0 1px rgba(52, 211, 153, 0.2)" 
      },
      Branco: { 
        bg_body: "#f8fafc", 
        surface_1: "#ffffff", 
        surface_2: "#f1f5f9", 
        border: "rgba(0, 0, 0, 0.08)", 
        text_main: "#0f172a", 
        text_muted: "#64748b", 
        shadow: "0 16px 36px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.06)" 
      },
      gray: { 
        bg_body: "#18181b", 
        surface_1: "#27272a", 
        surface_2: "#3f3f46", 
        border: "rgba(255, 255, 255, 0.1)", 
        text_main: "#fafafa", 
        text_muted: "#a1a1aa", 
        shadow: "0 16px 36px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
      }
    };

    function mudarTema(tipo) {
      if (tipo !== 'Branco') tipo = 'Branco';
      let p = paletas.Branco;
      document.documentElement.style.setProperty('--bg-body', p.bg_body);
      document.documentElement.style.setProperty('--surface-1', p.surface_1);
      document.documentElement.style.setProperty('--surface-2', p.surface_2);
      document.documentElement.style.setProperty('--surface-border', p.border);
      document.documentElement.style.setProperty('--text-main', p.text_main);
      document.documentElement.style.setProperty('--text-muted', p.text_muted);
      document.documentElement.style.setProperty('--shadow-card', p.shadow);
      
      let metaColor = document.getElementById('metaThemeColor');
      if (metaColor) metaColor.setAttribute('content', p.bg_body);

      localStorage.setItem('tema_preferido', tipo);

      ['black_Preto', 'Branco', 'gray'].forEach(t => {
        let btn = document.getElementById('theme_' + t);
        if (btn) {
          if (t === tipo) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
    }

    let vozesSistemaCache = [];
    let vozLiberadaPorInteracao = false;
    let filaUltimaFala = null;

    function carregarVozesSistema() {
      try {
        vozesSistemaCache =
          ('speechSynthesis' in window)
            ? window.speechSynthesis.getVoices()
            : [];
      } catch (_) {
        vozesSistemaCache = [];
      }

      return vozesSistemaCache;
    }

    function selecionarVozDisponivel(lang, tipo) {
      const vozes = carregarVozesSistema();
      if (!vozes.length) return null;

      const idiomaAlvo =
        lang === 'en'
          ? 'en'
          : (lang === 'es' ? 'es' : 'pt');

      const compativeis = vozes.filter(v =>
        String(v.lang || '').toLowerCase().startsWith(idiomaAlvo)
      );

      const lista = compativeis.length ? compativeis : vozes;
      const nome = v => String(v.name || '').toLowerCase();
      const idioma = v => String(v.lang || '').toLowerCase();

      /*
       * Busca primeiro a voz do Google em português do Brasil.
       * É a opção que normalmente fica mais próxima da voz usada
       * por navegação em aparelhos Android.
       *
       * Se o aparelho não disponibilizar essa voz ao navegador/PWA,
       * usa a voz pt-BR padrão do próprio sistema.
       */
      return (
        lista.find(v =>
          /google/.test(nome(v)) &&
          (
            idioma(v) === 'pt-br' ||
            /portugu|brasil|brazil/.test(nome(v))
          )
        ) ||
        lista.find(v =>
          idioma(v) === 'pt-br' && v.default
        ) ||
        lista.find(v =>
          idioma(v) === 'pt-br'
        ) ||
        lista.find(v => v.default) ||
        lista[0]
      );
    }

    /*
     * Android/Chrome/PWA podem bloquear a primeira fala até existir
     * uma interação real do usuário. Fazemos uma fala silenciosa UMA vez
     * no primeiro toque. O usuário não escuta nada.
     */
    function liberarVozPorInteracao() {
      if (vozLiberadaPorInteracao) return;
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;

      try {
        const synth = window.speechSynthesis;

        carregarVozesSistema();
        synth.resume();

        const silenciosa = new SpeechSynthesisUtterance(' ');
        silenciosa.volume = 0.01;
        silenciosa.rate = 1;
        silenciosa.pitch = 1;
        silenciosa.lang = 'pt-BR';

        silenciosa.onend = () => {
          vozLiberadaPorInteracao = true;
        };

        silenciosa.onerror = () => {
          vozLiberadaPorInteracao = true;
        };

        synth.speak(silenciosa);

        setTimeout(() => {
          vozLiberadaPorInteracao = true;
          try { synth.resume(); } catch (_) {}
        }, 500);

      } catch (_) {
        vozLiberadaPorInteracao = true;
      }
    }

    function executarFala(texto, tipo, tentativa = 0) {
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
        return false;
      }

      try {
        const lang = localStorage.getItem('idioma_preferido') || 'pt';
        const synth = window.speechSynthesis;

        carregarVozesSistema();
        synth.resume();

        const msg = new SpeechSynthesisUtterance(String(texto));
        msg.lang =
          lang === 'en'
            ? 'en-US'
            : (lang === 'es' ? 'es-ES' : 'pt-BR');

        msg.volume = 1;
        msg.rate = 1.00;
        msg.pitch = 1.00;

        const voz = selecionarVozDisponivel(lang, tipo);
        if (voz) msg.voice = voz;

        msg.onerror = function(event) {
          const erro = String(event?.error || '');

          if (
            tentativa < 2 &&
            erro !== 'interrupted' &&
            erro !== 'canceled'
          ) {
            setTimeout(() => {
              try {
                synth.resume();
                executarFala(texto, tipo, tentativa + 1);
              } catch (_) {}
            }, 300);
          }
        };

        msg.onend = function() {
          try { synth.resume(); } catch (_) {}
        };

        synth.speak(msg);
        return true;

      } catch (e) {
        console.error('Falha na voz:', e);

        if (tentativa < 2) {
          setTimeout(() => executarFala(texto, tipo, tentativa + 1), 300);
        }

        return false;
      }
    }

    function falarComPerfil(texto, tipo) {
      if (tipo === 'mudo') return false;
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return false;

      try {
        const synth = window.speechSynthesis;

        filaUltimaFala = {
          texto: String(texto),
          tipo
        };

        carregarVozesSistema();
        synth.resume();

        if (synth.speaking || synth.pending) {
          synth.cancel();
        }

        setTimeout(() => {
          try {
            synth.resume();
            executarFala(
              filaUltimaFala.texto,
              filaUltimaFala.tipo,
              0
            );
          } catch (_) {}
        }, 180);

        return true;
      } catch (_) {
        return false;
      }
    }

    function salvarVoz(tipo, testarAgora = false) {
      const escolha = tipo === 'mudo' ? 'mudo' : 'navegacao_feminina';
      localStorage.setItem('voz_preferida', escolha);

      ['navegacao_feminina', 'mudo'].forEach(v => {
        const btn = document.getElementById('voice_' + v);
        if (!btn) return;

        if (v === escolha) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      if (escolha === 'mudo') {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
        return;
      }

      liberarVozPorInteracao();

      if (escolha !== 'mudo' && testarAgora) {
        setTimeout(() => {
          try {
            falarComPerfil('Voz ativada', 'navegacao_feminina');
          } catch (_) {}
        }, 250);
      }
    }

    function desbloquearSinteseDeVoz() {
      if (!('speechSynthesis' in window)) return;

      try {
        window.speechSynthesis.resume();
        carregarVozesSistema();
      } catch (_) {}
    }

    if ('speechSynthesis' in window) {
      carregarVozesSistema();

      try {
        window.speechSynthesis.addEventListener(
          'voiceschanged',
          carregarVozesSistema
        );
      } catch (_) {
        window.speechSynthesis.onvoiceschanged = carregarVozesSistema;
      }

      document.addEventListener(
        'pointerdown',
        liberarVozPorInteracao,
        { passive: true }
      );

      document.addEventListener(
        'touchstart',
        liberarVozPorInteracao,
        { passive: true }
      );

      document.addEventListener(
        'click',
        liberarVozPorInteracao,
        { passive: true }
      );

      document.addEventListener(
        'keydown',
        liberarVozPorInteracao,
        { passive: true }
      );

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) desbloquearSinteseDeVoz();
      });
    }

    function notificar(msg) {
      const modalAdmin = document.getElementById('modalAdmin');
      const modalPix = document.getElementById('modalPix');

      let t = document.getElementById('toastNotificacao');

      // Mensagens administrativas aparecem dentro do Modo Dono.
      if (modalAdmin && getComputedStyle(modalAdmin).display !== 'none') {
        t = document.getElementById('toastAdmin') || t;
      }
      // Mensagens de pagamento aparecem dentro da janela do Pix.
      else if (modalPix && getComputedStyle(modalPix).display !== 'none') {
        t = document.getElementById('toastPix') || t;
      }

      if (!t) return;

      t.innerText = msg;
      t.style.display = 'block';

      clearTimeout(t._timerPacoteEmato);
      t._timerPacoteEmato = setTimeout(() => {
        t.style.display = 'none';
      }, 4200);
    }

    function normalizarTelefone(valor) {
      const digits = String(valor || '').replace(/\D/g, '');
      return digits.length === 13 && digits.startsWith('55') ? digits.slice(2) : digits;
    }
    function normalizarCampoTelefone(campo) {
      const start = campo.selectionStart;
      const original = campo.value;
      const clean = normalizarTelefone(original);
      campo.value = clean;
      if (start !== null && original !== clean) {
        const position = Math.min(normalizarTelefone(original.slice(0,start)).length, clean.length);
        campo.setSelectionRange(position,position);
      }
      campo.setCustomValidity('');
      campo.removeAttribute('aria-invalid');
      if (campo.id === 'inputTel') document.getElementById('avisoNumero').textContent = '';
    }
    function validarNumeroWhatsApp(zap) {
      const limpo = normalizarTelefone(zap);
      const ddds = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
      return /^\d{2}9\d{8}$/.test(limpo) && ddds.includes(Number(limpo.slice(0,2)));
    }
    function validarCampoTelefone(campo) {
      normalizarCampoTelefone(campo);
      const invalid = campo.value !== '' && !validarNumeroWhatsApp(campo.value);
      const message = invalid ? 'Informe um celular com DDD válido e 11 dígitos. Exemplo: 11987654321.' : '';
      campo.setCustomValidity(message);
      campo.setAttribute('aria-invalid', String(invalid));
      if (campo.id === 'inputTel') document.getElementById('avisoNumero').textContent = message;
    }

    function alternarVisibilidadeSenha() {
      let campo = document.getElementById('inputSenha');
      let icone = document.getElementById('toggleSenhaVisivel');
      if (campo.type === 'password') {
        campo.type = 'text';
        icone.innerText = 'OCU';
        icone.setAttribute('aria-label', 'Ocultar senha');
      } else {
        campo.type = 'password';
        icone.innerText = 'VER';
        icone.setAttribute('aria-label', 'Mostrar senha');
      }
    }

    function carregarConfiguracoesSalvas() {
      let lang = localStorage.getItem('idioma_preferido') || 'pt';
      mudarIdioma(lang);

      let tema = 'Branco';
      localStorage.setItem('tema_preferido', tema);
      mudarTema(tema);

      let voz = localStorage.getItem('voz_preferida') || 'navegacao_feminina';
      salvarVoz(voz, false);
      
      verificarRotaSalvaAnterior();

      iniciarMonitoramentoBroadcast();

      let zapSalvo = localStorage.getItem('usuario_zap_salvo');
      if (!zapSalvo) {
        document.getElementById('telaBloqueio').style.display = 'flex';
      }

      atualizarVisibilidadeTesteGratis();
    }

    const firebaseConfig = {
      apiKey: "AIzaSyD-2l3pWZSR8Z_d5jun5lUTuFyROUFa7zY",
      authDomain: "pacote-e-mato.firebaseapp.com",
      projectId: "pacote-e-mato",
      storageBucket: "pacote-e-mato.firebasestorage.app",
      messagingSenderId: "535255652602",
      appId: "1:535255652602:web:2881a450c393d22ccc1143"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    let usuarioAtualZap = localStorage.getItem('usuario_zap_salvo') || '';

    const CLOUDFLARE_WORKER_URL = "https://holy-frog-272c.joaovitor250p.workers.dev";
    
    function mostrarMensagemAuth(tipo, mensagem) {
      const erro = document.getElementById('msgErro');
      const sucesso = document.getElementById('msgSucessoAuth');
      if (erro) erro.style.display = 'none';
      if (sucesso) sucesso.style.display = 'none';
      const alvo = tipo === 'sucesso' ? sucesso : erro;
      if (alvo) { alvo.textContent = mensagem; alvo.style.display = 'block'; }
    }

    function mostrarModoAuth(modo) {
      // Limpa aviso visual antigo ao trocar de aba.
      // O status real da assinatura será reavaliado no login/monitoramento.
      const avisoRenovacaoAtual = document.getElementById('avisoRenovacao');
      if (avisoRenovacaoAtual) avisoRenovacaoAtual.style.display = 'none';
      const tituloPlanosAtual = document.getElementById('areaPlanosRenovacao')?.querySelector('h3');
      if (tituloPlanosAtual) tituloPlanosAtual.textContent = 'Escolha seu plano';

      const login = modo === 'login';
      document.getElementById('paneLogin').classList.toggle('active', login);
      document.getElementById('paneCadastro').classList.toggle('active', !login);
      document.getElementById('tabEntrar').classList.toggle('active', login);
      document.getElementById('tabCadastro').classList.toggle('active', !login);
      document.getElementById('tituloAuthModo').textContent = login ? 'Acesse sua conta' : 'Crie sua conta';
      mostrarMensagemAuth('erro', '');
      document.getElementById('msgErro').style.display = 'none';
      document.getElementById('msgSucessoAuth').style.display = 'none';
    }

    function toggleRecuperarSenha() {
      const box = document.getElementById('boxRecuperarSenha');
      box.style.display = box.style.display === 'block' ? 'none' : 'block';
    }

    function traduzirErroAuthFirebase(error) {
      const code = error && error.code ? error.code : '';
      const mapa = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'Digite um e-mail válido.',
        'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-login-credentials': 'WhatsApp ou senha incorretos.',
        'auth/invalid-credential': 'WhatsApp ou senha incorretos.',
        'auth/user-not-found': 'Conta não encontrada.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
        'auth/network-request-failed': 'Falha de internet. Verifique sua conexão.'
      };
      return mapa[code] || (error && error.message ? error.message : 'Não foi possível concluir a operação.');
    }

    async function recuperarSenhaFirebase() {
      const email = (
        document.getElementById('inputEmailRecuperacao').value || ''
      ).trim().toLowerCase();

      const btn = document.getElementById('btnEnviarReset');
      const card = document.getElementById('recoverySuccessCard');

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (card) card.style.display = 'none';
        mostrarMensagemAuth(
          'erro',
          'Digite o e-mail cadastrado para receber as instruções.'
        );
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Enviando e-mail...';
      }

      try {
        const res = await fetch(
          `${CLOUDFLARE_WORKER_URL}/solicitar-reset-firebase`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          }
        );

        const data = await res.json();

        if (!res.ok || !data.sucesso) {
          throw new Error(
            data.erro || 'Não foi possível solicitar a redefinição.'
          );
        }

        if (card) {
          card.style.display = 'flex';

          const titulo = card.querySelector('strong');
          const texto = card.querySelector('p');

          if (titulo) {
            titulo.textContent = 'E-mail solicitado com sucesso';
          }

          if (texto) {
            texto.textContent =
              'Confira a Caixa de entrada. Se não aparecer, veja Spam, Lixo eletrônico e Promoções. No Gmail, se estiver no Spam, toque em “Não é spam”.';
          }
        }

        mostrarMensagemAuth(
          'sucesso',
          'Pedido enviado ao Firebase. Confira Caixa de entrada, Spam e Promoções.'
        );

      } catch (e) {
        if (card) card.style.display = 'none';

        mostrarMensagemAuth(
          'erro',
          'Falha ao enviar: ' + (e.message || 'erro desconhecido')
        );
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = 'Enviar e-mail para redefinir';
        }
      }
    }

    function prepararMigracaoContaAntiga() {
      const zap = normalizarTelefone(document.getElementById('inputTel').value);
      const senha = document.getElementById('inputSenha').value;
      mostrarModoAuth('cadastro');
      document.getElementById('cadastroTel').value = zap;
      document.getElementById('cadastroSenha').value = senha;
      document.getElementById('cadastroSenha2').value = senha;
      document.getElementById('cadastroEmail').focus();
      mostrarMensagemAuth('sucesso', 'Informe seu e-mail. Ao criar a conta, seu acesso antigo será vinculado sem apagar o vencimento do plano.');
    }

    async function criarContaFirebase() {
      const zap = normalizarTelefone(document.getElementById('cadastroTel').value);
      const email = (document.getElementById('cadastroEmail').value || '').trim().toLowerCase();
      const senha = document.getElementById('cadastroSenha').value || '';
      const senha2 = document.getElementById('cadastroSenha2').value || '';
      const btn = document.getElementById('btnCriarConta');

      if (!validarNumeroWhatsApp(zap)) return mostrarMensagemAuth('erro', 'Digite um WhatsApp válido com DDD.');
      if (!email || !email.includes('@')) return mostrarMensagemAuth('erro', 'Digite um e-mail válido.');
      if (senha.length < 6) return mostrarMensagemAuth('erro', 'A senha precisa ter pelo menos 6 caracteres.');
      if (senha !== senha2) return mostrarMensagemAuth('erro', 'As duas senhas não são iguais.');

      btn.disabled = true;
      btn.textContent = 'Criando conta...';
      let cred = null;
      let senhaAntigaLegada = '';
      try {
        const ref = db.collection('usuarios').doc(zap);
        const antigoDoc = await ref.get();
        const antigo = antigoDoc.exists ? antigoDoc.data() : null;

        if (antigo && (antigo.authUid || antigo.email)) {
          mostrarMensagemAuth('erro', 'Este WhatsApp já possui conta. Use a aba Entrar ou “Esqueci minha senha”.');
          return false;
        }

        if (antigo && antigo.senha) {
          const senhaAntiga = await globalThis.PacoteEMatoDialog?.solicitarTexto?.({
            titulo: 'Confirmar conta antiga',
            mensagem: 'Digite a senha antiga desse WhatsApp para confirmar a vinculação. Ela pode ter 4 dígitos. A senha nova desta tela continua com no mínimo 6 caracteres.',
            placeholder: 'Senha antiga',
            confirmar: 'Confirmar senha',
            cancelar: 'Cancelar'
          });

          if (senhaAntiga === null || senhaAntiga === undefined) {
            mostrarMensagemAuth('erro', 'Vinculação cancelada.');
            return false;
          }

          if (String(senhaAntiga).trim() !== String(antigo.senha).trim()) {
            mostrarMensagemAuth('erro', 'Senha antiga incorreta para este WhatsApp.');
            return false;
          }

          senhaAntigaLegada = String(senhaAntiga).trim();
        }

        cred = await auth.createUserWithEmailAndPassword(email, senha);
        const uid = cred.user.uid;
        const base = {
          whatsapp: zap,
          email: email,
          authUid: uid,
          deviceId: MEU_DEVICE_ID,
          atualizadoEm: Date.now()
        };

        if (!antigo) {
          Object.assign(base, {
            ativo: false,
            bloqueado: false,
            jaUsouTeste: false,
            tipo: 'cadastro',
            plano: 'Sem assinatura',
            criadoEm: Date.now()
          });
        }

        if (antigo) {
          const firebaseIdToken = await cred.user.getIdToken(true);

          const vinculoRes = await fetch(`${CLOUDFLARE_WORKER_URL}/vincular-conta-antiga`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              whatsapp: zap,
              senhaAntiga: senhaAntigaLegada,
              firebaseIdToken,
              firebaseApiKey: firebaseConfig.apiKey,
              deviceId: MEU_DEVICE_ID
            })
          });

          const vinculoData = await vinculoRes.json();

          if (!vinculoRes.ok || !vinculoData.sucesso) {
            throw new Error(vinculoData.erro || 'Não foi possível vincular a conta antiga.');
          }
        } else {
          await ref.set(base, { merge: true });
        }

        usuarioAtualZap = zap;
        localStorage.setItem('usuario_zap_salvo', zap);
        document.getElementById('inputTel').value = zap;
        document.getElementById('inputSenha').value = senha;
        try { await cred.user.sendEmailVerification(); } catch (_) {}

        if (antigo && antigo.ativo && (adminVitalicio(antigo, Date.now()) || Date.now() < adminExpiry(antigo))) {
          mostrarMensagemAuth('sucesso', 'Conta antiga vinculada ao e-mail com sucesso. Seu plano e vencimento foram preservados.');
          iniciarMonitoramentoSessao(zap);
        } else {
          mostrarMensagemAuth('sucesso', antigo ? 'Conta antiga vinculada. Agora escolha um plano ou use o teste grátis, se disponível.' : 'Conta criada. Agora ative os 10 dias grátis ou escolha um plano abaixo.');
        }
        return true;
      } catch (e) {
        if (cred && cred.user) { try { await cred.user.delete(); } catch (_) {} }

        const msg = String(e?.message || e || '');
        if (
          msg.includes('senha antiga') ||
          msg.includes('vincular') ||
          msg.includes('WhatsApp já')
        ) {
          mostrarMensagemAuth('erro', msg);
        } else {
          mostrarMensagemAuth('erro', traduzirErroAuthFirebase(e));
        }
        return false;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Criar minha conta';
      }
    }

    let adminTokenAtual = sessionStorage.getItem('admin_token_pacote_emato') || '';

    async function autenticarAdmin() {
      let passInput = document.getElementById('passAdmin');
      let pass = passInput ? passInput.value.trim() : "";
      if (!pass) return;

      try {
        const res = await fetch(`${CLOUDFLARE_WORKER_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senha: pass })
        });
        const data = await res.json();

        if (data.sucesso && data.adminToken) {
          adminTokenAtual = data.adminToken;
          sessionStorage.setItem('admin_token_pacote_emato', adminTokenAtual);

          passInput.value = "";
          document.getElementById('areaLoginAdmin').style.display = 'none';
          document.getElementById('areaGeradorAdmin').style.display = 'flex';
          carregarUsuariosAdmin();
          carregarPagamentosAdmin();
          notificar(" Painel Dono Desbloqueado!");
        } else if (data.sucesso) {
          passInput.value = "";
          document.getElementById('areaLoginAdmin').style.display = 'none';
          document.getElementById('areaGeradorAdmin').style.display = 'flex';
          carregarUsuariosAdmin();
          carregarPagamentosAdmin();
          notificar("Painel aberto. Entre novamente depois para habilitar a edição de e-mail.");
        } else {
          notificar(data.erro || "Senha incorreta.");
        }
      } catch (err) {
        console.error(err);
        notificar("Erro ao validar acesso.");
      }
    }

    let timerVerificadorPix = null;
    let listenerSessaoRealtime = null;

    function obterDeviceId() {
      let id = localStorage.getItem('app_device_hw_id');
      if (!id) {
        id = 'DEV_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
        localStorage.setItem('app_device_hw_id', id);
      }
      return id;
    }
    const MEU_DEVICE_ID = obterDeviceId();

    let planoSelecionadoAtual = null;

    function selecionarPlano(dias, valor, nomePlano, cardId) {
      let zap = normalizarTelefone(usuarioAtualZap || document.getElementById('inputTel').value || document.getElementById('cadastroTel').value);
      let senha = document.getElementById('inputSenha').value.trim();

      if (!auth.currentUser) {
        mostrarModoAuth('cadastro');
        mostrarMensagemAuth('erro', 'Crie ou entre na sua conta antes de escolher um plano.');
        return;
      }
      if (!validarNumeroWhatsApp(zap)) {
        notificar(" Não foi possível identificar o WhatsApp da conta.");
        return;
      }

      document.querySelectorAll('.plan-item').forEach(el => el.classList.remove('selecionado'));
      document.getElementById(cardId).classList.add('selecionado');

      planoSelecionadoAtual = { dias, valor, nomePlano, senha };

      let btn = document.getElementById('btnConfirmarPagamento');
      btn.innerText = ` Pagar ${nomePlano} (R$ ${valor.toFixed(2).replace('.', ',')})`;
      btn.style.display = 'flex';

      notificar(`Plano ${nomePlano} selecionado. Clique abaixo para gerar o Pix.`);
    }

    function iniciarPixPlanoSelecionado() {
      if (!planoSelecionadoAtual) {
        notificar("Selecione um plano acima primeiro.");
        return;
      }
      gerarPixAutomatico(planoSelecionadoAtual.dias, planoSelecionadoAtual.valor, planoSelecionadoAtual.nomePlano, document.getElementById('inputSenha').value.trim());
    }

    let paymentIdGlobalAtual = null;
    let planoNomeGlobalAtual = "";
    let planoValorGlobalAtual = 0;
    let planoDiasGlobalAtual = 0;
    let contaPixAtual = null;

    function registrarDadosPixAtual(paymentId, nomePlano, valor, dias) {
      paymentIdGlobalAtual = paymentId;
      planoNomeGlobalAtual = nomePlano;
      planoValorGlobalAtual = valor;
      planoDiasGlobalAtual = dias;
    }

    async function forcarChecagemPagamentoManual() {
      if (!paymentIdGlobalAtual) {
        notificar("Nenhum pagamento ativo no momento.");
        return;
      }

      if (!contaPixAtual) {
        notificar("Gere um pagamento para sua conta primeiro.");
        return;
      }

      notificar("Verificando pagamento no banco...");

      try {
        const { zap, cupomIndicador } = contaPixAtual;

        const res = await fetch(`${CLOUDFLARE_WORKER_URL}/finalizar-pix`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: String(paymentIdGlobalAtual),
            whatsapp: zap,
            cupomIndicador: cupomIndicador || ""
          })
        });

        const data = await res.json();

        if (res.ok && data.sucesso) {
          clearInterval(timerVerificadorPix);
          fecharModalPix();
          localStorage.setItem("usuario_zap_salvo", zap);
          notificar(
            data.bonusDias
              ? " Pagamento confirmado com bônus de indicação!"
              : " Pagamento confirmado e acesso liberado!"
          );
          iniciarMonitoramentoSessao(zap);
        } else if (data.pendente) {
          notificar(" O pagamento ainda não foi aprovado. Tente novamente em alguns segundos.");
        } else {
          notificar(data.erro || "Não foi possível liberar o pagamento.");
        }
      } catch (e) {
        console.error("Erro finalizar Pix:", e);
        notificar("Erro ao verificar o pagamento. Verifique sua internet.");
      }
    }

    async function gerarPixAutomatico(dias, valor, nomePlano, senha) {
      let zap = normalizarTelefone(usuarioAtualZap || document.getElementById('inputTel').value || document.getElementById('cadastroTel').value);
      let cupomIndicador = normalizarTelefone((document.getElementById('inputCupomIndicacao') || {}).value || '');

      if (!validarNumeroWhatsApp(zap)) {
        notificar(" Número de WhatsApp inválido.");
        return;
      }

      try {
        if (!auth.currentUser) { notificar('Entre na sua conta antes de gerar o Pix.'); return; }
        const existente = await db.collection('usuarios').doc(zap).get();
        if (!existente.exists) { notificar('Conta não encontrada.'); return; }
        const conta = existente.data();
        if (conta.bloqueado) { notificar('Conta bloqueada. Entre em contato com o suporte.'); return; }
        if (conta.authUid && conta.authUid !== auth.currentUser.uid) { notificar('Esta conta não corresponde ao usuário autenticado.'); return; }
      } catch(e) { notificar('Não foi possível verificar sua conta. Tente novamente.'); return; }

      document.getElementById('pixPlanoNome').innerText = `${nomePlano} • R$ ${valor.toFixed(2).replace('.', ',')}`;
      document.getElementById('modalPix').style.display = 'flex';
      document.getElementById('qrContainer').innerHTML = "<div style='color:#000; font-weight:800; font-size:0.8rem;'>Gerando QR Code Pix...</div>";
      document.getElementById('pixCopiaColaOut').value = "";

      try {
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}/criar-pix`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            valor: valor,
            descricao: `Pacote É Mato - ${nomePlano}`,
            zap: zap
          })
        });

        let data;
        try {
          data = await response.json();
        } catch (_) {
          data = null;
        }

        // Aceita tanto o retorno direto do Mercado Pago como
        // o formato { sucesso, pagamento: {...} } do Worker.
        const mpData = data && data.pagamento ? data.pagamento : data;
        const transacaoPix = mpData?.point_of_interaction?.transaction_data;
        const copiaCola = transacaoPix?.qr_code || data?.qr_code || "";
        const paymentId = mpData?.id || data?.id;

        if (response.ok && copiaCola && paymentId) {
          registrarDadosPixAtual(String(paymentId), nomePlano, valor, dias);
          contaPixAtual = {zap, cupomIndicador};
          document.getElementById('pixCopiaColaOut').value = copiaCola;

          const qr = document.getElementById('qrContainer');
          qr.classList.remove('pix-error-visible');
          qr.innerHTML = "";

          new QRCode(qr, {
            text: copiaCola,
            width: 150,
            height: 150,
            correctLevel: QRCode.CorrectLevel.M
          });

          iniciarMonitoramentoPixAprovado(String(paymentId), zap, dias, nomePlano, valor, senha, cupomIndicador);
        } else {
          const erroDetalhado =
            data?.erro ||
            data?.message ||
            data?.detalhe?.message ||
            data?.detalhe?.cause?.[0]?.description ||
            mpData?.message ||
            ("Falha HTTP " + response.status);

          console.error("Mercado Pago / Worker:", data);

          const qr = document.getElementById('qrContainer');
          qr.classList.add('pix-error-visible');
          qr.innerHTML =
            "<div> Não foi possível gerar o Pix.</div>" +
            "<div style='margin-top:6px;font-weight:700;'>Motivo: " +
            String(erroDetalhado).replace(/[<>&]/g, '') +
            "</div><div style='margin-top:8px;color:var(--text-muted);font-weight:700;'>O plano continuará selecionado. Você pode tentar novamente.</div>";

          // NÃO fecha o modal: agora o erro permanece visível para diagnóstico.
          notificar("Pix não gerado. Veja o motivo na janela de pagamento.");
        }

      } catch (err) {
        console.error("Erro de conexão com o Pix:", err);
        const qr = document.getElementById('qrContainer');
        qr.classList.add('pix-error-visible');
        qr.innerHTML =
          "<div> Erro de conexão com o serviço Pix.</div>" +
          "<div style='margin-top:6px;font-weight:700;'>" +
          String(err?.message || err).replace(/[<>&]/g, '') +
          "</div>";
        notificar("Erro de conexão com o Pix. A janela foi mantida aberta.");
      }
    }

    function iniciarMonitoramentoPixAprovado(paymentId, zap, dias, nomePlano, valor, senha, cupomIndicador) {
      clearInterval(timerVerificadorPix);

      timerVerificadorPix = setInterval(async () => {
        try {
          const res = await fetch(`${CLOUDFLARE_WORKER_URL}/finalizar-pix`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: String(paymentId),
              whatsapp: zap,
              cupomIndicador: cupomIndicador || ""
            })
          });

          const data = await res.json();

          if (res.ok && data.sucesso) {
            clearInterval(timerVerificadorPix);
            fecharModalPix();
            localStorage.setItem("usuario_zap_salvo", zap);

            notificar(
              data.bonusDias
                ? " Pagamento Aprovado com +3 Dias de Bônus!"
                : " Pagamento Aprovado com sucesso!"
            );

            iniciarMonitoramentoSessao(zap);
          }
        } catch (e) {}
      }, 2000);
    }

    async function aplicarBonusQuemIndicou(zapIndicador, zapNovoUsuario) {
      // Mantido apenas por compatibilidade com versões anteriores.
      // O bônus agora é processado de forma segura pelo Worker junto com o pagamento.
      return;
    }

    function fecharModalPix() {
      clearInterval(timerVerificadorPix);
      document.getElementById('modalPix').style.display = 'none';
    }

    function copiarPixCopiaCola() {
      let campo = document.getElementById('pixCopiaColaOut');
      if (!campo.value) return;
      campo.select();
      navigator.clipboard.writeText(campo.value);
      notificar(" Código Pix Copiado com sucesso!");
    }

    function atualizarVisibilidadeTesteGratis() {
      const btn = document.getElementById('btnTesteGratis');
      if (!btn) return;

      const usadoLocal = localStorage.getItem('teste_gratis_bloqueado_local') === 'true';

      if (usadoLocal) {
        btn.style.display = 'none';
        btn.disabled = true;
        return;
      }

      btn.style.display = 'flex';
      btn.disabled = false;
      btn.innerText = ' TESTE GRÁTIS — 10 DIAS';
    }

    async function ativarTesteGratis() {
      const msgErro = document.getElementById('msgErro');
      const btn = document.getElementById('btnTesteGratis');
      const user = auth.currentUser;
      const zap = normalizarTelefone(usuarioAtualZap || document.getElementById('cadastroTel').value || document.getElementById('inputTel').value);
      const cupomIndicador = normalizarTelefone((document.getElementById('inputCupomIndicacao') || {}).value || '');

      if (!user) {
        mostrarModoAuth('cadastro');
        mostrarMensagemAuth('erro', 'Primeiro crie sua conta. Depois você poderá ativar os 10 dias grátis.');
        return;
      }
      if (!validarNumeroWhatsApp(zap)) {
        mostrarMensagemAuth('erro', 'Não foi possível identificar o WhatsApp da conta.');
        return;
      }
      if (localStorage.getItem('teste_gratis_bloqueado_local') === 'true') {
        mostrarMensagemAuth('erro', 'Este celular já utilizou o teste grátis.');
        if (btn) btn.style.display = 'none';
        return;
      }

      btn.innerText = 'Validando...';
      btn.disabled = true;
      try {
        const docAparelho = await db.collection('dispositivos_bloqueados').doc(MEU_DEVICE_ID).get();
        if (docAparelho.exists) {
          localStorage.setItem('teste_gratis_bloqueado_local', 'true');
          mostrarMensagemAuth('erro', 'Este celular já utilizou o teste grátis anteriormente.');
          btn.style.display = 'none';
          return;
        }

        const ref = db.collection('usuarios').doc(zap);
        const docZap = await ref.get();
        if (!docZap.exists || docZap.data().authUid !== user.uid) {
          mostrarMensagemAuth('erro', 'A conta autenticada não corresponde a este WhatsApp.');
          return;
        }
        const conta = docZap.data();
        if (conta.jaUsouTeste) {
          mostrarMensagemAuth('erro', 'Este WhatsApp já utilizou o teste gratuito.');
          btn.style.display = 'none';
          return;
        }

        const diasTeste = 10;
        const expiraEm = Date.now() + (diasTeste * 24 * 60 * 60 * 1000);
        await ref.set({
          whatsapp: zap,
          email: user.email || conta.email || '',
          authUid: user.uid,
          expiraEm,
          ativo: true,
          bloqueado: false,
          deviceId: MEU_DEVICE_ID,
          jaUsouTeste: true,
          tipo: 'teste',
          plano: 'Teste Grátis (10 Dias)',
          duracaoDias: diasTeste,
          indicadoPor: cupomIndicador || '',
          ativadoEm: Date.now()
        }, { merge: true });

        await db.collection('dispositivos_bloqueados').doc(MEU_DEVICE_ID).set({
          whatsapp: zap,
          authUid: user.uid,
          bloqueadoEm: Date.now()
        });

        usuarioAtualZap = zap;
        localStorage.setItem('teste_gratis_bloqueado_local', 'true');
        localStorage.setItem('usuario_zap_salvo', zap);
        atualizarVisibilidadeTesteGratis();
        mostrarMensagemAuth('sucesso', 'Teste de 10 dias ativado com sucesso!');
        iniciarMonitoramentoSessao(zap);
      } catch (e) {
        mostrarMensagemAuth('erro', 'Erro ao ativar teste: ' + (e.message || e));
      } finally {
        btn.innerText = ' TESTE GRÁTIS — 10 DIAS';
        btn.disabled = false;
      }
    }

    let tentativasLoginFalhas = 0;
    let loginBloqueadoAte = 0;

    async function autenticarUsuarioFirebase() {
      const lang = localStorage.getItem('idioma_preferido') || 'pt';
      const dict = traducoes[lang] || traducoes.pt;
      const btn = document.getElementById('btnEntrarAuth');

      if (Date.now() < loginBloqueadoAte) {
        mostrarMensagemAuth('erro', dict.login_bloqueado || 'Aguarde alguns segundos antes de tentar novamente.');
        return;
      }

      const zap = normalizarTelefone(document.getElementById('inputTel').value);
      const senha = document.getElementById('inputSenha').value || '';
      if (!validarNumeroWhatsApp(zap)) return mostrarMensagemAuth('erro', 'Digite um WhatsApp válido com DDD.');
      if (!senha) return mostrarMensagemAuth('erro', 'Digite sua senha de acesso.');

      btn.innerText = 'Verificando...';
      btn.disabled = true;
      document.getElementById('boxContaAntiga').style.display = 'none';

      try {
        const ref = db.collection('usuarios').doc(zap);
        const doc = await ref.get();
        if (!doc.exists) {
          mostrarMensagemAuth('erro', 'Número não localizado. Use “Criar conta” para fazer seu cadastro.');
          return;
        }

        const data = doc.data();
        const agora = Date.now();
        if (!data.email || !data.authUid) {
          if (data.senha && data.senha !== senha) {
            registrarTentativaLoginFalha(dict);
            mostrarMensagemAuth('erro', 'Senha incorreta.');
            return;
          }
          document.getElementById('boxContaAntiga').style.display = 'block';
          mostrarMensagemAuth('erro', 'Sua conta é do sistema antigo e ainda não possui e-mail. Vincule um e-mail para continuar.');
          return;
        }

        const cred = await auth.signInWithEmailAndPassword(data.email, senha);
        if (cred.user.uid !== data.authUid) {
          await auth.signOut();
          mostrarMensagemAuth('erro', 'Os dados desta conta não conferem. Fale com o suporte.');
          return;
        }

        tentativasLoginFalhas = 0;
        if (data.bloqueado) {
          await auth.signOut();
          mostrarMensagemAuth('erro', 'Este número foi bloqueado pelo administrador.');
          return;
        }

        usuarioAtualZap = zap;
        localStorage.setItem('usuario_zap_salvo', zap);
        await ref.update({ deviceId: MEU_DEVICE_ID, ultimoLoginEm: Date.now() });

        if (!contaTemAcessoAtivo(data, agora)) {
          mostrarRenovacao(zap);
          mostrarMensagemAuth('erro', 'Acesso expirado. Selecione um plano abaixo para renovar.');
          return;
        }

        mostrarMensagemAuth('sucesso', 'Bem-vindo de volta!');
        iniciarMonitoramentoSessao(zap);
      } catch (e) {
        registrarTentativaLoginFalha(dict);
        mostrarMensagemAuth('erro', traduzirErroAuthFirebase(e));
      } finally {
        btn.innerText = 'Entrar no Sistema →';
        btn.disabled = false;
      }
    }

    function registrarTentativaLoginFalha(dict) {
      tentativasLoginFalhas++;
      if (tentativasLoginFalhas >= 5) {
        loginBloqueadoAte = Date.now() + 30000;
        tentativasLoginFalhas = 0;
        notificar(dict.login_bloqueado);
      }
    }

    let timerExpiracaoSessao = null;
    function mostrarRenovacao(zap) {
      document.getElementById('inputTel').value = zap;
      document.getElementById('avisoRenovacao').style.display = 'block';
      document.getElementById('btnTesteGratis').style.display = 'none';
      document.getElementById('telaBloqueio').style.display = 'flex';
      document.getElementById('areaPlanosRenovacao').querySelector('h3').textContent = 'Renove seu acesso';
    }
    function limparAvisoRenovacao() {
      document.getElementById('avisoRenovacao').style.display = 'none';
      document.getElementById('areaPlanosRenovacao').querySelector('h3').textContent = 'Escolha seu plano';
      atualizarVisibilidadeTesteGratis();
    }
    async function salvarAcessoPago(zap, dados) {
      throw new Error("A liberação de assinatura agora é processada somente pelo servidor.");
    }

    function iniciarMonitoramentoSessao(zap) {
      if (listenerSessaoRealtime) listenerSessaoRealtime();
      clearTimeout(timerExpiracaoSessao);

      listenerSessaoRealtime = db.collection("usuarios").doc(zap).onSnapshot((doc) => {
        if (!doc.exists) {
          desconectarForcado("Conta não encontrada.");
          return;
        }

        let data = doc.data();
        let agora = Date.now();
        clearTimeout(timerExpiracaoSessao);

        if (data.bloqueado) {
          desconectarForcado(" Seu acesso foi bloqueado pelo administrador.");
          return;
        }

        if (!contaTemAcessoAtivo(data, agora)) {
          desconectarForcado("Assinatura expirada.", zap);
          return;
        }

        if (data.deviceId && data.deviceId !== MEU_DEVICE_ID) {
          desconectarForcado(" Esta conta foi conectada em outro aparelho!");
          return;
        }

        const expiraSessao = adminExpiry(data);
        if (!adminVitalicio(data, agora) && expiraSessao > 0) {
          const checarPrazo = () => {
            const restante = adminExpiry(data) - Date.now();
            if (restante <= 0) desconectarForcado('Assinatura expirada.', zap);
            else timerExpiracaoSessao = setTimeout(checarPrazo, Math.min(restante, 60000));
          };
          checarPrazo();
        }

        limparAvisoRenovacao();

        if (adminVitalicio(data, agora)) {
          document.getElementById('diasRestantes').innerText = "Vitalício";
        } else if (expiraSessao > 0) {
          const dias = Math.max(1, Math.ceil((expiraSessao - agora) / (1000 * 60 * 60 * 24)));
          document.getElementById('diasRestantes').innerText = `Ativo (${dias}d rest.)`;
        } else {
          document.getElementById('diasRestantes').innerText = "Acesso Ativo";
        }
        document.getElementById('telaBloqueio').style.display = 'none';

      });
    }

    function desconectarForcado(motivo, zapRenovacao = null) {
      clearTimeout(timerExpiracaoSessao);
      if (listenerSessaoRealtime) {
        listenerSessaoRealtime();
        listenerSessaoRealtime = null;
      }
      
      let sb = document.getElementById('sidebar');
      if (sb) sb.classList.remove('active');
      let ov = document.getElementById('overlay');
      if (ov) ov.style.display = 'none';

      finalizarCameraHardware();

      if (zapRenovacao) {
        localStorage.setItem('usuario_zap_salvo', zapRenovacao);
        mostrarRenovacao(zapRenovacao);
      } else {
        localStorage.removeItem('usuario_zap_salvo');
        limparAvisoRenovacao();
      }
      let msgErro = document.getElementById('msgErro');
      msgErro.innerText = motivo;
      msgErro.style.display = 'block';
      document.getElementById('telaBloqueio').style.display = 'flex';
    }

    function sairDoApp() {
      clearTimeout(timerExpiracaoSessao);
      limparAvisoRenovacao();
      if (listenerSessaoRealtime) {
        listenerSessaoRealtime();
        listenerSessaoRealtime = null;
      }

      let sb = document.getElementById('sidebar');
      if (sb) sb.classList.remove('active');
      let ov = document.getElementById('overlay');
      if (ov) ov.style.display = 'none';

      finalizarCameraHardware();

      localStorage.removeItem('usuario_zap_salvo');
      usuarioAtualZap = '';
      try { auth.signOut(); } catch(e) {}
      document.getElementById('inputTel').value = "";
      document.getElementById('inputSenha').value = "";
      document.getElementById('areaExecucao').style.display = 'none';
      
      document.getElementById('telaBloqueio').style.display = 'flex';
      notificar(" Você foi desconectado.");
    }

    document.getElementById('inputTel').addEventListener('input', limparAvisoRenovacao);

    auth.onAuthStateChanged(async (user) => {
      const zapSalvoInicial = localStorage.getItem('usuario_zap_salvo');
      if (user && zapSalvoInicial) {
        try {
          const doc = await db.collection('usuarios').doc(zapSalvoInicial).get();
          if (doc.exists && (!doc.data().authUid || doc.data().authUid === user.uid)) {
            usuarioAtualZap = zapSalvoInicial;
            iniciarMonitoramentoSessao(zapSalvoInicial);
            return;
          }
        } catch(e) {}
      }
      document.getElementById('telaBloqueio').style.display = 'flex';
    });

    // ==========================================
    // SISTEMA INDIQUE E GANHE DIAS GRÁTIS
    // ==========================================
    function abrirModalIndicacao() {
      let zap = localStorage.getItem('usuario_zap_salvo') || "Cadastre-se";
      document.getElementById('txtMeuCodigoIndicacao').innerText = zap;
      document.getElementById('modalIndicacao').style.display = 'flex';
    }

    function fecharModalIndicacao() {
      document.getElementById('modalIndicacao').style.display = 'none';
    }

    function copiarLinkConviteIndicacao() {
      let zap = localStorage.getItem('usuario_zap_salvo');
      if (!zap) {
        notificar("Faça login antes de compartilhar sua indicação.");
        return;
      }
      let texto = ` Baixe o app *Pacote É Mato* para organizar e otimizar suas entregas!\n\n Use meu código de indicação *${zap}* ao entrar e ganhe *dias grátis adicionais*!\n\nAcesse: ${window.location.origin}`;
      
      navigator.clipboard.writeText(texto);
      notificar(" Link e texto de convite copiados!");
      
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    }

    // ==========================================
    // MODO DONO - DASHBOARD FINANCEIRO E WHATSAPP
    // ==========================================
    let cliquesAdmin = 0;
    let timerCliques = null;

    function registrarCliqueAdmin(event) {
      // V53: o painel administrativo foi separado do aplicativo do motorista.
      // O antigo atalho de cinco toques permanece desativado por segurança.
      cliquesAdmin = 0;
      return false;
    }

    function fecharModalAdmin() {
      document.getElementById('modalAdmin').style.display = 'none';
      if (adminUnsubscribe) { adminUnsubscribe(); adminUnsubscribe=null; }
      clearInterval(adminClock);
    }

    let listaUsuariosCache = [];

    const ADMIN_DAY = 86400000;
    const ADMIN_LIFETIME_DAYS = 100000;
    const adminSections = { '30d':'30d', '90d':'90d', teste:'Teste', vitalicio:'Vitalicio', outros:'Outros', expirados:'Expirados', bloqueados:'Bloqueados', pagos:'Pagos', add:'Add', aviso:'Aviso' };
    const adminLabels = { '30d':'Mensal', '90d':'Trimestral', teste:'Teste grátis', vitalicio:'Vitalício', outros:'Outros acessos', expirados:'Expirados', bloqueados:'Bloqueados', pagos:'Histórico financeiro', add:'Liberar / renovar acesso', aviso:'Comunicados' };
    let adminTabAtual = '30d';
    let adminUnsubscribe = null;
    let adminClock = null;
    function adminEscape(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function adminExpiry(u) {
      if (!u) return 0;

      const valor = u.expiraEm;

      // Firestore Timestamp normal
      if (valor && typeof valor.toMillis === 'function') {
        return valor.toMillis();
      }

      // Objeto Timestamp serializado: {seconds, nanoseconds}
      if (valor && typeof valor === 'object') {
        if (Number.isFinite(Number(valor.seconds))) {
          return Number(valor.seconds) * 1000;
        }
        if (Number.isFinite(Number(valor._seconds))) {
          return Number(valor._seconds) * 1000;
        }
      }

      // Número ou string numérica.
      // Alguns cadastros antigos podem ter sido salvos em segundos (10 dígitos)
      // em vez de milissegundos (13 dígitos).
      if (valor !== undefined && valor !== null && valor !== '') {
        const numero = Number(valor);
        if (Number.isFinite(numero) && numero > 0) {
          return numero < 100000000000 ? numero * 1000 : numero;
        }

        // Datas em formato de texto/ISO
        const dataTexto = Date.parse(String(valor));
        if (Number.isFinite(dataTexto)) return dataTexto;
      }

      // Compatibilidade com cadastros antigos que tinham duração e data de ativação,
      // mas não possuíam expiraEm corretamente gravado.
      const dias = Number(u.duracaoDias || 0);
      const inicio = Number(u.ativadoEm || u.criadoEm || 0);
      if (dias > 0 && inicio > 0) {
        return inicio + (dias * 24 * 60 * 60 * 1000);
      }

      return 0;
    }
    function adminVitalicio(u, now = Date.now()) {
      return u.vitalicio === true || /vital[ií]cio/i.test(u.plano || '') || Number(u.duracaoDias) >= ADMIN_LIFETIME_DAYS || (adminExpiry(u)-now)/ADMIN_DAY >= ADMIN_LIFETIME_DAYS;
    }
    function contaTemAcessoAtivo(u, now = Date.now()) {
      if (!u || u.bloqueado === true) return false;
      if (adminVitalicio(u, now)) return true;

      const expira = adminExpiry(u);

      // Se há vencimento válido, ele é a fonte de verdade.
      if (expira > 0) return expira > now;

      // Compatibilidade com contas antigas:
      // algumas foram cadastradas apenas com ativo:true e sem expiraEm utilizável.
      // Não marca essas contas como expiradas automaticamente.
      if (u.ativo === true) return true;

      return false;
    }
    function adminPlano(u, now = Date.now()) {
      if (adminVitalicio(u,now)) return 'vitalicio';
      if (u.tipo === 'teste' || /teste|gr[aá]tis|trial/i.test(u.plano || '')) return 'teste';
      const name = String(u.plano || '').toLowerCase();
      const days = Number(u.duracaoDias || 0);
      if (/trimestr|3\s*mes|90\s*d/i.test(name) || days === 90 || (u.tipo === 'pago' && days === 93)) return '90d';
      if (/mensal|1\s*m[eê]s|30\s*d/i.test(name) || days === 30 || (u.tipo === 'pago' && days === 33)) return '30d';
      return 'outros';
    }
    function adminCategoria(u, now = Date.now()) {
      if (u.bloqueado === true) return 'bloqueados';
      if (!contaTemAcessoAtivo(u, now)) return 'expirados';
      return adminPlano(u,now);
    }
    async function adminWorkerFetch(path, options = {}) {
      if (!adminTokenAtual) {
        throw new Error('Sua sessão do Modo Dono expirou. Entre novamente.');
      }

      const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${adminTokenAtual}`
      };

      if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(`${CLOUDFLARE_WORKER_URL}${path}`, {
        ...options,
        headers
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        data = {};
      }

      if (res.status === 401) {
        adminTokenAtual = '';
        sessionStorage.removeItem('admin_token_pacote_emato');
        throw new Error('Sessão do Modo Dono expirada. Feche e entre novamente.');
      }

      if (!res.ok || data.sucesso === false) {
        throw new Error(data.erro || `Falha na operação (${res.status}).`);
      }

      return data;
    }

    async function carregarUsuariosAdmin() {
      if (adminUnsubscribe) {
        try { adminUnsubscribe(); } catch (_) {}
        adminUnsubscribe = null;
      }

      clearInterval(adminClock);
      document.getElementById('admListSummary').textContent = 'Carregando contas…';

      try {
        const data = await adminWorkerFetch('/admin/usuarios', { method: 'GET' });
        listaUsuariosCache = Array.isArray(data.usuarios) ? data.usuarios : [];
        filtrarListaAdminLocal();

        adminClock = setInterval(() => {
          filtrarListaAdminLocal();
        }, 60000);
      } catch (e) {
        console.error('Erro carregar usuários:', e);
        document.getElementById('admListSummary').textContent =
          e.message || 'Não foi possível carregar as contas.';
        notificar(e.message || 'Erro ao carregar contas.');
      }
    }

    function renderizarUsuariosAdminList(lista) {
      const now = Date.now();
      const groups = Object.fromEntries(Object.keys(adminSections).slice(0,7).map(k=>[k,[]]));
      const counts = Object.fromEntries(Object.keys(groups).map(k=>[k,0]));
      listaUsuariosCache.forEach(u=>counts[adminCategoria(u,now)]++);
      document.getElementById('txtAdminVitalicios').textContent = counts.vitalicio;
      document.getElementById('txtAdminExpirados').textContent = counts.expirados;
      document.getElementById('txtTotalPagantesAtivos').textContent = listaUsuariosCache.filter(u=>u.tipo==='pago' && !['expirados','bloqueados'].includes(adminCategoria(u,now))).length;
      lista.slice().sort((a,b)=>String(a.whatsapp || a.id).localeCompare(String(b.whatsapp || b.id))).forEach(u => {
        const cat = adminCategoria(u,now), plan = adminPlano(u,now);
        const rawId = String(u.id || u.whatsapp || '');
        const arg = adminEscape(JSON.stringify(rawId));
        const zap = adminEscape(u.whatsapp || u.id);
        const phone = String(u.whatsapp || u.id || '').replace(/\D/g,'');
        const days = Math.max(0,Math.ceil((adminExpiry(u)-now)/ADMIN_DAY));
        const status = cat==='bloqueados' ? 'Bloqueado' : cat==='expirados' ? 'Expirado' : plan==='vitalicio' ? 'Acesso vitalício' : `${days} dias restantes`;
        const date = plan==='vitalicio' ? 'Sem prazo de vencimento' : adminExpiry(u) ? `Vencimento: ${new Date(adminExpiry(u)).toLocaleDateString('pt-BR')}` : 'Sem vencimento cadastrado';
        const emailConta = String(u.email || '').trim();
        const emailHtml = emailConta
          ? `<div class="adm-email"> <strong>${adminEscape(emailConta)}</strong></div>`
          : `<div class="adm-email adm-email-empty"> E-mail não cadastrado</div>`;

        groups[cat].push(`<article class="adm-account"><div class="adm-account-top"><div><div class="adm-phone">${zap}</div><div class="adm-plan">${adminLabels[plan]}${plan==='outros' ? ' · '+adminEscape(u.plano || 'Acesso personalizado') : ''}</div>${emailHtml}</div><span class="adm-status ${cat}">${status}</span></div><div class="adm-account-meta"><span>${date}</span><span>${Number(u.totalIndicacoes)||0} indicações</span></div><div class="adm-account-actions"><button onclick="prepararRenovacaoAdmin(${arg})">Renovar / trocar plano</button><a href="https://wa.me/${phone.startsWith('55') && phone.length>11 ? phone : '55'+phone}" target="_blank" rel="noopener">WhatsApp</a><details><summary>Gerenciar conta</summary><div class="adm-extra-actions"><button onclick="ajustarDiasRapido(${arg})">Ajustar dias</button><button onclick="redefinirSenhaAdmin(${arg})"> Alterar senha</button><button class="adm-email-action" onclick="editarEmailAdmin(${arg})"> Editar e-mail</button><button onclick="desconectarAparelhoAdmin(${arg})">Resetar aparelho</button><button onclick="alternarBloqueioUsuario(${arg},${u.bloqueado!==true})">${u.bloqueado ? 'Desbloquear' : 'Bloquear'}</button><button class="adm-danger" onclick="deletarUsuarioAdmin(${arg})">Excluir conta</button></div></details></div></article>`);
      });
      Object.keys(groups).forEach(k=> {
        document.getElementById('countAdmin'+adminSections[k]).textContent=counts[k];
        document.getElementById('viewAdmin'+adminSections[k]).innerHTML=groups[k].join('') || '<div class="adm-empty">Nenhuma conta nesta seção'+(document.getElementById('buscaAdminUser').value ? ' corresponde à busca.' : '.')+'</div>';
      });
      document.getElementById('admListSummary').textContent = `${adminLabels[adminTabAtual]} · ${lista.length} conta(s) na busca · ${listaUsuariosCache.length} no total`;
    }
    function filtrarListaAdminLocal() {
      const query = document.getElementById('buscaAdminUser').value.trim().toLowerCase();
      renderizarUsuariosAdminList(listaUsuariosCache.filter(u=>String(u.whatsapp || u.id || '').toLowerCase().includes(query)));
    }
    function prepararRenovacaoAdmin(id) {
      const u = listaUsuariosCache.find(u=>String(u.id || u.whatsapp)===id);
      if (!u) return;
      document.getElementById('inputClienteZap').value=u.whatsapp || u.id;
      
      document.getElementById('inputDiasCustom').value=adminPlano(u)==='90d' ? 90 : 30;
      alternarTabAdmin('add');
      document.getElementById('inputDiasCustom').focus();
    }

    async function carregarPagamentosAdmin() {
      const viewPagos = document.getElementById('viewAdminPagos');
      if (!viewPagos) return;

      viewPagos.innerHTML =
        "<div style='font-size:0.75rem; color:#888;'>Carregando pagamentos...</div>";

      try {
        const data = await adminWorkerFetch('/admin/pagamentos', { method: 'GET' });
        const pagamentos = Array.isArray(data.pagamentos) ? data.pagamentos : [];

        let htmlPagos = "";
        let totalFaturado = 0;

        pagamentos.forEach(p => {
          const valorNum = Number(p.valor || 0);
          totalFaturado += valorNum;

          htmlPagos += `
            <div class="user-row">
              <div>
                <div style="font-weight:800; font-size:0.8rem; color:#34d399;"> ${adminEscape(p.whatsapp || '')}</div>
                <div style="font-size:0.68rem; color:var(--text-main);"><b>${adminEscape(p.plano || '')}</b> • R$ ${valorNum.toFixed(2).replace('.', ',')}</div>
                <div style="font-size:0.6rem; color:var(--text-muted);"> ${adminEscape(p.data || '')}</div>
              </div>
            </div>`;
        });

        viewPagos.innerHTML =
          htmlPagos || "<div style='font-size:0.75rem; color:#888;'>Nenhum pagamento registrado.</div>";

        const total = document.getElementById('txtTotalFaturamento');
        if (total) total.innerText = `R$ ${totalFaturado.toFixed(2).replace('.', ',')}`;
      } catch (e) {
        console.error('Erro carregar pagamentos:', e);
        viewPagos.innerHTML =
          `<div style="font-size:0.75rem;color:#ef4444;">${adminEscape(e.message || 'Erro ao carregar pagamentos.')}</div>`;
        notificar(e.message || 'Erro ao carregar pagamentos.');
      }
    }

    function exportarRelatorioCSV() {
      if (listaUsuariosCache.length === 0) {
        notificar("Nenhum usuário para exportar.");
        return;
      }
      let csv = "WhatsApp,Email,Plano,DuracaoDias,Indicacoes,Status\n";
      let agora = Date.now();

      listaUsuariosCache.forEach(u => {
        let status = u.bloqueado ? "Bloqueado" : (u.ativo && agora <= (u.expiraEm || 0) ? "Ativo" : "Expirado");
        csv += `"${u.whatsapp || u.id}","${u.email || ''}","${u.plano || ''}","${u.duracaoDias || ''}","${u.totalIndicacoes || 0}","${status}"\n`;
      });

      let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `pacote_e_mato_clientes_${Date.now()}.csv`;
      link.click();
      notificar(" Relatório CSV baixado com sucesso!");
    }

    function alternarTabAdmin(tab) {
      if (!adminSections[tab]) return;
      adminTabAtual=tab;
      Object.entries(adminSections).forEach(([key,suffix])=> {
        document.getElementById('tab'+suffix)?.classList.toggle('active',key===tab);
        const view=document.getElementById('viewAdmin'+suffix);
        if (view) view.style.display=key===tab ? 'flex':'none';
      });
      filtrarListaAdminLocal();
    }

    let senhaAdminZapAtual = null;

    function alternarSenhaAdminVisivel(inputId, iconeEl) {
      const input = document.getElementById(inputId);
      if (!input) return;

      const mostrando = input.type === 'text';
      input.type = mostrando ? 'password' : 'text';

      if (iconeEl) {
        iconeEl.textContent = mostrando ? 'VER' : 'OCU';
        iconeEl.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
      }
    }

    function fecharModalSenhaAdmin() {
      const modal = document.getElementById('modalSenhaAdmin');
      if (modal) modal.style.display = 'none';

      const a = document.getElementById('adminNovaSenha');
      const b = document.getElementById('adminConfirmarSenha');

      if (a) {
        a.value = '';
        a.type = 'password';
      }

      if (b) {
        b.value = '';
        b.type = 'password';
      }

      senhaAdminZapAtual = null;
    }

    function redefinirSenhaAdmin(zap) {
      const conta = listaUsuariosCache.find(
        u => String(u.id || u.whatsapp) === String(zap)
      );

      if (!conta) {
        notificar('Conta não encontrada no painel.');
        return;
      }

      senhaAdminZapAtual = String(zap);

      const label = document.getElementById('senhaAdminContaLabel');
      if (label) {
        label.innerHTML =
          `Conta: <strong style="color:var(--text-main)">${adminEscape(String(zap))}</strong><br>` +
          `E-mail: <strong style="color:var(--text-main)">${adminEscape(String(conta.email || 'não cadastrado'))}</strong>`;
      }

      const a = document.getElementById('adminNovaSenha');
      const b = document.getElementById('adminConfirmarSenha');

      if (a) {
        a.value = '';
        a.type = 'password';
      }

      if (b) {
        b.value = '';
        b.type = 'password';
      }

      const modal = document.getElementById('modalSenhaAdmin');
      if (modal) modal.style.display = 'flex';

      setTimeout(() => a?.focus(), 80);
    }

    async function confirmarNovaSenhaAdmin() {
      const zap = senhaAdminZapAtual;
      if (!zap) {
        notificar('Nenhuma conta selecionada.');
        return;
      }

      const conta = listaUsuariosCache.find(
        u => String(u.id || u.whatsapp) === String(zap)
      );

      if (!conta) {
        notificar('Conta não encontrada no painel.');
        return;
      }

      const novaSenha = String(
        document.getElementById('adminNovaSenha')?.value || ''
      );

      const confirmarSenha = String(
        document.getElementById('adminConfirmarSenha')?.value || ''
      );

      if (novaSenha.length < 6) {
        notificar('A nova senha precisa ter pelo menos 6 caracteres.');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        notificar('As duas senhas não são iguais.');
        return;
      }

      if (!(await window.PacoteEMatoDialog.confirmar({
        titulo: 'Alterar senha da conta?',
        mensagem: `Conta: ${zap}\n\nO plano, vencimento e dias restantes serão mantidos exatamente como estão.`,
        confirmar: 'Alterar senha',
        cancelar: 'Cancelar'
      }))) return;

      try {
        const data = await adminWorkerFetch('/admin/alterar-senha', {
          method: 'POST',
          body: JSON.stringify({
            whatsapp: zap,
            novaSenha
          })
        });

        if (data.authUid && conta) {
          conta.authUid = data.authUid;
        }

        fecharModalSenhaAdmin();

        notificar(
          data.mensagem ||
          ' Senha alterada. Plano e dias mantidos.'
        );

        await carregarUsuariosAdmin();

      } catch (e) {
        console.error('Erro alterar senha:', e);
        notificar(e.message || 'Não foi possível alterar a senha.');
      }
    }

    let emailAdminZapAtual = null;

    function fecharModalEmailAdmin() {
      const modal = document.getElementById('modalEmailAdmin');
      if (modal) modal.style.display = 'none';

      const novo = document.getElementById('emailAdminNovo');
      const confirmar = document.getElementById('emailAdminConfirmar');

      if (novo) novo.value = '';
      if (confirmar) confirmar.value = '';

      emailAdminZapAtual = null;
    }

    function editarEmailAdmin(zap) {
      const conta = listaUsuariosCache.find(
        u => String(u.id || u.whatsapp) === String(zap)
      );

      if (!conta) {
        notificar('Conta não encontrada no painel.');
        return;
      }

      emailAdminZapAtual = String(zap);

      const atual = String(conta.email || '').trim().toLowerCase();

      const info = document.getElementById('emailAdminContaInfo');
      if (info) {
        info.innerHTML =
          `Conta: <strong style="color:var(--text-main)">${adminEscape(String(zap))}</strong>`;
      }

      const campoAtual = document.getElementById('emailAdminAtual');
      const campoNovo = document.getElementById('emailAdminNovo');
      const campoConfirmar = document.getElementById('emailAdminConfirmar');

      if (campoAtual) campoAtual.value = atual;
      if (campoNovo) campoNovo.value = '';
      if (campoConfirmar) campoConfirmar.value = '';

      const modal = document.getElementById('modalEmailAdmin');
      if (modal) modal.style.display = 'flex';

      setTimeout(() => campoNovo?.focus(), 80);
    }

    async function confirmarEmailAdmin() {
      const zap = emailAdminZapAtual;

      if (!zap) {
        notificar('Nenhuma conta selecionada.');
        return;
      }

      const conta = listaUsuariosCache.find(
        u => String(u.id || u.whatsapp) === String(zap)
      );

      if (!conta) {
        notificar('Conta não encontrada no painel.');
        return;
      }

      const atual = String(conta.email || '').trim().toLowerCase();
      const emailNovo = String(
        document.getElementById('emailAdminNovo')?.value || ''
      ).trim().toLowerCase();

      const confirmar = String(
        document.getElementById('emailAdminConfirmar')?.value || ''
      ).trim().toLowerCase();

      if (!emailNovo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNovo)) {
        notificar('Digite um e-mail válido.');
        return;
      }

      if (emailNovo !== confirmar) {
        notificar('Os dois campos de e-mail não são iguais.');
        return;
      }

      if (emailNovo === atual) {
        notificar('Esse já é o e-mail atual da conta.');
        return;
      }

      if (!adminTokenAtual) {
        notificar('Sua sessão do Modo Dono expirou. Entre novamente.');
        return;
      }

      const btn = document.getElementById('btnSalvarEmailAdmin');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Salvando...';
      }

      try {
        const data = await adminWorkerFetch('/admin/alterar-email', {
          method: 'POST',
          body: JSON.stringify({
            whatsapp: String(conta.whatsapp || conta.id || zap).replace(/\D/g, ''),
            novoEmail: emailNovo
          })
        });

        conta.email = data.novoEmail || emailNovo;

        fecharModalEmailAdmin();
        notificar(` E-mail alterado para ${conta.email}`);
        await carregarUsuariosAdmin();

      } catch (e) {
        console.error('Erro ao editar e-mail:', e);
        notificar(e.message || 'Erro ao alterar e-mail.');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Salvar novo e-mail';
        }
      }
    }

    async function desconectarAparelhoAdmin(zap) {
      try {
        await adminWorkerFetch('/admin/resetar-aparelho', {
          method: 'POST',
          body: JSON.stringify({ whatsapp: zap })
        });

        notificar(` Celular de ${zap} desconectado. Ele já pode entrar em outro aparelho.`);
        await carregarUsuariosAdmin();
      } catch (e) {
        notificar(e.message || 'Erro ao resetar aparelho.');
      }
    }

    async function ajustarDiasRapido(zap) {
      const diasStr = await globalThis.PacoteEMatoDialog?.solicitarTexto?.({
        titulo: 'Ajustar dias de acesso',
        mensagem: `Informe quantos dias deseja adicionar ou remover para ${zap}. Use, por exemplo, 7 ou -5.`,
        placeholder: 'Ex.: 7 ou -5',
        confirmar: 'Aplicar',
        cancelar: 'Cancelar'
      });
      if (!diasStr) return;

      const dias = parseInt(diasStr, 10);

      if (!Number.isFinite(dias) || dias === 0) {
        notificar('Valor inválido.');
        return;
      }

      try {
        await adminWorkerFetch('/admin/ajustar-dias', {
          method: 'POST',
          body: JSON.stringify({ whatsapp: zap, dias })
        });

        notificar(`Acesso de ${zap} ajustado em ${dias} dias.`);
        await carregarUsuariosAdmin();
      } catch (e) {
        notificar(e.message || 'Erro ao ajustar dias.');
      }
    }

    async function alternarBloqueioUsuario(zap, statusBloqueio) {
      try {
        await adminWorkerFetch('/admin/bloqueio', {
          method: 'POST',
          body: JSON.stringify({
            whatsapp: zap,
            bloqueado: statusBloqueio === true
          })
        });

        notificar(`Usuário ${zap} ${statusBloqueio ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
        await carregarUsuariosAdmin();
      } catch (e) {
        notificar(e.message || 'Erro ao atualizar bloqueio.');
      }
    }

    async function deletarUsuarioAdmin(zap) {
      if (!(await window.PacoteEMatoDialog.confirmar({
        titulo: 'Excluir esta conta?',
        mensagem: `Conta: ${zap}\n\nO usuário também será removido do login seguro quando houver vínculo.`,
        confirmar: 'Excluir conta',
        cancelar: 'Cancelar',
        perigo: true
      }))) return;

      try {
        await adminWorkerFetch('/admin/excluir-usuario', {
          method: 'POST',
          body: JSON.stringify({ whatsapp: zap })
        });

        notificar(`Conta ${zap} excluída com sucesso.`);
        await carregarUsuariosAdmin();
      } catch (e) {
        notificar(e.message || 'Erro ao excluir conta.');
      }
    }

    async function liberarClienteManual() {
      const zap = document.getElementById('inputClienteZap').value.replace(/\D/g, '');
      const diasInput = parseInt(document.getElementById('inputDiasCustom').value, 10);

      if (!validarNumeroWhatsApp(zap)) {
        notificar(' Digite um WhatsApp válido com DDD.');
        return;
      }

      if (!Number.isFinite(diasInput) || diasInput <= 0) {
        notificar(' Informe uma quantidade de dias válida.');
        return;
      }

      try {
        const data = await adminWorkerFetch('/admin/liberar-acesso', {
          method: 'POST',
          body: JSON.stringify({
            whatsapp: zap,
            dias: diasInput
          })
        });

        notificar(
          data.vitalicio
            ? ` Acesso vitalício ativado para ${zap}.`
            : ` ${zap} liberado/renovado por ${diasInput} dias.`
        );

        document.getElementById('inputClienteZap').value = '';

        alternarTabAdmin(
          data.vitalicio
            ? 'vitalicio'
            : diasInput === 30
              ? '30d'
              : diasInput === 90
                ? '90d'
                : 'outros'
        );

        await carregarUsuariosAdmin();
      } catch (e) {
        notificar(e.message || 'Erro ao liberar/renovar acesso.');
      }
    }

    async function salvarBroadcastGlobal(ativo) {
      const txt = document.getElementById('inputBroadcastTexto').value.trim();
      const horas = parseFloat(document.getElementById('selDuracaoAviso').value) || 24;

      if (ativo && !txt) {
        notificar(' Digite o texto do aviso antes de publicar.');
        return;
      }

      try {
        await adminWorkerFetch('/admin/broadcast', {
          method: 'POST',
          body: JSON.stringify({
            ativo: ativo === true,
            mensagem: txt,
            horas
          })
        });

        if (ativo) {
          notificar(` Aviso publicado por ${horas === 99999 ? 'tempo indeterminado' : horas + 'h'}!`);
        } else {
          document.getElementById('inputBroadcastTexto').value = '';
          notificar('Aviso global removido.');
        }
      } catch (e) {
        console.error('Erro broadcast:', e);
        notificar(e.message || 'Erro ao salvar comunicado.');
      }
    }

    function iniciarMonitoramentoBroadcast() {
      db.collection("sistema_config").doc("broadcast").onSnapshot(doc => {
        let banner = document.getElementById('bannerBroadcast');
        if (doc.exists) {
          let data = doc.data();
          let agora = Date.now();

          if (data.ativo && data.mensagem && (agora <= data.expiraEm || !data.expiraEm)) {
            banner.innerHTML = `<span style="font-size:1.1rem; vertical-align:middle;"></span> <b>AVISO GERAL:</b> ${data.mensagem}`;
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        } else {
          banner.style.display = 'none';
        }
      });
    }

    // ==========================================
    // HISTÓRICO DE ROTAS LOCAIS DO MOTORISTA
    // ==========================================

    const HIST_DB_NOME = 'pacote_e_mato_historico_db';
    const HIST_DB_VERSAO = 1;
    const HIST_STORE = 'enderecos_rotas';

    function abrirHistoricoDB() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(HIST_DB_NOME, HIST_DB_VERSAO);

        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(HIST_STORE)) {
            db.createObjectStore(HIST_STORE, { keyPath: 'id' });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error || new Error('Falha ao abrir histórico local.'));
      });
    }

    async function salvarEnderecosHistoricoDB(id, enderecos) {
      if (!id || !Array.isArray(enderecos)) return;

      try {
        const db = await abrirHistoricoDB();

        await new Promise((resolve, reject) => {
          const tx = db.transaction(HIST_STORE, 'readwrite');
          tx.objectStore(HIST_STORE).put({
            id,
            enderecos,
            salvoEm: Date.now()
          });
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });

        db.close();
      } catch (e) {
        console.warn('Não foi possível salvar endereços no IndexedDB:', e);
      }
    }

    async function lerEnderecosHistoricoDB(id) {
      if (!id) return [];

      try {
        const db = await abrirHistoricoDB();

        const resultado = await new Promise((resolve, reject) => {
          const tx = db.transaction(HIST_STORE, 'readonly');
          const req = tx.objectStore(HIST_STORE).get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });

        db.close();
        return Array.isArray(resultado?.enderecos) ? resultado.enderecos : [];
      } catch (e) {
        console.warn('Não foi possível ler endereços do IndexedDB:', e);
        return [];
      }
    }

    // V71 - metadados estruturais da rota importada por PDF.
    // Se o PDF não trouxer códigos BR, ainda preservamos as entregas/paradas
    // para visualização e roteirização, mas a câmera de bipagem fica desativada.
    let entregasOriginaisPorEndereco = {};
    let paradaFisicaPorEndereco = {};
    let totalEntregasPdfAtual = 0;
    let pdfSemCodigosBipagem = false;

    function montarDadosEnderecosHistorico() {
      return Object.keys(mapaRotas || {})
        .map(chave => ({
          endereco: nomeExibicao[chave] || chave,
          pacotes: Array.isArray(mapaRotas[chave]) ? mapaRotas[chave].length : 0,
          stops: Array.isArray(mapaRotas[chave])
            ? [...new Set(
                mapaRotas[chave]
                  .map(codigo => stopCorrespondente[codigo])
                  .filter(n => Number.isFinite(Number(n)))
                  .map(Number)
              )].sort((a,b) => a-b)
            : []
        }))
        .sort((a, b) => {
          const pa = a.stops.length ? a.stops[0] : 999999;
          const pb = b.stops.length ? b.stops[0] : 999999;
          return pa - pb;
        });
    }

    function salvarOuAtualizarHistoricoRota(
      nomeRota,
      totalPacotes,
      totalParadas,
      concluida = false,
      duracaoMs = null
    ) {
      let hist = JSON.parse(localStorage.getItem('historico_rotas_usuario') || '[]');

      const nomeLimpo = limparNomeArquivoRota(nomeRota);
      const enderecos = montarDadosEnderecosHistorico();
      const paradasMultiplas = enderecos.filter(item => item.pacotes > 1).length;

      const idRota =
        chaveStorageAtual ||
        `rota_${nomeLimpo}_${totalPacotes}_${totalParadas}`;

      const dadosLeves = {
        id: idRota,
        nome: nomeLimpo,
        data: new Date().toLocaleDateString('pt-BR') + ' ' +
              new Date().toLocaleTimeString('pt-BR').substring(0,5),
        pacotes: totalPacotes,
        paradas: totalParadas,
        paradasMultiplas,
        duracaoMs: Number.isFinite(duracaoMs) ? duracaoMs : null,
        status: concluida ? 'concluida' : 'em_andamento',
        bipados: pacotesBipados.size,
        temEnderecos: enderecos.length > 0
      };

      const indice = hist.findIndex(h => h && h.id === idRota);

      if (indice >= 0) {
        hist[indice] = {
          ...hist[indice],
          ...dadosLeves,
          data: hist[indice].data || dadosLeves.data
        };

        const atualizada = hist.splice(indice, 1)[0];
        hist.unshift(atualizada);
      } else {
        hist.unshift(dadosLeves);
      }

      if (hist.length > 20) hist = hist.slice(0, 20);

      // Metadados pequenos e rápidos.
      localStorage.setItem('historico_rotas_usuario', JSON.stringify(hist));

      // Endereços completos ficam fora do localStorage e são gravados de forma assíncrona.
      salvarEnderecosHistoricoDB(idRota, enderecos);
    }

    // Compatibilidade com chamadas antigas.
    function salvarHistoricoRotaConcluida(nomeRota, totalPacotes, totalParadas, duracaoMs = null) {
      salvarOuAtualizarHistoricoRota(
        nomeRota,
        totalPacotes,
        totalParadas,
        true,
        duracaoMs
      );
    }

    function escaparHtmlHistorico(texto) {
      return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    let historicoCacheVisual = [];

    async function toggleEnderecosHistorico(indice) {
      const box = document.getElementById(`histEnderecos_${indice}`);
      const btn = document.getElementById(`histBtn_${indice}`);
      if (!box || !btn) return;

      const aberto = box.style.display !== 'none';

      if (aberto) {
        box.style.display = 'none';
        btn.textContent = 'Ver endereços';
        return;
      }

      if (!box.dataset.carregado) {
        const h = historicoCacheVisual[indice] || {};

        btn.disabled = true;
        btn.textContent = 'Carregando endereços...';

        let enderecos = [];

        // Compatibilidade com rotas antigas que ainda têm endereços dentro do localStorage.
        if (Array.isArray(h.enderecos) && h.enderecos.length) {
          enderecos = h.enderecos;

          // Migra em segundo plano para o formato novo.
          if (h.id) salvarEnderecosHistoricoDB(h.id, enderecos);
        } else {
          enderecos = await lerEnderecosHistoricoDB(h.id);
        }

        if (!enderecos.length) {
          box.innerHTML =
            '<div class="hist-sem-endereco">Esta rota não possui endereços salvos nesta versão.</div>';
        } else {
          box.innerHTML = enderecos.map((item, idx) => {
            const stops = Array.isArray(item.stops) && item.stops.length
              ? item.stops.map(n => `P${n}`).join('-')
              : `#${idx + 1}`;

            const qtdPacotes = Number(item.pacotes || 0);
            const tag = qtdPacotes > 1
              ? `<span class="hist-multi-tag">${qtdPacotes} pacotes</span>`
              : '';

            return `
              <div class="hist-endereco-item">
                <div class="hist-endereco-stop">${escaparHtmlHistorico(stops)}</div>
                <div class="hist-endereco-texto">${escaparHtmlHistorico(item.endereco || '')}</div>
                ${tag}
              </div>
            `;
          }).join('');
        }

        box.dataset.carregado = '1';
        btn.disabled = false;
      }

      box.style.display = 'block';
      btn.textContent = 'Ocultar endereços';
    }

    function abrirModalHistorico() {
      let hist = JSON.parse(localStorage.getItem('historico_rotas_usuario') || '[]');
      hist = hist.slice(0, 15);
      historicoCacheVisual = hist;

      let container = document.getElementById('listaHistoricoRotas');

      if (hist.length === 0) {
        container.innerHTML =
          "<div style='font-size:0.75rem; color:#888; text-align:center;'>Nenhuma rota salva no histórico ainda.</div>";
      } else {
        container.innerHTML = hist.map((h, indice) => {
          const nome = escaparHtmlHistorico(limparNomeArquivoRota(h.nome || 'Rota'));
          const data = escaparHtmlHistorico(h.data || '');
          const pacotes = Number(h.pacotes || 0);
          const paradas = Number(h.paradas || 0);
          const multiplas = Number(h.paradasMultiplas || 0);
          const statusTexto = h.status === 'concluida' ? 'Concluída' : 'Em andamento';
          const statusClasse = h.status === 'concluida' ? 'concluida' : 'andamento';

          return `
            <div class="hist-rota-card">
              <div class="hist-rota-top">
                <div style="min-width:0;">
                  <div class="hist-rota-nome"> ${nome}</div>
                  <div class="hist-status ${statusClasse}">${statusTexto}</div>
                </div>
                <div class="hist-rota-data">${data}</div>
              </div>

              <div class="hist-rota-metricas">
                <div><strong>${pacotes}</strong><span>Pacotes</span></div>
                <div><strong>${paradas}</strong><span>Paradas</span></div>
                <div><strong>${multiplas}</strong><span>Múltiplas</span></div>
              </div>

              <button
                type="button"
                class="hist-enderecos-btn"
                id="histBtn_${indice}"
                onclick="toggleEnderecosHistorico(${indice})">
                Ver endereços
              </button>

              <div
                class="hist-enderecos-lista"
                id="histEnderecos_${indice}"
                data-carregado=""
                style="display:none;">
              </div>
            </div>
          `;
        }).join('');
      }

      document.getElementById('modalHistoricoRotas').style.display = 'flex';
    }

    function fecharModalHistorico() {
      document.getElementById('modalHistoricoRotas').style.display = 'none';
    }

    // ==========================================
    // CONTROLE PWA E HARDWARE
    // ==========================================
    if ('serviceWorker' in navigator) {
      const swCode = `
        self.addEventListener('install', e => self.skipWaiting());
        self.addEventListener('activate', e => clients.claim());
        self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
      `;
      const blob = new Blob([swCode], { type: 'text/javascript' });
      navigator.serviceWorker.register(URL.createObjectURL(blob)).catch(() => {});
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // V72 - marca a versão realmente carregada e remove resíduos de cache antigos.
    // Isso ajuda a evitar que o WebView continue executando V69/V70 depois de
    // uma atualização do GitHub Pages. Não apaga dados operacionais do usuário.
    try {
      window.PEMATO_BUILD = '72';
      localStorage.setItem('pemato_build_carregado', '72');
      if ('caches' in window) {
        caches.keys().then(chaves => Promise.all(chaves.map(chave => caches.delete(chave)))).catch(() => {});
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then(regs =>
          Promise.all(regs.map(reg => reg.unregister()))
        ).catch(() => {});
      }
    } catch (_) {}

    let html5QrCode = null;
    let sensorAtual = "environment";
    let flashLigado = false;
    let processandoTroca = false;

    // Estado principal centralizado em js/state.js.
    // Os nomes legados continuam disponíveis como propriedades globais vinculadas ao appState,
    // preservando o comportamento do sistema atual sem refatorar regras nesta etapa.

    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }


    function limparNomeArquivoRota(nome) {
      let texto = String(nome || 'Rota salva').trim();

      try {
        texto = decodeURIComponent(texto);
      } catch (_) {}

      // Remove prefixo interno, caso tenha vindo da chave do localStorage.
      texto = texto.replace(/^bipados_/i, '');

      // Remove sufixo numérico interno usado para diferenciar arquivo/tamanho.
      // Ex.: "rota (20).pdf_101720" -> "rota (20).pdf"
      texto = texto.replace(/(\.pdf)_\d+$/i, '$1');

      // Se por acaso vier qualquer conteúdo após ".pdf", conserva só o nome do PDF.
      const pdfMatch = texto.match(/^(.*?\.pdf)/i);
      if (pdfMatch) texto = pdfMatch[1];

      return texto || 'Rota salva';
    }

    function calcularParadasSalvas(mapa) {
      try {
        return Object.keys(mapa || {}).length;
      } catch (_) {
        return 0;
      }
    }

    function atualizarResumoRotaHome() {
      const card = document.getElementById('resumoRotaHome');
      if (!card) return;

      const dadosSalvos = localStorage.getItem('rota_ativa_completa');

      if (dadosSalvos) {
        try {
          const rota = JSON.parse(dadosSalvos);
          const total = Array.isArray(rota.todosPacotes) ? rota.todosPacotes.length : 0;
          const feitos = Array.isArray(rota.pacotesBipados) ? rota.pacotesBipados.length : 0;

          if (total > 0) {
            const faltam = Math.max(0, total - feitos);
            const paradas = calcularParadasSalvas(rota.mapaRotas);
            const pct = Math.max(0, Math.min(100, Math.round((feitos / total) * 100)));
            const concluida = feitos >= total;

            document.getElementById('resumoRotaTitulo').textContent =
              concluida ? 'ÚLTIMA ROTA CONCLUÍDA' : 'RESUMO DA ROTA ATUAL';

            document.getElementById('resumoRotaArquivo').textContent =
              limparNomeArquivoRota(rota.nomeArquivo || 'Rota salva');

            document.getElementById('resumoRotaStatus').textContent =
              concluida ? 'Concluída' : 'Em andamento';

            document.getElementById('resumoRotaBipados').textContent =
              `${feitos} / ${total}`;

            document.getElementById('resumoRotaParadas').textContent =
              paradas;

            document.getElementById('resumoRotaFaltam').textContent =
              faltam;

            document.getElementById('resumoRotaPercentual').textContent =
              `${pct}% concluído`;

            document.getElementById('resumoRotaBarra').style.width =
              `${pct}%`;

            let rodape = concluida ? ' Rota concluída' : ' Rota em andamento';

            if (concluida && rota.rotaInicioEm && rota.salvoEm) {
              rodape += ` • ${formatarDuracaoRota(Math.max(0, rota.salvoEm - rota.rotaInicioEm))}`;
            }

            document.getElementById('resumoRotaRodape').textContent = rodape;
            card.style.display = 'block';
            return;
          }
        } catch (_) {}
      }

      // Sem rota ativa: se existir histórico, mostra a última concluída.
      try {
        const hist = JSON.parse(localStorage.getItem('historico_rotas_usuario') || '[]');
        const ultima = hist && hist[0];

        if (ultima) {
          document.getElementById('resumoRotaTitulo').textContent = 'ÚLTIMA ROTA CONCLUÍDA';
          document.getElementById('resumoRotaArquivo').textContent =
            limparNomeArquivoRota(ultima.nome || 'Rota concluída');
          document.getElementById('resumoRotaStatus').textContent = 'Concluída';
          document.getElementById('resumoRotaBipados').textContent = `${ultima.pacotes} / ${ultima.pacotes}`;
          document.getElementById('resumoRotaParadas').textContent = ultima.paradas || 0;
          document.getElementById('resumoRotaFaltam').textContent = 0;
          document.getElementById('resumoRotaPercentual').textContent = '100% concluído';
          document.getElementById('resumoRotaBarra').style.width = '100%';

          document.getElementById('resumoRotaRodape').textContent =
            ultima.duracaoMs
              ? ` Rota concluída • ${formatarDuracaoRota(ultima.duracaoMs)}`
              : ' Rota concluída';

          card.style.display = 'block';
          return;
        }
      } catch (_) {}

      card.style.display = 'none';
    }

    function verificarRotaSalvaAnterior() {
      let dadosSalvos = localStorage.getItem('rota_ativa_completa');
      let cardRetomar = document.getElementById('cardRetomarRota');
      if (dadosSalvos) {
        try {
          let parsed = JSON.parse(dadosSalvos);
          if (Number(parsed.versaoLeitura || 0) < 72) {
            // V64 corrige a leitura/contagem do PDF. Um snapshot antigo pode conter
            // pacote fantasma; por isso a rota ativa antiga precisa ser reimportada.
            localStorage.removeItem('rota_ativa_completa');
            cardRetomar.style.display = 'none';
            atualizarResumoRotaHome();
            return;
          }
          if (Object.keys(parsed.mapaRotas || {}).length > 0) {
            document.getElementById('txtNomeRotaSalva').innerText =
              limparNomeArquivoRota(parsed.nomeArquivo || 'Rota');
            cardRetomar.style.display = 'block';
            document.getElementById('btnVerParadasModal').style.display = 'none';
            atualizarResumoRotaHome();
            return;
          }
        } catch(e) {}
      }
      cardRetomar.style.display = 'none';
      atualizarResumoRotaHome();
    }

    function salvarEstadoCompletoRota(nomeArquivo) {
      let dados = {
        nomeArquivo: nomeArquivo || (chaveStorageAtual ? chaveStorageAtual.replace('bipados_', '') : 'Rota Salva'),
        chaveStorage: chaveStorageAtual,
        mapaRotas: mapaRotas,
        stopCorrespondente: stopCorrespondente,
        nomeExibicao: nomeExibicao,
        entregasOriginaisPorEndereco: entregasOriginaisPorEndereco,
        paradaFisicaPorEndereco: paradaFisicaPorEndereco,
        totalEntregasPdfAtual: totalEntregasPdfAtual,
        pdfSemCodigosBipagem: pdfSemCodigosBipagem === true,
        todosPacotes: Array.from(todosPacotes),
        pacotesBipados: Array.from(pacotesBipados),
        rotaInicioEm: rotaInicioEm || Date.now(),
        resumoFinalJaExibido: resumoFinalJaExibido === true,
        versaoLeitura: 72,
        salvoEm: Date.now()
      };
      localStorage.setItem('rota_ativa_completa', JSON.stringify(dados));
    }

    function retomarRotaAnterior() {
      let dadosSalvos = localStorage.getItem('rota_ativa_completa');
      if (!dadosSalvos) return;

      try {
        let parsed = JSON.parse(dadosSalvos);
        if (Number(parsed.versaoLeitura || 0) < 72) {
          localStorage.removeItem('rota_ativa_completa');
          notificar('A leitura do PDF foi atualizada. Importe o arquivo novamente para usar a contagem corrigida.');
          return;
        }
        mapaRotas = parsed.mapaRotas || {};
        stopCorrespondente = parsed.stopCorrespondente || {};
        nomeExibicao = parsed.nomeExibicao || {};
        entregasOriginaisPorEndereco = parsed.entregasOriginaisPorEndereco || {};
        paradaFisicaPorEndereco = parsed.paradaFisicaPorEndereco || {};
        totalEntregasPdfAtual = Number(parsed.totalEntregasPdfAtual || 0);
        pdfSemCodigosBipagem = parsed.pdfSemCodigosBipagem === true;
        todosPacotes = new Set(parsed.todosPacotes || []);
        pacotesBipados = new Set(parsed.pacotesBipados || []);
        chaveStorageAtual = parsed.chaveStorage;
        rotaInicioEm = Number(parsed.rotaInicioEm || parsed.salvoEm || Date.now());
        resumoFinalJaExibido = parsed.resumoFinalJaExibido === true;

        document.getElementById('btnUploadTxt').innerHTML = " " + (parsed.nomeArquivo || 'Rota Retomada');
        document.getElementById('btnVerParadasModal').style.display = 'flex';

        document.getElementById('areaExecucao').style.display = 'block';
        entrarModoRotaAtiva();
document.getElementById('cardRetomarRota').style.display = 'none';

        aplicarModoBipagemPdfAtual();
        atualizarStats();
        if (!pdfSemCodigosBipagem) iniciarScanner();
        notificar(" Rota anterior retomada!");

      } catch(e) {
        notificar("Erro ao carregar a rota anterior.");
      }
    }


    function entrarModoRotaAtiva() {
      const upload = document.getElementById('elSecaoUpload');
      const toolbar = document.getElementById('toolbarRotaAtiva');
      const retomar = document.getElementById('cardRetomarRota');
      const resumoHome = document.getElementById('resumoRotaHome');

      if (upload) upload.style.display = 'none';
      if (toolbar) toolbar.style.display = 'grid';
      if (retomar) retomar.style.display = 'none';
      if (resumoHome) resumoHome.style.display = 'none';
    }

    async function voltarAoInicioRota() {
      // Preserva a rota e as bipagens para poder retomar depois.
      try { salvarEstadoCompletoRota(); } catch (_) {}
      try { await finalizarCameraHardware(); } catch (_) {}

      const exec = document.getElementById('areaExecucao');
      const upload = document.getElementById('elSecaoUpload');
      const toolbar = document.getElementById('toolbarRotaAtiva');
      const card = document.getElementById('cardResult');
      const aviso = document.getElementById('boxAviso');

      if (exec) exec.style.display = 'none';
      if (upload) upload.style.display = 'block';
      if (toolbar) toolbar.style.display = 'none';
      if (card) card.style.display = 'none';
      if (aviso) aviso.style.display = 'none';

      const resumoHome = document.getElementById('resumoRotaHome');
      if (resumoHome) resumoHome.style.display = 'none';

      const btnVis = document.getElementById('btnVerParadasModal');
      if (btnVis) btnVis.style.display = 'none';

      verificarRotaSalvaAnterior();
      atualizarResumoRotaHome();

      const btn = document.getElementById('btnUploadTxt');
      if (btn) btn.innerHTML = ' Escolher outro PDF';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function abrirModalRota() {
      filtroAtualModal = 'todos';
      document.getElementById('filtroTabTodos').classList.add('active');
      document.getElementById('filtroTabDuplos').classList.remove('active');
      renderizarListaParadasModal();
      document.getElementById('modalVisualizarRota').style.display = 'flex';
    }

    function fecharModalRota() {
      document.getElementById('modalVisualizarRota').style.display = 'none';
    }

    function filtrarParadasModal(filtro) {
      filtroAtualModal = filtro;
      if (filtro === 'todos') {
        document.getElementById('filtroTabTodos').classList.add('active');
        document.getElementById('filtroTabDuplos').classList.remove('active');
      } else {
        document.getElementById('filtroTabDuplos').classList.add('active');
        document.getElementById('filtroTabTodos').classList.remove('active');
      }
      renderizarListaParadasModal();
    }

    function renderizarListaParadasModal() {
      const container = document.getElementById('listaParadasModal');
      container.innerHTML = '';

      const chaves = Object.keys(mapaRotas || {});
      if (!chaves.length) {
        container.innerHTML = "<div style='font-size:0.8rem; color:var(--text-muted); text-align:center;'>Nenhuma rota carregada no momento.</div>";
        return;
      }

      const grupos = chaves
        .map((end, indice) => {
          const pacotes = Array.isArray(mapaRotas[end]) ? mapaRotas[end].slice() : [];
          const entregasPdf = [...new Set(
            (entregasOriginaisPorEndereco[end] || [])
              .map(Number)
              .filter(Number.isFinite)
          )].sort((a,b) => a-b);

          let numeroFisico = Number(paradaFisicaPorEndereco[end]);
          if (!Number.isFinite(numeroFisico) || numeroFisico <= 0) {
            const stops = pacotes
              .map(p => Number(stopCorrespondente[p]))
              .filter(n => Number.isFinite(n) && n > 0);
            numeroFisico = stops.length ? Math.min(...stops) : indice + 1;
          }

          return {
            end,
            endereco: nomeExibicao[end] || end,
            pacotes,
            entregasPdf,
            numeroFisico,
            quantidadeEntregas: entregasPdf.length || Math.max(1, pacotes.length)
          };
        })
        .sort((a,b) => a.numeroFisico - b.numeroFisico);

      let totalParadasMultiplas = 0;
      let totalEntregasMultiplas = 0;
      const cards = [];

      grupos.forEach(dados => {
        const ehMultipla = dados.quantidadeEntregas > 1;
        if (ehMultipla) {
          totalParadasMultiplas++;
          totalEntregasMultiplas += dados.quantidadeEntregas;
        }

        if (filtroAtualModal === 'duplos' && !ehMultipla) return;

        const origemTexto = dados.entregasPdf.length
          ? dados.entregasPdf.join(' · ')
          : '';

        let badge;
        if (ehMultipla) {
          const detalhePacotes = !pdfSemCodigosBipagem && dados.pacotes.length
            ? ` • ${dados.pacotes.length} pacote${dados.pacotes.length === 1 ? '' : 's'}`
            : '';
          const entregasJuntas = origemTexto
            ? `<div style="margin-top:5px;font-size:.76rem;font-weight:900;letter-spacing:.01em;">ENTREGAS ${origemTexto} JUNTAS</div>`
            : '';
          badge = `<div class="tag-duplo-info">PARADA MÚLTIPLA • ${dados.quantidadeEntregas} entregas${detalhePacotes}${entregasJuntas}</div>`;
        } else {
          badge = `<div style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">${pdfSemCodigosBipagem ? '1 entrega' : `${Math.max(1, dados.pacotes.length)} pacote${dados.pacotes.length === 1 ? '' : 's'}`}</div>`;
        }

        const enderecoUrl = encodeURIComponent(String(dados.endereco || '')).replace(/'/g, '%27');

        cards.push(`
          <div class="parada-box-pro ${ehMultipla ? 'duplo-pro' : ''}">
            <div class="parada-header-row" style="align-items:flex-start; gap:10px;">
              <div style="
                min-width:34px;height:34px;border-radius:12px;
                display:flex;align-items:center;justify-content:center;
                background:rgba(46,160,101,.13);font-weight:900;font-size:.9rem;
                color:var(--primary, #2ea065);">
                ${dados.numeroFisico}
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:.72rem;font-weight:900;color:var(--text-muted);margin-bottom:5px;">
                  PARADA ${dados.numeroFisico}
                </div>
                ${badge}
              </div>
            </div>

            <div class="endereco-texto-pro">${dados.endereco}</div>

            ${origemTexto && !ehMultipla ? `
              <div style="margin-top:7px;font-size:.72rem;color:var(--text-muted);font-weight:700;">
                Entrega do PDF: ${origemTexto}
              </div>
            ` : ''}

            <div class="acoes-footer-pro">
              <button class="btn-acao-card" onclick="perguntarGps(decodeURIComponent('${enderecoUrl}'), 'P${dados.numeroFisico}')">
                Waze / Maps
              </button>
            </div>
          </div>
        `);
      });

      document.getElementById('contadorTodos').innerText = grupos.length;
      document.getElementById('contadorDuplos').innerText = totalParadasMultiplas;

      const totalPacotes = todosPacotes?.size || 0;
      const totalEntregas = Number(totalEntregasPdfAtual || 0) ||
        grupos.reduce((s,g) => s + g.quantidadeEntregas, 0);

      const contagemTopo = document.getElementById('rotaModalContagem');
      if (contagemTopo) {
        contagemTopo.textContent = pdfSemCodigosBipagem
          ? `${grupos.length} paradas • ${totalEntregas} entregas • sem códigos BR`
          : `${grupos.length} paradas • ${totalPacotes} pacotes`;
      }

      const resumo = document.getElementById('resumoMultiplosRota');
      if (resumo) {
        resumo.innerText = pdfSemCodigosBipagem
          ? `${grupos.length} paradas • ${totalEntregas} entregas • ${totalParadasMultiplas} múltiplas (${totalEntregasMultiplas} entregas)`
          : `${grupos.length} paradas • ${totalPacotes} pacotes • ${totalParadasMultiplas} múltiplas (${totalEntregasMultiplas} entregas)`;
      }

      if (!cards.length) {
        container.innerHTML = "<div style='font-size:0.8rem; color:var(--text-muted); text-align:center; padding:20px;'>Nenhuma parada múltipla encontrada nesta rota.</div>";
      } else {
        container.innerHTML = cards.join('');
      }
    }

    function perguntarGps(endereco, paradaNome) {
      enderecoSelecionadoGps = endereco;
      document.getElementById('tituloGpsParada').innerText = `Navegar para Parada ${paradaNome}`;
      document.getElementById('modalEscolhaGps').style.display = 'flex';
    }

    function fecharModalGps() {
      document.getElementById('modalEscolhaGps').style.display = 'none';
    }

    function abrirGpsSelecionado(app) {
      let query = encodeURIComponent(enderecoSelecionadoGps);
      if (app === 'waze') {
        window.open(`https://waze.com/ul?q=${query}&navigate=yes`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
      }
      fecharModalGps();
    }

    function toggleSidebar() {
      let sb = document.getElementById('sidebar');
      let ov = document.getElementById('overlay');
      if (sb.classList.contains('active')) {
        sb.classList.remove('active');
        ov.style.display = 'none';
      } else {
        sb.classList.add('active');
        ov.style.display = 'block';
      }
    }

    async function ativarWakeLock() {
      try { if ('wakeLock' in navigator) await navigator.wakeLock.request('screen'); } catch(e) {}
    }
    ativarWakeLock();

    function scannerOperacaoAtiva() {
      try { return window.PacoteEMatoOperacoesPacotes?.estaAtiva?.() === true; } catch (_) { return false; }
    }

    function scannerReaderIdAtual() { return scannerOperacaoAtiva() ? 'pkgOpReader' : 'reader'; }
    function scannerViewportAtual() { return document.getElementById(scannerOperacaoAtiva() ? 'pkgOpCameraViewport' : 'elCameraViewport'); }
    function scannerFlashBtnAtual() { return document.getElementById(scannerOperacaoAtiva() ? 'pkgOpBtnFlash' : 'btn-flash'); }
    function scannerFlashTextAtual() { return document.getElementById(scannerOperacaoAtiva() ? 'pkgOpTxtFlash' : 'txt-flash'); }

    async function finalizarCameraHardware() {
      if (html5QrCode) {
        try {
          if (html5QrCode.isScanning) await html5QrCode.stop();
          await html5QrCode.clear();
        } catch(e) {}
        html5QrCode = null;
      }
      let videoEl = document.querySelector(`#${scannerReaderIdAtual()} video`) || document.querySelector('#reader video') || document.querySelector('#pkgOpReader video');
      if (videoEl && videoEl.srcObject) {
        try { videoEl.srcObject.getTracks().forEach(t => t.stop()); } catch(e) {}
      }
      const reader = document.getElementById(scannerReaderIdAtual());
      if (reader) reader.innerHTML = '';
    }

    async function iniciarScanner() {
      if (processandoTroca) return;
      processandoTroca = true;

      await finalizarCameraHardware();
      await new Promise(r => setTimeout(r, 150));

      const readerId = scannerReaderIdAtual();
      const readerEl = document.getElementById(readerId);
      if (!readerEl) { processandoTroca = false; return; }
      html5QrCode = new Html5Qrcode(readerId);

      const config = {
        fps: 12,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      try {
        await html5QrCode.start({ facingMode: sensorAtual }, config, (txt) => { processarCodigo(txt); }, (err) => {});
        processandoTroca = false;
      } catch (e) {
        processandoTroca = false;
      }
    }

    async function alternarCamera() {
      if (processandoTroca) return;
      sensorAtual = (sensorAtual === "environment") ? "user" : "environment";
      let btnFlash = scannerFlashBtnAtual();
      if (sensorAtual === "user") {
        if (btnFlash) btnFlash.style.display = 'none';
      } else {
        if (btnFlash) btnFlash.style.display = 'flex';
        btnFlash?.classList.remove('active-flash');
        flashLigado = false;
        const txt = scannerFlashTextAtual(); if (txt) txt.innerText = 'Flash';
      }
      await iniciarScanner();
    }

    async function alternarFlash() {
      if (sensorAtual === "user" || !html5QrCode) return;
      try {
        flashLigado = !flashLigado;
        await html5QrCode.applyVideoConstraints({ advanced: [{ torch: flashLigado }] });
        let btnFlash = scannerFlashBtnAtual();
        const txtFlash = scannerFlashTextAtual();
        if (flashLigado) {
          btnFlash?.classList.add('active-flash');
          if (txtFlash) txtFlash.innerText = 'On';
        } else {
          btnFlash?.classList.remove('active-flash');
          if (txtFlash) txtFlash.innerText = 'Flash';
        }
      } catch(e) {}
    }

    function removerAcentosEndereco(texto) {
      return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    function extrairEnderecoExibicao(texto) {
      if (!texto) return '';

      let t = String(texto).replace(/\s+/g, ' ').trim();

      // Remove número da parada no começo.
      t = t.replace(/^\s*\d{1,3}\s+/, '');

      // Remove código do pacote e qualquer conteúdo posterior.
      t = t.replace(/\s+B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}[A-Za-z0-9].*$/i, '');

      // Remove horário no fim da parte do endereço.
      t = t.replace(/\s+\d{1,2}:\d{2}\s*$/, '');

      return t.trim();
    }

    function normalizarTokenLogradourorota(token) {
      const mapa = {
        'doutor':'dr', 'dr':'dr',
        'doutora':'dra', 'dra':'dra',
        'professor':'prof', 'prof':'prof',
        'professora':'profa', 'profa':'profa',
        'engenheiro':'eng', 'eng':'eng',
        'engenheira':'enga', 'enga':'enga',
        'desembargador':'des', 'des':'des',
        'comendador':'com', 'com':'com',
        'coronel':'cel', 'cel':'cel',
        'capitao':'cap', 'cap':'cap',
        'tenente':'ten', 'ten':'ten',
        'padre':'pe', 'pe':'pe',
        'frei':'frei',
        'santa':'sta', 'sta':'sta',
        'santo':'sto', 'sto':'sto',
        'barao':'br', 'br':'br',
        'baronesa':'brsa', 'brsa':'brsa',
        'vereador':'ver', 'ver':'ver',
        'deputado':'dep', 'dep':'dep',
        'dom':'dom',
        'dona':'dona'
      };
      return mapa[token] || token;
    }

    function decomporEnderecorota(texto) {
      if (!texto) return null;

      const original = extrairEnderecoExibicao(texto);

      let t = removerAcentosEndereco(original)
        .toLowerCase()
        .replace(/[º°ª]/g, '')
        .replace(/[;|]/g, ',')
        .replace(/\s+/g, ' ')
        .trim();

      // Normaliza somente o tipo de via. Complementos continuam intactos.
      t = t
        .replace(/\bavenida\b/g, ' av ')
        .replace(/\bav\.?\b/g, ' av ')
        .replace(/\brua\b/g, ' r ')
        .replace(/\br\.?\b/g, ' r ')
        .replace(/\balameda\b/g, ' al ')
        .replace(/\btravessa\b/g, ' tv ')
        .replace(/\bestrada\b/g, ' est ')
        .replace(/\brodovia\b/g, ' rod ')
        .replace(/\bpraca\b/g, ' pca ')
        .replace(/\blargo\b/g, ' lg ')
        .replace(/\bviela\b/g, ' vl ')
        .replace(/\bpassagem\b/g, ' psg ')
        .replace(/\s+/g, ' ')
        .trim();


      // ============================================================
      // V16 - RECUPERA ENDEREÇOS COLADOS DO rota
      // Alguns PDFs chegam assim:
      // marquesvalencaapto113bsaopaulo_595
      // mqvalencaapto93asaopaulo_595
      //
      // Recupera rua + número antes do agrupamento físico.
      // ============================================================
      if (!t.includes(',')) {
        const partesSublinhado = t.split('_');
        if (partesSublinhado.length > 1) {
          const numeroFinal = partesSublinhado.pop().replace(/\D/g,'');
          const corpo = partesSublinhado.join(' ');

          t = corpo
            .replace(/(apto|apartamento|apt|ap|bloco|bl|torre|sala|casa|fundos|lado).*/i, '')
            .trim()
            + ', '
            + numeroFinal;
        }
      }

      const numeroEnderecoPattern = '(\\d{1,6}|s\\s*\\/?\\s*n|sem\\s+numero)';

      let m = t.match(
        new RegExp('(?:^|\\s)(?:r|av|al|tv|est|rod|pca|lg|vl|psg)\\s+(.+?)\\s*,\\s*' + numeroEnderecoPattern + '(.*)$', 'i')
      );

      if (!m) {
        m = t.match(
          new RegExp('^(.+?)\\s*,\\s*' + numeroEnderecoPattern + '(.*)$', 'i')
        );
      }

      if (!m) return null;

      let ruaBruta = m[1]
        .replace(/^(?:r|av|al|tv|est|rod|pca|lg|vl|psg)\s+/i, '')
        .replace(/[.,\-_/]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const numeroBruto = String(m[2] || '').trim().toLowerCase();

      const numero = /^(?:s\s*\/?\s*n|sem\s+numero)$/i.test(numeroBruto)
        ? 'sn'
        : numeroBruto.replace(/\D/g, '');

      if (!ruaBruta || !numero) return null;

      // Complementos de unidade fazem parte da identidade física.
      // Ex: Apt 12 != Apt 13
      let complemento = String(m[3] || '')
        .replace(/^[,\s]+/, '')
        .replace(/[.,\-_/]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const normalizarTokens = (valor) =>
        valor.split(/\s+/)
          .filter(Boolean)
          .filter(token => !['da','de','do','das','dos','e'].includes(token))
          .map(normalizarTokenLogradourorota)
          .filter(Boolean);

      const tokensRua = normalizarTokens(ruaBruta);
      const tokensComplemento = normalizarTokens(complemento);

      if (!tokensRua.length) return null;

      return {
        original,
        numero,
        tokens: [...tokensRua, ...tokensComplemento],
        tokensRua,
        complemento,
        ruaCanonica: tokensRua.join(' '),
        complementoCanonico: tokensComplemento.join(' ')
      };
    }

    function normalizarEndereco(texto) {
      const d = decomporEnderecorota(texto);
      if (!d) return "";

      // CORREÇÃO V12:
      // Parada é o imóvel: LOGRADOURO + NÚMERO.
      // Apartamento, bloco, torre, sala e complementos não criam nova parada.
      // Também remove abreviações comuns do rota.
      const aliases = {
        'mq': 'marques',
        'cnsl': 'conselheiro',
        'cnsol': 'conselheiro',
        'fr': 'frei',
        'p': 'paes'
      };

      const rua = d.tokensRua
        .map(t => aliases[t] || t)
        .join('');

      return `${rua}_${d.numero}`;
    }

    function linhaPareceEnderecorota(texto) {
      if (!texto) return false;

      const limpo = removerAcentosEndereco(String(texto)).toLowerCase();

      return (
        /(?:\brua\b|\br\.?\s|\bavenida\b|\bav\.?\s|\balameda\b|\btravessa\b|\bestrada\b|\brodovia\b|\bpraca\b|\bpraça\b|\blargo\b|\bviela\b|\bpassagem\b).+?,\s*\d{1,6}\b/i.test(limpo) ||
        /^\s*\d{1,3}\s+.+?,\s*\d{1,6}\b/i.test(limpo)
      );
    }

    function encontrarLinhaEnderecorota(linhas, indice) {
      const atual = String(linhas[indice] || '');

      // Se endereço e código já vieram na mesma linha, usa a própria linha.
      if (linhaPareceEnderecorota(atual) && normalizarEndereco(atual)) {
        return atual;
      }

      /*
       * O PDF do rota frequentemente posiciona a coluna "Notes"
       * alguns pixels acima/abaixo da coluna "Address".
       * O PDF.js então pode criar duas linhas:
       *   BR26874888166
       *   1 Rua Doutor... 14:54
       *
       * Procuramos o endereço vizinho mais próximo do código.
       */
      const offsets = [-1, 1, -2, 2, -3, 3, -4, 4];

      for (const off of offsets) {
        const candidato = String(linhas[indice + off] || '');
        if (linhaPareceEnderecorota(candidato) && normalizarEndereco(candidato)) {
          return candidato;
        }
      }

      return atual;
    }

    function extrairNumeroParadarota(texto, fallback) {
      const t = String(texto || '').trim();
      const m = t.match(/^(\d{1,3})\b/);
      return m ? parseInt(m[1], 10) : fallback;
    }

    // V64 - leitor estrito de códigos de pacote BR.
    // O código aceito tem 15 caracteres: BR + 12 dígitos + 1 caractere final.
    // Separadores/espacos no meio sao tolerados para PDFs fragmentados, mas textos
    // como "BR-050" (rodovia) deixam de virar pacote fantasma.
    function normalizarCodigoPacoteBr(valor) {
      const compacto = String(valor || '').toUpperCase().replace(/[\s._-]+/g, '');
      return /^BR\d{12}[A-Z0-9]$/.test(compacto) ? compacto : '';
    }

    function extrairCodigosBrFlexiveis(texto) {
      const bruto = String(texto || '').toUpperCase();
      const encontrados = new Set();

      // Codigo continuo, com fronteiras para nao capturar parte de outra palavra.
      const continuo = /(?:^|[^A-Z0-9])(BR\d{12}[A-Z0-9])(?=$|[^A-Z0-9])/g;
      let m;
      while ((m = continuo.exec(bruto))) {
        const codigo = normalizarCodigoPacoteBr(m[1]);
        if (codigo) encontrados.add(codigo);
      }

      // Codigo quebrado pelo PDF.js: BR2609 67904580Q, BR 260967904580 Q etc.
      // Entre os caracteres do codigo aceitamos somente espaco/ponto/_/hifen.
      const flexivel = /(?:^|[^A-Z0-9])(B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}[A-Z0-9])(?=$|[^A-Z0-9])/g;
      while ((m = flexivel.exec(bruto))) {
        const codigo = normalizarCodigoPacoteBr(m[1]);
        if (codigo) encontrados.add(codigo);
      }

      return [...encontrados];
    }


    // ============================================================
    // V71 - LEITOR ESTRUTURAL DE PDF PARA BIPAGEM
    // ============================================================
    // Princípio: nunca associa pacote a endereço apenas por "estar perto".
    // Quando o PDF possui numeração de linhas, a própria linha da tabela é a
    // unidade de verdade. O leitor detecta automaticamente a coluna de # em
    // qualquer posição X, cria uma faixa vertical para cada entrega e lê,
    // dentro dessa mesma faixa, endereço + todos os códigos BR válidos.
    //
    // Se a coluna # não existir, os leitores universais antigos continuam como
    // fallback. Dessa forma preservamos Spoke com # vazio sem reintroduzir
    // associações arriscadas nos PDFs que já fornecem uma linha numerada.

    function removerAcentosPdfV71(valor) {
      return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    function normalizarTipoViaPdfV71(tipo) {
      const t = removerAcentosPdfV71(tipo).toLowerCase().replace(/[^a-z]/g, '');
      const mapa = {
        r: 'rua', rua: 'rua',
        av: 'avenida', avenida: 'avenida',
        al: 'alameda', alameda: 'alameda',
        tv: 'travessa', travessa: 'travessa',
        est: 'estrada', estrada: 'estrada',
        rod: 'rodovia', rodovia: 'rodovia',
        pc: 'praca', pca: 'praca', praca: 'praca',
        lg: 'largo', largo: 'largo',
        viela: 'viela', passagem: 'passagem',
        comunidade: 'comunidade', beco: 'beco', servidao: 'servidao',
        marginal: 'marginal', ladeira: 'ladeira', via: 'via', rodoanel: 'rodoanel', acesso: 'acesso', condominio: 'condominio', residencial: 'residencial', sitio: 'sitio', fazenda: 'fazenda', chacara: 'chacara'
      };
      return mapa[t] || t || 'via';
    }

    function expandirTokenRuaPdfV71(token) {
      const t = removerAcentosPdfV71(token).toLowerCase().replace(/[^a-z0-9]/g, '');
      const aliases = {
        dr: 'doutor', dra: 'doutora',
        prof: 'professor', profa: 'professora',
        cel: 'coronel', ten: 'tenente',
        brig: 'brigadeiro', pres: 'presidente',
        ver: 'vereador', mons: 'monsenhor',
        con: 'conego', cnso: 'conselheiro', cnsl: 'conselheiro', cnsol: 'conselheiro',
        fr: 'frei', sta: 'santa', sto: 'santo',
        mq: 'marques'
      };
      return aliases[t] || t;
    }

    function limparTextoEnderecoPdfV71(valor) {
      let t = String(valor || '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!t) return '';

      // Remove identificadores de lote/rota e códigos de pacote sem tocar no endereço.
      t = t
        .replace(/\bAT[A-Z0-9]{8,30}\s*;?/gi, ' ')
        .replace(/B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}[A-Z0-9]\s*;?/gi, ' ')
        .replace(/B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}(?![A-Z0-9])\s*;?/gi, ' ')
        .replace(/^\s*(?:#|Address|Endere[cç]o|Notes?|Notas?|Estimated\s+Arrival(?:\s+Time)?|Arrival\s+Time)\s*[:\-]?\s*/i, '')
        .replace(/^\s*(?:Stop|Parada)\s*#?\s*\d{1,4}\s*[:\-]?\s*/i, '')
        .replace(/^\s*\d{1,4}\s+(?=[A-Za-zÀ-ÿ])/i, '')
        // Repara números que o PDF quebra entre linhas sem inventar conteúdo.
        // Exemplos reais: "Comunidade ..., 16" + "6, ..." => 166;
        // "Rua Rodeio, 719" + "A, ..." => 719A. A regra só atua logo
        // após vírgula e quando o fragmento seguinte também termina em vírgula,
        // evitando juntar número de rua com apartamento/horário.
        .replace(/,\s*(\d{1,4})\s+(\d{1,2}[A-Za-z]?)\s*(?=,)/g, (_, a, b) => `, ${a}${b}`)
        .replace(/,\s*(\d{1,6})\s+([A-Za-z])\s*(?=,)/g, (_, a, b) => `, ${a}${b}`)
        .replace(/\bS(?:ã|a)o\s+Paul\s+o\b/gi, 'São Paulo')
        .replace(/\bS(?:ã|a)o\s+Pa\s+ulo\b/gi, 'São Paulo')
        .replace(/\bSã\s+o\s+Paulo\b/gi, 'São Paulo')
        .replace(/\s+/g, ' ')
        .trim();

      return t;
    }

    function decomporEnderecoFisicoPdfV71(valor) {
      const original = limparTextoEnderecoPdfV71(valor);
      if (!original || original.length < 4) return null;

      const texto = original.replace(/\s+/g, ' ').trim();
      // Evita \\b depois de caracteres como "ç" (Pç), pois o boundary do JS é
      // baseado em ASCII e pode falhar em abreviações brasileiras.
      const viaRegex = /(Rua|R\.?|Avenida|Av\.?|Alameda|Al\.?|Travessa|Tv\.?|Estrada|Est\.?|Rodovia|Rod\.?|Pra[cç]a|P[cç]\.?|Pca\.?|Largo|Lg\.?|Viela|Passagem|Comunidade|Beco|Servid[aã]o|Marginal|Ladeira|Via|Rodoanel|Acesso|Condom[ií]nio|Residencial|S[ií]tio|Fazenda|Ch[aá]cara)(?=\s)/i;
      const via = texto.match(viaRegex);

      // Alguns exports omitem "Rua/Av." e deixam somente "Jorge Augusto, 831".
      // Aceitamos esse formato APENAS quando há vírgula explícita antes do número,
      // evitando transformar bairro/CEP/observação em endereço.
      const genericoSemTipo = !via &&
        /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9.'’\- ]{2,100},\s*\d{1,6}[A-Za-z]?(?:\b|,)/.test(texto);

      if (!via && !genericoSemTipo) return null;

      let inicio = via ? via.index : 0;
      let corpo = texto.slice(inicio).trim();
      if (!corpo) return null;

      // A unidade física é identificada pelo primeiro número que parece número
      // de imóvel. Isso evita escolher "25" em Rua 25 de Março e evita pegar
      // "609A" em "Avenida Rudge 351 apto 609A".
      const reNumero = /\b(\d{1,6}[A-Za-z]?)\b/g;
      let escolhido = null;
      let m;
      while ((m = reNumero.exec(corpo))) {
        const antes = corpo.slice(0, m.index);
        const depois = corpo.slice(m.index + m[0].length);
        const anterior = antes.match(/([A-Za-zÀ-ÿ.]+)\s*$/)?.[1] || '';
        const prox = depois.replace(/^\s+/, '');

        if (/^(?:ap|apt|apto|apartamento|bl|bloco|torre|sala|cj|conj|conjunto|andar|loja|casa|fundos?)\.?$/i.test(anterior)) {
          continue;
        }

        const temNomeAntes = /[A-Za-zÀ-ÿ]{2}/.test(antes);
        if (!temNomeAntes) continue;

        const marcadorForte =
          /^\s*[,\-]/.test(depois) ||
          /^(?:ap|apt|apto|apartamento|bl|bloco|torre|sala|cj|conj|conjunto|andar|loja|casa|fundos?|portaria|recep[cç][aã]o|condom[ií]nio|pr[eé]dio|edif[ií]cio)\b/i.test(prox) ||
          /^(?:S[aã]o\s+Paulo|Osasco|Guarulhos|Santo\s+Andr[eé]|S[aã]o\s+Bernardo|$)/i.test(prox);

        // Números que fazem parte do nome da rua costumam ser seguidos de
        // preposição/palavra (Rua 25 de Março). Nesse caso seguimos procurando.
        if (!marcadorForte && /^[A-Za-zÀ-ÿ]/.test(prox)) continue;

        escolhido = { valor: m[1], indice: m.index };
        break;
      }

      if (!escolhido) return null;

      const antesNumero = corpo.slice(0, escolhido.indice).trim().replace(/[,:;\-]+$/g, '').trim();
      if (!/[A-Za-zÀ-ÿ]/.test(antesNumero)) return null;

      const tipoMatch = antesNumero.match(/^\s*(Rua|R\.?|Avenida|Av\.?|Alameda|Al\.?|Travessa|Tv\.?|Estrada|Est\.?|Rodovia|Rod\.?|Pra[cç]a|P[cç]\.?|Pca\.?|Largo|Lg\.?|Viela|Passagem|Comunidade|Beco|Servid[aã]o|Marginal|Ladeira|Via|Rodoanel|Acesso|Condom[ií]nio|Residencial|S[ií]tio|Fazenda|Ch[aá]cara)\s+/i);
      const tipo = normalizarTipoViaPdfV71(tipoMatch?.[1] || 'via');
      const ruaBruta = tipoMatch ? antesNumero.slice(tipoMatch[0].length).trim() : antesNumero;

      const tokensRua = removerAcentosPdfV71(ruaBruta)
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter(t => !['da','de','do','das','dos','e'].includes(t))
        .map(expandirTokenRuaPdfV71)
        .filter(Boolean);

      if (!tokensRua.length) return null;

      const numero = String(escolhido.valor || '').toLowerCase().replace(/[^0-9a-z]/g, '');
      if (!numero) return null;

      return {
        original: texto,
        tipo,
        numero,
        tokensRua,
        ruaCanonica: tokensRua.join(' '),
        chave: `${tipo}|${tokensRua.join('')}|${numero}`
      };
    }

    function chaveFisicaPdfV71(valor) {
      return decomporEnderecoFisicoPdfV71(valor)?.chave || '';
    }

    function agruparItensEmLinhasPdfV71(itensOriginais, tolerancia = 3.5) {
      const itens = (Array.isArray(itensOriginais) ? itensOriginais : [])
        .filter(i => String(i?.str || '').trim())
        .slice()
        .sort((a, b) => {
          if (Math.abs(Number(a.y || 0) - Number(b.y || 0)) <= tolerancia) return Number(a.x || 0) - Number(b.x || 0);
          return Number(b.y || 0) - Number(a.y || 0);
        });

      const linhas = [];
      for (const item of itens) {
        let melhor = null;
        let dist = Infinity;
        for (const linha of linhas) {
          const d = Math.abs(linha.y - Number(item.y || 0));
          if (d <= tolerancia && d < dist) { melhor = linha; dist = d; }
        }
        if (!melhor) {
          melhor = { y: Number(item.y || 0), itens: [] };
          linhas.push(melhor);
        }
        melhor.itens.push(item);
        melhor.y = melhor.itens.reduce((s, i) => s + Number(i.y || 0), 0) / melhor.itens.length;
      }

      return linhas
        .map(l => ({
          y: l.y,
          itens: l.itens.slice().sort((a,b) => Number(a.x || 0) - Number(b.x || 0)),
          texto: l.itens.slice().sort((a,b) => Number(a.x || 0) - Number(b.x || 0)).map(i => String(i.str || '').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
        }))
        .sort((a,b) => b.y - a.y);
    }

    function textoItensPdfV71(itens) {
      return agruparItensEmLinhasPdfV71(itens)
        .map(l => l.texto)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function detectarMarcadoresNumeradosPdfV71(itensOriginais, larguraPagina) {
      const itens = (Array.isArray(itensOriginais) ? itensOriginais : []);
      const candidatos = itens
        .map((item, indice) => ({
          item,
          indice,
          numero: /^\d{1,3}$/.test(String(item?.str || '').trim()) ? Number(String(item.str).trim()) : NaN,
          x: Number(item?.x || 0),
          y: Number(item?.y || 0)
        }))
        .filter(c => Number.isFinite(c.numero) && c.numero > 0 && c.numero <= 999);

      if (!candidatos.length) return [];

      const toleranciaX = Math.max(5, Number(larguraPagina || 600) * 0.014);
      const grupos = [];
      candidatos.sort((a,b) => a.x - b.x).forEach(c => {
        let alvo = null;
        let menor = Infinity;
        grupos.forEach(g => {
          const d = Math.abs(g.x - c.x);
          if (d <= toleranciaX && d < menor) { alvo = g; menor = d; }
        });
        if (!alvo) { alvo = { x: c.x, itens: [] }; grupos.push(alvo); }
        alvo.itens.push(c);
        alvo.x = alvo.itens.reduce((s,i) => s + i.x, 0) / alvo.itens.length;
      });

      const hashes = itens.filter(i => String(i?.str || '').trim() === '#').map(i => Number(i.x || 0));

      let melhorGrupo = null;
      grupos.forEach(g => {
        const ordenados = g.itens.slice().sort((a,b) => b.y - a.y);
        const unicos = [];
        ordenados.forEach(c => {
          if (!unicos.some(u => Math.abs(u.y - c.y) < 2.2 && u.numero === c.numero)) unicos.push(c);
        });

        let consecutivos = 0;
        let crescentes = 0;
        for (let i = 1; i < unicos.length; i++) {
          if (unicos[i].numero > unicos[i-1].numero) crescentes++;
          if (unicos[i].numero === unicos[i-1].numero + 1) consecutivos++;
        }

        const pertoHash = hashes.some(x => Math.abs(x - g.x) <= Math.max(18, Number(larguraPagina || 600) * 0.05));
        const score = (unicos.length * 12) + (consecutivos * 28) + (crescentes * 4) + (pertoHash ? 120 : 0);
        if (!melhorGrupo || score > melhorGrupo.score) melhorGrupo = { score, itens: unicos, pertoHash };
      });

      if (!melhorGrupo) return [];
      if (melhorGrupo.itens.length < 2 && !melhorGrupo.pertoHash) return [];

      // Mantém a sequência visual crescente. Itens isolados (número de apartamento,
      // data etc.) não entram porque não formam a coluna repetitiva da tabela.
      const saida = [];
      melhorGrupo.itens.forEach(c => {
        if (!saida.length || c.numero > saida[saida.length - 1].numero) saida.push(c);
      });

      return saida;
    }

    function extrairCodigosDoBlocoPdfV71(itensBloco, larguraPagina) {
      const itens = (Array.isArray(itensBloco) ? itensBloco : []);
      const codigos = new Set();

      // 1) código completo, ainda que fragmentado por espaços dentro da mesma linha.
      agruparItensEmLinhasPdfV71(itens).forEach(l => {
        extrairCodigosBrFlexiveis(l.texto).forEach(c => codigos.add(c));
      });
      itens.forEach(i => extrairCodigosBrFlexiveis(i.str).forEach(c => codigos.add(c)));

      // 2) Circuit: BR + 12 dígitos em uma linha e caractere final logo abaixo.
      const prefixos = itens
        .map((item, indice) => {
          const m = String(item?.str || '').toUpperCase().match(/(?:^|[^A-Z0-9])(BR\d{12})(?=$|[^A-Z0-9])/);
          return m ? { prefixo: m[1], item, indice } : null;
        })
        .filter(Boolean);

      const finaisUsados = new Set();
      prefixos.forEach(pfx => {
        const candidatos = itens
          .map((item, indice) => {
            if (indice === pfx.indice || finaisUsados.has(indice)) return null;
            const m = String(item?.str || '').toUpperCase().trim().match(/^([A-Z0-9])\s*[;:,.]?$/);
            if (!m) return null;
            const dx = Math.abs(Number(item.x || 0) - Number(pfx.item.x || 0));
            const dy = Math.abs(Number(item.y || 0) - Number(pfx.item.y || 0));
            // O último caractere pertence à mesma coluna visual do prefixo.
            // Esta restrição impede que o "1" da coluna # seja anexado ao BR.
            if (dx > Math.max(55, Number(larguraPagina || 600) * 0.11)) return null;
            return { indice, char: m[1], dx, dy, score: (dx * 4) + dy };
          })
          .filter(Boolean)
          .sort((a,b) => a.score - b.score);

        for (const cand of candidatos.slice(0, 5)) {
          const codigo = normalizarCodigoPacoteBr(pfx.prefixo + cand.char);
          if (!codigo) continue;
          codigos.add(codigo);
          finaisUsados.add(cand.indice);
          break;
        }
      });

      return [...codigos];
    }

    function pontuarEnderecoPdfV71(textoBruto) {
      const limpo = limparTextoEnderecoPdfV71(textoBruto);
      const d = decomporEnderecoFisicoPdfV71(limpo);
      if (!d) return null;

      let score = 100;
      if (/^(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|P[cç]\.?|Largo|Viela|Passagem|Comunidade|Beco|Servid[aã]o|Marginal|Ladeira|Via|Rodoanel)\b/i.test(limpo)) score += 25;
      if (/\b(?:S[aã]o Paulo|Osasco|Guarulhos|Santo Andr[eé]|S[aã]o Bernardo)\b/i.test(limpo)) score += 10;
      if (!/\bBR\d/i.test(textoBruto) && !/\bAT[A-Z0-9]/i.test(textoBruto)) score += 18;
      if (!/[;]{2,}/.test(textoBruto)) score += 5;
      if (limpo.length >= 12 && limpo.length <= 220) score += 5;
      return { texto: limpo, dados: d, score };
    }

    function extrairEnderecoDoBlocoPdfV71(itensBloco, marcadorNumero) {
      const itens = (Array.isArray(itensBloco) ? itensBloco : []).filter(i => String(i?.str || '').trim());
      if (!itens.length) return '';

      const xNumero = Number(marcadorNumero?.x || 0);
      const tempos = itens
        .filter(i => /^\d{1,2}:\d{2}(?:\s*(?:AM|PM))?$/i.test(String(i.str || '').trim()))
        .sort((a,b) => Math.abs(Number(a.y || 0) - Number(marcadorNumero?.y || 0)) - Math.abs(Number(b.y || 0) - Number(marcadorNumero?.y || 0)));

      const conjuntos = [];
      if (tempos.length) {
        const hora = tempos[0];
        const xHora = Number(hora.x || 0);
        const margem = 4;

        if (xNumero < xHora) {
          conjuntos.push(itens.filter(i => Number(i.x || 0) > xNumero + margem && Number(i.x || 0) < xHora - margem));
        } else if (xNumero > xHora) {
          conjuntos.push(itens.filter(i => Number(i.x || 0) < xNumero - margem && Number(i.x || 0) > xHora + margem));
        }

        conjuntos.push(itens.filter(i => Number(i.x || 0) < xHora - margem));
        conjuntos.push(itens.filter(i => Number(i.x || 0) > xHora + margem));
      }

      // Fallback sem ETA: linha inteira; o saneamento remove BR/AT.
      conjuntos.push(itens.filter(i => i !== marcadorNumero?.item));

      const vistos = new Set();
      const candidatos = [];
      conjuntos.forEach(conjunto => {
        if (!conjunto?.length) return;
        const bruto = textoItensPdfV71(conjunto);
        if (!bruto || vistos.has(bruto)) return;
        vistos.add(bruto);
        const p = pontuarEnderecoPdfV71(bruto);
        if (p) candidatos.push({ ...p, bruto });
      });

      // Também tenta cada linha visual isolada; útil quando Address e Notes estão
      // trocados ou quando o PDF não possui coluna de horário.
      agruparItensEmLinhasPdfV71(itens).forEach(l => {
        const p = pontuarEnderecoPdfV71(l.texto);
        if (p) candidatos.push({ ...p, bruto: l.texto });
      });

      candidatos.sort((a,b) => b.score - a.score || a.texto.length - b.texto.length);
      return candidatos[0]?.texto || '';
    }

    function extrairRegistrosPdfV71(itensOriginais, pagina, larguraPagina) {
      const itens = (Array.isArray(itensOriginais) ? itensOriginais : [])
        .map((item, indice) => ({
          str: String(item?.str || '').replace(/\s+/g, ' ').trim(),
          x: Number(item?.x || 0),
          y: Number(item?.y || 0),
          indice
        }))
        .filter(i => i.str);

      if (!itens.length) return [];

      const marcadores = detectarMarcadoresNumeradosPdfV71(itens, larguraPagina);
      if (!marcadores.length) return [];

      const gaps = [];
      for (let i = 1; i < marcadores.length; i++) {
        const d = Math.abs(marcadores[i-1].y - marcadores[i].y);
        if (d > 4 && d < 120) gaps.push(d);
      }
      gaps.sort((a,b) => a-b);
      const gapMediano = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 26;

      const registros = [];
      for (let i = 0; i < marcadores.length; i++) {
        const atual = marcadores[i];
        const anterior = marcadores[i - 1];
        const proximo = marcadores[i + 1];
        const ySuperior = anterior ? (anterior.y + atual.y) / 2 : atual.y + (gapMediano * 0.55);
        const yInferior = proximo ? (atual.y + proximo.y) / 2 : atual.y - (gapMediano * 0.55);

        const bloco = itens.filter(item => item.y <= ySuperior && item.y > yInferior);
        if (!bloco.length) continue;

        const endereco = extrairEnderecoDoBlocoPdfV71(bloco, atual);
        const codigos = extrairCodigosDoBlocoPdfV71(bloco, larguraPagina);
        const textoBloco = textoItensPdfV71(bloco);
        const auxiliarDestino = /\b(?:Destino|Destination|Retorno|Return)\b/i.test(textoBloco);
        const prefixoIncompleto = /\bBR\d{8,14}\b/i.test(textoBloco) && codigos.length === 0;

        registros.push({
          numeroParada: atual.numero,
          endereco,
          codigos,
          pagina,
          auxiliarDestino,
          prefixoIncompleto,
          origemLeitura: 'linhas-v71'
        });
      }

      return registros;
    }





    // V71B - fallback determinístico para relatórios em que a coluna "#" existe,
    // mas vem vazia (alguns exports do Spoke). Cada código BR completo vira a
    // âncora da própria faixa visual; o endereço precisa estar dentro dessa mesma
    // faixa. Não procuramos "endereço vizinho" fora da entrega.
    function extrairRegistrosPdfV71PorCodigo(itensOriginais, pagina, larguraPagina, sequenciaInicial = 0) {
      const itens = (Array.isArray(itensOriginais) ? itensOriginais : [])
        .map((item, indice) => ({
          str: String(item?.str || '').replace(/\s+/g, ' ').trim(),
          x: Number(item?.x || 0),
          y: Number(item?.y || 0),
          indice
        }))
        .filter(i => i.str);

      if (!itens.length) return { registros: [], sequencia: sequenciaInicial };

      const linhas = agruparItensEmLinhasPdfV71(itens);
      const ancoras = [];

      linhas.forEach(linha => {
        const codigos = extrairCodigosBrFlexiveis(linha.texto);
        if (!codigos.length) return;
        ancoras.push({
          y: linha.y,
          codigos: [...new Set(codigos)],
          linha
        });
      });

      // Só usamos esta estratégia se houver códigos reais. Cabeçalho/rodovia
      // jamais cria linha porque extrairCodigosBrFlexiveis exige BR+12+final.
      if (!ancoras.length) return { registros: [], sequencia: sequenciaInicial };

      ancoras.sort((a,b) => b.y - a.y);

      const unicas = [];
      ancoras.forEach(a => {
        const existente = unicas.find(u => Math.abs(u.y - a.y) <= 2.5);
        if (existente) {
          a.codigos.forEach(c => {
            if (!existente.codigos.includes(c)) existente.codigos.push(c);
          });
        } else {
          unicas.push({ ...a, codigos: a.codigos.slice() });
        }
      });

      const gaps = [];
      for (let i = 1; i < unicas.length; i++) {
        const d = Math.abs(unicas[i-1].y - unicas[i].y);
        if (d > 4 && d < 160) gaps.push(d);
      }
      gaps.sort((a,b) => a-b);
      const gapMediano = gaps.length ? gaps[Math.floor(gaps.length/2)] : 28;

      let sequencia = Number(sequenciaInicial || 0);
      const registros = [];

      for (let i = 0; i < unicas.length; i++) {
        const atual = unicas[i];
        const anterior = unicas[i-1];
        const proximo = unicas[i+1];

        const ySuperior = anterior
          ? (anterior.y + atual.y) / 2
          : atual.y + gapMediano * 0.55;
        const yInferior = proximo
          ? (atual.y + proximo.y) / 2
          : atual.y - gapMediano * 0.55;

        const bloco = itens.filter(item => item.y <= ySuperior && item.y > yInferior);
        const linhasBloco = agruparItensEmLinhasPdfV71(bloco);
        const candidatos = [];

        linhasBloco.forEach(l => {
          const p = pontuarEnderecoPdfV71(l.texto);
          if (p) candidatos.push(p);
        });

        // Também tenta a concatenação do bloco para endereços quebrados em duas
        // linhas; a pontuação prefere a coluna Address sem BR/AT quando existir.
        const pBloco = pontuarEnderecoPdfV71(textoItensPdfV71(bloco));
        if (pBloco) candidatos.push(pBloco);

        candidatos.sort((a,b) => b.score - a.score || a.texto.length - b.texto.length);
        const endereco = candidatos[0]?.texto || '';

        const codigosFaixa = [...new Set(extrairCodigosDoBlocoPdfV71(bloco, larguraPagina))];
        const codigos = codigosFaixa.length ? codigosFaixa : atual.codigos.slice();

        sequencia++;
        registros.push({
          numeroParada: sequencia,
          endereco,
          codigos,
          pagina,
          auxiliarDestino: false,
          prefixoIncompleto: false,
          origemLeitura: 'codigo-v71'
        });
      }

      return { registros, sequencia };
    }


    // V70 - leitor de PDF por ancoras, sem depender de coluna fixa.
    // Endereco, codigo, numero da parada e horario podem aparecer em qualquer X da pagina.
    // A associacao usa a proximidade vertical/ordem de leitura e validacao semantica.
    function extrairRegistrosPdfPosicaoLivre(itensOriginais, pagina, larguraPagina) {
      const itens = (Array.isArray(itensOriginais) ? itensOriginais : [])
        .map((item, indice) => ({
          str: String(item?.str || '').replace(/\s+/g, ' ').trim(),
          x: Number(item?.x || 0),
          y: Number(item?.y || 0),
          indice
        }))
        .filter(item => item.str);

      if (!itens.length) return [];

      function agruparPorY(tolerancia = 4.5) {
        const ordenados = itens.slice().sort((a, b) => {
          if (Math.abs(a.y - b.y) <= tolerancia) return a.x - b.x;
          return b.y - a.y;
        });
        const grupos = [];
        for (const item of ordenados) {
          let melhor = null;
          let melhorDist = Infinity;
          for (const grupo of grupos) {
            const dist = Math.abs(grupo.y - item.y);
            if (dist <= tolerancia && dist < melhorDist) {
              melhor = grupo;
              melhorDist = dist;
            }
          }
          if (!melhor) {
            melhor = { y: item.y, itens: [] };
            grupos.push(melhor);
          }
          melhor.itens.push(item);
          melhor.y = melhor.itens.reduce((soma, atual) => soma + atual.y, 0) / melhor.itens.length;
        }
        return grupos
          .map(g => ({
            y: g.y,
            itens: g.itens.slice().sort((a, b) => a.x - b.x),
            texto: g.itens.slice().sort((a, b) => a.x - b.x).map(i => i.str).join(' ').replace(/\s+/g, ' ').trim(),
            indice: Math.round(g.itens.reduce((soma, atual) => soma + atual.indice, 0) / Math.max(1, g.itens.length))
          }))
          .sort((a, b) => b.y - a.y);
      }

      const grupos = agruparPorY(4.5);
      const gaps = [];
      for (let i = 0; i < grupos.length - 1; i++) {
        const d = Math.abs(grupos[i].y - grupos[i + 1].y);
        if (d > 2 && d < 80) gaps.push(d);
      }
      gaps.sort((a,b)=>a-b);
      const gapMediano = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 18;
      const distanciaJanela = Math.max(14, Math.min(34, gapMediano * 1.25));

      function textoJanela(indices) {
        return indices
          .filter(i => i >= 0 && i < grupos.length)
          .flatMap(i => grupos[i].itens)
          .slice()
          .sort((a, b) => {
            if (Math.abs(a.y - b.y) <= 4.5) return a.x - b.x;
            return b.y - a.y;
          })
          .map(i => i.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function limparEnderecoLivre(texto) {
        let t = String(texto || '').replace(/\s+/g, ' ').trim();
        if (!t) return '';

        // Remove codigos completos e prefixos quebrados em qualquer posicao da linha.
        t = t
          .replace(/B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}[A-Z0-9]/gi, ' ')
          .replace(/B[\s._-]*R[\s._-]*(?:\d[\s._-]*){12}(?![A-Z0-9])/gi, ' ')
          .replace(/\b(?:Estimated\s+Arrival\s+Time|Arrival\s+Time|Address|Endere[cç]o|Notes?|Notas?|Tempo)\b/gi, ' ')
          .replace(/\b\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\b/gi, ' ')
          .replace(/[|]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Comeca no primeiro logradouro reconhecivel, esteja ele onde estiver no texto.
        const inicioVia = t.search(/\b(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|Largo|Viela|Passagem)\b/i);
        if (inicioVia >= 0) t = t.slice(inicioVia).trim();

        // Numero de parada pode ter ficado no inicio.
        t = t.replace(/^\s*\d{1,4}\s+(?=(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|Largo|Viela|Passagem)\b)/i, '');
        t = t.replace(/^\s*(?:Stop|Parada)\s*#?\s*\d{1,4}\s*[:\-]?\s*/i, '');
        t = t.replace(/\bS(?:ã|a)o\s+Paul\s+o\b/gi, 'São Paulo');
        t = t.replace(/\s+/g, ' ').trim();

        // Se sobrou um fragmento isolado de Notes no final, corta apenas quando
        // o endereco ja e valido sem esse ultimo caractere.
        const semFinal = t.replace(/\s+[A-Z0-9]\s*[;:]?$/i, '').trim();
        if (semFinal !== t && decomporEnderecorota(semFinal)) t = semFinal;

        return decomporEnderecorota(t) ? t : '';
      }

      function numeroExplicito(texto) {
        const t = String(texto || '').trim();
        let m = t.match(/^\s*(\d{1,4})\s+(?=(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|Largo|Viela|Passagem)\b)/i);
        if (!m) m = t.match(/\b(?:Stop|Parada)\s*#?\s*(\d{1,4})\b/i);
        const n = m ? Number(m[1]) : null;
        return Number.isFinite(n) && n > 0 ? n : null;
      }

      // 1) Candidatos de endereco: linha isolada e janelas de linhas adjacentes.
      const enderecos = [];
      const chavesEndereco = new Set();
      for (let i = 0; i < grupos.length; i++) {
        const janelas = [[i]];
        if (i + 1 < grupos.length && Math.abs(grupos[i].y - grupos[i + 1].y) <= distanciaJanela) janelas.push([i, i + 1]);
        if (i > 0 && Math.abs(grupos[i - 1].y - grupos[i].y) <= distanciaJanela) janelas.push([i - 1, i]);
        if (
          i + 2 < grupos.length &&
          Math.abs(grupos[i].y - grupos[i + 1].y) <= distanciaJanela &&
          Math.abs(grupos[i + 1].y - grupos[i + 2].y) <= distanciaJanela
        ) janelas.push([i, i + 1, i + 2]);

        for (const js of janelas) {
          const bruto = textoJanela(js);
          const endereco = limparEnderecoLivre(bruto);
          if (!endereco) continue;

          const ys = js.map(k => grupos[k].y);
          const y = ys.reduce((a,b)=>a+b,0) / ys.length;
          const indice = Math.round(js.map(k => grupos[k].indice).reduce((a,b)=>a+b,0) / js.length);
          const numero = numeroExplicito(bruto);
          const chave = `${normalizarEndereco(endereco)}|${Math.round(y / 3)}`;
          if (chavesEndereco.has(chave)) continue;
          chavesEndereco.add(chave);
          enderecos.push({ endereco, y, indice, numero });
        }
      }

      if (!enderecos.length) return [];

      // 2) Ancora de codigo. Primeiro aceita codigos completos em qualquer lugar.
      // Depois reconstrói BR+12 digitos com o caractere final em outro item/linha.
      const codigos = new Map();
      function registrarCodigo(codigo, y, indice, prioridade = 1) {
        const normal = normalizarCodigoPacoteBr(codigo);
        if (!normal) return;
        const atual = codigos.get(normal);
        if (!atual || prioridade > atual.prioridade) codigos.set(normal, { codigo: normal, y, indice, prioridade });
      }

      for (const grupo of grupos) {
        extrairCodigosBrFlexiveis(grupo.texto).forEach(c => registrarCodigo(c, grupo.y, grupo.indice, 3));
      }

      // Codigos partidos em linhas sao reconstruidos abaixo por proximidade
      // espacial entre o prefixo BR+12 digitos e o caractere final. Evitamos
      // concatenar linhas inteiras aqui porque um numero da coluna de parada
      // poderia ser confundido com o ultimo caractere do codigo.

      const prefixos = [];
      const rePrefixo = /(?:^|[^A-Z0-9])(BR\d{12})(?=$|[^A-Z0-9])/i;
      itens.forEach(item => {
        const m = item.str.toUpperCase().match(rePrefixo);
        if (m) prefixos.push({ prefixo: m[1], item });
      });

      for (const pfx of prefixos) {
        const candidatosFinal = itens
          .map(item => {
            const m = item.str.toUpperCase().trim().match(/^([A-Z0-9])\s*[;:,.]?$/);
            if (!m || item.indice === pfx.item.indice) return null;
            const dy = Math.abs(item.y - pfx.item.y);
            const dx = Math.abs(item.x - pfx.item.x);
            const di = Math.abs(item.indice - pfx.item.indice);
            // O caractere final costuma ficar fisicamente perto do prefixo, mesmo
            // quando o exportador o joga para outra linha. X e usado apenas como
            // distancia relativa, nunca como coluna fixa.
            const pareceNumeroParadaDistante = /^\d$/.test(m[1]) && dx > Math.max(90, larguraPagina * 0.16);
            const penalidadeNumeroParada = pareceNumeroParadaDistante ? 70 : 0;
            const score = dy + (dx * 0.22) + (di * 1.2) + penalidadeNumeroParada;
            return { char: m[1], item, score, dy, dx, di };
          })
          .filter(Boolean)
          .filter(c => c.dy <= Math.max(36, distanciaJanela * 2.2) || c.di <= 10)
          .sort((a,b)=>a.score-b.score);

        for (const cand of candidatosFinal.slice(0, 6)) {
          const codigo = normalizarCodigoPacoteBr(pfx.prefixo + cand.char);
          if (!codigo) continue;
          registrarCodigo(
            codigo,
            (pfx.item.y + cand.item.y) / 2,
            Math.round((pfx.item.indice + cand.item.indice) / 2),
            4
          );
          break;
        }
      }

      if (!codigos.size) return [];

      // 3) Associa cada codigo ao endereco semanticamente valido mais proximo.
      // X nao entra como regra de coluna; ele serve apenas como desempate minimo.
      const limiteY = Math.max(48, Math.min(110, gapMediano * 2.6));
      const registros = [];
      const usados = new Set();

      for (const ancora of codigos.values()) {
        let melhor = null;
        for (const end of enderecos) {
          const dy = Math.abs(ancora.y - end.y);
          const di = Math.abs(ancora.indice - end.indice);
          const score = dy + (di * 0.12);
          if (!melhor || score < melhor.score) melhor = { end, score, dy };
        }
        if (!melhor || melhor.dy > limiteY) continue;
        if (usados.has(ancora.codigo)) continue;
        usados.add(ancora.codigo);
        registros.push({
          numeroParada: melhor.end.numero,
          endereco: melhor.end.endereco,
          codigos: [ancora.codigo],
          pagina,
          ordemY: melhor.end.y,
          origemLeitura: 'posicao-livre-v70'
        });
      }

      // Ordem visual da pagina; numeracao faltante sera completada pelo chamador.
      return registros.sort((a,b)=>b.ordemY-a.ordemY);
    }

    // V50 - leitor universal de PDFs de rota (Spoke, Circuit e layouts semelhantes).
    // Não depende da coluna #. A fonte de verdade passa a ser a associação visual/textual
    // entre um código de pacote e um endereço próximo na tabela.
    function extrairRegistrosPdfUniversal(linhas) {
      const lista = (Array.isArray(linhas) ? linhas : [])
        .map((linha, indice) => ({ indice, texto: String(linha || '').replace(/\s+/g, ' ').trim() }))
        .filter(item => item.texto);

      const cabecalho = /^(#|address|endereco|endereço|notes?|notas?|estimated arrival|time|tempo|powered by|route|rota)$/i;
      const usados = new Set();
      const registros = [];
      let sequencia = 0;

      function codigosDaLinha(texto, pos = -1) {
        const diretos = extrairCodigosBrFlexiveis(texto);
        if (diretos.length || pos < 0) return diretos;

        /*
         * V69 - fallback textual para códigos quebrados em linhas diferentes.
         * Circuit pode extrair:
         *   BR265691124855
         *   1 Rua Machado Bitencourt, 220 ... 06:11
         *   W;
         *
         * O prefixo BR + 12 dígitos sozinho NÃO é pacote válido; só é aceito
         * quando encontramos, bem perto, uma linha contendo exclusivamente o
         * caractere final. Isso evita voltar a confundir BR-050 com pacote.
         */
        const atual = String(texto || '').toUpperCase().trim();
        const prefixo = atual.match(/(?:^|[^A-Z0-9])(BR\d{12})(?=$|[^A-Z0-9])/);
        if (!prefixo) return [];

        const offsets = [1, 2, -1, -2, 3, -3];
        for (const off of offsets) {
          const vizinho = lista[pos + off];
          if (!vizinho) continue;
          const pedaco = String(vizinho.texto || '').toUpperCase().trim();
          const final = pedaco.match(/^([A-Z0-9])\s*[;:,.]?$/);
          if (!final) continue;
          const codigo = normalizarCodigoPacoteBr(prefixo[1] + final[1]);
          if (codigo) return [codigo];
        }

        return [];
      }

      function limparCandidatoEndereco(texto) {
        let t = String(texto || '').replace(/\s+/g, ' ').trim();
        if (!t) return '';
        // Remove cabeçalhos/labels que alguns exportadores colocam na mesma linha.
        t = t.replace(/^\s*(?:#\s*)?(?:address|endereco|endereço)\s*[:\-]?\s*/i, '');
        // Remove códigos/Notes mesmo quando o PDF separa o BR em fragmentos.
        const posCodigo = t.search(/\bBR(?:[\s._-]*[0-9])/i);
        if (posCodigo >= 0) t = t.slice(0, posCodigo).trim();
        // Remove prefixos de parada do Circuit/Spoke quando existirem.
        t = t.replace(/^\s*(?:stop|parada)\s*#?\s*\d{1,4}\s*[:\-]?\s*/i, '');
        t = t.replace(/^\s*\d{1,4}\s+(?=(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|Largo|Viela|Passagem)\b)/i, '');
        // Remove horários/ETAs no fim.
        t = t.replace(/\s+\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*$/i, '');
        return t.trim().replace(/[|]+$/g, '').trim();
      }

      function enderecoValido(texto) {
        const limpo = limparCandidatoEndereco(texto);
        return limpo && !!decomporEnderecorota(limpo);
      }

      lista.forEach((item, pos) => {
        const codigos = codigosDaLinha(item.texto, pos).slice(0, 1);
        if (!codigos.length) return;

        // 1) Preferência: endereço está na própria linha (Spoke clássico).
        let candidato = limparCandidatoEndereco(item.texto);

        // 2) Se Notes/código saiu em outra linha no PDF.js, procura linhas vizinhas.
        if (!enderecoValido(candidato)) {
          const offsets = [-1, 1, -2, 2, -3, 3, -4, 4];
          let melhor = '';
          for (const off of offsets) {
            const vizinho = lista[pos + off];
            if (!vizinho || cabecalho.test(vizinho.texto)) continue;
            // Não rouba endereço de outra linha que já tenha outro pacote.
            const outrosCodigos = codigosDaLinha(vizinho.texto);
            if (outrosCodigos.length && vizinho.indice !== item.indice) continue;
            const possivel = limparCandidatoEndereco(vizinho.texto);
            if (enderecoValido(possivel)) { melhor = possivel; break; }
          }
          candidato = melhor;
        }

        if (!enderecoValido(candidato)) return;

        const novosCodigos = codigos.filter(codigo => !usados.has(codigo));
        if (!novosCodigos.length) return;
        novosCodigos.forEach(codigo => usados.add(codigo));

        // Se a linha trouxer um número de parada explícito, preserva. Caso contrário,
        // cria sequência 1..N na ordem visual do PDF (caso do Spoke enviado pelo usuário).
        let numero = null;
        const n1 = item.texto.match(/^\s*(\d{1,4})\s+(?=(?:Rua|R\.?|Avenida|Av\.?|Alameda|Travessa|Estrada|Rodovia|Pra[cç]a|Largo|Viela|Passagem)\b)/i);
        const n2 = item.texto.match(/\b(?:stop|parada)\s*#?\s*(\d{1,4})\b/i);
        if (n1 || n2) numero = Number((n1 || n2)[1]);
        if (!Number.isFinite(numero) || numero <= 0) numero = ++sequencia;
        else sequencia = Math.max(sequencia, numero);

        registros.push({
          numeroParada: numero,
          endereco: candidato,
          codigos: novosCodigos,
          pagina: 0,
          origemLeitura: 'universal'
        });
      });

      return registros;
    }

    function abrirTelaCarregamentoPdf(nomeArquivo) {
      const tela = document.getElementById('pdfLoadingScreen');
      if (!tela) return;
      tela.classList.remove('error');
      tela.classList.add('active');
      document.getElementById('pdfLoadingFile').textContent = nomeArquivo || 'Arquivo PDF';
      atualizarTelaCarregamentoPdf(8, 'Abrindo o arquivo...', 'Preparando sua rota');
    }

    function atualizarTelaCarregamentoPdf(percentual, status, titulo) {
      const barra = document.getElementById('pdfLoadingBar');
      const statusEl = document.getElementById('pdfLoadingStatus');
      const titleEl = document.getElementById('pdfLoadingTitle');
      const subEl = document.getElementById('pdfLoadingSubtitle');
      if (barra) barra.style.width = `${Math.max(4, Math.min(100, percentual || 0))}%`;
      if (statusEl && status) statusEl.textContent = status;
      if (titleEl && titulo) titleEl.textContent = titulo;
      if (subEl) subEl.textContent =
        'Aguarde enquanto conferimos os pacotes e organizamos as paradas.';
    }

    function concluirTelaCarregamentoPdf() {
      atualizarTelaCarregamentoPdf(100, 'Tudo certo. Rota pronta!', 'Leitura concluída');
      const sub = document.getElementById('pdfLoadingSubtitle');
      if (sub) sub.textContent = 'Sua rota foi conferida e já está pronta para bipar.';
      setTimeout(() => {
        const tela = document.getElementById('pdfLoadingScreen');
        if (tela) tela.classList.remove('active');
      }, 550);
    }

    function mostrarErroTelaCarregamentoPdf(mensagem) {
      const tela = document.getElementById('pdfLoadingScreen');
      if (!tela) return;
      tela.classList.add('active', 'error');
      document.getElementById('pdfLoadingTitle').textContent = 'Não foi possível carregar a rota';
      document.getElementById('pdfLoadingSubtitle').textContent =
        mensagem || 'O PDF não pôde ser lido com segurança. Escolha o arquivo novamente.';
      document.getElementById('pdfLoadingFile').textContent =
        'Nenhuma rota foi liberada para bipagem.';
    }

    function voltarUploadAposErroPdf() {
      const tela = document.getElementById('pdfLoadingScreen');
      if (tela) {
        tela.classList.remove('active', 'error');
      }
      const input = document.getElementById('pdfInput');
      if (input) input.value = '';
      document.getElementById('btnUploadTxt').innerHTML = ' Escolher Arquivo PDF';
      document.getElementById('btnVerParadasModal').style.display = 'none';
      document.getElementById('areaExecucao').style.display = 'none';
      const uploadSec = document.getElementById('elSecaoUpload');
      const toolbarSec = document.getElementById('toolbarRotaAtiva');
      if (uploadSec) uploadSec.style.display = 'block';
      if (toolbarSec) toolbarSec.style.display = 'none';
    }

    function extrairCodigoChave(texto) {
      if (!texto) return "";
      const flex = extrairCodigosBrFlexiveis(texto);
      if (flex.length) return flex[0];
      return texto.replace(/[^A-Za-z0-9]/g, '').toUpperCase().trim();
    }

    document.getElementById('pdfInput').addEventListener('change', async function(e) {
      let file = e.target.files[0];
      if (!file) return;

      let lang = localStorage.getItem('idioma_preferido') || 'pt';
      let dict = traducoes[lang] || traducoes.pt;

      document.getElementById('cardResult').style.display = 'none';
      document.getElementById('cardResult').classList.remove('error-state');
      document.getElementById('boxAviso').style.display = 'none';
      document.getElementById('inputManual').value = "";
      document.getElementById('btnUploadTxt').innerHTML = " Lendo " + file.name.substring(0, 20) + "...";
      document.getElementById('areaExecucao').style.display = 'none';
      document.getElementById('btnVerParadasModal').style.display = 'none';
      abrirTelaCarregamentoPdf(file.name);
      const inicioVisualLeituraPdf = Date.now();

      chaveStorageAtual = "bipados_" + encodeURIComponent(file.name) + "_" + file.size;
      rotaInicioEm = Date.now();
      resumoFinalJaExibido = false;

      let reader = new FileReader();

      reader.onerror = function() {
        document.getElementById('btnUploadTxt').innerHTML = " Escolher Arquivo PDF";
        document.getElementById('btnVerParadasModal').style.display = 'none';
        document.getElementById('areaExecucao').style.display = 'none';
        mostrarErroTelaCarregamentoPdf(
          'Não conseguimos abrir este arquivo. Verifique o PDF e tente novamente.'
        );
      };

      reader.onload = async function() {
        try {
          const typedarray = new Uint8Array(this.result);
          atualizarTelaCarregamentoPdf(18, 'PDF aberto com sucesso...', 'Lendo sua rota');
          const pdf = await pdfjsLib.getDocument(typedarray).promise;

          const registrosrota = [];
          const codigosGlobais = new Set();

          // Buffer compatível com o leitor antigo.
          // Se o layout novo/estrito não reconhecer o PDF, usamos estas linhas
          // para tentar a leitura por texto/proximidade em vez de bloquear a rota.
          const linhasFallbackPdf = [];
          // V51: registros extraídos diretamente das linhas visuais do PDF.js.
          // Não depende da coluna # e tolera código BR em item separado da coluna Address.
          const registrosVisuaisPdf = [];
          let sequenciaVisualPdf = 0;
          // V71: leitor determinístico por linha numerada. A posição das colunas
          // pode mudar, mas código e endereço nunca são associados fora da própria
          // linha da entrega. Se uma tabela numerada for reconhecida e tiver
          // inconsistência, a rota é bloqueada em vez de "chutada".
          const registrosV71Pdf = [];
          let v71EncontrouTabelaNumerada = false;

          // V72: uma única sequência determinística, página a página. Se a página
          // possui # numerado, usamos a linha numerada. Se aquela página não tiver
          // # utilizável, usamos o código BR da própria linha como âncora. Assim um
          // PDF de várias páginas não perde uma página só porque as outras têm #.
          const registrosDeterministicosV72 = [];
          const codigosFonteV72 = new Set();
          const diagnosticoPaginasV72 = [];
          let sequenciaDeterministicaV72 = 0;

          // V71B legado, mantido apenas para compatibilidade interna.
          const registrosCodigoV71Pdf = [];
          let sequenciaCodigoV71Pdf = 0;

          // V70 legado fica apenas como compatibilidade para PDFs que realmente
          // não possuem numeração de entregas utilizável.
          const registrosPosicaoLivrePdf = [];
          let sequenciaPosicaoLivrePdf = 0;

          for (let pagina = 1; pagina <= pdf.numPages; pagina++) {
            const progressoPagina = 20 + Math.round((pagina / Math.max(1, pdf.numPages)) * 52);
            atualizarTelaCarregamentoPdf(
              progressoPagina,
              `Lendo página ${pagina} de ${pdf.numPages}...`,
              'Conferindo pacotes e paradas'
            );
            const page = await pdf.getPage(pagina);
            const viewport = page.getViewport({ scale: 1 });
            const width = viewport.width;
            const content = await page.getTextContent();

            const itens = content.items
              .map(item => ({
                str: String(item.str || '').replace(/\s+/g, ' ').trim(),
                x: Number(item.transform?.[4] || 0),
                y: Number(item.transform?.[5] || 0)
              }))
              .filter(item => item.str);


            // V71 - primeiro tenta a tabela numerada de forma determinística.
            // O número da entrega define a faixa vertical da própria linha; nenhum
            // código é puxado da linha de cima/baixo.
            const v71Pagina = extrairRegistrosPdfV71(itens, pagina, width);
            let escolhidosPaginaV72 = [];
            let modoPaginaV72 = 'nenhum';

            if (v71Pagina.length) {
              v71EncontrouTabelaNumerada = true;
              modoPaginaV72 = 'linha-numerada';
              escolhidosPaginaV72 = v71Pagina;
              v71Pagina.forEach(registro => registrosV71Pdf.push(registro));
              const maiorNumeroPagina = Math.max(...v71Pagina.map(r => Number(r.numeroParada) || 0));
              sequenciaDeterministicaV72 = Math.max(sequenciaDeterministicaV72, maiorNumeroPagina);
            } else {
              const porCodigoV71 = extrairRegistrosPdfV71PorCodigo(
                itens,
                pagina,
                width,
                sequenciaDeterministicaV72
              );
              sequenciaDeterministicaV72 = porCodigoV71.sequencia;
              sequenciaCodigoV71Pdf = porCodigoV71.sequencia;
              modoPaginaV72 = porCodigoV71.registros.length ? 'codigo-na-linha' : 'nenhum';
              escolhidosPaginaV72 = porCodigoV71.registros;
              porCodigoV71.registros.forEach(registro => registrosCodigoV71Pdf.push(registro));
            }

            escolhidosPaginaV72.forEach(registro => {
              registrosDeterministicosV72.push({
                ...registro,
                origemLeituraOriginal: registro.origemLeitura,
                origemLeitura: 'deterministico-v72'
              });
              (registro.codigos || []).forEach(codigo => codigosFonteV72.add(codigo));
            });

            // Códigos completos que aparecem literalmente no PDF também entram
            // na conferência. Não usamos códigos inventados por leitores legados.
            itens.forEach(item => {
              extrairCodigosBrFlexiveis(item.str).forEach(codigo => codigosFonteV72.add(codigo));
            });

            diagnosticoPaginasV72.push({
              pagina,
              modo: modoPaginaV72,
              entregas: escolhidosPaginaV72.length,
              codigos: new Set(escolhidosPaginaV72.flatMap(r => r.codigos || [])).size
            });

            // V70 legado: só será usado depois se não houver tabela numerada V71.
            const livresPagina = extrairRegistrosPdfPosicaoLivre(itens, pagina, width);
            livresPagina.forEach(registro => {
              if (!Number.isFinite(Number(registro.numeroParada)) || Number(registro.numeroParada) <= 0) {
                registro.numeroParada = ++sequenciaPosicaoLivrePdf;
              } else {
                sequenciaPosicaoLivrePdf = Math.max(sequenciaPosicaoLivrePdf, Number(registro.numeroParada));
              }
              registrosPosicaoLivrePdf.push(registro);
              (registro.codigos || []).forEach(codigo => codigosGlobais.add(codigo));
            });

            /*
             * LEITOR UNIVERSAL / COMPATIBILIDADE
             * Reconstrói linhas visuais usando a posição Y e X do PDF.js.
             * Isso permite cair no leitor antigo se o formato da tabela mudar.
             */
            const gruposLinhaFallback = [];
            const itensOrdenadosFallback = itens
              .slice()
              .sort((a, b) => {
                if (Math.abs(a.y - b.y) <= 2.5) return a.x - b.x;
                return b.y - a.y;
              });

            for (const item of itensOrdenadosFallback) {
              let grupo = gruposLinhaFallback.find(g => Math.abs(g.y - item.y) <= 2.5);

              if (!grupo) {
                grupo = { y: item.y, itens: [] };
                gruposLinhaFallback.push(grupo);
              }

              grupo.itens.push(item);
            }

            gruposLinhaFallback
              .sort((a, b) => b.y - a.y)
              .forEach(grupo => {
                const linha = grupo.itens
                  .slice()
                  .sort((a, b) => a.x - b.x)
                  .map(i => i.str)
                  .join(' ')
                  .replace(/\s+/g, ' ')
                  .trim();

                if (linha) linhasFallbackPdf.push(linha);
              });

            // V51 — leitura direta por linha visual.
            // Esta é a estratégia principal para Spoke/Circuit com coluna # vazia.
            gruposLinhaFallback
              .slice()
              .sort((a, b) => b.y - a.y)
              .forEach(grupo => {
                const linhaItens = grupo.itens.slice().sort((a, b) => a.x - b.x);
                if (!linhaItens.length) return;

                let codigo = '';
                let indiceCodigo = -1;
                for (let i = 0; i < linhaItens.length; i++) {
                  const janela = linhaItens.slice(i, Math.min(linhaItens.length, i + 4)).map(x => x.str).join(' ');
                  const achados = extrairCodigosBrFlexiveis(janela);
                  if (achados.length) { codigo = achados[0]; indiceCodigo = i; break; }
                }
                if (!codigo || codigosGlobais.has(`VISUAL:${codigo}`)) return;

                const limite = indiceCodigo >= 0 ? indiceCodigo : linhaItens.length;
                let partesEndereco = linhaItens.slice(0, limite).map(i => i.str).filter(Boolean);
                // Remove número da coluna # quando existir, mas não exige que ele exista.
                let numeroExplicito = null;
                if (partesEndereco.length && /^\d{1,4}$/.test(String(partesEndereco[0]).trim())) {
                  numeroExplicito = Number(partesEndereco.shift());
                }
                let enderecoVisual = partesEndereco.join(' ').replace(/\s+/g, ' ').trim();
                enderecoVisual = enderecoVisual
                  .replace(/^\s*(?:#|Address|Endere[cç]o)\s*/i, '')
                  .replace(/\s+\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*$/i, '')
                  .trim();

                if (!decomporEnderecorota(enderecoVisual)) return;
                if (!Number.isFinite(numeroExplicito) || numeroExplicito <= 0) numeroExplicito = ++sequenciaVisualPdf;
                else sequenciaVisualPdf = Math.max(sequenciaVisualPdf, numeroExplicito);

                registrosVisuaisPdf.push({
                  numeroParada: numeroExplicito,
                  endereco: enderecoVisual,
                  codigos: [codigo],
                  pagina,
                  origemLeitura: 'visual-v51'
                });
                // marcador interno para não duplicar a mesma extração visual.
                codigosGlobais.add(`VISUAL:${codigo}`);
              });

            // Remove marcadores internos antes da validação global.
            [...codigosGlobais].filter(c => c.startsWith('VISUAL:')).forEach(c => codigosGlobais.delete(c));

            // Conta TODOS os códigos BR do PDF, inclusive quando o PDF.js
            // separa um mesmo código em vários itens/fragmentos.
            gruposLinhaFallback.forEach(grupo => {
              const linhaCompleta = grupo.itens.slice().sort((a,b)=>a.x-b.x).map(i=>i.str).join(' ');
              extrairCodigosBrFlexiveis(linhaCompleta).forEach(c => codigosGlobais.add(c));
            });
            // Também preserva códigos que já vieram inteiros em itens isolados.
            itens.forEach(item => extrairCodigosBrFlexiveis(item.str).forEach(c => codigosGlobais.add(c)));

            /*
             * Âncoras da coluna "#" do rota.
             * Não agrupamos mais linhas por arredondamento variável.
             * Cada número da coluna esquerda define matematicamente a faixa
             * vertical daquela entrega.
             */
            const candidatosNumero = itens
              .filter(item =>
                item.x < width * 0.10 &&
                /^\d{1,3}$/.test(item.str)
              )
              .map(item => ({
                numero: parseInt(item.str, 10),
                x: item.x,
                y: item.y
              }))
              .filter(item =>
                Number.isFinite(item.numero) &&
                item.numero > 0 &&
                item.numero <= 999
              );

            // Elimina falsos números escolhendo a sequência crescente do rota.
            const ordenadosY = candidatosNumero
              .slice()
              .sort((a, b) => b.y - a.y);

            let marcadores = [];

            for (const candidato of ordenadosY) {
              if (marcadores.length === 0) {
                marcadores.push(candidato);
                continue;
              }

              const ultimo = marcadores[marcadores.length - 1];

              // Dentro da mesma página os números da rota sempre avançam.
              if (candidato.numero > ultimo.numero) {
                marcadores.push(candidato);
              }
            }

            for (let m = 0; m < marcadores.length; m++) {
              const atual = marcadores[m];

              const ySuperior = m === 0
                ? atual.y + 20
                : (marcadores[m - 1].y + atual.y) / 2;

              const yInferior = m === marcadores.length - 1
                ? atual.y - 20
                : (atual.y + marcadores[m + 1].y) / 2;

              const itensDaLinha = itens
                .filter(item =>
                  item.y <= ySuperior &&
                  item.y > yInferior
                )
                .slice()
                .sort((a, b) => {
                  // Primeiro lê da esquerda para a direita.
                  // Para pequenos desalinhamentos verticais, preserva a coluna.
                  if (Math.abs(a.y - b.y) <= 3) return a.x - b.x;
                  return b.y - a.y;
                });

              const textoCompleto = itensDaLinha
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              /*
               * V69 - Circuit com código quebrado dentro da coluna Notes.
               *
               * Alguns exports do Circuit desenham o código em DUAS linhas no
               * mesmo campo, por exemplo:
               *
               *   BR265691124855
               *   W;
               *
               * A ordenação global por Y pode colocar o endereço inteiro entre
               * essas duas partes e o leitor antigo deixa de enxergar o código.
               * Aqui reconstruímos a coluna Notes separadamente, usando a posição
               * X. Assim BR + 12 dígitos + caractere final volta a ser uma unidade.
               */
              const itensNotasDaLinha = itensDaLinha
                .filter(item => item.x >= width * 0.78)
                .slice()
                .sort((a, b) => {
                  if (Math.abs(a.y - b.y) <= 3) return a.x - b.x;
                  return b.y - a.y;
                });

              const textoNotas = itensNotasDaLinha
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              let codigos = [...new Set(
                extrairCodigosBrFlexiveis(textoNotas)
              )].slice(0, 1);

              // Compatibilidade com layouts em que Notes não fica na última coluna.
              if (codigos.length === 0) {
                codigos = [...new Set(
                  extrairCodigosBrFlexiveis(textoCompleto)
                )].slice(0, 1);
              }

              if (codigos.length === 0) continue;

              // A reconstrução por faixa é também fonte válida para a contagem global.
              codigos.forEach(codigo => codigosGlobais.add(codigo));

              /*
               * Reconstrói SOMENTE a coluna Address. Isso evita que o prefixo do
               * código (que pode ficar alguns pixels acima) seja inserido antes do
               * endereço e evita depender da posição exata do horário.
               */
              const itensEnderecoDaLinha = itensDaLinha
                .filter(item => item.x >= width * 0.065 && item.x < width * 0.68)
                .slice()
                .sort((a, b) => {
                  if (Math.abs(a.y - b.y) <= 3) return a.x - b.x;
                  return b.y - a.y;
                });

              let endereco = itensEnderecoDaLinha
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              // Compatibilidade com PDFs que não respeitam as colunas esperadas.
              if (!endereco || !decomporEnderecorota(endereco)) {
                endereco = textoCompleto
                  .replace(new RegExp(`^${atual.numero}\\s+`), '')
                  .trim();

                const posHorario = endereco.search(/\b\d{1,2}:\d{2}\b/);
                if (posHorario >= 0) {
                  endereco = endereco.slice(0, posHorario).trim();
                } else {
                  const posCodigoEndereco = endereco.search(/\bBR(?:[\s._-]*[0-9])/i);
                  if (posCodigoEndereco >= 0) endereco = endereco.slice(0, posCodigoEndereco).trim();
                }
              }

              // Remove eventual número da coluna # e pequenas quebras de palavra
              // vistas em exports do Circuit ("São Paul o" -> "São Paulo").
              endereco = endereco
                .replace(/^\d{1,3}\s+/, '')
                .replace(/\bS(?:ã|a)o\s+Paul\s+o\b/gi, 'São Paulo')
                .replace(/\s+/g, ' ')
                .trim();

              if (!endereco) continue;

              registrosrota.push({
                numeroParada: atual.numero,
                endereco,
                codigos,
                pagina
              });
            }
          }

          const codigosLidos = new Set();
          registrosrota.forEach(r =>
            r.codigos.forEach(c => codigosLidos.add(c))
          );

          const numerosParada = [...new Set(
            registrosrota.map(r => Number(r.numeroParada))
          )].sort((a, b) => a - b);

          const maiorParada = numerosParada.length
            ? numerosParada[numerosParada.length - 1]
            : 0;

          const sequenciaCompleta =
            maiorParada > 0 &&
            numerosParada.length === maiorParada &&
            numerosParada.every((n, i) => n === i + 1);

          const paradasSemEnderecoValido = registrosrota
            .filter(r => !decomporEnderecorota(r.endereco))
            .map(r => r.numeroParada);

          atualizarTelaCarregamentoPdf(
            82,
            'Validando a rota...',
            'Fazendo a conferência final'
          );

          /*
           * MODO HÍBRIDO:
           * 1) Tenta primeiro a leitura estrita, que preserva melhor agrupamentos.
           * 2) Se qualquer detalhe do layout divergir, NÃO rejeita mais o PDF.
           *    O app cai automaticamente no leitor de compatibilidade antigo.
           */
          const leituraEstritaOk =
            codigosGlobais.size > 0 &&
            codigosLidos.size === codigosGlobais.size &&
            sequenciaCompleta &&
            paradasSemEnderecoValido.length === 0;

          atualizarTelaCarregamentoPdf(
            92,
            leituraEstritaOk
              ? 'Organizando as paradas...'
              : 'Conferindo um formato diferente sem aproximar paradas...',
            'Quase pronto'
          );

          let processado = false;

          function contarCodigosDosRegistros(lista) {
            const set = new Set();
            (Array.isArray(lista) ? lista : []).forEach(r => (r?.codigos || []).forEach(c => set.add(String(c || '').toUpperCase())));
            return set.size;
          }

          // V72 é a fonte de verdade: combina, por página, linha numerada ou
          // código ancorado na própria linha. Não associa pacote ao endereço vizinho.
          if (registrosDeterministicosV72.length) {
            try {
              processarRegistrosrota(registrosDeterministicosV72, file.name);
              processado = rotaPdfPossuiDadosProcessados();
            } catch (erroV72) {
              console.error('Leitor V72 recusou uma associação insegura:', erroV72);
              throw erroV72;
            }
          }

          // V71 não usa mais o antigo "endereço mais próximo" como fallback.
          // Leitores aproximados permanecem no código apenas por compatibilidade
          // histórica, mas não liberam uma rota nova.

          if (!processado && leituraEstritaOk) {
            try {
              processarRegistrosrota(registrosrota, file.name);
              processado = rotaPdfPossuiDadosProcessados();
            } catch (erroEstrito) {
              console.warn(
                'Leitura estrita não serviu para este PDF. Tentando modo compatível:',
                erroEstrito
              );
            }
          }

          if (!processado && registrosVisuaisPdf.length) {
            try {
              const totalVisual = contarCodigosDosRegistros(registrosVisuaisPdf);
              // Não aceita uma leitura parcial se o próprio PDF já revelou mais códigos.
              if (!codigosGlobais.size || totalVisual >= codigosGlobais.size) {
                processarRegistrosrota(registrosVisuaisPdf, file.name);
                processado = rotaPdfPossuiDadosProcessados();
              } else {
                console.info(`Leitura visual encontrou ${totalVisual}/${codigosGlobais.size}. A rota não será liberada parcialmente.`);
              }
            } catch (erroVisual) {
              console.warn('Leitura visual exata não concluiu este PDF:', erroVisual);
            }
          }

          if (!processado) {
            throw new Error('NENHUM_REGISTRO_PDF');
          }

          // V62: contagem de pacotes é a fonte de verdade. Não libera uma rota
          // silenciosamente com 26/30, por exemplo. Se o PDF revelou 30 códigos,
          // os 30 precisam chegar à Bipagem.
          const codigosEsperadosV72 = registrosDeterministicosV72.length
            ? codigosFonteV72
            : codigosGlobais;

          if (codigosEsperadosV72.size > 0 && todosPacotes.size !== codigosEsperadosV72.size) {
            throw new Error(`CONTAGEM_CODIGOS_DIVERGENTE|${todosPacotes.size}|${codigosEsperadosV72.size}`);
          }

          try {
            window.diagnosticoPdfV72 = {
              build: 72,
              arquivo: file.name,
              paginas: diagnosticoPaginasV72,
              entregas: totalEntregasPdfAtual,
              pacotes: todosPacotes.size,
              paradasFisicas: Object.keys(mapaRotas || {}).length,
              codigosEsperados: codigosEsperadosV72.size
            };
          } catch (_) {}

          const tempoVisualDecorrido = Date.now() - inicioVisualLeituraPdf;
          const esperaVisualRestante = Math.max(0, 1500 - tempoVisualDecorrido);

          atualizarTelaCarregamentoPdf(
            96,
            'Finalizando sua rota...',
            'Só mais um instante'
          );

          await new Promise(resolve => setTimeout(resolve, esperaVisualRestante));
          concluirTelaCarregamentoPdf();

          notificar(
            ` PDF processado com sucesso`
          );

        } catch (err) {
          console.error("Erro leitura PDF rota:", err);

          const msg = String(err?.message || err || '');
          let mensagemErro =
            'Não conseguimos conferir este PDF com segurança. Nenhuma rota foi liberada.';

          if (msg.startsWith('LEITURA_INCOMPLETA|')) {
            mensagemErro =
              'A leitura ficou incompleta. Para evitar uma contagem errada, a rota não foi liberada. Escolha o PDF novamente.';
          } else if (msg.startsWith('CONTAGEM_PDF_INCOMPLETA|')) {
            const partes = msg.split('|');
            mensagemErro = `O PDF possui ${partes[2] || 'mais'} códigos de pacote, mas só ${partes[1] || 'alguns'} puderam ser associados com segurança. A rota não foi liberada com contagem errada.`;
          } else if (msg.startsWith('ENDERECO_NAO_IDENTIFICADO|')) {
            const partes = msg.split('|');
            mensagemErro =
              `A entrega ${partes[1] || ''} possui um endereço que não pôde ser identificado com segurança. Para não criar uma parada errada, a rota não foi liberada.`;
          } else if (msg.startsWith('CODIGO_INCOMPLETO_LINHA|')) {
            const partes = msg.split('|');
            mensagemErro =
              `O PDF contém código BR incompleto na(s) entrega(s) ${partes[1] || ''}. O app não usou caracteres de outra parada para completar o código.`;
          } else if (msg.startsWith('ENTREGA_SEM_CODIGO|')) {
            const partes = msg.split('|');
            mensagemErro =
              `Este manifesto contém códigos BR, mas a(s) entrega(s) ${partes[1] || ''} ficaram sem código. A rota foi bloqueada para não alterar a quantidade de pacotes.`;
          } else if (msg.startsWith('PARADA_AMBIGUA|')) {
            const partes = msg.split('|');
            mensagemErro =
              `A entrega ${partes[1] || ''} apareceu com dois endereços diferentes no PDF. A rota não foi liberada para evitar associação incorreta.`;
          } else if (msg.startsWith('SEQUENCIA_PARADAS_INCOMPLETA|')) {
            mensagemErro =
              'A numeração das entregas ficou incompleta durante a leitura. O app não renumerou nem adivinhou as paradas; importe o PDF novamente.';
          } else if (msg.startsWith('PACOTE_EM_DUAS_PARADAS|')) {
            mensagemErro =
              'O mesmo código de pacote apareceu associado a duas entregas diferentes. A rota foi bloqueada para evitar uma bipagem incorreta.';
          } else if (msg.startsWith('CONTAGEM_CODIGOS_DIVERGENTE|')) {
            const partes = msg.split('|');
            mensagemErro =
              `A conferência encontrou ${partes[2] || 'mais'} código(s) BR no PDF, mas somente ${partes[1] || 'alguns'} ficaram associados a entregas válidas. Para não errar a quantidade, a rota não foi liberada.`;
          } else if (msg.includes('NENHUM_REGISTRO_PDF') || msg.includes('NENHUM_PACOTE_VALIDO')) {
            mensagemErro =
              'Não encontramos linhas de entrega que pudessem ser validadas com segurança neste PDF. Nenhuma parada foi criada por aproximação.';
          }

          document.getElementById('btnUploadTxt').innerHTML =
            " Escolher Arquivo PDF";
          document.getElementById('btnVerParadasModal').style.display = 'none';
          document.getElementById('areaExecucao').style.display = 'none';
          const uploadSec = document.getElementById('elSecaoUpload');
          const toolbarSec = document.getElementById('toolbarRotaAtiva');
          if (uploadSec) uploadSec.style.display = 'block';
          if (toolbarSec) toolbarSec.style.display = 'none';

          mostrarErroTelaCarregamentoPdf(mensagemErro);
        }
      };
      reader.readAsArrayBuffer(file);
    });

    function decomporChaveEndereco(endKey) {
      const m = String(endKey || '').match(/^(.*)_(\d{1,6})$/);
      if (!m) return null;
      return { rua: m[1], numero: m[2] };
    }

    function tokensRuaCanonica(texto) {
      const d = decomporEnderecorota(texto);
      if (d) return d.tokens;

      return removerAcentosEndereco(String(texto || ''))
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter(t => ![
          'r','rua','av','avenida','al','alameda','tv','travessa',
          'est','estrada','rod','rodovia','pca','praca',
          'da','de','do','das','dos','e'
        ].includes(t))
        .map(normalizarTokenLogradourorota);
    }

    function tokenRuaEquivalente(a, b) {
      if (a === b) return true;

      // Abreviação de uma letra: "S" x "Silveira".
      if (a.length === 1 && b.startsWith(a)) return true;
      if (b.length === 1 && a.startsWith(b)) return true;

      // Abreviações maiores do próprio relatório: "Alexandr" x "Alexandrino".
      if (
        a.length >= 3 &&
        b.length >= 3 &&
        (a.startsWith(b) || b.startsWith(a))
      ) {
        return true;
      }

      return false;
    }

    function ruasProvavelmenteIguais(a, b) {
      const ta = tokensRuaCanonica(a);
      const tb = tokensRuaCanonica(b);

      if (!ta.length || !tb.length) return false;

      const menor = ta.length <= tb.length ? ta : tb;
      const maior = ta.length <= tb.length ? tb : ta;

      const usados = new Set();
      let acertos = 0;

      for (const token of menor) {
        let achou = -1;

        for (let i = 0; i < maior.length; i++) {
          if (usados.has(i)) continue;
          if (tokenRuaEquivalente(token, maior[i])) {
            achou = i;
            break;
          }
        }

        if (achou >= 0) {
          usados.add(achou);
          acertos++;
        }
      }

      // Para uma via de um único token, exige equivalência total.
      if (menor.length === 1) return acertos === 1;

      // Para nomes maiores, exige pelo menos dois tokens compatíveis e 75%.
      return acertos >= 2 && (acertos / menor.length) >= 0.75;
    }

    function hashLeiturarota(texto) {
      // FNV-1a 32-bit: diagnóstico simples e determinístico entre aparelhos.
      let h = 0x811c9dc5;
      const s = String(texto || '');
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
      }
      return (h >>> 0).toString(16).padStart(8, '0').toUpperCase();
    }

    function aplicarModoBipagemPdfAtual() {
      const camera = document.getElementById('elCameraViewport');
      const manual = document.getElementById('inputManual');
      const resultado = document.getElementById('cardResult');
      const aviso = document.getElementById('boxAviso');

      if (pdfSemCodigosBipagem) {
        if (camera) camera.style.display = 'none';
        if (manual) manual.style.display = 'none';
        if (resultado) resultado.style.display = 'none';
        if (aviso) {
          aviso.dataset.pdfSemCodigo = '1';
          aviso.style.display = 'block';
          aviso.innerText = `PDF lido com segurança: ${totalEntregasPdfAtual} entrega(s) em ${Object.keys(mapaRotas || {}).length} parada(s) física(s). Este arquivo não contém códigos BR de pacote; a lista de paradas foi carregada, mas a bipagem por câmera não pode ser validada sem os códigos.`;
        }
      } else {
        if (camera) camera.style.display = '';
        if (manual) manual.style.display = '';
        if (aviso?.dataset?.pdfSemCodigo === '1') {
          aviso.style.display = 'none';
          aviso.innerText = '';
          delete aviso.dataset.pdfSemCodigo;
        }
      }
    }

    function rotaPdfPossuiDadosProcessados() {
      return Object.keys(mapaRotas || {}).length > 0 && totalEntregasPdfAtual > 0;
    }

    function processarRegistrosrota(registros, nomeArquivo) {
      mapaRotas = {};
      stopCorrespondente = {};
      nomeExibicao = {};
      todosPacotes = new Set();
      pacotesBipados = new Set();
      entregasOriginaisPorEndereco = {};
      paradaFisicaPorEndereco = {};
      totalEntregasPdfAtual = 0;
      pdfSemCodigosBipagem = false;

      const entrada = (Array.isArray(registros) ? registros : [])
        .map((registro, indice) => ({
          ...registro,
          numeroParada: Number(registro?.numeroParada),
          endereco: limparTextoEnderecoPdfV71(registro?.endereco || ''),
          codigos: [...new Set((registro?.codigos || []).map(normalizarCodigoPacoteBr).filter(Boolean))],
          _indice: indice
        }))
        .filter(r => Number.isFinite(r.numeroParada) && r.numeroParada > 0);

      if (!entrada.length) throw new Error('NENHUM_REGISTRO_PDF');

      // Em uma tabela V71 numerada, a própria sequência do PDF é fonte de verdade.
      // Se faltar 18 entre 17 e 19, por exemplo, não renumeramos nem aproximamos:
      // a importação é bloqueada para não criar uma parada errada.
      if (entrada.some(r => r.origemLeitura === 'linhas-v71' || r.origemLeitura === 'deterministico-v72')) {
        const numerosV71 = [...new Set(
          entrada
            .filter(r => (r.origemLeitura === 'linhas-v71' || r.origemLeitura === 'deterministico-v72') && !r.auxiliarDestino)
            .map(r => Number(r.numeroParada))
            .filter(Number.isFinite)
        )].sort((a,b) => a-b);

        if (numerosV71.length) {
          const maior = numerosV71[numerosV71.length - 1];
          const completa = numerosV71[0] === 1 &&
            numerosV71.length === maior &&
            numerosV71.every((n, i) => n === i + 1);
          if (!completa) {
            throw new Error(`SEQUENCIA_PARADAS_INCOMPLETA|${numerosV71.join(',')}`);
          }
        }
      }

      // Se há um prefixo BR incompleto dentro de uma linha numerada, não tentamos
      // compensar pegando caractere de outra entrega. Bloqueia em vez de chutar.
      const prefixosIncompletos = entrada.filter(r => r.prefixoIncompleto === true);
      if (prefixosIncompletos.length) {
        throw new Error(`CODIGO_INCOMPLETO_LINHA|${prefixosIncompletos.map(r => r.numeroParada).join(',')}`);
      }

      const temAlgumCodigo = entrada.some(r => r.codigos.length > 0);
      let entregasBase = entrada.slice();

      if (temAlgumCodigo) {
        // Linhas explicitamente marcadas como destino/retorno não são pacotes.
        entregasBase = entregasBase.filter(r => !r.auxiliarDestino);

        // Em um manifesto que contém códigos, uma entrega numerada sem código é
        // uma inconsistência real. Não descartamos silenciosamente.
        const semCodigo = entregasBase.filter(r => r.codigos.length === 0);
        if (semCodigo.length) {
          throw new Error(`ENTREGA_SEM_CODIGO|${semCodigo.map(r => r.numeroParada).join(',')}`);
        }
      }

      const porNumero = new Map();
      const donoCodigo = new Map();

      entregasBase.forEach(registro => {
        const numero = registro.numeroParada;
        const dadosEndereco = decomporEnderecoFisicoPdfV71(registro.endereco);
        if (!dadosEndereco) {
          throw new Error(`ENDERECO_NAO_IDENTIFICADO|${numero}`);
        }

        const existente = porNumero.get(numero);
        if (!existente) {
          porNumero.set(numero, {
            numeroParada: numero,
            endereco: registro.endereco,
            chaveFisica: dadosEndereco.chave,
            codigos: registro.codigos.slice(),
            pagina: registro.pagina || 0
          });
        } else {
          if (existente.chaveFisica !== dadosEndereco.chave) {
            throw new Error(`PARADA_AMBIGUA|${numero}`);
          }
          registro.codigos.forEach(c => {
            if (!existente.codigos.includes(c)) existente.codigos.push(c);
          });
          if (registro.endereco.length > existente.endereco.length) existente.endereco = registro.endereco;
        }
      });

      const entregas = Array.from(porNumero.values()).sort((a,b) => a.numeroParada - b.numeroParada);
      if (!entregas.length) throw new Error('NENHUM_REGISTRO_PDF');

      entregas.forEach(entrega => {
        entrega.codigos.forEach(codigo => {
          if (donoCodigo.has(codigo) && donoCodigo.get(codigo) !== entrega.numeroParada) {
            throw new Error(`PACOTE_EM_DUAS_PARADAS|${codigo}|${donoCodigo.get(codigo)}|${entrega.numeroParada}`);
          }
          donoCodigo.set(codigo, entrega.numeroParada);
        });
      });

      const grupos = new Map();
      entregas.forEach(entrega => {
        const chave = entrega.chaveFisica;
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(entrega);
      });

      const gruposOrdenados = Array.from(grupos.entries())
        .map(([chave, lista]) => ({
          chave,
          entregas: lista.slice().sort((a,b) => a.numeroParada - b.numeroParada)
        }))
        .sort((a,b) => a.entregas[0].numeroParada - b.entregas[0].numeroParada);

      gruposOrdenados.forEach((grupo, indiceFisico) => {
        const numeroFisico = indiceFisico + 1;
        const endKey = grupo.chave;
        const enderecos = grupo.entregas.map(e => String(e.endereco || '')).filter(Boolean);
        const exibicao = enderecos.sort((a,b) => b.length - a.length || a.localeCompare(b))[0] || 'Endereço do PDF';
        const linhasOriginais = [...new Set(grupo.entregas.map(e => Number(e.numeroParada)).filter(Number.isFinite))].sort((a,b) => a-b);
        const codigos = [...new Set(grupo.entregas.flatMap(e => e.codigos || []))];

        mapaRotas[endKey] = codigos;
        nomeExibicao[endKey] = exibicao;
        entregasOriginaisPorEndereco[endKey] = linhasOriginais;
        paradaFisicaPorEndereco[endKey] = numeroFisico;

        codigos.forEach(codigo => {
          todosPacotes.add(codigo);
          stopCorrespondente[codigo] = numeroFisico;
        });
      });

      totalEntregasPdfAtual = entregas.length;
      pdfSemCodigosBipagem = todosPacotes.size === 0;

      // Em PDFs com código, a fonte de verdade é o conjunto exato de BRs lidos
      // dentro das linhas. Nenhum código pode desaparecer no agrupamento físico.
      if (!pdfSemCodigosBipagem && todosPacotes.size !== donoCodigo.size) {
        throw new Error(`CONTAGEM_INTERNA_DIVERGENTE|${todosPacotes.size}|${donoCodigo.size}`);
      }

      if (chaveStorageAtual && !pdfSemCodigosBipagem) {
        const salvos = localStorage.getItem(chaveStorageAtual);
        if (salvos) {
          try {
            pacotesBipados = new Set(
              (JSON.parse(salvos) || [])
                .map(c => normalizarCodigoPacoteBr(c))
                .filter(c => c && todosPacotes.has(c))
            );
          } catch (_) {}
        }
      }

      document.getElementById('btnUploadTxt').innerHTML = ' ' + nomeArquivo.substring(0, 20) + '...';
      document.getElementById('btnVerParadasModal').style.display = 'flex';
      document.getElementById('areaExecucao').style.display = 'block';
      entrarModoRotaAtiva();
      document.getElementById('cardRetomarRota').style.display = 'none';

      aplicarModoBipagemPdfAtual();
      salvarEstadoCompletoRota(nomeArquivo);

      // Só entra no histórico de bipagem quando o manifesto realmente possui
      // códigos escaneáveis. PDF só de endereço continua disponível para lista/rota.
      if (!pdfSemCodigosBipagem) {
        salvarOuAtualizarHistoricoRota(
          nomeArquivo,
          todosPacotes.size,
          Object.keys(mapaRotas).length,
          false,
          null
        );
      }

      atualizarStats();
      if (!pdfSemCodigosBipagem) iniciarScanner();

      const gruposMultiplos = Object.keys(mapaRotas).filter(chave => (entregasOriginaisPorEndereco[chave] || []).length > 1);
      const entregasEmMultiplas = gruposMultiplos.reduce((s, chave) => s + (entregasOriginaisPorEndereco[chave] || []).length, 0);

      try {
        window.diagnosticoRotaReal = {
          arquivo: nomeArquivo,
          totalEntregas: totalEntregasPdfAtual,
          totalPacotes: todosPacotes.size,
          totalParadas: Object.keys(mapaRotas).length,
          semCodigos: pdfSemCodigosBipagem,
          paradas: Object.keys(mapaRotas).map(chave => ({
            paradaFisica: paradaFisicaPorEndereco[chave],
            endereco: nomeExibicao[chave],
            entregasPdf: entregasOriginaisPorEndereco[chave] || [],
            pacotes: mapaRotas[chave] || []
          }))
        };
        console.table(window.diagnosticoRotaReal.paradas);
      } catch (_) {}

      if (pdfSemCodigosBipagem) {
        notificar(` PDF lido • ${totalEntregasPdfAtual} entregas • ${Object.keys(mapaRotas).length} paradas • sem códigos BR para bipagem`);
      } else {
        notificar(` Rota pronta • ${todosPacotes.size} pacotes • ${Object.keys(mapaRotas).length} paradas${gruposMultiplos.length ? ` • ${gruposMultiplos.length} múltiplas (${entregasEmMultiplas} entregas)` : ''}`);
      }
    }


    function processarLinhasExatas(linhas, nomeArquivo) {
      mapaRotas = {};
      stopCorrespondente = {};
      nomeExibicao = {};
      todosPacotes = new Set();
      pacotesBipados = new Set();

      /*
       * Leitura específica e robusta para PDF exportado pelo rota.
       *
       * A coluna "#" do rota é a fonte de verdade da parada original.
       * Cada linha que começa com 1, 2, 3... abre uma nova linha de entrega.
       * O código BR pode vir na mesma linha ou logo abaixo, por causa da forma
       * como o PDF.js separa as colunas. Em vez de "adivinhar" pelo endereço
       * vizinho, juntamos todo o conteúdo até a próxima parada numerada.
       */
      let registros = [];

      for (let i = 0; i < linhas.length; i++) {
        const linha = String(linhas[i] || '').replace(/\s+/g, ' ').trim();
        if (!linha) continue;

        const inicio = linha.match(/^(\d{1,3})\s+(.+)$/);
        if (!inicio) continue;

        const numeroParada = parseInt(inicio[1], 10);

        // Evita interpretar datas/horários/cabeçalhos como parada.
        if (!Number.isFinite(numeroParada) || numeroParada <= 0 || numeroParada > 999) {
          continue;
        }

        let bloco = linha;
        let j = i + 1;

        // Junta linhas auxiliares dessa mesma linha da tabela até a próxima
        // linha que claramente começa com outro número de parada.
        while (j < linhas.length) {
          const prox = String(linhas[j] || '').replace(/\s+/g, ' ').trim();
          if (!prox) {
            j++;
            continue;
          }

          // CORREÇÃO PONTUAL: qualquer nova linha numerada do rota
          // encerra a parada atual. Antes, a próxima parada só encerrava o
          // bloco se linhaPareceEnderecorota() também reconhecesse o texto;
          // quando o PDF.js fragmentava a linha, o BR da parada seguinte podia
          // vazar para a parada anterior e gerar falso "mesmo endereço".
          if (/^\d{1,3}\s+\S/.test(prox)) {
            break;
          }

          // Cabeçalhos de página não pertencem à entrega.
          if (/^(#|Address|Estimated Arrival|Time|Notes)$/i.test(prox)) {
            j++;
            continue;
          }

          // Junta no máximo algumas linhas auxiliares. Normalmente é só a
          // continuação da coluna Notes/código do pacote.
          if (j - i <= 4) {
            bloco += ' ' + prox;
          } else {
            break;
          }

          j++;
        }

        const codigos = [...new Set(
          extrairCodigosBrFlexiveis(bloco)
        )].slice(0, 1);

        if (codigos.length === 0) {
          continue;
        }

        // A linha inicial contém o endereço. O bloco completo contém também
        // horário e Notes, mas extrairEnderecoExibicao remove o código BR.
        const linhaEndereco = linha;
        const enderecoExibicao = extrairEnderecoExibicao(linhaEndereco);
        let endKey = normalizarEndereco(linhaEndereco);

        if (!endKey || !decomporEnderecorota(enderecoExibicao || linhaEndereco)) {
          console.warn('Pacote É Mato: registro PDF ignorado por endereço incompleto.', { numeroParada, linhaEndereco, codigos });
          continue;
        }

        registros.push({
          numeroParada,
          linhaEndereco,
          enderecoExibicao,
          endKey,
          codigos
        });
      }

      /*
       * Fallback: caso uma versão do rota não traga o número da parada no
       * começo da linha extraída pelo PDF.js, usa o método de proximidade.
       */
      if (registros.length === 0) {
        let seqStopAuto = 0;

        linhas.forEach((linhaOriginal, idx) => {
          const linhaStr = String(linhaOriginal || '').replace(/\s+/g, ' ').trim();
          if (!linhaStr) return;

          let codigos = [...new Set(
            extrairCodigosBrFlexiveis(linhaStr)
          )].slice(0, 1);

          if (codigos.length === 0) return;

          seqStopAuto++;

          const linhaEndereco = encontrarLinhaEnderecorota(linhas, idx);
          const numeroParada = extrairNumeroParadarota(
            linhaEndereco,
            seqStopAuto
          );

          let endKey = normalizarEndereco(linhaEndereco);
          const enderecoExibicao = extrairEnderecoExibicao(linhaEndereco);
          if (!endKey || !decomporEnderecorota(enderecoExibicao || linhaEndereco)) {
            console.warn('Pacote É Mato: pacote sem endereço estrutural foi descartado do fallback.', { numeroParada, linhaEndereco, codigos });
            return;
          }

          registros.push({
            numeroParada,
            linhaEndereco,
            enderecoExibicao,
            endKey,
            codigos
          });
        });
      }

      // CORREÇÃO PONTUAL DE SEGURANÇA:
      // cada código BR só pode pertencer a uma parada original do rota.
      // Se uma leitura fragmentada ainda repetir um BR em registros consecutivos,
      // mantém a ocorrência mais recente (a própria parada seguinte) e remove o
      // vazamento da parada anterior. Isso não altera o agrupamento de endereços.
      const donoCodigo = new Map();
      registros.forEach((registro, indiceRegistro) => {
        (registro.codigos || []).forEach(codigo => {
          donoCodigo.set(String(codigo || '').toUpperCase(), indiceRegistro);
        });
      });

      registros = registros.map((registro, indiceRegistro) => ({
        ...registro,
        codigos: (registro.codigos || []).filter(codigo =>
          donoCodigo.get(String(codigo || '').toUpperCase()) === indiceRegistro
        )
      })).filter(registro => registro.codigos.length > 0);

      registros.forEach(registro => {
        const {
          numeroParada,
          enderecoExibicao,
          endKey,
          codigos
        } = registro;

        if (!mapaRotas[endKey]) {
          mapaRotas[endKey] = [];
          nomeExibicao[endKey] =
            enderecoExibicao ||
            "Endereço não identificado no PDF";
        }

        codigos.forEach(codigo => {
          todosPacotes.add(codigo);

          if (!mapaRotas[endKey].includes(codigo)) {
            mapaRotas[endKey].push(codigo);
          }

          stopCorrespondente[codigo] = numeroParada;
        });
      });

      if (todosPacotes.size === 0) {
        let lang = localStorage.getItem('idioma_preferido') || 'pt';
        let dict = traducoes[lang] || traducoes.pt;

        notificar(dict.pdf_erro);
        document.getElementById('btnUploadTxt').innerHTML =
          " Escolher Arquivo PDF";
        return;
      }

      if (chaveStorageAtual) {
        let salvos = localStorage.getItem(chaveStorageAtual);

        if (salvos) {
          try {
            pacotesBipados = new Set((JSON.parse(salvos) || []).map(c => normalizarCodigoPacoteBr(c)).filter(c => c && todosPacotes.has(c)));
          } catch (e) {}
        }
      }

      document.getElementById('btnUploadTxt').innerHTML =
        " " + nomeArquivo.substring(0, 20) + "...";

      document.getElementById('btnVerParadasModal').style.display = 'flex';
      document.getElementById('areaExecucao').style.display = 'block';
      entrarModoRotaAtiva();
      document.getElementById('cardRetomarRota').style.display = 'none';

      salvarEstadoCompletoRota(nomeArquivo);

      
const totalParadasFisicas = Object.keys(mapaRotas).length;

// ============================================================
// DIAGNÓSTICO REAL - INSERIDO NO PONTO DA CRIAÇÃO DAS PARADAS
// Aqui já existem mapaRotas e todosPacotes.
// ============================================================
try {
  const diagnosticoReal = {
    arquivo: nomeArquivo,
    totalPacotes: todosPacotes.size,
    totalParadas: totalParadasFisicas,
    paradas: Object.entries(mapaRotas).map(([endereco, pacotes]) => ({
      endereco,
      quantidadePacotes: pacotes.length,
      pacotes
    }))
  };

  window.diagnosticoRotaReal = diagnosticoReal;

  console.table(
    diagnosticoReal.paradas.map((p, i) => ({
      parada: i + 1,
      endereco: p.endereco,
      pacotes: p.quantidadePacotes
    }))
  );

  console.log("DIAGNÓSTICO REAL DA ROTA", diagnosticoReal);

} catch(e) {
  console.log("Erro diagnóstico real:", e);
}


      // Também salva no histórico no modo de compatibilidade.
      salvarOuAtualizarHistoricoRota(
        nomeArquivo,
        todosPacotes.size,
        totalParadasFisicas,
        false,
        null
      );

      atualizarStats();
      iniciarScanner();

      const gruposMultiplos = Object.values(mapaRotas)
        .filter(pacotes => pacotes.length > 1);

      const qtdParadasMultiplas = gruposMultiplos.length;
      const qtdPacotesMultiplos = gruposMultiplos
        .reduce((total, pacotes) => total + pacotes.length, 0);

      notificar(
        ` ${todosPacotes.size} pacotes •  ${totalParadasFisicas} paradas •  ${qtdPacotesMultiplos} pacotes múltiplos em ${qtdParadasMultiplas} paradas`
      );
    }

    let ultimoCodigoBipado = "";
    let tempoUltimoBip = 0;
    let processandoLeituraAtual = false;

    function processarCodigo(codigoBruto) {
      if (window.PacoteEMatoOperacoesPacotes?.estaAtiva?.()) {
        return window.PacoteEMatoOperacoesPacotes.processarCodigoOperacao(codigoBruto);
      }

      if (!codigoBruto || processandoLeituraAtual || pdfSemCodigosBipagem) return;

      const agora = Date.now();

      // V71: a bipagem é EXATA. Nunca usamos "includes", prefixo parcial ou
      // aproximação. O QR/barcode pode trazer texto ao redor, mas precisa conter
      // exatamente um código BR válido que exista no manifesto importado.
      const candidatos = new Set(extrairCodigosBrFlexiveis(String(codigoBruto)));
      const direto = normalizarCodigoPacoteBr(codigoBruto);
      if (direto) candidatos.add(direto);

      const presentes = [...candidatos].filter(c => todosPacotes.has(c));
      const identificado = presentes.length === 1 ? presentes[0] : null;
      const ambiguo = presentes.length > 1;

      if (identificado === ultimoCodigoBipado && (agora - tempoUltimoBip < 2500)) return;

      processandoLeituraAtual = true;

      const lang = localStorage.getItem('idioma_preferido') || 'pt';

      const card = document.getElementById('cardResult');
      const resStop = document.getElementById('resStop');
      const resEndereco = document.getElementById('resEndereco');
      const resPacote = document.getElementById('resPacote');
      const aviso = document.getElementById('boxAviso');

      if (identificado) {
        ultimoCodigoBipado = identificado;
        tempoUltimoBip = agora;

        pacotesBipados.add(identificado);
        if (chaveStorageAtual) {
          localStorage.setItem(chaveStorageAtual, JSON.stringify(Array.from(pacotesBipados)));
        }
        salvarEstadoCompletoRota();

        const numP = stopCorrespondente[identificado] || '?';
        let endMatch = '';
        let listaParada = [];

        for (const end in mapaRotas) {
          if ((mapaRotas[end] || []).includes(identificado)) {
            endMatch = end;
            listaParada = mapaRotas[end] || [];
            break;
          }
        }

        playBeepSucesso();
        card.classList.remove('error-state');
        card.style.display = 'block';
        resStop.innerText = 'P' + numP;

        const textoEndereco = nomeExibicao[endMatch] || 'Endereço identificado no PDF';
        resEndereco.innerText = ' ' + textoEndereco;
        resPacote.innerText = 'Pacote: ' + identificado;

        const qtdEntregasFisicas = Math.max(
          (entregasOriginaisPorEndereco[endMatch] || []).length,
          listaParada.length
        );

        if (qtdEntregasFisicas > 1 && !endMatch.startsWith('pacote_isolado_')) {
          const linhas = entregasOriginaisPorEndereco[endMatch] || [];
          const origem = linhas.length ? ` • entregas ${linhas.join(' · ')}` : '';
          aviso.style.display = 'block';
          aviso.innerText =
            `PARADA MÚLTIPLA • ${qtdEntregasFisicas} entrega${qtdEntregasFisicas === 1 ? '' : 's'} neste endereço${origem}`;
        } else {
          aviso.style.display = 'none';
        }

        atualizarProgressoParada(endMatch);

        liberarVozPorInteracao();
        // Todas as entregas do mesmo imóvel usam o MESMO número físico.
        falarParada(numP, false, null);

        atualizarStats();
        verificarConclusaoRota();
        document.getElementById('inputManual').value = '';
      } else {
        if (agora - tempoUltimoBip > 2000) {
          tempoUltimoBip = agora;
          playBeepErro();

          card.classList.add('error-state');
          card.style.display = 'block';
          resStop.innerText = lang === 'en'
            ? 'NOT FOUND'
            : (lang === 'es' ? 'NO ENCONTRADO' : 'NÃO LOCALIZADO');

          if (ambiguo) {
            resEndereco.innerText = 'A leitura contém mais de um código válido. Aponte a câmera somente para uma etiqueta.';
            resPacote.innerText = 'Nenhum pacote foi confirmado.';
          } else {
            resEndereco.innerText = 'O código exato não consta no manifesto importado.';
            resPacote.innerText = 'Código lido: ' + (direto || [...candidatos][0] || String(codigoBruto).trim());
          }

          aviso.style.display = 'none';

          const progressoAnterior = document.getElementById('progressoParadaAtual');
          if (progressoAnterior) progressoAnterior.style.display = 'none';

          document.getElementById('inputManual').value = '';
        }
      }

      setTimeout(() => {
        processandoLeituraAtual = false;
      }, 1000);
    }

    function atualizarProgressoParada(endKey) {
      const box = document.getElementById('progressoParadaAtual');
      const contador = document.getElementById('progressoParadaContador');
      const barra = document.getElementById('progressoParadaBarra');
      const texto = document.getElementById('progressoParadaTexto');

      if (!box || !contador || !barra || !texto || !endKey || !mapaRotas[endKey]) {
        if (box) box.style.display = 'none';
        return;
      }

      const pacotes = mapaRotas[endKey];
      const total = pacotes.length;

      const feitos = pacotes.filter(p => pacotesBipados.has(p)).length;
      const percentual = Math.round((feitos / total) * 100);
      const faltam = Math.max(0, total - feitos);

      box.style.display = 'block';
      contador.textContent = `${feitos} de ${total}`;
      barra.style.width = `${percentual}%`;

      if (faltam === 0) {
        texto.textContent = total > 1
          ? ` Parada concluída • ${total} pacotes`
          : ' Parada concluída';
      } else {
        texto.textContent = `Falta${faltam === 1 ? '' : 'm'} ${faltam} pacote${faltam === 1 ? '' : 's'}`;
      }
    }

    function formatarDuracaoRota(ms) {
      const totalMin = Math.max(0, Math.floor(ms / 60000));
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      if (h <= 0) return `${m} min`;
      return `${h}h ${String(m).padStart(2, '0')}min`;
    }

    function fecharResumoFinalRota() {
      const modal = document.getElementById('modalResumoFinalRota');
      if (modal) modal.style.display = 'none';
    }

    function verificarConclusaoRota() {
      if (
        resumoFinalJaExibido ||
        todosPacotes.size === 0 ||
        pacotesBipados.size < todosPacotes.size
      ) {
        return;
      }

      resumoFinalJaExibido = true;
      const fim = Date.now();
      const inicio = rotaInicioEm || fim;
      const totalParadas = Object.keys(mapaRotas).length;
      const paradasMultiplas = Object.values(mapaRotas)
        .filter(p => p.length > 1).length;

      document.getElementById('finalPacotes').textContent = todosPacotes.size;
      document.getElementById('finalParadas').textContent = totalParadas;
      document.getElementById('finalMultiplas').textContent = paradasMultiplas;
      document.getElementById('finalDuracao').textContent = formatarDuracaoRota(fim - inicio);
      document.getElementById('finalInicio').textContent =
        new Date(inicio).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
      document.getElementById('finalFim').textContent =
        new Date(fim).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});

      // Só agora entra no histórico como rota realmente concluída.
      const rotaSalva = (() => {
        try {
          return JSON.parse(localStorage.getItem('rota_ativa_completa') || '{}');
        } catch (_) {
          return {};
        }
      })();

      salvarHistoricoRotaConcluida(
        rotaSalva.nomeArquivo || 'Rota concluída',
        todosPacotes.size,
        totalParadas,
        fim - inicio
      );

      salvarEstadoCompletoRota(rotaSalva.nomeArquivo || undefined);

      const modal = document.getElementById('modalResumoFinalRota');
      if (modal) modal.style.display = 'flex';
    }

    function atualizarStats() {
      const bip = pacotesBipados.size;
      const tot = todosPacotes.size;
      const paradas = Object.keys(mapaRotas).length;

      if (pdfSemCodigosBipagem) {
        document.getElementById('valPacotes').innerText = `${totalEntregasPdfAtual} entregas`;
        document.getElementById('valParadas').innerText = paradas;
        document.getElementById('valFaltam').innerText = '—';
        return;
      }

      document.getElementById('valPacotes').innerText = `${bip} / ${tot}`;
      document.getElementById('valParadas').innerText = paradas;
      document.getElementById('valFaltam').innerText = Math.max(0, tot - bip);
    }

    function playBeepSucesso() {
      if (window.PacoteEMatoBipagemArea?.somAtivo?.() === false) return;
      try {
        let ctx = getAudioContext();
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);

        if (navigator.vibrate) {
          navigator.vibrate(80);
        }
      } catch(e) {}
    }

    function playBeepErro() {
      if (window.PacoteEMatoBipagemArea?.somAtivo?.() === false) return;
      try {
        let ctx = getAudioContext();
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch(e) {}
    }

    function falarParada(num, ehDuplo, stopOutro) {
      if (window.PacoteEMatoBipagemArea?.vozAtiva?.() === false) return;
      // Versão reforçada: fala diretamente, sem depender da fila antiga.
      // Nesta versão a voz inicia ATIVA por padrão.
      let tipo = localStorage.getItem('voz_preferida') || 'navegacao_feminina';
      if (tipo === 'mudo') return;

      const lang = localStorage.getItem('idioma_preferido') || 'pt';
      let frase = String(num);

      if (ehDuplo) {
        const outra = stopOutro ? stopOutro.replace('P','') : '';
        if (lang === 'en') frase += ". Attention! Same address as stop " + outra + "!";
        else if (lang === 'es') frase += ". ¡Atención! Misma dirección que la parada " + outra + "!";
        else frase += ". Atenção! Mesmo endereço da parada " + outra + "!";
      }

      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
        console.error('Este navegador/WebView não disponibilizou speechSynthesis.');
        return;
      }

      const synth = window.speechSynthesis;
      carregarVozesSistema();

      let iniciou = false;
      let finalizou = false;

      const disparar = (tentativa = 0) => {
        try {
          synth.resume();

          const msg = new SpeechSynthesisUtterance(frase);
          msg.lang =
            lang === 'en' ? 'en-US' :
            (lang === 'es' ? 'es-ES' : 'pt-BR');
          msg.volume = 1;
          msg.rate = 1;
          msg.pitch = 1;

          const voz = selecionarVozDisponivel(lang, tipo);
          if (voz) msg.voice = voz;

          msg.onstart = () => {
            iniciou = true;
            console.log('Voz iniciou:', frase);
          };

          msg.onend = () => {
            finalizou = true;
            console.log('Voz finalizou:', frase);
          };

          msg.onerror = (ev) => {
            console.warn('Erro de voz:', ev?.error || ev);
            if (tentativa < 2 && ev?.error !== 'canceled' && ev?.error !== 'interrupted') {
              setTimeout(() => disparar(tentativa + 1), 350);
            }
          };

          synth.speak(msg);

          // Alguns Android/PWA engolem a primeira chamada sem disparar erro.
          setTimeout(() => {
            if (!iniciou && !finalizou && tentativa < 2) {
              try { synth.cancel(); } catch (_) {}
              setTimeout(() => disparar(tentativa + 1), 160);
            }
          }, 900);

        } catch (e) {
          console.error('Falha ao falar parada:', e);
          if (tentativa < 2) {
            setTimeout(() => disparar(tentativa + 1), 350);
          }
        }
      };

      // Evita conflito com o bip e com uma fala antiga.
      try {
        if (synth.speaking || synth.pending) synth.cancel();
        synth.resume();
      } catch (_) {}

      setTimeout(() => disparar(0), 260);
    }

    function zerarRota() {
      pacotesBipados.clear();
      rotaInicioEm = Date.now();
      resumoFinalJaExibido = false;
      if (chaveStorageAtual) localStorage.removeItem(chaveStorageAtual);
      salvarEstadoCompletoRota();
      atualizarStats();
      document.getElementById('cardResult').style.display = 'none';
      document.getElementById('cardResult').classList.remove('error-state');
      document.getElementById('boxAviso').style.display = 'none';
      document.getElementById('progressoParadaAtual').style.display = 'none';
      fecharResumoFinalRota();
      toggleSidebar();
      notificar("Bipagens desta rota foram zeradas.");
    }

    window.addEventListener('DOMContentLoaded', () => {
      // Correção de voz: esta versão inicia com Voz Navegação ativa.
      localStorage.setItem('voz_preferida', 'navegacao_feminina');
      carregarConfiguracoesSalvas();
      atualizarResumoRotaHome();

      // Migração silenciosa do histórico antigo:
      // tira listas grandes do localStorage e move para IndexedDB.
      setTimeout(async () => {
        try {
          let hist = JSON.parse(localStorage.getItem('historico_rotas_usuario') || '[]');
          let mudou = false;

          for (const item of hist) {
            if (item?.id && Array.isArray(item.enderecos) && item.enderecos.length) {
              await salvarEnderecosHistoricoDB(item.id, item.enderecos);
              item.temEnderecos = true;
              delete item.enderecos;
              mudou = true;
            }
          }

          if (mudou) {
            localStorage.setItem('historico_rotas_usuario', JSON.stringify(hist));
          }
        } catch (_) {}
      }, 500);

      dispararAberturaPs2();
    });
