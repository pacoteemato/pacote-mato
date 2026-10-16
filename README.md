# Pacote É Mato V76 — correções pontuais

Esta versão parte da V75 e altera somente os pontos solicitados:

- corrige o aviso de localização na importação: no Android/WebView, a posição real retornada pelo GPS passa a ser a fonte de verdade, mesmo quando `navigator.permissions` estiver desatualizado;
- adicionar parada e editar parada passam a usar o mesmo campo de pesquisa da lista de paradas, com sugestões logo abaixo, igual à busca principal de endereços;
- corrige exibição/salvamento de logradouro, número e complemento para não repetir número do imóvel nem apartamento;
- corrige a operação “Adicionar pacotes à rota”: pacote que já estava na rota e foi confirmado em “Sim, manter na rota” agora permanece contado também na conferência e permite confirmar a operação sem duplicar o pacote;
- a remoção por bipagem foi preservada e testada para não regredir.

Não foram alterados o leitor PDF V73, desenho/refino, exportação PDF, Worker, Firebase, navegação, câmera, áudio ou demais regras da rota.
