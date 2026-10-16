# Relatório V78

Escopo restrito ao pedido:

1. Corrigida a cor do endereço no cartão de resultado da Bipagem (`#resEndereco`) para texto escuro sobre fundo claro.
2. Removido o texto visível `LEITOR PDF V73` da tela de importação.
3. Removida referência visível à versão interna do parser em mensagem de erro.
4. Corrigido o mecanismo de build para não manter um número antigo hardcoded no `app.js`; o cache usa a versão atual declarada no `index.html`.

Nenhuma regra de parsing, agrupamento de paradas, associação de pacotes ou roteirização foi alterada.
