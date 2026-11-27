# Relatório V79 — Avisos e manutenção

## Avisos
O `bannerBroadcast` saiu do módulo de Bipagem e passou para o módulo `moduloRoteirizacao`, junto ao mapa. O conteúdo é aplicado com `textContent`, sem injeção de HTML.

## Manutenção
O mesmo documento Firestore `sistema_config/broadcast` recebe:
- `manutencaoAtiva`
- `manutencaoMensagem`
- `manutencaoAtualizadoEm`

A tela de login permanece acima da camada de manutenção. Depois que a sessão do cliente é validada, a manutenção bloqueia a área interna. Ao desativar pelo painel, o snapshot do Firestore remove a camada automaticamente.

## Worker
Novas rotas administrativas:
- `GET /admin/system-config`
- `POST /admin/maintenance`

Nenhum secret ou variável adicional é necessário.
