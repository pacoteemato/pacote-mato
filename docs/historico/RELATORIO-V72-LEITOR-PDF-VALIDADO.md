# V72 - Leitor PDF validado

A V72 corrige dois pontos: atualização presa em versão anterior no WebView/cache e seleção global do leitor V71 em PDFs multipágina. Agora a estratégia é escolhida por página.

## Regras

1. Linha numerada é fonte de verdade quando presente.
2. Se uma página não tiver numeração utilizável, o código BR da própria linha é a âncora.
3. Nunca busca código de outra entrega para completar uma linha.
4. Parada física = logradouro normalizado + número do imóvel. Complementos não criam outra parada.
5. Contagem final é validada pelo conjunto de códigos BR determinísticos.
6. PDFs textuais sem BR podem carregar endereços/rota, mas não habilitam bipagem por código.
