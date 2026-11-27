# V57 — Bipagem: múltiplas corrigidas

- Corrigida a criação de paradas físicas na importação PDF.
- Complementos como apartamento, bloco, torre, sala e casa não criam nova parada.
- Quando o mesmo imóvel aparece mais de uma vez com variações de texto, os pacotes são mesclados na mesma chave física (logradouro + número).
- Removida a regra que criava sufixos `_sN` e podia inflar a contagem de paradas.
- Cache-bust atualizado para V57.
