# RELATÓRIO — PACOTE É MATO V81 NAVEGAÇÃO FLUIDA

Base: `Pacote-Em-Mato-V80-AVISO-POS-LOGIN`

A V81 foi feita como alteração cirúrgica. O backup lógico dos arquivos-base está documentado em `docs/V81-BACKUP-LOGICO.md`.

## 1. Falso aviso de assinatura expirada

### Causa encontrada

Na V80 o fluxo de restauração de sessão não distinguia de forma suficiente quatro situações diferentes: sessão ainda sendo restaurada, conta ativa, expiração confirmada e falha temporária de Firestore/rede. O monitor em tempo real também podia reagir a um estado inicial/cache antes de uma confirmação do servidor. Como `mostrarRenovacao()` não exigia uma confirmação explícita de expiração, um estado ainda não confiável podia terminar na interface de renovação.

### Correção

`js/app.js` passou a manter estados separados:

- `verificando`
- `ativo`
- `expirado`
- `erro_conexao`

`mostrarRenovacao()` agora possui guarda e só abre renovação quando a expiração foi confirmada. Se um snapshot de cache indicar expiração, a aplicação primeiro consulta o Firestore com `source: 'server'`. Uma falha temporária não transforma a conta em expirada.

### Restauração automática

Quando `auth.onAuthStateChanged` restaura um usuário Firebase e existe `usuario_zap_salvo`, o aplicativo inicia diretamente o monitoramento da conta. O `authUid` do documento é conferido com o UID Firebase. Não é necessário fazer login novamente diariamente.

A compatibilidade existente de vencimento foi preservada para:

- número em milissegundos;
- número em segundos;
- Firestore Timestamp;
- Timestamp serializado (`seconds` / `_seconds`);
- data em texto/ISO;
- conta antiga com `ativo:true` sem vencimento utilizável;
- acesso vitalício;
- bloqueio administrativo.

## 2. GPS e navegação interna

### Antes

- `watchPosition` usava `maximumAge: 3000`;
- a câmera era recentralizada aproximadamente a cada 1.200 ms;
- cada recentralização disparava `easeTo()` com animação relativamente longa;
- a câmera usava aproximadamente zoom 17.5 e pitch 58.

Isso podia criar o padrão visual “anda / para / anda / para”, especialmente quando o GPS entregava atualizações em ritmos diferentes da animação do mapa.

### V81

- `enableHighAccuracy:true` foi mantido;
- `maximumAge` passou para `0` durante a navegação ativa;
- posições com timestamp mais antigo ou igual à última posição aceita são ignoradas;
- toda posição GPS válida é processada;
- posição GPS bruta e posição visual foram separadas;
- a posição visual é interpolada por `requestAnimationFrame`;
- o heading é suavizado por interpolação circular, evitando giro pelo caminho errado em 359° → 1°;
- a câmera contínua usa atualização instantânea (`jumpTo`) em vez de enfileirar animações `easeTo` longas;
- durante a convergência visual, a câmera é atualizada no máximo aproximadamente a cada 70 ms (~14 Hz), independente da frequência real do GPS;
- a frequência de GPS em si continua sendo determinada pelo Android/WebView e pelo dispositivo.

## 3. Map matching visual

A posição GPS bruta continua sendo a fonte de verdade para:

- detecção de desvio;
- decisão de recálculo;
- distância até a rota;
- progresso operacional.

Somente a seta/câmera pode usar a projeção visual sobre a geometria quando o GPS está suficientemente perto da rota. O limite é adaptado pela precisão reportada pelo GPS, com teto conservador.

Se o motorista realmente se afasta da rota, a posição visual volta para a posição GPS real.

Nenhuma coordenada de parada e nenhuma geometria planejada são alteradas pelo map matching.

## 4. Câmera

A câmera interna passou a usar:

- pitch aproximado de 60°;
- zoom dinâmico aproximadamente entre 17.7 e 18.65 conforme a velocidade;
- direção de deslocamento para cima;
- centro visual projetado alguns metros à frente do motorista, aumentando a área útil de rua/curvas à frente e deixando a seta aproximadamente no terço inferior da área útil.

Ao arrastar/rotacionar/alterar manualmente o mapa, o acompanhamento continua sendo desativado. O botão Recentralizar reativa imediatamente o acompanhamento.

## 5. Trecho percorrido

`SOURCE_PROGRESS / LAYER_PROGRESS` continua usando a mesma geometria de rota. Somente a apresentação mudou:

- trecho à frente: verde principal da rota;
- trecho percorrido: verde com opacidade 0.36;
- atualização acompanha continuamente a posição bruta projetada na rota.

O cinza forte foi removido.

## 6. Ícones de manobra

O card superior recebeu um ícone SVG grande. O ícone é derivado das instruções reais já devolvidas pelo Routing API.

`extrairInstrucoes()` agora preserva, além dos campos existentes:

- modificador/direção quando fornecido;
- ângulo quando fornecido;
- número de saída da rotatória também quando vem diretamente no step.

São representadas visualmente categorias como seguir reto, esquerda, direita, leve esquerda/direita, retorno, rotatória e saída. Quando não existe informação suficiente, é usado o símbolo neutro de seguir em frente. A voz existente não foi removida.

## 7. Bottom sheet

No navegador interno Pacote É Mato o painel inferior agora possui um grabber dedicado.

### Compacto — padrão

Mostra principalmente:

- número discreto da parada;
- endereço;
- Não entregue;
- Entregue.

Oculta informações secundárias, observação, pacotes, nota, opções extras e o botão Navegar.

### Expandido

O motorista arrasta o grabber para cima para consultar as informações completas e arrasta para baixo para voltar ao compacto.

O gesto vertical fica somente no grabber. O swipe horizontal do card de parada permanece separado.

Para Waze/Google Maps não foi aplicado o comportamento compacto interno desnecessariamente.

## 8. Histórico de rota concluída e correção

`js/historico/historico-rotas.js` foi ampliado em cima do fluxo existente.

No detalhe da rota, cada parada é clicável e mostra:

- número;
- endereço;
- status;
- observação;
- motivo de não entrega quando houver;
- nota da entrega quando houver.

Paradas Entregues ou Não entregues exibem `Corrigir status`.

Ao confirmar a correção:

- a mesma rota é reaberta com o MESMO ID;
- a mesma ordem é preservada;
- pacotes são preservados;
- coordenadas são preservadas;
- geometria e instruções são preservadas;
- demais paradas concluídas permanecem concluídas;
- somente a parada escolhida volta para `pendente`;
- timestamps/motivos associados ao status daquela parada são limpos;
- `concluidoEm` e `conclusaoPendente` são ajustados para permitir operação;
- não há reotimização automática;
- `precisaRecalculo` não é acionado pela correção.

## 9. Garantia antes de limpar a rota ativa

A finalização agora exige confirmação da persistência local.

`RotaStore.salvarRota()` recebeu uma opção conservadora `exigirPersistenciaLocal`. A navegação usa essa opção ao concluir. Em seguida, lê novamente a rota e verifica:

- mesmo ID;
- status `concluida`;
- mesma quantidade de paradas.

Somente depois disso a rota ativa é limpa e o Histórico é aberto. Se essa confirmação falhar, a rota permanece aberta e o motorista recebe aviso; a aplicação não apaga a rota ativa.

O espelhamento Firestore continua com o comportamento já existente (best effort) para preservar funcionamento offline. A garantia nova é sobre a persistência local usada pelo Histórico operacional.

## 10. Otimização mais rápida sem mudar a regra

Nenhum candidato foi removido e nenhuma regra de comparação foi alterada.

A V81 continua avaliando:

- sequência atual;
- objetivo atual;
- `short`;
- `balanced`;
- refinamentos locais permitidos pela V80.

Mudança técnica:

- alternativas independentes podem rodar com concorrência máxima 2;
- a chave `ordem + tipo` continua evitando avaliar exatamente a mesma combinação duas vezes;
- refinamentos independentes também usam concorrência máxima 2;
- foi incluído um ordinal apenas como desempate de métricas *exatamente iguais*, reproduzindo a prioridade de inserção da V80 mesmo que requisições concorrentes terminem em ordem diferente.

### Prova por mocks

O teste `tests/v81-optimization-equivalence.js` executou o serviço V80 e o V81 contra as mesmas respostas mockadas para preferências `short` e `balanced`, com 3, 7 e 12 paradas.

Em todos os casos foram iguais:

- rota vencedora (`orderIds`);
- tipo escolhido;
- distância;
- tempo;
- conjunto de candidatos avaliados.

Isso prova equivalência para as respostas de teste utilizadas; não é uma afirmação de que um provedor externo nunca mudará suas próprias respostas.

## 11. Textos de processamento

Foram substituídos textos técnicos visíveis durante cálculo por etapas como:

- Preparando sua rota;
- Localizando paradas;
- Analisando a melhor sequência;
- Calculando o percurso;
- Finalizando sua rota;
- Rota pronta.

Termos internos como geometria/blocos seguros não são mais usados nos principais textos de carregamento desta rotina.

## 12. Performance do mapa

Durante atualizações de GPS:

- não é executado `renderizarTudo()`;
- a source do motorista é atualizada independentemente;
- a source de paradas continua protegida pela assinatura visual já existente;
- paradas/marcadores não são reconstruídos a cada frame;
- progresso, instrução e câmera recebem atualizações específicas.

## 13. Recálculo / fora da rota

A regra operacional de desvio foi mantida. O cálculo de `nearest.distance`, limite baseado na precisão, contagem de eventos fora da rota e recálculo continuam usando a posição bruta.

A suavização e o map matching V81 são somente visuais.

## 14. Arquivos alterados

Arquivos funcionais:

- `index.html`
- `js/app.js`
- `js/navegacao/navegacao.js`
- `css/navegacao.css`
- `css/app-shell.css`
- `js/historico/historico-rotas.js`
- `js/core/rota-store.js`
- `js/roteirizacao/roteirizacao.js`
- `js/roteirizacao/servico-rota.js`
- `README.md`

Documentação/testes adicionados:

- `docs/V81-BACKUP-LOGICO.md`
- `docs/RELATORIO-V81-NAVEGACAO-FLUIDA.md`
- `tests/v81-regression.js`
- `tests/v81-optimization-equivalence.js`
- `tests/fixtures/servico-rota-v80.js` (fixture da lógica V80 usada apenas no teste de equivalência)

## 15. Arquivos preservados sem alteração

Comparação SHA-256 contra a V80 confirmou que permaneceram byte a byte iguais:

- `js/bipagem/bipagem-area.js`
- `js/bipagem/operacoes-pacotes.js`
- `js/bipagem/rota-ativa-bridge.js`
- `js/importacao/xlsx.js`
- `js/importacao/fluxo-importacao.js`
- `js/mapa/geocodificacao.js`
- `cloudflare/geocodificacao-worker.js`
- `cloudflare/admin-gateway-worker.js`

Os contratos de Workers/Firebase não foram alterados.

## 16. Testes executados

### Sintaxe

`node --check` foi executado em todos os 36 arquivos `.js` do projeto V81 e todos passaram.

### Regressão lógica/estática

`tests/v81-regression.js` verificou:

- hashes das áreas que não deveriam ser alteradas;
- conta mensal ativa em milissegundos;
- vencimento em segundos;
- Timestamp serializado;
- data ISO;
- conta antiga `ativo:true`;
- vitalícia;
- expirada;
- bloqueada;
- guarda de renovação por expiração confirmada;
- confirmação Firestore no servidor;
- restauração de sessão Firebase;
- reabertura da mesma rota;
- preservação de ordem/geometria/pacotes e demais status;
- `maximumAge:0` no GPS ativo;
- separação GPS bruto / posição visual;
- câmera sem fila de `easeTo`;
- interpolação RAF;
- detecção de desvio baseada no dado real;
- ausência de `renderizarTudo()` no loop GPS;
- ícones de manobra;
- grabber do bottom sheet;
- persistência obrigatória na finalização.

### Otimização

`tests/v81-optimization-equivalence.js` comparou V80 e V81 com mocks idênticos e confirmou o mesmo vencedor/métricas/conjunto de candidatos nos cenários testados.

### Bipagem

Foi feita regressão de integridade por hash nos três módulos dedicados de Bipagem: não houve alteração de bytes nesses arquivos.

## 17. O que NÃO foi validado em trânsito real

Não foi realizado teste físico dirigindo em ruas reais com um aparelho Android. Portanto não é correto declarar como “validado em trânsito real”:

- sensação final do zoom em todos os tamanhos de tela;
- frequência real entregue pelo GPS de cada aparelho;
- comportamento em túneis/avenidas com multipath severo;
- suavização em curvas reais muito fechadas;
- tolerância ideal do map matching em aparelhos com GPS muito ruim.

Esses pontos foram implementados e testados estruturalmente/lógicamente, mas precisam de teste de campo antes de serem considerados calibrados definitivamente.

## 18. Riscos restantes

1. O Android/WebView decide a frequência física dos callbacks de GPS; o código não consegue obrigar o hardware a entregar uma posição a cada intervalo específico.
2. O map matching visual usa a precisão reportada pelo GPS. Aparelhos que reportam precisão irreal podem exigir ajuste posterior do limite visual.
3. A câmera usa parâmetros conservadores de zoom/avanço; a preferência visual pode precisar de pequena calibração depois de teste em rua, sem alterar a lógica operacional.
4. O Firestore remoto das rotas mantém o espelhamento assíncrono já existente para suportar operação offline. A garantia de não perder a rota na finalização é feita no armazenamento local antes da limpeza da rota ativa.
5. Paralelização de otimização foi limitada a 2 para reduzir risco de rate limit, mas a latência externa continua dependente do Worker/provedor.
