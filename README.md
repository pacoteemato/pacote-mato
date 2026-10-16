# Pacote É Mato V74 - Ponto final, refinamento por desenho e PDF

Alterações desta versão (somente as solicitadas):

- Ponto final opcional da rota (casa/base/outro destino) após a última entrega.
- Refinar rota sem a opção “Otimizar automaticamente”.
- Desenho livre real no mapa, sem preenchimento em formato de “bola” durante o gesto.
- Vários grupos desenhados em sequência: Grupo 1, Grupo 2, Grupo 3...
- Cartão automático de localização removido; ativação permanece em Configurações e a importação apenas orienta o usuário.
- Exportação PDF com identidade Pacote É Mato, tabela verde/branca, sequência da rota e coluna SPX TN.
- Leitor/Bipagem V73 preservados sem mudanças.

# Pacote É Mato V71 - Bipagem/PDF robusta

Esta versão troca a associação por proximidade por uma leitura estrutural e conservadora.

- Em PDFs com coluna de número da entrega, cada número delimita a própria linha/faixa da tabela. Código BR e endereço só podem ser associados dentro daquela entrega.
- Códigos BR seguem validação estrita: `BR` + 12 dígitos + 1 caractere final. Fragmentação visual do PDF é reconstruída, inclusive quando o último caractere fica na linha abaixo.
- Endereço físico é agrupado por logradouro + número do imóvel. Apartamento, bloco, torre, sala, casa interna e observações não criam uma nova parada física.
- A lista mostra a numeração física 1..N. Em parada múltipla, exibe juntas as entregas originais do PDF, por exemplo `ENTREGAS 18 · 19 · 20 JUNTAS`.
- PDFs de rota sem códigos BR continuam sendo importados para lista/roteirização; a câmera de bipagem fica desativada e o app explica que o arquivo não contém identificadores de pacote.
- Destino/retorno sem pacote não entra na contagem de entregas.
- Se uma linha tiver código/endereço realmente ambíguo, a rota é bloqueada em vez de o app chutar uma associação.
- Corrigidas quebras reais de número causadas por PDF, como `16` + `6` = `166` e `719` + `A` = `719A`, apenas em contextos seguros de endereço.

## Corpus de regressão usado

- Circuit com 93 entregas e códigos BR quebrados em duas linhas.
- Circuit com 30 entregas e nenhum código BR.
- Spoke com 93, 11, 46 e 69 entregas codificadas, incluindo linhas de Destino que não devem virar pacote.

PDFs somente imagem/scan ainda dependem de OCR e não são tratados como texto confiável nesta versão.


## V72 - leitor PDF validado

- Corrige importação híbrida página a página: linha numerada quando existe, código BR ancorado quando a página não tem numeração utilizável.
- A contagem de pacotes usa apenas códigos BR completos/reconstruídos pelo leitor determinístico, sem poluição de leitores legados.
- Mantém agrupamento de parada física por logradouro + número e exibe numeração física sequencial no modal.
- Adiciona diagnóstico `window.diagnosticoPdfV72` e identificação visual V72.
- Limpa caches/service workers antigos sem apagar rota/histórico/localStorage operacional.

## V73 - bipagem/PDF deterministico

- Corrige o bloqueio indevido `SEQUENCIA_PARADAS_INCOMPLETA` da V72.
- A coluna `#` nao e mais requisito de integridade da rota.
- Para PDFs com pacotes, o BR e usado como ancora da propria faixa visual e o endereco precisa ser validado dentro dessa mesma faixa.
- Reconstrucao de BR quebrado exige alinhamento de coluna e proximidade vertical, evitando anexar numero de parada ao codigo.
- As entregas sao renumeradas pela ordem visual do PDF somente depois de codigo/endereco estarem associados com seguranca.
- PDFs sem BR podem montar rota/lista, mas a bipagem por codigo permanece desabilitada.
- Identificacao visual: `LEITOR PDF V73` e `PACOTE E MATO · V73`.

- Na navegação, depois da última entrega, o ponto final vira o destino ativo e o botão **Cheguei** encerra esse deslocamento antes do resumo final.
