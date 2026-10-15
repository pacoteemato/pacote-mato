# Pacote É Mato — V60

## Localização dentro do app

- Adicionado onboarding de localização após o usuário entrar no sistema.
- Botão **Ativar localização** chama a API de geolocalização diretamente a partir de uma ação do usuário.
- Adicionado bloco **Localização** em Configurações com status e botão para solicitar novamente.
- Quando a permissão estiver concedida, o sistema reconhece e não exibe o onboarding novamente.
- Quando estiver bloqueada pelo Android/WebView, o sistema informa claramente que o contêiner Android ainda precisa repassar a permissão nativa.
- Corrigido o estado interno para reconhecer uma permissão que foi liberada depois de estar bloqueada.

## Limite técnico
O front-end WebView pode solicitar localização, mas a janela nativa do Android só aparecerá se o WebView Android tiver as permissões de localização e o tratamento de geolocalização habilitados no projeto Android.
