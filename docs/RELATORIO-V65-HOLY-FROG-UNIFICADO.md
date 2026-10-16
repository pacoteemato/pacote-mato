# Pacote É Mato — V65

## Worker unificado

Esta versão usa o mesmo Worker `holy-frog-272c` para:
- administração;
- Firebase;
- Mercado Pago / PIX;
- geocodificação Geoapify;
- otimização de rota;
- traçado de rota.

O frontend de mapas/roteirização agora aponta por padrão para:
`https://holy-frog-272c.joaovitor250p.workers.dev`

## Variável adicional necessária no holy-frog

Crie apenas o secret `GEOAPIFY_API_KEY`.

A origem do app pode reutilizar `ADMIN_ALLOWED_ORIGINS`, já configurada como `https://pacoteemato.github.io`. O Worker também aceita `ALLOWED_ORIGINS` se você quiser separar no futuro.

## Endpoints adicionados
- `GET /health`
- `POST /geocode`
- `POST /optimize`
- `POST /route`

As rotas administrativas existentes continuam preservadas.
