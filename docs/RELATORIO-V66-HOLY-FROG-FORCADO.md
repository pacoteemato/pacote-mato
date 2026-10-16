# V66 — Holy-Frog oficial forçado

## Problema encontrado
A V65 ainda lia `pemato_worker_base_url` e endpoints antigos do `localStorage` antes do endereço oficial. Um aparelho que já tivesse usado o Worker antigo continuava chamando esse endereço, mesmo após publicar o Holy-Frog novo e configurar `ALLOWED_ORIGINS` corretamente.

## Correção
- backend oficial fixado em `https://holy-frog-272c.joaovitor250p.workers.dev`;
- limpeza automática de Worker e endpoints antigos salvos no aparelho;
- `/geocode`, `/optimize`, `/route` e `/health` sempre derivados do Holy-Frog;
- `servico-rota.js` não lê mais overrides antigos do `localStorage`;
- mensagem de erro não acusa mais `ALLOWED_ORIGINS` automaticamente quando a falha é apenas de rede/publicação.
