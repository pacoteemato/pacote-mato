# Relatório V71 - Bipagem/PDF robusta

## Objetivo
Evitar associação errada entre pacote e endereço e garantir que quantidades, entregas e paradas físicas sejam derivadas da estrutura real do PDF.

## Regras de leitura
1. Uma linha numerada do manifesto é a unidade de verdade.
2. Código BR nunca é puxado de outra linha numerada.
3. Código válido: BR + 12 dígitos + 1 caractere alfanumérico.
4. Destino/retorno sem código não é entrega de pacote.
5. Endereço físico usa logradouro + número do imóvel; complemento não muda a parada física.
6. PDFs sem código BR podem fornecer paradas/rota, mas não liberam bipagem por câmera.
7. Divergências de sequência, contagem ou associação bloqueiam a importação em vez de criar dados estimados.

## Casos de regressão
- Circuit: código BR em duas linhas dentro de Notes.
- Circuit: 30 endereços, sem códigos de pacote.
- Spoke: Notes com AT..., BR..., cópia do endereço, bairro, cidade e CEP.
- Endereço quebrado em linha: `Comunidade ... 16` / `6, ...`.
- Número com letra quebrado: `719` / `A` e `26` / `C`.
- Paradas múltiplas: apartamentos diferentes no mesmo logradouro+número ficam na mesma parada física, mantendo os números originais das entregas juntos.
