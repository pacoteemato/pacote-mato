# Relatório V77 — numeração original na Bipagem

## Problema confirmado
A V76 usava `stopCorrespondente` para mostrar o número grande da Bipagem. Esse mapa contém a **parada física agrupada**, não a linha original da entrega no PDF. Em um manifesto com 102 entregas e 78 endereços físicos, a entrega 43 podia aparecer como P33.

## Correção
A V77 mantém dois mapas separados:
- `stopCorrespondente`: parada física, usada pela rota e pelo progresso do endereço;
- `entregaOriginalPorPacote`: número original da entrega/pacote no PDF, usado no cartão e na voz da Bipagem.

Assim, o pacote da entrega 43 aparece como **P43**, mesmo que fisicamente esteja agrupado na 33ª parada de rua com a entrega 42.
