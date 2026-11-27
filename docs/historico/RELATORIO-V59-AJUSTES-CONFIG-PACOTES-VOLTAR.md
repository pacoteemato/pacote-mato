# Pacote É Mato — V59

## Correções desta versão

- Configurações obrigatórias: o campo passa a contar como revisado ao ser tocado/focado, sem exigir trocar para outra opção e voltar.
- Pacote já existente na rota: agora abre uma confirmação própria do Pacote É Mato perguntando se o usuário quer mantê-lo na rota; o pacote não é duplicado.
- Operação de adicionar/remover pacotes: removido o `confirm()` nativo do navegador ao cancelar.
- Removidos também os outros `prompt()/confirm()` nativos remanescentes do app principal; no painel admin, a exclusão passou a usar confirmação em dois cliques.
- Botão Voltar: histórico interno reorganizado para não acumular passos; em módulos/camadas internas volta para o mapa/fecha a camada, e no mapa principal o navegador/PWA pode sair normalmente.
- Cache-busting atualizado para V59.
