# RELATÓRIO — PACOTE É MATO V81 HOTFIX FINAL 8

## ROTA PERCORRIDA + VOZ EXCLUSIVA DA NAVEGAÇÃO INTERNA

Base utilizada: `Pacote-Em-Mato-V81-HOTFIX-FINAL-7`.

Este hotfix foi restrito às duas áreas autorizadas:

1. recorte visual definitivo da rota percorrida;
2. voz GPS/TTS exclusiva do modo `Navegar > Pacote É Mato`.

Não houve redesign do mapa nem alteração de Bipagem, múltiplos, login, histórico, parser, geocodificação ou otimização.

---

## 1. ROTA — causa do verde forte atrás do motorista

O HOTFIX FINAL 7 já recortava `SOURCE_ROUTE` para deixar somente a geometria futura e desenhava o passado em `SOURCE_PROGRESS`.

O risco restante estava em `SOURCE_ROUTE_STATUS`.

A feature com:

```text
status = "proxima"
```

podia continuar contendo uma geometria de leg iniciada antes da posição atual do motorista. Como a layer `pemato-nav-route-status-layer` usa verde forte para `proxima`, esse source podia redesenhar verde sobre uma parte que já deveria estar apagada.

Portanto, corrigir apenas `SOURCE_ROUTE` não era suficiente.

---

## 2. Uma única divisão de progresso

Foi criada/consolidada a divisão visual por uma única projeção da posição do motorista na geometria real da rota.

A função central é:

```text
aplicarDivisaoVisualRota(nearest)
```

Ela usa o mesmo:

- `nearest.index`;
- `nearest.t`;
- `nearest.point`;
- snapped point visual.

A partir desse único progresso são gerados:

### `SOURCE_PROGRESS`

Somente o trecho:

```text
início da rota -> posição projetada do motorista
```

### `SOURCE_ROUTE`

Somente o trecho:

```text
posição projetada do motorista -> fim da rota
```

### `SOURCE_ROUTE_STATUS`

O trecho `passado` é gerado com a mesma geometria passada.

O segmento `proxima` original é projetado contra o mesmo snapped point e é recortado para começar na posição atual.

Se não for possível associar com segurança o snapped point ao segmento `proxima`, o sistema **não restaura a leg completa como fallback**. O status verde deixa de ser desenhado nesse caso, porque `SOURCE_ROUTE` já contém a rota futura forte e é preferível omitir o highlight de status a recolocar verde forte atrás do motorista.

---

## 3. Aparência definitiva do passado

Durante `navigation-active`:

### Passado

`SOURCE_PROGRESS`:

```text
color: #96a69f
opacity: 0.20
```

`SOURCE_ROUTE_STATUS` com `status=passado`:

```text
color: #96a69f
opacity: 0.07
```

Casing de status passado:

```text
opacity: 0.06
```

### Futuro

Continua usando o verde forte Pacote É Mato.

Assim, a parte atrás do motorista não possui mais nenhuma layer verde forte conhecida no módulo de navigation-active.

---

## 4. Sem gap / duplicação

O mesmo snapped point é simultaneamente:

- último ponto do passado;
- primeiro ponto do futuro.

Isso evita buraco visual entre as linhas.

A geometria operacional da rota não é alterada. A divisão é somente de renderização.

---

## 5. Diagnóstico da linha

Foi criado:

```text
window.diagnosticoRotaVisualV81
```

Campos:

```text
progressIndex
progressFraction
routeFutureCoordinates
routePastCoordinates
routeStatusFutureCoordinates
routeStatusPastCoordinates
driverSnappedCoordinate
```

---

## 6. Teste de progresso

Foram executados testes com a implementação real de divisão em:

```text
0%
25%
50%
75%
95%
```

Em todos os casos foi confirmado:

- `SOURCE_ROUTE` começa no snapped point;
- `SOURCE_PROGRESS` termina no snapped point;
- `SOURCE_ROUTE_STATUS/proxima` começa no mesmo snapped point;
- não existe gap passado/futuro;
- a geometria anterior não volta a ser coberta pelo status verde forte.

Resultado:

```text
PASS — 0 / 25 / 50 / 75 / 95%
```

Foram também gerados screenshots em browser harness para esses cinco estágios.

Esses screenshots são **BROWSER HARNESS**, não trânsito real.

---

# VOZ GPS / TTS

## 7. Separação definitiva da voz

A voz GPS continua em módulo próprio:

```text
js/navegacao/voz-navegacao.js
```

A voz da Bipagem continua fora desse módulo e não foi modificada.

A frase aprovada:

```text
121. Atenção.
```

permanece intacta.

---

## 8. Guard central

Foi implementado:

```text
podeFalarNavegacao()
```

A voz GPS só pode falar quando todas as condições forem verdadeiras:

```text
navigationMode === "navigation-active"
navegacaoInternaAtiva === true
vozNavegacaoAtiva === true
módulo atual === "navegacao"
provider === "pacote_emato"
documento não está em background
existe instrução válida quando a fala é de instrução
```

Todas as falas GPS passam pelo módulo que aplica esse guard.

---

## 9. Cenários de escopo

### A — overview + voz habilitada

Resultado:

```text
0 frases GPS
PASS
```

### B — Bipagem

Resultado:

```text
0 frases GPS do Pacote É Mato Navegação
voz da Bipagem permanece separada
PASS
```

### C — Waze / Google Maps externo

Resultado:

```text
0 voz GPS interna
PASS
```

Antes de abrir navegador externo, o TTS GPS ativo/pendente é encerrado.

### D — Navegar > Pacote É Mato + voz habilitada

Resultado estrutural:

```text
TTS liberado pelo guard
PASS
```

### E — sair do navigation-active

Resultado:

```text
novas falas GPS bloqueadas imediatamente
estado GPS/TTS limpo
PASS
```

---

## 10. Causa provável da falha no Android/WebView anterior

No módulo anterior existiam duas fragilidades importantes:

1. `desbloqueada` podia ser considerada verdadeira apenas porque `speechSynthesis.speak()` não lançou exception;
2. `falasExecutadas.add(chave)` era executado antes de confirmação real de `utterance.onstart`.

Em um Android/WebView que aceite a chamada JavaScript mas não inicie efetivamente a utterance, isso poderia produzir:

```text
speak() chamado
-> nenhum áudio
-> frase marcada como falada
-> nenhuma nova tentativa
```

O HOTFIX FINAL 8 remove esse comportamento.

---

## 11. onstart obrigatório

Agora uma fase só entra em:

```text
falasExecutadas
```

quando:

```text
utterance.onstart
```

é disparado.

Não basta `speak()` retornar sem exception.

O estado `READY` também não é atribuído apenas porque a chamada foi aceita.

---

## 12. Watchdog Android

Após `speechSynthesis.speak(utterance)`, existe watchdog aproximado de:

```text
1000 ms
```

Se não ocorrer:

- `onstart`;
- `onend`;
- `onerror`;

o diagnóstico registra:

```text
TTS_START_TIMEOUT
```

---

## 13. Retry limitado

Máximo:

```text
3 tentativas totais
```

Fluxo:

```text
resume()
speak()
-> falha de início
cancel() da utterance GPS
resume()
aguarda ~260 ms
speak() novamente
```

Após três falhas, a chave entra em falha controlada e não é reiniciada a cada atualização GPS. Isso impede loop infinito.

Uma falha não é registrada como fala executada.

---

## 14. Voices carregadas com atraso

O módulo trata:

```text
voiceschanged
```

Prioridade de seleção:

1. `pt-BR` exato;
2. `pt-BR` equivalente;
3. qualquer `pt-*`;
4. voz default;
5. primeira voz disponível.

Se `getVoices()` estiver vazio, a utterance ainda usa:

```text
lang = "pt-BR"
```

para permitir que o engine default resolva a voz.

---

## 15. Botão Voz ativa

A preferência continua em:

```text
pemato_nav_voice_enabled_v81
```

Ela significa somente:

> quando eu estiver na navegação interna, desejo voz GPS.

Ao mudar de mudo para ativo **dentro do navigation-active**, o app tenta falar uma vez:

```text
Voz de navegação ativada.
```

Isso não é disparado:

- ao abrir o app;
- no overview;
- na Bipagem;
- ao escolher Waze/Maps externo.

Estados visuais suportados:

```text
Voz ativa
Voz muda
Inicializando voz...
Voz indisponível
```

---

## 16. Background

Quando o documento entra em background:

- não inicia novas instruções GPS;
- TTS GPS pendente/ativo é limpo;
- não é criada fila de utterances.

Ao retornar:

- `speechSynthesis.resume()` é tentado;
- o guard é recalculado;
- só volta a falar se ainda estiver em `navigation-active` interno.

---

## 17. Navegador externo

Antes de Waze/Google Maps externo:

- navigation-active interno é encerrado para overview;
- TTS GPS Pacote É Mato é limpo;
- nenhuma instrução interna continua falando em paralelo.

---

## 18. Cancelamento sem interferir na Bipagem

O módulo de navegação não chama `speechSynthesis.cancel()` indiscriminadamente.

`cancelarSomenteGps()` só cancela o synthesizer quando existe uma utterance GPS do módulo ativa/pendente ou estado de inicialização/retry relacionado à navegação.

Isso reduz o risco de cancelar fala que não pertença ao sistema GPS.

Nenhum arquivo em `js/bipagem/` foi alterado.

---

## 19. Diagnóstico Android/TTS

Foi criado:

```text
window.diagnosticoTTSAndroidV81
```

Campos implementados:

```text
runtime
navigationMode
navegacaoInternaAtiva
vozNavegacaoAtiva
podeFalar
speechSynthesisDisponivel
utteranceDisponivel
voicesCount
selectedVoice
ttsState
lastInstructionId
lastText
lastPhase
lastStart
lastEnd
lastError
retryCount
failedKeysCount
```

---

## 20. Runtime Android disponível no repositório

Foi procurado no projeto entregue:

```text
AndroidManifest.xml
build.gradle / build.gradle.kts
*.kt
*.java
capacitor.config.*
config.xml
```

Resultado:

```text
ANDROID_WRAPPER_NAO_DISPONIVEL
```

Portanto não é possível afirmar, a partir deste ZIP web, se a versão da Play Store usa TWA, WebView nativo, Capacitor, Cordova ou outro wrapper.

---

## 21. Teste em Chromium com user-agent Android WebView

Foi executado **BROWSER REAL** com Chromium headless usando user-agent equivalente a Android WebView.

Resultado observado:

```text
speechSynthesisDisponivel = true
SpeechSynthesisUtterance = true
voicesCount = 0
runtime detectado = android-webview
activationAccepted = true
onstart = não ocorreu
último erro = synthesis-failed
retryCount = 2  (3 tentativas totais: 0, 1, 2)
overviewSpeak = false
```

Isso confirma que o novo código:

- detecta API;
- aplica o guard;
- tenta retry;
- não inventa READY sem `onstart`;
- bloqueia fala fora do navigation-active.

Porém o ambiente headless não possui voz/saída de áudio física verificável.

Resultado obrigatório:

```text
ANDROID_AUDIO_NAO_VALIDADO
```

Não é declarado PASS de áudio em Android.

---

## 22. Cache-buster

Atualizado para:

```text
js/navegacao/voz-navegacao.js?v=20261017-v81-hotfix-final-8
js/navegacao/navegacao.js?v=20261017-v81-hotfix-final-8
```

---

## 23. Arquivos de produção alterados

Somente:

```text
README.md
index.html
js/navegacao/navegacao.js
js/navegacao/voz-navegacao.js
```

`README.md` é documentação e `index.html` teve apenas cache-buster dos módulos modificados.

Também foram adicionados/ajustados testes e harnesses.

---

## 24. Arquivos congelados — comparação SHA-256

Comparados com `Pacote-Em-Mato-V81-HOTFIX-FINAL-7` e confirmados inalterados:

```text
js/app.js
js/bipagem/bipagem-area.js
js/bipagem/operacoes-pacotes.js
js/bipagem/rota-ativa-bridge.js
js/importacao/fluxo-importacao.js
js/importacao/xlsx.js
js/roteirizacao/roteirizacao.js
js/roteirizacao/servico-rota.js
js/historico/historico-rotas.js
js/mapa/config.js
js/mapa/mapa.js
css/navegacao.css
```

Consequências:

- mapa refinado FINAL 7: intacto;
- overlay/seta FINAL 7: intacto;
- indicador FINAL 7: intacto;
- múltiplos: intactos;
- agrupamento rua+número: intacto;
- `ATENÇÃO`: intacto;
- Bipagem: intacta;
- `121. Atenção.`: intacto;
- login: intacto;
- histórico: intacto;
- otimização: intacta.

---

## 25. Testes executados

Todas as suítes abaixo passaram:

```text
v81-final-enderecos-navegacao.js
v81-hotfix-final-2.js
v81-hotfix-final-6.js
v81-hotfix-final-7.js
v81-hotfix-final-8.js
v81-hotfix-pacotes-paradas.js
v81-numeracao-atencao.js
v81-optimization-equivalence.js
v81-regra-definitiva-paradas.js
v81-regression.js
```

Resultado:

```text
10/10 suítes PASS
```

Também foi executado `node --check` em todos os JS de produção e testes/fixtures.

---

## 26. Honestidade de validação

### Validado

- lógica real de recorte de sources: **TESTE AUTOMATIZADO REAL DO CÓDIGO**;
- progressos 0/25/50/75/95: **TESTE AUTOMATIZADO**;
- cenários de escopo TTS: **VM/TESTE AUTOMATIZADO**;
- Chromium com user-agent Android WebView: **BROWSER REAL**;
- screenshots de progresso: **BROWSER HARNESS**;
- regressões: **TESTES AUTOMATIZADOS**.

### Não validado

```text
ANDROID_WRAPPER_NAO_DISPONIVEL
ANDROID_AUDIO_NAO_VALIDADO
TRÂNSITO_REAL_NAO_VALIDADO
```

Não foi afirmado que áudio funciona fisicamente no APK/Play Store sem teste em aparelho.

