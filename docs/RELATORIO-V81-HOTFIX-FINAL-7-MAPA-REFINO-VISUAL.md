# PACOTE É MATO — V81 HOTFIX FINAL 7
## Refino visual definitivo do mapa + seta de manobra no mapa + novo indicador + rota percorrida apagada

Base utilizada: `Pacote-Em-Mato-V81-HOTFIX-FINAL-6`.

## 1. Escopo executado

Este hotfix foi limitado ao escopo visual autorizado:

- refino do style do mapa;
- overlay/seta da próxima manobra diretamente no mapa;
- novo desenho do indicador do motorista;
- separação visual efetiva entre rota futura e rota percorrida;
- cache-buster dos arquivos modificados;
- testes e harness visual.

Não foram alteradas regras operacionais da rota, GPS bruto, detecção de desvio, recálculo, coordenadas das paradas, agrupamento, Bipagem, login, histórico ou otimização.

---

## 2. Style do mapa

Arquivo alterado: `js/mapa/config.js`.

### 2.1 Fundo

Mantido off-white:

```text
#f7f8f7
```

### 2.2 Ruas locais

A rua local continua com interior branco, mas o casing foi reforçado:

```text
interior: #ffffff
casing:   #cfd6d9
```

Isso aumenta a separação entre ruas paralelas e melhora cruzamentos sem transformar o mapa em fundo cinza pesado.

### 2.3 Hierarquia viária

As larguras foram recalibradas por zoom, mantendo a ordem:

```text
motorway/trunk > primary > secondary > tertiary > residential/local
```

Cores usadas:

```text
rodovia:   base #efd39a / borda #cbae6d
primary:   base #f4e2ba / borda #d2bb87
secondary: base #f7ead2 / borda #d9caa8
tertiary:  base #fcf8ed / borda #d7d7cf
local:     base #ffffff / borda #cfd6d9
```

Avenues e vias maiores ficam distinguíveis sem competir com a rota verde.

### 2.4 Parques, água e prédios

- parques permanecem verdes suaves;
- água permanece azul suave;
- prédios ganharam leve aumento de definição, com fill e outline discretos;
- POIs comerciais/turísticos continuam reduzidos/ocultos.

### 2.5 Labels

Road labels continuam explicitamente visíveis e receberam:

- tamanho ligeiramente maior em zoom de navegação;
- halo mais forte (`2.05` no navigation-active);
- halo mais nítido;
- contraste escuro/claro preservado.

---

## 3. Seta de manobra diretamente no mapa

Arquivo alterado: `js/navegacao/navegacao.js`.

Foi criado:

```text
SOURCE_MANEUVER = pemato-nav-maneuver-overlay
LAYER_MANEUVER_ARROW = pemato-nav-maneuver-arrow
LAYER_MANEUVER_LABEL = pemato-nav-maneuver-label
```

### 3.1 Tipos suportados no overlay

O overlay possui desenho próprio para:

- esquerda;
- direita;
- leve esquerda;
- leve direita;
- acentuada esquerda;
- acentuada direita;
- retorno esquerdo/direito;
- saída esquerda/direita;
- rotatória;
- saída de rotatória.

Os ícones são gerados pelo próprio projeto. Não são assets de Google/Waze/Apple/Spoke.

### 3.2 Aparência

A seta do mapa usa:

- traço branco forte;
- outline escuro;
- sombra suave;
- escala por zoom;
- alta prioridade visual sobre a rota.

### 3.3 Posicionamento

A função `pontoAntesDaManobra()` percorre a geometria real da rota para colocar a seta aproximadamente antes da conversão.

O overlay não é colocado em coordenada aleatória nem na coordenada da parada. Ele deriva do `globalToIndex`/geometria da instrução.

### 3.4 Orientação

O bearing é obtido da geometria local da rota e enviado para `icon-rotate`, com:

```text
icon-rotation-alignment = map
```

Assim, o símbolo de esquerda/direita é orientado de acordo com o sentido de aproximação da via.

### 3.5 Controle de poluição visual

Somente uma manobra é desenhada por vez.

A seta só é mostrada quando a manobra está dentro de uma janela útil (até aproximadamente 520 m). A mudança de instrução substitui o overlay anterior.

Um label curto da rua é disponibilizado quando `nomeRuaInstrucao()` retorna rua real.

---

## 4. Novo indicador do motorista

O desenho anterior foi substituído conforme autorização explícita do HOTFIX FINAL 7.

Novo desenho:

- cursor de navegação próprio;
- corpo mais largo;
- frente curta/elegante;
- cantos curvos;
- verde `#047857`;
- contorno branco;
- sombra suave;
- detalhe interno claro.

O ícone continua girando somente pelo heading visual já suavizado:

```text
headingVisual -> SOURCE_DRIVER.heading -> icon-rotate
```

Nenhuma regra de GPS foi alterada.

---

## 5. Rota futura x rota percorrida

Este ponto recebeu uma correção estrutural apenas de renderização.

### 5.1 Problema anterior

A `SOURCE_ROUTE` desenhava a geometria inteira em verde forte. Colocar uma linha transparente sobre o trecho passado não era suficiente, porque o verde forte continuava por baixo.

### 5.2 Correção

Durante `navigation-active`, `atualizarProgressoVisual()` agora separa visualmente:

```text
SOURCE_PROGRESS = início da rota -> posição visual atual
SOURCE_ROUTE    = posição visual atual -> final da rota
```

A `rota.geometria` original não é modificada.

Isso significa:

```text
GPS/rota operacional: INTACTOS
render passado: fraco
render futuro: forte
```

### 5.3 Aparência do trecho passado

```text
cor: #96a69f
opacidade: 0.20
```

Os segmentos de status `passado` também foram reduzidos:

```text
cor: #8da298
opacidade: 0.16
```

### 5.4 Overview

Ao sair do GPS para `overview`, `desenharRota()` restaura a geometria completa para visualização geral.

---

## 6. Performance

A implementação evita múltiplos overlays:

- uma única source de manobra;
- um único feature ativo;
- imagens de manobra registradas uma vez;
- atualização sincronizada com `atualizarInstrucao()`;
- nenhuma nova rotina pesada por frame;
- map matching/GPS bruto não foram modificados.

---

## 7. Arquivos de produção alterados

```text
README.md
index.html
js/mapa/config.js
js/navegacao/navegacao.js
```

`index.html` sofreu apenas cache-buster dos arquivos visuais alterados.

Arquivos de teste/harness modificados/adicionados:

```text
tests/v81-final-enderecos-navegacao.js
tests/v81-hotfix-final-6.js
tests/v81-hotfix-final-7.js
tests/visual/hotfix7/*
```

Os dois testes antigos foram atualizados somente onde a expectativa foi explicitamente substituída pelo HOTFIX FINAL 7: novo indicador e trecho percorrido mais apagado.

---

## 8. Áreas congeladas — comparação SHA-256

Antes e depois do hotfix foram comparados:

```text
js/app.js
js/bipagem/bipagem-area.js
js/bipagem/operacoes-pacotes.js
js/bipagem/rota-ativa-bridge.js
js/importacao/fluxo-importacao.js
js/importacao/xlsx.js
js/roteirizacao/roteirizacao.js
js/historico/historico-rotas.js
js/navegacao/voz-navegacao.js
```

Resultado:

```text
PASS — hashes idênticos à base HOTFIX FINAL 6
```

Portanto:

```text
Bipagem: 0 arquivos alterados
voz da Bipagem: intacta
"121. Atenção.": intacto
múltiplos: intactos
agrupamento rua+número: intacto
login: intacto
histórico: intacto
otimização: intacta
voz GPS/TTS do FINAL 6: intacta
```

---

## 9. Testes executados

### 9.1 Syntax check

```text
30 JS de produção: PASS
10 JS em tests/ (incluindo fixture): PASS
```

### 9.2 Suítes executadas

```text
v81-final-enderecos-navegacao.js       PASS
v81-hotfix-final-2.js                   PASS
v81-hotfix-final-6.js                   PASS
v81-hotfix-final-7.js                   PASS
v81-hotfix-pacotes-paradas.js           PASS
v81-numeracao-atencao.js                PASS
v81-optimization-equivalence.js         PASS
v81-regra-definitiva-paradas.js         PASS
v81-regression.js                       PASS
```

### 9.3 Regressões preservadas

Continuam passando:

- múltiplos 107/123;
- múltiplos 78/102;
- numeração original;
- `ATENÇÃO`;
- fala `121. Atenção.`;
- Bipagem individual;
- sessão/login;
- histórico;
- equivalência da otimização V80/V81;
- GPS bruto separado da posição visual;
- voz GPS/TTS do HOTFIX FINAL 6.

---

## 10. Validação visual

Foi criado **BROWSER HARNESS** em Chromium headless com viewport móvel de 390 px.

Gerados 9 screenshots:

```text
CURVA-DIREITA-HOTFIX7-HARNESS.png
CURVA-ESQUERDA-HOTFIX7-HARNESS.png
LEVE-DIREITA-HOTFIX7-HARNESS.png
LEVE-ESQUERDA-HOTFIX7-HARNESS.png
RETORNO-HOTFIX7-HARNESS.png
ROTATORIA-HOTFIX7-HARNESS.png
NOVO-INDICADOR-HOTFIX7-HARNESS.png
ROTA-PERCORRIDA-HOTFIX7-HARNESS.png
MAPA-REFINADO-HOTFIX7-HARNESS.png
```

Resultado automatizado do browser harness:

```text
BROWSER_HARNESS_CASES = 9
MANEUVER_VISIBLE_ALL = true
DRIVER_VISIBLE_ALL = true
```

Os screenshots mostram:

- casing das ruas;
- hierarquia de avenidas;
- labels legíveis;
- overlay branco de manobra com outline/sombra;
- cursor novo do motorista;
- rota futura verde forte;
- trecho passado apagado.

---

## 11. Honestidade de validação

Classificação desta execução:

```text
código/syntax: TESTE AUTOMATIZADO
regressões: TESTE AUTOMATIZADO
visual: BROWSER HARNESS
Android físico: NÃO TESTADO NESTA EXECUÇÃO
trânsito real: NÃO TESTADO NESTA EXECUÇÃO
```

Os screenshots não são apresentados como captura de trânsito real nem como tiles ao vivo do OpenFreeMap; são harnesses visuais para verificar a implementação gráfica.

---

## 12. Resultado

Os critérios de código e regressão foram atendidos nesta execução:

- existe seta de curva no próprio mapa;
- overlay é sincronizado com a instrução atual;
- novo indicador foi implementado;
- mapa ganhou maior definição/hierarquia;
- rota forte passou a representar somente o futuro durante GPS;
- trecho passado ficou realmente apagado, sem verde forte subjacente da `SOURCE_ROUTE`;
- voz GPS permanece intacta;
- Bipagem/múltiplos/login/histórico/otimização permanecem intactos.

A validação em aparelho Android e em trânsito real continua sendo etapa externa necessária para avaliação definitiva de percepção visual em condução.
