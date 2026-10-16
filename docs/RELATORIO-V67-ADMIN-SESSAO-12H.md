# Pacote É Mato — V67

## Sessão do Painel do Dono

- Sessão administrativa aumentada de 2 horas para 12 horas no Holy-Frog.
- O token assinado passa a ser mantido no `localStorage` do painel, permitindo fechar e reabrir o navegador/WebView sem perder a sessão antes do vencimento.
- O PIN administrativo nunca é armazenado no navegador.
- O painel valida a sessão no Worker ao reabrir.
- Sessões vencidas são removidas automaticamente.
- O botão **Sair do painel** remove imediatamente token, e-mail e validade locais.
- Chaves antigas em `sessionStorage` são limpas/migradas para evitar conflito com versões anteriores.

## Cloudflare

Substituir o código do Worker `holy-frog-272c` pelo conteúdo de:

`cloudflare/WORKER-HOLY-FROG-V67-ADMIN-12H-COMPLETO.txt`

As variáveis/secrets existentes continuam iguais. Não é necessário criar um novo secret para esta alteração.
