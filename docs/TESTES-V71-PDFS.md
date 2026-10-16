# Testes de regressão - V71

Os PDFs enviados foram renderizados e inspecionados antes da alteração. A conferência estrutural do conteúdo textual encontrou:

| Arquivo | Entregas numeradas | Códigos BR únicos | Linha Destino sem pacote |
|---|---:|---:|---:|
| b (2) (1).pdf | 93 | 93 (reconstruídos quando o último caractere fica em outra linha) | 0 |
| 838484884 (1).pdf | 30 | 0 | 0 |
| Spoke (26).pdf | 93 | 93 | 1 |
| Spoke (30).pdf | 11 | 11 | 1 |
| Spoke (29).pdf | 46 | 46 | 1 |
| Spoke (32).pdf | 69 | 69 | 1 |

## Comportamento esperado

- Quando há códigos BR: número de pacotes na Bipagem = códigos BR únicos validados.
- Quando não há códigos BR: a rota/lista de paradas é importada, mas a câmera de bipagem não inventa códigos.
- A linha `Destino` do Spoke não vira entrega nem pacote.
- Agrupamento físico usa logradouro + número do imóvel. Complementos (apto, bloco, torre etc.) permanecem juntos na mesma parada física.
- A lista de paradas físicas recebe numeração sequencial própria. Em múltiplas, os números originais das entregas do PDF aparecem juntos.
