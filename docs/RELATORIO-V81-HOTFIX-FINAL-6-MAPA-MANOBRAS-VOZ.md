# PACOTE É MATO — V81 HOTFIX FINAL 6

## MAPA DE NAVEGAÇÃO + SETAS + FRASES + VOZ GPS

Base utilizada: `Pacote-Em-Mato-V81-HOTFIX-FINAL-5`.

## 1. Escopo respeitado

Este hotfix foi limitado a:

- mapa;
- `navigation-active`;
- setas/manobras;
- frases de navegação;
- voz GPS/TTS.

Não houve alteração funcional em:

- `js/app.js`;
- `js/bipagem/*`;
- scanner/câmera/`processarCodigo()`;
- `entregaOriginalPorPacote`;
- regra definitiva de parada `logradouro normalizado + número principal`;
- pacotes múltiplos;
- numeração original;
- `ATENÇÃO`;
- voz da Bipagem `121. Atenção.`;
- login/sessão/assinatura;
- histórico;
- importação PDF;
- geocodificação;
- `js/roteirizacao/roteirizacao.js` e algoritmo de otimização;
- ordem otimizada.

O marcador do veículo criado no HOTFIX FINAL 5 foi preservado sem alteração de desenho.

## 2. Mapa

### Estilo

Mantido OpenFreeMap/Liberty. Não houve troca de fornecedor.

Nova base:

- fundo: `#f7f8f7`;
- água: `#e5f2f7`;
- parques: `#edf5ed`;
- prédios: `#eef0f1`, baixa opacidade;
- road labels: `#2f3438` com halo claro;
- POIs comerciais/turísticos continuam ocultos;
- road shields continuam discretos.

### Hierarquia das vias

A classificação passa a tratar separadamente:

1. `motorway/trunk/freeway`;
2. `primary`;
3. `secondary`;
4. `tertiary`;
5. `residential/local/service`.

Cores internas aproximadas:

- rodovia: `#efd9a9`;
- primary: `#f3e5c5`;
- secondary: `#f7edd8`;
- tertiary: `#fbf8ef`;
- rua local: `#ffffff`.

Cada categoria possui casing e largura próprios. A função continua trabalhando por `id + source-layer`, sem depender de um único ID fixo do tema.

## 3. Navigation-active e câmera

A entrada por `Navegar > Pacote É Mato` continua usando a rota já calculada, sem reotimização.

Parâmetros atuais:

- zoom urbano dinâmico: aproximadamente `18.20–18.65`;
- pitch: `56°`;
- bearing: `headingVisual` suavizado;
- posição útil do veículo: aproximadamente `70%` da altura disponível;
- mais área à frente do veículo;
- `fitBounds` geral continua protegido no `navigation-active`;
- recentralização restaura follow/câmera, sem reenquadrar a rota inteira.

GPS bruto continua responsável por desvio/recálculo. A posição visual continua separada para seta/câmera/map matching.

## 4. Manobras

### Normalização

CamelCase é normalizado antes do mapeamento:

- `SlightRight` → `slight right`;
- `SharpLeft` → `sharp left`;
- `TurnAroundRight` → `turn around right`.

### Tipos suportados

Cobertura explícita:

- `StartAt`, `StartAtRight`, `StartAtLeft`;
- `Straight`;
- `SlightRight`, `Right`, `SharpRight`;
- `TurnAroundRight`, `TurnAroundLeft`;
- `SharpLeft`, `Left`, `SlightLeft`;
- `ExitRight`, `ExitLeft`;
- `StayRight`, `StayLeft`;
- `Merge`, `MergeRight`, `MergeLeft`;
- `Roundabout`;
- `DestinationReached`, `DestinationReachedRight`, `DestinationReachedLeft`.

### SVGs

Foram criados SVGs próprios para:

- reta;
- direita;
- esquerda;
- leve direita;
- leve esquerda;
- direita acentuada;
- esquerda acentuada;
- retorno à direita;
- retorno à esquerda;
- saída direita/esquerda;
- rotatória;
- saída da rotatória;
- chegada.

O ícone principal usa até `56 px` no card; a segunda manobra usa `26 px`.

Teste em DOM real de Chromium confirmou para os screenshots:

- `display = grid`;
- `visibility = visible`;
- `opacity = 1`;
- caixa principal `58 × 58`;
- SVG `56 × 56`.

Nenhum screenshot de manobra contém o placeholder `□`.

## 5. Frases

Mapeamento principal:

- `Straight` → `Continue em frente`;
- `Right` → `Vire à direita`;
- `Left` → `Vire à esquerda`;
- `SlightRight` → `Mantenha-se à direita`;
- `SlightLeft` → `Mantenha-se à esquerda`;
- `SharpRight` → `Faça uma curva acentuada à direita`;
- `SharpLeft` → `Faça uma curva acentuada à esquerda`;
- `TurnAround*` → `Faça o retorno`;
- `ExitRight` → `Pegue a saída à direita`;
- `ExitLeft` → `Pegue a saída à esquerda`;
- `MergeRight` → `Entre à direita`;
- `MergeLeft` → `Entre à esquerda`;
- `Roundabout` → `Entre na rotatória` ou frase com saída real;
- `DestinationReached*` → `Você chegou ao destino`.

Exemplos produzidos pelos testes:

- `Vire à direita na Rua do Oratório.`;
- `Vire à esquerda na Rua Ancara.`;
- `Continue em frente pela Avenida X.`;
- `Na rotatória, pegue a 3ª saída para Avenida X.`.

Nome de rua usa prioritariamente `streets[0]`, `street_name`, `name/rua`, `exitRoadName[0]`. Texto real do provedor fica disponível como fallback visual quando nenhum nome estruturado existir; ele não é inventado.

## 6. Segunda manobra

O card mostra `Depois` com SVG pequeno e frase da próxima instrução quando existe uma segunda instrução válida próxima. A voz inclui apenas uma segunda manobra e somente quando a distância entre as duas manobras é curta o suficiente para ser útil.

## 7. Multi-leg

Foi mantida a correção já existente:

- `legIndex`;
- `stepIndex`;
- `fromIndexLeg`;
- `toIndexLeg`;
- `globalFromIndex`;
- `globalToIndex`.

As suítes de regressão multi-leg continuam passando.

## 8. Voz GPS/TTS

Foi criado o módulo:

`js/navegacao/voz-navegacao.js`

A voz GPS é separada da voz da Bipagem.

### Comportamento

- `SpeechSynthesisUtterance`;
- `lang = pt-BR`;
- preferência por voz exatamente `pt-BR`, depois português;
- `rate = 1.02`;
- `pitch = 1.0`;
- `volume = 1.0`;
- preferência `Voz ativa` persistida em `localStorage` pela chave `pemato_nav_voice_enabled_v81`;
- desbloqueio do TTS ocorre após ação do usuário em `Navegar > Pacote É Mato`;
- não interfere na voz da Bipagem.

### Gatilhos

Distâncias são adaptadas pela velocidade.

Faixas aproximadas:

- longe: `260–430 m`;
- perto: `90–170 m`;
- agora: `30–65 m`.

A distância falada é arredondada de forma natural.

### Anti-repetição / fila

A chave lógica é formada por:

`legIndex + stepIndex + globalFromIndex + type`

Cada fase (`longe`, `perto`, `agora`) só pode ser executada uma vez por instrução.

O módulo também:

- descarta uma instrução que já não é a atual;
- não chama `speechSynthesis.cancel()` a cada atualização GPS;
- evita fila de frases antigas;
- permite substituição apenas por instrução urgente diferente;
- limpa/cancela ao desligar a voz, recalcular ou encerrar a navegação.

### Reto

`Straight` não é narrado repetidamente. É considerado relevante quando há mudança real de rua em relação à instrução anterior.

### Chegada

- próximo: `Seu destino está próximo.`;
- chegada: `Você chegou ao destino.`.

## 9. Diagnóstico

Disponível em runtime:

`window.diagnosticoNavegacaoVozV81`

Inclui:

- `instructionId`;
- `legIndex`;
- `stepIndex`;
- `typeBruto`;
- `modifierBruto`;
- `tipoVisual`;
- `fraseVisual`;
- `fraseTTS`;
- `rua`;
- `distancia`;
- `faseFalando`;
- `falouLonge`;
- `falouPerto`;
- `falouAgora`;
- `speechSynthesisDisponivel`.

Também foi criado:

`window.diagnosticoManobrasReal`

Ele é preenchido em runtime a partir de `rota.instrucoes` e registra os índices multi-leg, tipo bruto, modificador, texto, rua, tipo visual e SVG escolhido.

## 10. Testes executados

### Testes automatizados

Todas as suítes existentes mais a nova suíte `v81-hotfix-final-6.js` passaram.

Cobertura inclui:

- múltiplos 107/123;
- múltiplos 78/102;
- numeração original;
- `ATENÇÃO`;
- voz da Bipagem `121. Atenção.`;
- Bipagem individual;
- login/sessão;
- histórico;
- otimização short/balanced;
- PDF/importação;
- multi-leg;
- tipos reais de manobra;
- frases;
- SVGs;
- TTS simulado.

### Browser real — DOM

Chromium headless real foi usado com harness de DOM para renderizar:

- Right;
- Left;
- SlightRight;
- SlightLeft;
- U-turn;
- Roundabout;
- Arrival;
- Overview.

Os SVGs tiveram dimensões reais maiores que zero e ficaram visíveis.

### Browser real — API TTS

No Chromium do ambiente:

- `speechSynthesis`: disponível;
- `SpeechSynthesisUtterance`: disponível;
- construção de utterance: OK;
- chamada de `speechSynthesis.speak()`: OK;
- vozes instaladas no ambiente headless: `0`.

Portanto a validação é classificada como **TTS SIMULADO/ESTRUTURAL + API DE BROWSER REAL**, não como áudio físico validado.

## 11. Payload real / rota real

Foi tentado acesso ao Worker real para capturar uma rota curta, mas o ambiente desta execução não resolveu o host (`Could not resolve host`). Assim:

- o pipeline do frontend/Worker e o schema de `extrairInstrucoes()` foram validados estruturalmente e pelas suítes;
- `window.diagnosticoManobrasReal` está pronto para capturar o payload no aparelho/browser com rede;
- **não é declarado PAYLOAD REAL Geoapify validado nesta execução**;
- **não é declarado APARELHO REAL ou TRÂNSITO REAL**.

## 12. Arquivos de produção alterados

- `js/mapa/config.js`;
- `js/navegacao/navegacao.js`;
- `js/navegacao/voz-navegacao.js` (novo);
- `css/navegacao.css`;
- `index.html` (módulo/cache-buster).

Não foi necessário modificar `js/mapa/mapa.js` nem `js/roteirizacao/servico-rota.js`.

## 13. Regressão das áreas congeladas

Hashes confirmam inalterados em relação à HOTFIX FINAL 5:

- `js/app.js`;
- `js/bipagem/bipagem-area.js`;
- `js/bipagem/operacoes-pacotes.js`;
- `js/bipagem/rota-ativa-bridge.js`;
- `js/roteirizacao/roteirizacao.js`;
- `js/importacao/xlsx.js`;
- `js/importacao/fluxo-importacao.js`.

O bloco do marcador do veículo HOTFIX FINAL 5 também manteve o mesmo hash.

## 14. Honestidade de validação

- mapa screenshots: **BROWSER REAL / HARNESS**;
- manobras screenshots: **BROWSER REAL / HARNESS**;
- TTS: **SIMULADO/ESTRUTURAL + API DE BROWSER REAL**;
- payload Geoapify ao vivo: **NÃO VALIDADO nesta execução**;
- aparelho Android: **NÃO VALIDADO**;
- trânsito real: **NÃO VALIDADO**.
