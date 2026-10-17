# Pacote É Mato — V81 NAVEGAÇÃO FLUIDA

Versão construída sobre a V80 com alterações cirúrgicas em login/sessão, navegação interna, histórico e performance técnica da otimização.

## Alterações principais

- Estado de acesso separado em verificando, ativo, expirado confirmado e erro temporário de conexão.
- Restauração automática da sessão Firebase sem transformar cache/atraso de Firestore em assinatura expirada.
- Navegação interna mais próxima, com zoom dinâmico, câmera apontada para a frente, posição visual suavizada e GPS bruto preservado para decisões operacionais.
- Trecho percorrido em verde com baixa opacidade; trecho futuro continua verde forte.
- Ícones SVG de manobra baseados nas instruções reais da rota.
- Bottom sheet compacto/expandido com grabber dedicado; no compacto ficam endereço, Não entregue e Entregue.
- Histórico concluído consultável por parada, com correção explícita de status que reabre a mesma rota sem reotimizar.
- Finalização só limpa a rota ativa depois que a cópia concluída foi confirmada no armazenamento local.
- Otimização executa alternativas independentes com concorrência máxima 2, mantendo os mesmos candidatos e a mesma regra de escolha da V80.
- Textos de processamento mais claros para o motorista.

## Proteções de regressão

Os arquivos de Bipagem, importação XLSX/CSV, geocodificação e Workers foram mantidos byte a byte iguais à V80. O leitor/parser de PDF dentro de `js/app.js` não foi reescrito; as mudanças nesse arquivo ficaram no bloco de autenticação/sessão.

Consulte `docs/RELATORIO-V81-NAVEGACAO-FLUIDA.md` para detalhes, testes executados e riscos restantes.
