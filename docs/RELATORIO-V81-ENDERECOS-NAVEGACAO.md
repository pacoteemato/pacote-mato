# PACOTE É MATO — V81
## Relatório final — Endereços + Navegação ativa

**Versão entregue:** `Pacote-Em-Mato-V81-ENDERECOS-NAVEGACAO`  
**Base usada:** `Pacote-Em-Mato-V81-NAVEGACAO-FLUIDA`  
**Escopo:** especificação final e congelada da V81.  
**Validação em trânsito real:** **NÃO realizada**. Os testes de navegação descritos abaixo são automatizados/simulados e estruturais.

---

## 1. Resultado executivo

A revisão final foi implementada sem reescrever o aplicativo. O trabalho foi concentrado em quatro pontos:

1. identidade física conservadora dos endereços;
2. separação explícita entre `overview` e `navigation-active`;
3. preservação integral da Bipagem e da lógica de otimização;
4. testes de regressão, inclusive com um PDF real do acervo usado somente durante a validação e não incluído na entrega.

**Arquivos da Bipagem modificados: 0.**

---

## 2. Causa raiz do agrupamento errado

A causa concreta estava em `js/app.js`.

A função `decomporEnderecoFisicoPdfV71()` produzia uma chave física baseada essencialmente em:

```text
TIPO_DA_VIA | LOGRADOURO_NORMALIZADO | NUMERO_DO_IMOVEL
```

Exemplo antigo:

```text
rua|ancara|105
```

Além disso, `normalizarEndereco()` continha a regra legada de que apartamento, bloco, torre, sala e complementos não criavam nova parada. O fallback retornava essencialmente:

```text
rua_normalizada_numero
```

Portanto:

```text
R Ancara, 105, Bloco 1, Apartamento 501
R Ancara, 105, Bloco 2, Apartamento 1208
```

podiam cair na mesma identidade física apenas por compartilharem rua e número.

Esse comportamento foi removido da identidade física da V81 final.

---

## 3. Chave antiga e chave nova

### 3.1 Chave antiga

Forma principal anterior:

```text
<tipo>|<logradouro_normalizado_sem_preposicoes>|<numero>
```

Exemplo:

```text
rua|ancara|105
```

Fallback legado de `normalizarEndereco()`:

```text
ancara_105
```

### 3.2 Chave nova

A base continua determinística:

```text
<tipo>|<logradouro>|<numero>
```

mas a identidade final adiciona a unidade contextual quando ela existe:

```text
<base>|u:<unidade_normalizada>
```

Exemplo:

```text
rua|ancara|105|u:bloco:1|apt:501
```

versus:

```text
rua|ancara|105|u:bloco:2|apt:1208
```

Sem unidade explícita:

```text
rua|a|100|u:-
```

Se um marcador de unidade existir mas estiver incompleto/inseguro, ele **não é usado para fundir entregas**. A chave de agrupamento é isolada pela própria entrega:

```text
<chave>|entrega:<numero_da_entrega>
```

Isso implementa a regra conservadora: falso negativo é preferível a falso positivo.

---

## 4. Normalização de complementos

Foi criada extração contextual em `extrairUnidadeEnderecoPdfV81()`.

Tipos reconhecidos:

- `AP`, `APT`, `APTO`, `APARTAMENTO` → `apt:<valor>`;
- `BL`, `BLOCO` → `bloco:<valor>`;
- `TORRE` → `torre:<valor>`;
- `CASA` → `casa:<valor>`;
- `SALA` → `sala:<valor>`;
- `LOJA` → `loja:<valor>`;
- `UNID`, `UNIDADE` → `unidade:<valor>`;
- `CJ`, `CONJ`, `CONJUNTO` → `conjunto:<valor>`;
- `ANDAR` e formato `3º andar` → `andar:<valor>`;
- `FUNDOS` → `fundos:sim` quando não há identificador adicional;
- `EDIFÍCIO` / `PRÉDIO` → `edificio:<nome>` somente quando explicitamente delimitado.

Também foi coberta uma fragmentação encontrada em PDF real:

```text
A p. 101
```

que é interpretada contextualmente como:

```text
apt:101
```

O parser exige rótulo/contexto; não transforma um número solto em apartamento.

Exemplos validados:

```text
Rua A, 100, Apto 10
Rua A, 100, APARTAMENTO 10
=> mesma chave
```

```text
Rua A, 100, Apto 10
Rua A, 100, Apto 20
=> chaves diferentes
```

```text
R Ancara, 105, Bloco 1, Apartamento 501
Rua Ancara, 105, BL 1, APTO 501
=> mesma chave física
```

```text
R Ancara, 105, Bloco 1, Apartamento 501
R Ancara, 105, Bloco 2, Apartamento 1208
=> chaves diferentes
```

---

## 5. Diagnóstico de agrupamento

Foi criado diagnóstico no console sem alterar a tela normal do motorista.

Prefixo:

```text
[PACOTE É MATO][AGRUPAMENTO]
```

A comparação é feita par a par entre entregas que compartilham a mesma base `via + rua + número`.

O diagnóstico mostra:

- entrega do PDF;
- endereço bruto;
- base física;
- rua normalizada;
- número;
- unidade normalizada;
- chave física final;
- parada física resultante;
- `JUNTAS` ou `SEPARADAS`;
- motivo determinístico.

Motivos possíveis implementados:

```text
MESMA_BASE_SEM_UNIDADE
MESMA_UNIDADE_NORMALIZADA
UNIDADES_DIFERENTES
UNIDADE_PRESENTE_EM_APENAS_UMA
UNIDADE_INCOMPLETA
```

O diagnóstico foi ajustado para não rotular como “SEPARADAS” duas entregas que efetivamente foram agrupadas apenas porque existe uma terceira unidade diferente no mesmo número.

---

## 6. Paradas & Endereços

A interface passa a distinguir explicitamente as duas numerações.

Parada física:

```text
PARADA 107
```

Origem no manifesto:

```text
ENTREGA DO PDF: 119
```

ou, somente quando o agrupamento físico é realmente seguro:

```text
ENTREGAS DO PDF: 119 · 120 · JUNTAS
```

A palavra `JUNTAS` depende do resultado da nova chave física. Ela não é mais consequência automática de rua + número.

---

## 7. Bipagem

### Arquivos da Bipagem alterados

**0**

Diretório comparado byte a byte:

```text
js/bipagem/
```

Arquivos confirmados sem alteração:

```text
js/bipagem/bipagem-area.js
js/bipagem/operacoes-pacotes.js
js/bipagem/rota-ativa-bridge.js
```

Não foram alterados:

- scanner;
- leitura de código BR;
- câmera;
- voz/som;
- fluxo da tela de Bipagem;
- histórico da Bipagem;
- reconhecimento de pacotes;
- associação BR → entrega original;
- regra de numeração mostrada pela Bipagem.

`entregaOriginalPorPacote[codigo] = numeroEntregaOriginal` continua presente e foi testado.

---

## 8. Importação PDF e códigos BR

Os módulos separados de importação foram mantidos byte a byte iguais à base recebida:

```text
js/importacao/fluxo-importacao.js
js/importacao/xlsx.js
```

O parser PDF que vive dentro de `js/app.js` recebeu **somente a alteração necessária à identidade física/complementos**, porque é nesse ponto que nasce o agrupamento incorreto. O reconhecimento BR não foi reescrito.

### Teste com PDF real

Foi usado um PDF real existente no acervo do projeto durante a validação. O arquivo não foi incorporado ao ZIP final.

Resultado do teste estrutural do parser real:

```text
âncoras BR encontradas: 11
entregas normalizadas: 11
BRs únicos após leitura: 11
pacotes após formação das paradas físicas: 11
entregaOriginalPorPacote: 11/11 códigos cobertos
BR perdido: 0
BR duplicado: 0
```

O teste também capturou no conteúdo real a fragmentação `A p. 101 - Bloco D`; a nova normalização resultou em:

```text
bloco:d|apt:101
```

### Limite deste teste de PDF

O conteúdo e as coordenadas vieram do PDF real e foram passados pelas funções reais do parser V73/V81 e pela formação real de paradas. A extração inicial de palavras/caixas foi feita em ambiente de teste com Poppler para produzir itens equivalentes aos itens posicionais do PDF.js. Portanto, isso **não é** uma afirmação de que o clique de upload + PDF.js no navegador foi exercitado ponta a ponta neste ambiente.

---

## 9. Múltiplos pacotes

Teste sintético executado através da função real `processarRegistrosrota()`:

```text
Entrega 119
R Ancara, 105, Bloco 1, Apartamento 501
BR260000000001A

Entrega 120
Rua Ancara, 105, BL 1, APTO 501
BR260000000002B

Entrega 121
Rua Ancara, 105, Bloco 2, Apartamento 1208
BR260000000003C
```

Resultado:

```text
Parada física 1: entregas 119 e 120
Parada física 2: entrega 121
Pacotes preservados: 3/3
entregaOriginalPorPacote preservado: 119 / 120 / 121
```

---

## 10. Mapa anterior

O estilo vetorial configurado continua sendo:

```text
OpenFreeMap — styles/liberty
```

Não houve troca desnecessária de fornecedor.

O fallback OSM raster também foi preservado.

---

## 11. Contraste do mapa na navegação ativa

Foi criada em `js/mapa/config.js` a função:

```text
aplicarEstiloNavegacaoAtiva(mapa)
```

Ela varre as layers existentes por `id` e `source-layer`, em vez de depender de um único ID rígido do tema.

Padrões de vias considerados:

```text
road
street
highway
motorway
trunk
primary
secondary
tertiary
residential
transportation
```

Padrões de lugar/labels considerados:

```text
place
neighbourhood
neighborhood
suburb
city
town
village
```

Mudanças no modo ativo:

- fundo vetorial mais definido (`#e8edef` quando há layer de background);
- vias principais claras e fortemente delimitadas;
- vias secundárias/locais com contraste suficiente;
- opacidade de linhas viárias elevada para `1`;
- texto de rua escuro (`#24333f`);
- labels de lugar discretos (`#475569`);
- halo claro nos nomes das ruas;
- labels úteis forçados a `visible` apenas quando a layer existe.

Não foi aplicada opacidade/filtro global no canvas.

O estilo original fica guardado por mapa e é restaurado ao voltar ao overview por:

```text
restaurarEstiloMapaOverview(mapa)
```

Quando uma propriedade não existia originalmente, o restore remove o override e volta ao default da layer em vez de deixar o estilo de navegação “vazar” para o overview.

---

## 12. `limparPontosInteresse()` e labels preservadas

A função continua reduzindo POIs não essenciais, porém preserva explicitamente layers cujos IDs/source-layers indiquem:

```text
road
street
highway
motorway
trunk
primary
secondary
tertiary
route
place
city
town
village
neighbourhood
neighborhood
water
boundary
```

Teste automatizado confirmou:

```text
road-label => visible
place-city => visible
poi-shop => none
```

---

## 13. OVERVIEW

Foi criado estado explícito:

```text
overview
```

Comportamento:

- enquadra a geometria completa da rota com `fitBounds`;
- pitch `0`;
- bearing `0`;
- painel inferior expandido;
- painel de manobra de GPS oculto;
- acompanhamento automático desligado;
- progress source percorrido limpo;
- GPS pode atualizar informação de posição sem disparar detecção/recalculo de desvio.

Abrir a tela de navegação não significa automaticamente começar navigation-active.

---

## 14. NAVIGATION-ACTIVE

Foi criado estado explícito:

```text
navigation-active
```

Ao executar `Navegar > Pacote É Mato`:

1. mantém a rota/geometria já calculada;
2. muda o estado para `navigation-active`;
3. compacta o bottom sheet;
4. ativa acompanhamento;
5. aplica estilo de navegação;
6. atualiza próxima instrução;
7. aplica câmera de navegação;
8. mantém o GPS ativo;
9. persiste o estado.

O caminho de entrada em `navegarPreferido()` não chama `recalcular()`.

Teste dinâmico em VM confirmou:

```text
início => overview
Navegar/Pacote É Mato => navigation-active
recalculo durante entrada => 0 chamadas
bottom sheet => collapsed
watch de GPS => iniciado
```

---

## 15. Câmera de navegação

No modo ativo:

- bearing acompanha o heading visual suavizado;
- pitch usado: `60°`;
- zoom é dinâmico por velocidade;
- zoom inicial/baixa velocidade: aproximadamente `18.5`;
- velocidades maiores abrem progressivamente até aproximadamente `17.7`;
- perto da próxima manobra o mapa abre levemente (`18.25` / `18.1`, respeitando zoom já mais aberto) para manter motorista + curva/cruzamento visíveis;
- o centro visual é deslocado para a frente na direção de movimento;
- o offset vertical é calculado para posicionar o motorista em aproximadamente `70%` da área útil entre painel de manobra e bottom sheet.

Na atualização contínua é usado `jumpTo`, evitando acumular animações `easeTo` a cada amostra GPS. `easeTo` fica para transições intencionais, como a entrada/recentralização.

---

## 16. Recentralização

Interação manual com o mapa interrompe o acompanhamento.

O botão de recentralização no modo ativo restabelece:

- posição visual;
- bearing;
- pitch;
- zoom dinâmico;
- offset do motorista;
- acompanhamento GPS.

No overview, o mesmo controle apenas reenquadra a rota completa, sem converter a tela em navegação ativa.

---

## 17. GPS bruto x posição visual

A separação foi preservada/fortalecida:

### GPS bruto

Variáveis operacionais usam a posição real:

```text
ultimaPosicaoBruta
ultimaPosicao
```

Essa posição continua responsável por:

- distância real;
- nearest real;
- detecção de desvio;
- contador de fora da rota;
- decisão de recalcular.

### Posição visual

A seta e a câmera usam:

```text
alvoVisual
posicaoVisual
headingVisual
```

Quando o GPS bruto está suficientemente próximo da geometria planejada, `alvoVisualDaPosicao()` pode projetar **somente a representação visual** para o ponto mais próximo da linha.

A coordenada real não é sobrescrita.

Não foram alteradas:

- coordenadas das paradas;
- geocodificação;
- regras de desvio;
- cálculo operacional.

---

## 18. Geometria real da rota

Os GeoJSONs foram mantidos vinculados à geometria real da rota:

### `SOURCE_ROUTE`

Origem:

```text
rota.geometria
```

A source passou a usar:

```text
tolerance = 0
```

para evitar simplificação adicional do MapLibre no desenho da navegação.

### `SOURCE_ROUTE_STATUS`

Origem:

```text
PacoteEMatoMarcadores.segmentosStatusDaRota(rota)
```

que deriva os segmentos da geometria da rota.

### `SOURCE_PROGRESS`

Deriva da projeção visual do progresso sobre a geometria real da rota.

Foi criado:

```text
window.diagnosticoNavegacaoV81
```

com tipo/quantidade de pontos/origem dos sources, e log:

```text
[PACOTE É MATO][NAVEGAÇÃO][GEOMETRIA]
```

Não foi introduzido código para ligar paradas em linha reta.

A função de normalização visual continua limpando apenas coordenadas inválidas/duplicadas e compondo partes compatíveis; não existe decimação de curvas na nova implementação.

---

## 19. Rota futura e trecho percorrido

Apresentação implementada:

### Futuro

```text
verde escuro #047857
opacidade alta
contorno claro
```

### Percorrido

```text
verde #3f9d72
opacidade aproximada 0.34–0.36
```

O caminho percorrido não fica com cinza forte sobre o mapa.

---

## 20. Instruções reais do serviço

O Worker atual foi analisado antes do mapeamento.

Ele solicita ao Geoapify:

```text
details=instruction_details
```

E mantém `props.legs` na feature sanitizada.

O Worker não foi modificado.

`PacoteEMatoServicoRota.extrairInstrucoes(feature)` passou a preservar, quando presentes:

```text
type
modifier
street_name
exit_number
transition_instruction
pre_transition_instruction
distance
time
from_index
to_index
```

Os aliases já usados pelo app também continuam disponíveis (`tipo`, `modificador`, `rua`, `exitNumber`, `distancia`, `tempo`, `fromIndex`, `toIndex`).

---

## 21. Manobras e SVGs

O painel usa SVGs próprios, sem emoji.

Tipos testados:

```text
seguir reto
esquerda
direita
leve esquerda
leve direita
acentuada esquerda
acentuada direita
retorno
entrar na rotatória
continuar na rotatória
sair da rotatória
chegada
```

O mapeamento foi executado em teste unitário diretamente sobre a função usada pela navegação.

Para tipo/modificador desconhecido:

```text
reta / seguir neutro
```

Não é inventada esquerda/direita.

---

## 22. Rotatórias

A classificação procura os dados reais `roundabout`, `rotary`, texto equivalente e `exit_number`.

Regras:

- entrada identificada → `rotatoria_entrada`;
- continuação sem saída → `rotatoria`;
- saída real ou `exit_number` real → `rotatoria_saida`;
- número de saída só é exibido quando o dado existe;
- sem número real, o texto do provedor é usado como fallback.

Teste executado com `exit_number: 3` confirmou classificação de saída.

---

## 23. Painel superior de manobra

Durante navigation-active exibe:

- SVG grande da manobra;
- distância;
- rua atual/próxima em destaque;
- instrução textual real;
- bloco `Depois` com segunda instrução quando ela existe.

No overview o painel é ocultado.

---

## 24. Bottom sheet

O comportamento existente de swipe horizontal entre paradas foi preservado.

No navigation-active:

- estado padrão `collapsed`;
- endereço;
- número/progresso da parada;
- pacotes de forma secundária;
- `Não entregue`;
- `Entregue`;
- grabber dedicado para drag vertical.

Ao expandir, os detalhes já existentes do painel ficam disponíveis.

O drag vertical começa no `navPanelGrabber`, evitando conflitar com o swipe horizontal do card.

---

## 25. Login / sessão

A correção anterior da V81 foi preservada.

Os testes existentes confirmaram:

- mensal ativa;
- trimestral ativa;
- teste ativo;
- `Firestore Timestamp.toMillis()`;
- timestamp em segundos;
- timestamp serializado;
- ISO date;
- conta legada `ativo:true`;
- vitalícia;
- expiração real;
- bloqueio continua bloqueio;
- tela de renovação depende de expiração confirmada;
- consulta explícita ao servidor Firestore para confirmar expiração;
- `onAuthStateChanged` restaura sessão e inicia monitoramento.

Logo, estado de verificação não foi transformado em “expirado” por esta revisão.

---

## 26. Histórico

A implementação anterior da V81 foi preservada.

Teste de regressão confirmou que uma rota concluída pode ser preparada para correção mantendo:

- mesmo ID;
- mesma ordem otimizada;
- mesma geometria;
- mesmos pacotes;
- demais paradas concluídas intactas;
- somente a parada escolhida volta a `pendente`.

A preparação de correção não executa reotimização.

---

## 27. Otimização

Arquivo principal de roteirização:

```text
js/roteirizacao/roteirizacao.js
```

permanece byte a byte igual à base recebida.

`js/roteirizacao/servico-rota.js` mudou exclusivamente na preservação dos campos de instruções/manobras retornados pelo provedor.

Não foram alterados:

- algoritmo;
- candidatos;
- comparação;
- regra de vencedor;
- refinamento;
- decisão da rota otimizada.

`tests/v81-optimization-equivalence.js` foi executado com respostas mock idênticas para V80/V81.

Cenários:

```text
short: 3, 7, 12 paradas
balanced: 3, 7, 12 paradas
```

Em todos:

```text
mesma rota vencedora
mesmas métricas/critério
mesmo conjunto de candidatos
```

---

## 28. Cache/build desta entrega

Como esta é uma revisão da mesma V81, apenas manter `PEMATO_BUILD = "81"` poderia permitir que uma instalação anterior reutilizasse JS/CSS em cache.

Foi alterado para:

```text
PEMATO_BUILD = "81-ENDERECOS-NAVEGACAO"
PEMATO_VERSION = "V81"
```

E os query strings dos assets em `index.html` foram atualizados para:

```text
20261017-v81-enderecos-navegacao-final
```

Isso não modifica os arquivos protegidos referenciados; apenas força o navegador a buscar a revisão correta.

---

## 29. Arquivos alterados em relação à base

Arquivos funcionais/documentais alterados ou adicionados:

```text
README.md
index.html
css/navegacao.css
js/app.js
js/mapa/config.js
js/navegacao/navegacao.js
js/roteirizacao/servico-rota.js
tests/v81-final-enderecos-navegacao.js
docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md
```

### Arquivos da Bipagem modificados

```text
0
```

### Workers modificados nesta revisão

```text
0
```

---

## 30. Testes executados

### 30.1 Syntax check

Executado com `node --check` nos JS modificados e, adicionalmente, em todos os `.js` dentro de `js/` e `tests/`.

Resultado:

```text
PASS — todos
```

### 30.2 Agrupamento obrigatório

Passaram:

```text
Rua A, 100 == Rua A, 100
Rua A, 100, Apto 10 == Rua A, 100, Apartamento 10
Rua A, 100, Apto 10 != Rua A, 100, Apto 20
Bloco 1 != Bloco 2
Casa 1 != Casa 2
sem unidade != Apto 10
Av. Rudge, 417 == Avenida Rudge, 417
Rua José da Silva, 50 == R. Jose Silva, 50
Ancara Bloco 1/Apto 501 != Bloco 2/Apto 1208
Ancara Bloco 1/Apto 501 == BL 1/APTO 501
Torre A != Torre B
Sala 31 != Sala 32
Loja 1 != Loja 2
Unidade 4 != Unidade 5
Conjunto 12 != CJ 13
3º Andar != 4º Andar
Fundos != unidade principal
Apto sem valor => unidade incompleta/insegura
```

### 30.3 Mapa

Passaram em mock de layers MapLibre:

```text
limparPontosInteresse preserva labels de vias
limparPontosInteresse preserva place/city
POI não essencial é ocultado
navigation-active aumenta contraste de vias
labels de ruas recebem contraste
labels continuam visíveis
retorno ao overview restaura estilo original
```

### 30.4 Navigation-active

Passaram:

```text
existem estados overview/navigation-active
entrada ativa não chama recálculo
bottom sheet compacta
GPS watch inicia
GPS bruto/visual separados
map matching somente visual
câmera usa pitch/zoom/offset
câmera abre levemente perto da manobra
route source usa tolerance 0
SOURCE_ROUTE deriva de rota.geometria
SOURCE_PROGRESS usa verde de baixa opacidade
segunda manobra existe quando há instrução seguinte
```

### 30.5 Manobras

Passaram todos os tipos listados na seção 21, incluindo fallback neutro.

### 30.6 PDF real + BR

Passou conforme seção 8.

### 30.7 Múltiplos

Passou conforme seção 9.

### 30.8 Bipagem

Comparação byte a byte do diretório protegido:

```text
PASS — 0 arquivos alterados
```

O teste desta revisão verifica presença/preservação das regras BR/`entregaOriginalPorPacote`. Não houve abertura de câmera física/scanner em dispositivo real neste ambiente.

### 30.9 Histórico

```text
PASS
```

### 30.10 Sessão/login

```text
PASS
```

### 30.11 Otimização

```text
PASS — vencedor V80/V81 equivalente em todos os cenários mockados
```

### 30.12 Smoke headless do HTML

Foi tentado um carregamento local com Chromium headless para observar a árvore DOM completa. O processo expirou aguardando dependências externas/CDNs do `index.html` no ambiente isolado e, por isso, **não foi considerado um teste aprovado nem usado como evidência funcional**. A estrutura HTML dos novos controles foi validada diretamente pelos testes de código/DOM simulado descritos acima.

---

## 31. Comparação antes x depois

| Área | Antes | Depois |
|---|---|---|
| Chave física | via + rua + número | via + rua + número + unidade contextual |
| Apto/bloco diferente | podia fundir | separado |
| Unidade só em uma entrega | podia fundir por base | separado por segurança |
| Complemento incompleto | não diferenciava com segurança | isola a entrega |
| Diagnóstico | sem decisão detalhada | comparação determinística com motivo |
| Texto de múltipla | `ENTREGAS ... JUNTAS` | `ENTREGAS DO PDF ... JUNTAS` só após chave segura |
| Tela de rota | navegação e visão geral pouco diferenciadas | `overview` e `navigation-active` explícitos |
| Mapa ativo | estilo de planejamento | contraste específico reversível |
| Route render | tolerance 0.2 | tolerance 0 |
| Rota percorrida | apresentação anterior | verde apagado 34–36% |
| Manobras | painel básico | tipos reais + SVG + segunda instrução + rotatória |
| Câmera | acompanhamento V81 anterior | heading/pitch/offset + enquadramento próximo à curva |
| Entrada Pacote É Mato | modo interno já pouco distinguível | ativa `navigation-active` sem recalcular |
| Bipagem | funcional | idêntica; 0 arquivos alterados |
| Otimização | V81 anterior | algoritmo/decisão preservados |

---

## 32. Limitações e riscos restantes

1. **Não houve validação em trânsito real.** Não afirmar “validado em trânsito real”.
2. O teste de navigation-active é automatizado/simulado; heading/GPS reais em veículo podem expor comportamento específico de aparelhos Android e qualidade de sinal.
3. O teste de contraste executou a lógica contra layers simuladas; a aparência final depende das layers efetivamente presentes na versão do estilo OpenFreeMap carregada no aparelho.
4. O mapeamento de manobras depende dos campos que o Geoapify realmente retornar. Campos desconhecidos caem em “seguir” neutro, de propósito.
5. O teste com PDF real exercitou o parser do aplicativo com itens posicionais derivados do documento, mas não o fluxo completo de seleção de arquivo + PDF.js dentro do WebView/Chrome.
6. Scanner/câmera físicos não foram acionados nesta infraestrutura. Como os arquivos de Bipagem permaneceram byte a byte intactos, o risco de regressão introduzida por esta revisão foi minimizado, mas teste físico continua recomendado antes de publicação ampla.
7. `normalizarEndereco()` agora usa a mesma identidade conservadora de `decomporEnderecoFisicoPdfV71()`. Isso reduz falsos positivos, mas intencionalmente pode aumentar casos separados para revisão quando o complemento estiver incompleto/ambíguo.

---

## 33. Conclusão

A V81 final implementa o ajuste crítico de identidade física e separa a experiência de planejamento da navegação ativa sem modificar a Bipagem nem a decisão do otimizador.

Resultado obrigatório confirmado:

```text
ARQUIVOS DA BIPAGEM MODIFICADOS: 0
```

A entrega foi validada por syntax check, testes unitários/estruturais, regressão V81 existente, equivalência da otimização, teste de estado de navegação e teste com PDF real. Não foi declarada validação em trânsito real.
