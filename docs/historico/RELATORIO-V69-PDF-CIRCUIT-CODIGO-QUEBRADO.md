# V69 - Leitura de PDF Circuit com código quebrado

## Problema encontrado

O PDF `b (2).pdf` é um PDF textual válido do Circuit, com 93 entregas. O campo `Notes` desenha o código de pacote em duas linhas dentro da mesma célula. Exemplo visual/textual:

```text
BR265691124855
W;
```

O código completo é `BR265691124855W`.

O leitor anterior agrupava itens principalmente por linha/Y. Como o prefixo `BR + 12 dígitos` e o caractere final ficavam em alturas diferentes, o endereço podia entrar entre as duas partes durante a ordenação. O regex estrito, corretamente, recusava o prefixo incompleto; por isso nenhum pacote era liberado.

## Correção V69

- Reconstrução da coluna `Notes` por faixa da parada e posição X antes de validar o código.
- Reconstrução separada da coluna `Address`, evitando que fragmentos de Notes/ETA contaminem o endereço.
- O código reconstruído por faixa entra na contagem global do PDF.
- Fallback textual adicional: reconhece `BR + 12 dígitos` somente quando encontra, bem próximo, uma linha contendo exclusivamente o caractere final. Isso mantém a proteção contra falsos códigos como `BR-050`.
- Mantidos os leitores anteriores para Spoke, Circuit e exports tabulares em que endereço/código já vêm na mesma linha.
- Cache do frontend atualizado para V69.

## Validação

No PDF enviado pelo usuário (`b (2).pdf`):

- páginas: 4;
- linhas de entrega: 93;
- códigos completos reconstruídos: 93;
- códigos únicos: 93;
- o caso de endereço quebrado em duas linhas (paradas 26/27) foi reconstruído;
- a observação longa da parada 60 foi preservada no endereço de exibição.

Também foi mantida compatibilidade com o PDF Spoke de regressão `corrida 0710(1).pdf`, cujos códigos já vêm completos na mesma linha.

## Limite técnico

A V69 amplia a compatibilidade de PDFs **com camada de texto**. PDF formado somente por imagem/scan continua exigindo OCR antes de ser interpretado; não é seguro inventar códigos ou endereços a partir de um arquivo sem texto reconhecível.
