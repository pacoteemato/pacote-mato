# V70 - PDF por posição livre

## Objetivo
Evitar falhas quando um exportador move as colunas ou desenha código, endereço, número e horário em posições diferentes.

## Alteração
- Nova estratégia `posicao-livre-v70` como primeira tentativa.
- Não usa faixas X fixas para identificar `Address` ou `Notes`.
- Agrupa itens por proximidade vertical com tolerância adaptativa.
- Testa janelas de linhas adjacentes para endereços quebrados.
- Reconstrói `BR + 12 dígitos + caractere final` mesmo se o último caractere estiver em outro item/linha.
- Associa códigos a endereços válidos por proximidade visual e ordem de leitura.
- Mantém os leitores V69/V51/universal/legado como fallback.
- Mantém proteção contra `BR-050` e outros textos que não são pacote.

## Limite
A leitura continua baseada na camada de texto do PDF. Arquivos somente-imagem precisam de OCR.
