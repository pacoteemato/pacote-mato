# Pacote É Mato V64

Versão revisada a partir do projeto V62 enviado pelo usuário.

## Correções principais

- roteirização calcula 1 visita por parada física e mantém todas as entregas/pacotes do mesmo endereço agrupados;
- pontos consecutivos repetidos deixam de ser enviados ao serviço de rotas;
- Worker de rotas preparado para o domínio atual `https://pacoteemato.github.io`;
- leitura de PDF usa código BR estrito (`BR` + 12 dígitos + 1 caractere final), evitando falso pacote como `BR-050`;
- registros sem endereço estrutural não viram paradas falsas;
- múltiplos continuam sendo agrupados por logradouro + número do imóvel;
- configurações de navegação/veículo/tempo são recomendação e não bloqueiam otimização;
- snapshots antigos da Bipagem são invalidados para que uma leitura com contagem antiga não seja reaproveitada.

## Publicação

Substitua os arquivos do site no GitHub Pages pelos arquivos deste pacote.

A roteirização também depende do Worker `pacote-emato-rotas`. O Worker completo revisado está em:

`cloudflare/WORKER-ROTAS-V64-COMPLETO.txt`

O `cloudflare/wrangler.toml` já autoriza o domínio atual `https://pacoteemato.github.io` e mantém o domínio antigo por compatibilidade.
