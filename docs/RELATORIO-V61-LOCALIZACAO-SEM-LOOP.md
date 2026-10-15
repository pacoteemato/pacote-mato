# V61 — Localização sem loop

- Corrigido ciclo de "toque em Ativar localização" quando o WebView já devolveu permissão negada.
- Após bloqueio, a UI explica que a permissão nativa do Android/WebView ainda precisa ser habilitada no contêiner Android.
- O usuário pode escolher **Continuar sem localização** e seguir usando o app.
- O botão continua disponível em Configurações para tentar novamente depois.
- Quando a permissão for concedida, o onboarding fecha automaticamente.
