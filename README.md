# Pacote É Mato — V81 HOTFIX FINAL 8

Base obrigatória: `Pacote-Em-Mato-V81-HOTFIX-FINAL-7`.

Este hotfix altera **somente**:

1. corte definitivo do trecho percorrido em todas as layers visuais da rota;
2. robustez e escopo da voz GPS/TTS da navegação interna `Navegar > Pacote É Mato`.

## Rota percorrida

Durante `navigation-active`, o mesmo ponto de progresso visual divide:

- `SOURCE_ROUTE` → somente futuro;
- `SOURCE_PROGRESS` → somente passado;
- `SOURCE_ROUTE_STATUS` → passado fraco + trecho `proxima` recortado no mesmo snapped point.

O trecho passado usa cinza-esverdeado e baixa opacidade. Nenhuma layer de status pode recolocar verde forte atrás do motorista.

Diagnóstico disponível em:

`window.diagnosticoRotaVisualV81`

## Voz GPS interna

O módulo `js/navegacao/voz-navegacao.js` agora possui guard central `podeFalarNavegacao()`.

A voz GPS só pode falar quando:

- `navigationMode === "navigation-active"`;
- a navegação interna Pacote É Mato está ativa;
- a preferência de voz GPS está habilitada;
- o módulo atual é navegação;
- existe instrução válida.

Não fala no overview, Bipagem ou Waze/Google Maps externo.

A robustez Android/WebView inclui:

- confirmação de início somente por `utterance.onstart`;
- watchdog de início de 1 s;
- até 3 tentativas;
- `resume()` + retry controlado;
- `voiceschanged`;
- preferência por `pt-BR` e fallback do engine;
- nenhuma fase é marcada como falada antes de `onstart`;
- background e saída da navegação cancelam somente TTS GPS pendente/ativo;
- ao reativar a voz dentro da navegação, tenta falar `Voz de navegação ativada.`.

Diagnóstico disponível em:

`window.diagnosticoTTSAndroidV81`

## Áreas congeladas preservadas

Não foram alterados funcionalmente:

- mapa/style/overlay/indicador do HOTFIX FINAL 7;
- `js/app.js`;
- `js/bipagem/*`;
- voz da Bipagem `121. Atenção.`;
- múltiplos e agrupamento rua+número;
- numeração original;
- parser/importação;
- login/sessão/assinatura;
- histórico;
- geocodificação;
- `js/roteirizacao/roteirizacao.js`;
- algoritmo/ordem da otimização.

## Validação

- progresso testado em 0%, 25%, 50%, 75% e 95%;
- cenários overview/Bipagem/Waze/navegação interna/saída testados;
- watchdog/retry e `onstart` testados em VM;
- Chromium real confirmou API `speechSynthesis`, mas o ambiente não possui voz/saída de áudio verificável.

Portanto:

`ANDROID_AUDIO_NAO_VALIDADO`

O projeto entregue não contém o wrapper Android nativo/Gradle/Manifest do app publicado, portanto:

`ANDROID_WRAPPER_NAO_DISPONIVEL`

## Relatório

`docs/RELATORIO-V81-HOTFIX-FINAL-8-ROTA-VOZ-ANDROID.md`
