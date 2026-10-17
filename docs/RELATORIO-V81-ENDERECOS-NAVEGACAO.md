# AVISO DE REGRA FINAL — HOTFIX FINAL 3

> **REGRA DEFINITIVA:** a partir do HOTFIX FINAL 3, qualquer seção histórica deste relatório que diga que apartamento, bloco, torre, sala, loja, unidade, andar, casa interna ou complemento **separam paradas físicas** está **CANCELADA/SUPERADA**. A chave física final usa apenas **logradouro normalizado + número principal do imóvel**. Complementos continuam armazenados apenas para exibição.

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
[SUPERADO] Apto 10 != Apto 20 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Bloco 1 != Bloco 2 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Casa 1 != Casa 2 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] sem unidade != Apto 10 — regra cancelada no HOTFIX FINAL 3
Av. Rudge, 417 == Avenida Rudge, 417
Rua José da Silva, 50 == R. Jose Silva, 50
[SUPERADO] Ancara Bloco 1/Apto 501 != Bloco 2/Apto 1208 — agora é UMA parada
Ancara Bloco 1/Apto 501 == BL 1/APTO 501
[SUPERADO] Torre A != Torre B — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Sala 31 != Sala 32 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Loja 1 != Loja 2 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Unidade 4 != Unidade 5 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Conjunto 12 != CJ 13 — regra cancelada no HOTFIX FINAL 3
[SUPERADO] 3º Andar != 4º Andar — regra cancelada no HOTFIX FINAL 3
[SUPERADO] Fundos != unidade principal — regra cancelada no HOTFIX FINAL 3
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

---

## 34. HOTFIX FINAL — PACOTES MÚLTIPLOS E PARADAS FÍSICAS

### 34.1 Sintoma observado no aparelho

Foi reportado um cenário semelhante a:

```text
123 PACOTES
122 PARADAS FÍSICAS
```

Esse número não foi hard-coded nem usado como meta. O hotfix trata a causa estrutural que pode fazer uma entrega com vários códigos BR ser fragmentada antes da formação das paradas.

### 34.2 Causa raiz encontrada

O leitor V73 trabalha corretamente com âncoras de código e pode produzir mais de um registro visual para a **mesma entrega original** quando uma entrega contém vários códigos BR ou quando a coluna `Notes` é fragmentada pelo PDF.

Antes deste hotfix:

1. cada registro visual mantinha, quando disponível, `numeroOriginalPdf`;
2. `normalizarRegistrosPdfV73()` atribuía uma sequência interna em `numeroParada` para os registros normalizados;
3. `processarRegistrosrota()` reconstruía a unidade de entrega usando principalmente `numeroParada`;
4. assim, dois BRs da mesma entrega original podiam ser tratados temporariamente como duas entregas independentes;
5. se as linhas de endereço desses registros viessem fragmentadas de forma diferente, a fase de chave física podia produzir chaves diferentes e transformar uma entrega real em mais de uma parada.

A regressão não estava no scanner. Ela estava **antes da Bipagem**, na reconstrução dos dados da rota.

### 34.3 Ordem corrigida

A formação da rota agora segue explicitamente:

```text
PDF
→ registros visuais
→ ENTREGA ORIGINAL DO PDF
→ todos os BRs da entrega
→ endereço/unidade da entrega
→ comparação com OUTRAS entregas
→ PARADA FÍSICA
```

Foi criada em `js/app.js`:

```text
reconstruirEntregasOriginaisV81()
```

Ela executa antes do agrupamento físico.

### 34.4 Regra da entrega original

Quando `numeroOriginalPdf` está confirmado, todos os registros com esse mesmo número são reunidos em uma única entrega e seus BRs são unidos sem duplicação.

Exemplo validado:

```text
Entrega 119
BR-1
BR-2
BR-3
```

permanece:

```text
1 entrega
3 pacotes
```

antes de qualquer decisão de parada física.

Se o leitor V73 não possuir número original confirmado, o hotfix **não inventa** que dois registros são a mesma entrega apenas porque o endereço parece semelhante.

### 34.5 Endereço fragmentado dentro da mesma entrega

A mesma entrega pode conter registros visuais com variações como:

```text
Rua A, 50, Apto
Rua A, 50, Apto 501
```

Se uma versão completa e segura do complemento existir dentro da mesma entrega, ela é escolhida como referência da entrega inteira.

Resultado validado:

```text
apt:501
```

Os BRs continuam juntos.

Se registros da **mesma entrega original** apontarem para rua/número realmente conflitantes, o sistema bloqueia com diagnóstico em vez de dividir silenciosamente os BRs em paradas diferentes.

Erros de proteção adicionados:

```text
ENTREGA_ORIGINAL_ENDERECO_CONFLITANTE
ENTREGA_ORIGINAL_UNIDADE_CONFLITANTE
PACOTE_EM_DUAS_ENTREGAS
```

### 34.6 Agrupamento físico continua conservador

Somente depois da entrega estar reconstruída, a V81 compara sua chave física.

Caso validado:

```text
Entrega 119
R Ancara, 105, Bloco 1, Apto 501
2 pacotes

Entrega 120
Rua Ancara, 105, BL 1, APTO 501
1 pacote
```

Resultado:

```text
1 PARADA FÍSICA
2 ENTREGAS DO PDF
3 PACOTES
```

Enquanto:

```text
R Ancara, 105, Bloco 2, Apto 1208
```

permanece em outra parada.

### 34.7 Paradas Múltiplas

A tela de `Paradas Múltiplas` foi ajustada na camada principal para considerar uma parada múltipla quando:

```text
quantidade de entregas > 1
OU
quantidade de pacotes > 1
```

Portanto uma única entrega com três BRs é corretamente reconhecida como uma parada física com múltiplos pacotes, sem fingir que existem três entregas.

A palavra `JUNTAS` continua reservada ao caso em que **mais de uma entrega do PDF** foi realmente agrupada na mesma unidade física.

### 34.8 Contadores da Bipagem

A implementação existente foi conferida e preservada:

```text
BIPADOS = pacotesBipados.size
TOTAL = todosPacotes.size
PARADAS FÍSICAS = Object.keys(mapaRotas).length
FALTAM = TOTAL - BIPADOS
```

Ou seja, `FALTAM` continua contando **pacotes**, não paradas.

### 34.9 Diagnóstico de rota real

`window.diagnosticoRotaReal` agora inclui:

```text
TOTAL DE PACOTES
TOTAL DE ENTREGAS DO PDF
TOTAL DE PARADAS FÍSICAS
PARADAS MÚLTIPLAS
```

Para cada parada também são registrados:

```text
paradaFisica
endereco
entregasPdf
pacotes
multipla
motivoAgrupamento
```

Motivos usados:

```text
MESMA_ENTREGA_ORIGINAL
MESMA_UNIDADE_FISICA
PARADA_SIMPLES
```

O console imprime o detalhamento das paradas múltiplas com entregas, BRs, endereço e motivo.

### 34.10 Teste sintético obrigatório — 6 pacotes / 3 entregas / 2 paradas

Entrada:

```text
Entrega 119 — Apto 10
BR-1
BR-2
BR-3

Entrega 120 — AP 10
BR-4

Entrega 121 — Apto 20
BR-5
BR-6
```

Resultado do teste automatizado:

```text
PASS — 6 BRs
PASS — 3 entregas originais
PASS — 2 paradas físicas
PASS — entrega 119 mantém 3 BRs
PASS — entrega 121 mantém 2 BRs
PASS — 119 + 120 compartilham parada
PASS — 121 permanece separada
```

### 34.11 Teste Ancara com pacote múltiplo

Entrada simulada usando a lógica real do app:

```text
Entrega 119
R Ancara, 105, Bloco 1, Apartamento 501
BR260000000001A
BR260000000004D

Entrega 120
Rua Ancara, 105, BL 1, APTO 501
BR260000000002B

Entrega 121
Rua Ancara, 105, Bloco 2, Apartamento 1208
BR260000000003C
```

Resultado real do harness:

```text
TOTAL DE PACOTES: 4
TOTAL DE ENTREGAS DO PDF: 3
TOTAL DE PARADAS FÍSICAS: 2
PARADAS MÚLTIPLAS: 1
```

Parada 1:

```text
ENTREGAS DO PDF: 119, 120
PACOTES:
BR260000000001A
BR260000000004D
BR260000000002B
MOTIVO: MESMA_UNIDADE_FISICA
```

Parada 2:

```text
ENTREGA DO PDF: 121
PACOTE:
BR260000000003C
```

### 34.12 PDF real disponível para regressão

O PDF real disponível nesta sessão (`Spoke-30-V81-Teste.pdf`) foi processado novamente com o código do hotfix.

Resultado:

```text
TOTAL DE PACOTES: 11
TOTAL DE ENTREGAS DO PDF: 11
TOTAL DE PARADAS FÍSICAS: 11
PARADAS MÚLTIPLAS: 0
```

Também passou:

```text
11/11 âncoras BR encontradas
11/11 pacotes preservados
0 BR perdido
0 BR duplicado
entregaOriginalPorPacote cobrindo todos os BRs
fragmentação "A p. 101" normalizada para apt:101
```

**Limitação importante:** o PDF específico do aparelho que apresentou `123 pacotes / 122 paradas físicas` não estava disponível nos arquivos acessíveis desta execução. Portanto não é declarado que esse arquivo específico foi reproduzido aqui. A causa estrutural foi reproduzida em teste automatizado e corrigida; o PDF real disponível foi usado como regressão adicional.

### 34.13 Bipagem — arquivos modificados

Resultado obrigatório:

```text
ARQUIVOS MODIFICADOS EM js/bipagem/: 0
```

Hashes dos três módulos protegidos permanecem os mesmos da V81 anterior:

```text
js/bipagem/bipagem-area.js
js/bipagem/operacoes-pacotes.js
js/bipagem/rota-ativa-bridge.js
```

A rotina principal `processarCodigo()` também foi verificada: ela continua executando somente:

```text
pacotesBipados.add(identificado)
```

Não existe laço marcando automaticamente os demais BRs da parada.

### 34.14 Otimização, login, histórico e navegação

Nenhuma lógica de otimização foi modificada neste hotfix.

A suíte existente foi executada novamente e confirmou:

```text
PASS — vencedor equivalente V80/V81 em short: 3, 7 e 12 paradas
PASS — vencedor equivalente V80/V81 em balanced: 3, 7 e 12 paradas
PASS — mesmos candidatos/métricas dos testes de equivalência
PASS — regressão de sessão/login
PASS — histórico/correção de parada
PASS — GPS bruto x visual
PASS — navigation-active estrutural
PASS — manobras existentes da V81
```

### 34.15 Syntax check

Executado `node --check` em todos os arquivos `.js` da árvore do projeto após o hotfix.

Resultado:

```text
ALL_JS_SYNTAX_OK
```

### 34.16 Arquivos alterados neste hotfix

Em comparação com `Pacote-Em-Mato-V81-ENDERECOS-NAVEGACAO`:

```text
README.md
index.html
js/app.js
tests/v81-final-enderecos-navegacao.js
tests/v81-hotfix-pacotes-paradas.js (novo)
docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md
docs/VALIDACAO-V81-HOTFIX-PACOTES-PARADAS.log (novo)
```

`index.html` recebeu apenas novo cache-buster para garantir carregamento do `js/app.js` corrigido.

### 34.17 Estado final desta correção

Implementado e testado neste ambiente:

```text
PACOTE ≠ ENTREGA ≠ PARADA FÍSICA
1 pacote não implica 1 parada
vários BRs da mesma entrega são recompostos antes do agrupamento físico
entregaOriginalPorPacote permanece original
contadores continuam em pacotes
paradas continuam físicas
Bipagem modular permanece intocada
```

Não foi realizada condução em trânsito real nem teste de câmera física nesta execução.


## 35. HOTFIX FINAL 2 — MAPA, SESSÃO E MANOBRAS

Data da execução: 17/10/2026.

Base utilizada: `Pacote-Em-Mato-V81-HOTFIX-FINAL`, isto é, a V81 que já contém o hotfix aprovado de pacotes múltiplos/paradas físicas.

### 35.1 Escopo congelado

A lógica aprovada de pacote → entrega original → parada física **não foi alterada** neste hotfix. Foram comparados hashes/blocos da base aprovada com a árvore final.

Resultados:

```text
PASS — reconstruirEntregasOriginaisV81() idêntica
PASS — extrairUnidadeEnderecoPdfV81() idêntica
PASS — decomporEnderecoFisicoPdfV71() / trecho idêntico
PASS — chaveFisicaPdfV71() / trecho idêntico
PASS — normalizarRegistrosPdfV73() / trecho idêntico
PASS — processarRegistrosrota() / trecho idêntico
PASS — js/bipagem/bipagem-area.js idêntico
PASS — js/bipagem/operacoes-pacotes.js idêntico
PASS — js/bipagem/rota-ativa-bridge.js idêntico
PASS — js/roteirizacao/roteirizacao.js idêntico
```

Resultado obrigatório:

```text
ARQUIVOS MODIFICADOS EM js/bipagem/: 0
```

A regressão funcional do hotfix anterior também foi executada novamente: vários BRs da mesma entrega permanecem juntos, BRs são bipados individualmente, entregas equivalentes podem compartilhar a mesma parada, bloco/apartamento diferente permanece separado e os contadores continuam distinguindo pacotes de paradas físicas.

### 35.2 MAPA — causa e implementação clean

O mapa anterior ainda mantinha a aparência original colorida do Liberty no overview e aplicava ajustes mais fortes apenas no modo ativo. Isso produzia uma identidade inconsistente e deixava rodovias, áreas temáticas, POIs e labels secundários competindo com a rota.

Foi consolidada em `js/mapa/config.js` a função:

```text
aplicarEstiloMapaClean(mapa, { navegacaoAtiva })
```

A classificação é feita por `id` + `source-layer` + `type`, sem depender de um único ID rígido do estilo.

Paleta aplicada:

```text
fundo:          #f3f5f6
água:           #e2f0f5
parques/verde:  #edf3ed
prédios:        #e9edef com baixa opacidade
vias principais:#cfd6da
vias secundárias:#d7dde1
vias locais:    #e0e4e7
road labels:    #303b42 com halo claro
rota futura:    verde Pacote É Mato
rota percorrida:verde apagado/baixa opacidade
```

Layers/categorias reduzidas ou ocultadas quando identificadas:

```text
poi
amenity
shop/store
restaurant/cafe/bar
commercial labels
tourism/attraction
school/college/university/kindergarten
church/place_of_worship
hotel/lodging
building extrusion
detalhes excessivos de landuse
```

Road shields (`SP-*`, `BR-*`, refs de highway/motorway) não são apagados indiscriminadamente, mas recebem `text-opacity`/`icon-opacity` reduzidos para não dominar a tela.

Preservado explicitamente:

```text
road/street labels
transportation_name
primary/secondary/tertiary/residential
place/city/town/village/neighbourhood
water
boundary útil
```

A largura das vias agora mantém hierarquia visual `principal > secundária > local`, com pequeno reforço adicional em `navigation-active`.

`limparPontosInteresse()` continua preservando labels de rua/localidade e remove somente símbolos secundários compatíveis com POI.

### 35.3 Mesmo mapa no OVERVIEW e NAVIGATION-ACTIVE

`OVERVIEW` e `NAVIGATION-ACTIVE` agora usam a mesma identidade clean.

No overview:

```text
mapa clean
rota completa
paradas da rota
fitBounds permitido
```

No navigation-active:

```text
mesmo mapa clean
vias levemente reforçadas
câmera próxima
pitch/bearing
seta/posição visual
manobras
markers filtrados para reduzir poluição
```

`restaurarEstiloMapaOverview()` não restaura mais o Liberty colorido; ele reaplica o estilo clean de overview.

### 35.4 Screenshots / validação visual

Foram gerados:

```text
tests/visual/OVERVIEW-HOTFIX2-SIMULADO.png
tests/visual/NAVIGATION-ACTIVE-HOTFIX2-SIMULADO.png
```

Essas imagens são **harness visual offline**, marcadas no próprio arquivo como `NÃO É TRÂNSITO REAL`. Elas validam paleta, contraste, hierarquia de ruas, destaque da rota, painel de manobra e bottom sheet conceitualmente.

O ambiente desta execução não conseguiu concluir a captura com tiles reais do OpenFreeMap/Liberty por indisponibilidade de recursos externos/Chromium headless. Portanto **não** se declara screenshot de mapa online real nem validação em trânsito.

Além do harness, a lógica real de `aplicarEstiloMapaClean()` foi executada contra um mock de layers Liberty-like e confirmou:

```text
PASS — fundo clean
PASS — água suave
PASS — parque desaturado
PASS — road labels preservados/legíveis
PASS — POI comercial ocultado
PASS — road shield reduzido
PASS — overview e navigation-active mantêm a mesma identidade base
PASS — navigation-active reforça moderadamente a via
```

### 35.5 LOGIN — causa do logout/reabertura

Na base anterior, `onAuthStateChanged` só restaurava o monitoramento quando existiam simultaneamente:

```text
Firebase currentUser
E
usuario_zap_salvo
```

Se o Firebase recuperasse `currentUser`, mas `usuario_zap_salvo` estivesse ausente/inconsistente, a interface caía para o fluxo de login. Além disso, a persistência `LOCAL` do Firebase Auth não era solicitada explicitamente antes de cadastro/login.

Também havia mais de uma representação textual de estado (`verificando`, `ativo`, `expirado`, `erro_conexao`) e `mostrarRenovacao()` aceitava `expiracaoConfirmada=true` sem exigir simultaneamente que o estado atual ainda fosse `expired`, o que permitia UI antiga conflitante em condições de corrida.

### 35.6 LOGIN — máquina única e persistência

Foi consolidado:

```text
authAccessState =
booting
checking
active
expired
blocked
offline-error
signed-out
```

Foi adicionada persistência explícita:

```text
firebase.auth.Auth.Persistence.LOCAL
```

Cadastro e login aguardam a configuração de persistência.

Na abertura:

```text
1. aguarda persistência Firebase;
2. registra onAuthStateChanged;
3. se currentUser existir, entra em checking;
4. tenta vínculo UID → WhatsApp local;
5. se necessário, consulta único usuário com authUid == currentUser.uid;
6. somente depois inicia monitoramento da conta/assinatura.
```

`usuario_zap_salvo` deixou de ser ponto único de falha. O vínculo por UID é mantido localmente e pode ser recuperado de forma segura pelo Firestore. O fallback legado só é aceito se o cache confirmar que `authUid` corresponde ao usuário Firebase atual.

`mostrarRenovacao()` agora exige as duas condições:

```text
expiracaoConfirmada === true
E
authAccessState === expired
```

`checking`, `booting`, `active`, `offline-error` e `signed-out` não podem abrir renovação.

Ao entrar em `active`, mensagens/classes/datasets antigos de expiração são limpos.

Fechar/recarregar WebView não contém `signOut()`. Logout é reservado para ação explícita ou invalidação/bloqueio confirmado.

### 35.7 Teste de login — nível de validação

Executado nesta sessão:

```text
PASS — conta vitalícia continua considerada ativa pela regra de acesso
PASS — mensal ativa
PASS — trimestral ativa
PASS — teste ativo
PASS — expiração real é distinguida de conta ativa
PASS — bloqueio continua bloqueio
PASS — Firebase Auth Persistence.LOCAL presente
PASS — onAuthStateChanged restaura currentUser via restaurarSessaoFirebase()
PASS — recuperação segura de vínculo por UID presente
PASS — offline-error é diferente de expired
PASS — mostrarRenovacao exige expired + confirmação real
PASS — não há signOut automático por fechamento/reload no fluxo analisado
```

**Limitação:** não foi possível executar nesta sessão um ciclo físico `login → fechar processo Android → abrir processo Android` com uma conta real Vitalícia/mensal. Portanto isso é validação automatizada/estrutural da implementação, não “login validado no Android real”.

### 35.8 NAVIGATION-ACTIVE — persistência do modo e câmera

A entrada em `Navegar > Pacote É Mato` continua utilizando a rota já calculada e não reotimiza.

`enquadrarOverview()` passou a possuir guard explícito:

```text
se navigation-active: não executar fitBounds
```

No modo ativo continuam aplicados:

```text
zoom urbano próximo de 18.x
pitch 60° na câmera ativa
bearing suavizado
posição visual do motorista abaixo do centro
mais área útil à frente
follow contínuo
recentralização sem fitBounds
```

Interação manual desliga temporariamente o follow. O botão `Recentralizar` restaura o acompanhamento do carro; não abre a rota inteira.

No overview podem aparecer todas as paradas. No modo ativo, a fonte de markers é filtrada para priorizar parada atual/selecionada e próxima parada, reduzindo poluição visual.

### 35.9 GPS bruto x map matching visual

A separação foi reforçada:

```text
nearestOperacional = GPS bruto projetado globalmente
nearestVisual      = posição usada para seta/câmera/progresso visual
```

`nearestOperacional` continua responsável por desvio e decisão de recálculo.

`nearestVisual` pode usar map matching visual próximo do progresso atual. Foi introduzido `ultimoIndiceVisualRota`; a busca visual tenta primeiro uma janela ao redor do índice anterior (`-35 / +220`) antes de procurar globalmente, reduzindo saltos para outro trecho quando a rota cruza a si mesma.

Isso não sobrescreve coordenada GPS bruta nem a posição real das paradas.

### 35.10 MANOBRAS — schema real preservado

`extrairInstrucoes(feature)` foi ampliado para preservar, quando presentes:

```text
type
modifier
streets
street_name
name/rua derivada
exitNumber
exit_number
exitRoadName
exitTowards
roundabout_exit
transition_instruction
pre_transition_instruction
post_transition_instruction
distance
time
from_index
to_index
```

A prioridade do nome da rua usada pelo painel passou a ser:

```text
streets[0]
street_name
rua/name
exitRoadName[0]
texto real da instrução
```

Não é inventado nome de rua.

### 35.11 MANOBRAS — tipos Geoapify

Foram executados testes diretos de parsing CamelCase para:

```text
StartAt
StartAtRight
StartAtLeft
Straight
SlightRight
Right
SharpRight
TurnAroundRight
TurnAroundLeft
SharpLeft
Left
SlightLeft
ExitRight
ExitLeft
StayRight
StayLeft
Merge
MergeRight
MergeLeft
Roundabout
DestinationReached
DestinationReachedRight
DestinationReachedLeft
```

Resultado: todos os tipos laterais, retornos e chegada foram classificados sem cair erroneamente em `reta`.

Tipo desconhecido continua em fallback neutro `reta` em vez de inventar direção.

Rotatória aceita saída real via `roundabout_exit`, `exitNumber` ou `exit_number`, inclusive number/string/array. Sem número real, nenhuma saída é inventada.

### 35.12 Correção MULTI-LEG

O bug crítico era que `from_index`/`to_index` de cada leg podiam ser reutilizados como se fossem índices globais da geometria achatada. A extração agora mantém:

```text
legIndex
fromIndexLeg
toIndexLeg
globalFromIndex
globalToIndex
```

Para `MultiLineString`, os offsets reproduzem a concatenação real das LineStrings usada pelo navegador.

Teste obrigatório executado:

```text
leg 0 = 100 pontos
leg 1 = 70 pontos
leg 2 = 80 pontos

from_index local = 10 em cada leg

leg 0 -> globalFromIndex = 10
leg 1 -> globalFromIndex = 110
leg 2 -> globalFromIndex = 180
```

Resultado: PASS.

`indiceInstrucaoAtual()` e `atualizarInstrucao()` agora preferem índices globais e mantêm fallback para rotas antigas que só tenham índices legados.

### 35.13 Rota futura / percorrida

Mantido:

```text
FUTURO: verde forte Pacote É Mato
PERCORRIDO: verde com baixa opacidade (~36%)
```

O overview também deixou de usar cinza forte para o trecho já percorrido.

A geometria continua vindo de `rota.geometria`. A navegação mantém `tolerance = 0` na fonte renderizada, sem substituir a rota por linhas retas entre paradas.

### 35.14 Bottom sheet

A implementação existente de bottom sheet compacto/grabber foi preservada. Durante `navigation-active`, o conteúdo prioritário continua:

```text
parada/progresso
endereço
Não entregue
Entregue
```

O grabber expande informações complementares. A lógica de status das entregas não foi alterada neste hotfix.

### 35.15 Otimização congelada

`js/roteirizacao/roteirizacao.js` permaneceu byte a byte idêntico à base aprovada.

A suíte de equivalência foi executada novamente:

```text
PASS — short: 3, 7, 12 paradas
PASS — balanced: 3, 7, 12 paradas
PASS — mesmo vencedor
PASS — mesmas métricas/critério
PASS — mesmo conjunto de candidatos nos cenários mockados
```

Nenhum algoritmo/candidato/refinamento/vencedor foi modificado.

### 35.16 Syntax check

Foi executado `node --check` em todos os arquivos JavaScript da árvore final.

Resultado:

```text
29 arquivos JS verificados
ALL JS SYNTAX OK
```

Também foram executadas as suítes:

```text
tests/v81-hotfix-final-2.js
tests/v81-final-enderecos-navegacao.js
tests/v81-regression.js
tests/v81-hotfix-pacotes-paradas.js
tests/v81-optimization-equivalence.js
```

Resultado final das suítes: PASS.

### 35.17 Arquivos alterados no HOTFIX FINAL 2

Em comparação direta com `Pacote-Em-Mato-V81-HOTFIX-FINAL`:

```text
README.md
index.html
css/navegacao.css
js/app.js
js/mapa/config.js
js/mapa/mapa.js
js/navegacao/navegacao.js
js/roteirizacao/servico-rota.js
tests/v81-final-enderecos-navegacao.js
tests/v81-regression.js
tests/v81-hotfix-pacotes-paradas.js (teste tornou-se autocontido por hashes aprovados)
tests/v81-hotfix-final-2.js (novo)
tests/visual/hotfix2-map-harness.html (novo)
tests/visual/OVERVIEW-HOTFIX2-SIMULADO.png (novo)
tests/visual/NAVIGATION-ACTIVE-HOTFIX2-SIMULADO.png (novo)
docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md
docs/VALIDACAO-V81-HOTFIX-FINAL-2.log (novo)
```

`index.html` recebeu novo cache-buster para os arquivos alterados, evitando que o WebView reutilize JS/CSS do hotfix anterior.

### 35.18 Limitações e riscos restantes

Não foi realizado nesta execução:

```text
condução em trânsito real;
GPS físico em veículo;
fechar/reabrir processo Android com conta real;
scanner/câmera física;
render de tiles OpenFreeMap reais no Chromium deste ambiente;
chamada real ao Geoapify durante condução.
```

Os testes de manobra utilizaram payload estruturado compatível com o schema real esperado do provedor, incluindo múltiplas legs e índices reiniciando em cada leg.

Risco restante principal: diferenças futuras do estilo Liberty podem introduzir novos IDs/source-layers. A implementação reduz esse risco classificando por padrões de `id + source-layer + type`, mas a revisão visual em aparelho com tiles reais continua recomendada.

### 35.19 Estado da entrega

O código do `HOTFIX FINAL 2` está implementado e passou nos testes automatizados disponíveis. O artefato pode ser levado ao aparelho para validação final de ambiente real.

Não é declarado neste relatório:

```text
"validado em trânsito real"
"login validado no Android real"
"câmera física validada"
"mapa OpenFreeMap real validado visualmente neste ambiente"
```


---

## 36. HOTFIX FINAL 3 — REGRA DEFINITIVA DE PARADAS FÍSICAS

### 36.1 Regra final

A identidade de uma parada física passou a ser exclusivamente:

```text
<logradouro_normalizado>|<numero_principal>
```

Na implementação interna o tipo normalizado da via pode compor a representação determinística, mas `R/R./Rua` e `Av/Av./Avenida` são normalizados para a mesma via. **Nenhum complemento de unidade participa da decisão de agrupamento.**

Campos como apartamento, bloco, torre, sala, loja, casa interna, unidade, conjunto, andar, fundos e demais complementos continuam extraídos e preservados para exibição ao motorista.

### 36.2 Número principal

O parser seleciona o número do imóvel imediatamente associado ao logradouro e impede que CEP ou números de complemento sejam promovidos a número principal. Exemplos validados:

```text
Avenida Y, 5350, Torre 4 Apto 1507 => número principal 5350
Rua Z, 451, Apartamento 714        => número principal 451
```

Quando nenhum número principal seguro é encontrado, a entrega recebe uma chave isolada por entrega original (`sem_numero|entrega:<id>`). Assim, endereços sem número não são fundidos somente pelo nome da rua.

### 36.3 Ordem dos dados preservada

Permanece:

```text
PDF
→ ENTREGA ORIGINAL
→ todos os BRs daquela entrega
→ endereço físico
→ agrupamento por logradouro + número principal
→ PARADA FÍSICA
```

`entregaOriginalPorPacote` continua independente da numeração física da rota.

### 36.4 Parada múltipla

A definição final é:

```text
pacotes.length > 1 => PARADA MÚLTIPLA
```

Pacotes de apartamentos, blocos ou torres diferentes continuam na mesma parada quando logradouro e número principal forem iguais. Isso não muda a Bipagem individual: bipar um BR não bipa os demais.

### 36.5 Validação real — 91.pdf

O arquivo real `91.pdf` disponível nesta execução foi processado pelas funções reais de leitura PDF e pela formação de rota do aplicativo. Resultado:

```text
TOTAL DE PACOTES: 102
TOTAL DE ENTREGAS DO PDF: 102
TOTAL DE PARADAS FÍSICAS: 78
PARADAS MÚLTIPLAS: 18
PACOTES NAS PARADAS MÚLTIPLAS: 42
```

Grupos verificados incluem, entre outros:

```text
Avenida Angélica, 634             => 34, 35, 36
R Martim Francisco, 107           => 38, 39, 40, 41
Rua Doutor Sérgio Meira, 230      => 73, 74, 75
Rua Anhangüera/Anhanguera, 451    => 84, 85, 86
Avenida Rudge, 485                => 93, 94, 95
```

Em Sérgio Meira 230 e Anhangüera 451 os complementos são diferentes, mas a parada física é única, como exigido.

### 36.6 Matriz de aceitação Spoke 123

O arquivo exato `Spoke (1)(1).pdf` não estava disponível nos arquivos acessíveis desta execução. Portanto **não é declarado teste real desse PDF**. Foi executada uma matriz sintética fiel aos grupos e contagens fornecidos na especificação:

```text
123 PACOTES
107 PARADAS FÍSICAS
8 PARADAS MÚLTIPLAS
24 PACOTES NAS PARADAS MÚLTIPLAS
```

Grupos testados:

```text
Rua Leais Paulistanos, 525  => 10, 11
Avenida dos Estados, 5350   => 34, 35, 36
Avenida Varsóvia, 850       => 53, 54
Avenida João Pessoa, 873    => 69, 70, 71, 72, 73
Rua do Centro, 1377         => 90, 91
Rua Eleutério, 171          => 98, 99, 100, 101, 102
Rua Ancara, 105             => 119, 120
Rua Ancara, 100             => 121, 122, 123
```

Resultado da matriz: **PASS**.

### 36.7 Bipagem

```text
ARQUIVOS MODIFICADOS EM js/bipagem/: 0
```

A rotina de scanner/câmera/voz não foi alterada. A regressão automatizada continua verificando que `processarCodigo()` marca somente o BR identificado, sem percorrer os demais pacotes da parada.

### 36.8 Otimização e demais blocos

O algoritmo em `js/roteirizacao/roteirizacao.js` não foi alterado. Mapa clean, login persistente, navigation-active e manobras do HOTFIX FINAL 2 também não receberam alteração funcional nesta revisão.

### 36.9 Limitações

- Não houve câmera física nesta execução.
- Não houve condução em trânsito real.
- O PDF exato `Spoke (1)(1).pdf` não estava disponível; sua aceitação foi coberta por matriz sintética, não por leitura real.
- `91.pdf` foi testado de forma real no parser/estrutura de dados, mas não em scanner físico.
