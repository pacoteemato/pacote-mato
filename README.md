# Pacote É Mato — V81 HOTFIX FINAL

Versão final congelada da V81, construída sobre `Pacote-Em-Mato-V81-NAVEGACAO-FLUIDA` com alterações cirúrgicas no agrupamento físico de endereços e na experiência de navegação interna.


## Hotfix crítico — pacotes x entregas x paradas

- A formação física agora segue obrigatoriamente **PACOTE → ENTREGA ORIGINAL DO PDF → PARADA FÍSICA**.
- Vários BRs com o mesmo `numeroOriginalPdf` são recompostos na mesma entrega antes de qualquer comparação de endereço.
- Uma entrega com vários BRs não pode mais virar várias paradas por fragmentação visual do PDF.
- Somente depois da reconstrução da entrega é aplicada a chave física conservadora de rua/número/unidade.
- `Paradas Múltiplas` passa a considerar tanto mais de uma entrega quanto mais de um pacote associado à mesma parada física.
- `BIPADOS` e `FALTAM` continuam contando pacotes; `PARADAS FÍSICAS` continua contando apenas os destinos físicos.
- `js/bipagem/`: **0 arquivos modificados**.

## Implementado nesta revisão final

- Identidade física conservadora: via + logradouro + número + unidade/complemento contextual quando existir.
- Normalização segura de AP/APTO/APARTAMENTO, BL/BLOCO, TORRE, CASA, SALA, LOJA, UNIDADE, CONJUNTO, ANDAR, FUNDOS e edifício/prédio explícito.
- Complemento ausente em apenas uma entrega ou complemento incompleto não é usado para fundir destinos.
- Diagnóstico `[PACOTE É MATO][AGRUPAMENTO]` explica decisões JUNTAS/SEPARADAS e a chave física final.
- `OVERVIEW` e `NAVIGATION-ACTIVE` são estados separados.
- Navigation-active usa câmera próxima, heading/pitch, offset do motorista, GPS visual suavizado, map matching apenas visual e recentralização completa.
- Estilo vetorial de navegação aumenta contraste de vias e labels sem trocar o provedor OpenFreeMap.
- Geometria da rota não recebe simplificação adicional na renderização da navegação.
- Painel de manobras usa instruções reais do provedor, com SVGs próprios, segunda manobra e tratamento de rotatória quando os dados existem.
- Bottom sheet permanece compacto no modo ativo e expansível pelo grabber.
- Histórico concluído e restauração de sessão da V81 anterior foram preservados.
- Cache-buster/build desta revisão foi alterado para evitar que uma instalação V81 anterior reutilize JS/CSS antigo.

## Proteções de regressão

- Arquivos em `js/bipagem/`: **0 modificados**.
- Módulos de importação separados (`js/importacao/`) permanecem byte a byte iguais à base recebida.
- `entregaOriginalPorPacote` e validação dos códigos BR continuam preservados.
- A lógica de otimização não foi alterada; o teste de equivalência V80/V81 continua escolhendo o mesmo vencedor com as mesmas respostas de teste.

Consulte `docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md` para a comparação antes/depois, testes executados, limitações e riscos restantes.


## V81 HOTFIX FINAL 2 — Mapa, sessão e manobras

Esta versão mantém congelado o HOTFIX aprovado de pacotes múltiplos/paradas físicas e altera somente mapa base clean, persistência de sessão, navigation-active e interpretação de manobras/multi-leg. Veja `docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md`.
