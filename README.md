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
