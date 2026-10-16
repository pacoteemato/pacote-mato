# Pacote É Mato V79 — avisos no mapa e modo manutenção

Alterações desta versão:
- comunicado do dono aparece somente em Minha rota / mapa;
- comunicado não aparece no login nem na Bipagem;
- painel do dono ganhou Modo manutenção;
- manutenção bloqueia a área interna do app após autenticação e libera automaticamente em tempo real quando encerrada;
- login continua disponível durante manutenção;
- aviso e manutenção usam o documento já existente `sistema_config/broadcast`;
- não exige nova coleção nem nova regra do Firestore;
- requer publicar o Worker `cloudflare/WORKER-HOLY-FROG-V79-AVISOS-MANUTENCAO-COMPLETO.txt`.

Fora desses pontos, a V78 foi preservada.
