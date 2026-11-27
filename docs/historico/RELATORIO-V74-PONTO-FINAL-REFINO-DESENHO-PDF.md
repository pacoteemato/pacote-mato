# V74 - alterações restritas ao pedido

1. Ponto final opcional após a última entrega (casa/base/outro endereço), sem virar entrega nem entrar na bipagem.
2. O ponto final entra no cálculo/otimização como último waypoint e, na navegação, vira o destino ativo depois que todas as entregas forem tratadas; o motorista conclui esse trecho com **Cheguei**.
3. Removida apenas a opção **Otimizar automaticamente** do painel Refinar.
4. Desenho no mapa alterado para traço livre real (`fill:none`) durante o gesto; círculo, quadrado ou contorno irregular são aceitos.
5. Refinamento por múltiplos grupos: Grupo 1, Grupo 2, Grupo 3...; ao aplicar, os grupos entram nessa ordem e as paradas não desenhadas preservam a ordem relativa anterior.
6. Cartão automático de localização removido; a ativação fica em Configurações. Na importação, se a permissão ainda não estiver ativa, o app oferece abrir Configurações ou continuar sem GPS.
7. PDF de rota refeito no estilo tabela Circuit, com identidade Pacote É Mato em verde/branco/preto, nome de arquivo `Pacote É Mato - <rota>.pdf`, paradas físicas na sequência atual/otimizada, endereço, ETA real quando disponível e SPX TN. Paradas múltiplas saem em uma linha física com todos os códigos do endereço.
8. Leitor PDF/Bipagem V73 não foi alterado; somente o marcador de build do app foi atualizado para V74.

## Verificações executadas

- 30 arquivos JavaScript passaram em `node --check`.
- Teste unitário do serviço de rota confirmou: início + paradas físicas únicas + ponto final.
- Teste unitário do exportador confirmou: nome do arquivo, agrupamento físico, ordem, SPX TN, ponto final e resumo de quantidades.
- IDs novos da interface conferidos no HTML e referências antigas de `Otimizar automaticamente`/desenho antigo removidas.
