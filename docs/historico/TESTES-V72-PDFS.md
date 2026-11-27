# Testes V72 - PDFs de regressão

Leitura validada com os itens posicionais equivalentes ao `getTextContent()` do PDF.js e com os PDFs reais enviados.

| Arquivo | Entregas | Códigos BR | Paradas físicas |
|---|---:|---:|---:|
| b (2) (Circuit) | 93 | 93 | 75 |
| 838484884 (Circuit sem BR) | 30 | 0 | 26 |
| Spoke (26) | 93 | 93 | 82 |
| Spoke (30) | 11 | 11 | 11 |
| Spoke (29) | 46 | 46 | 44 |
| Spoke (32) | 69 | 69 | 64 |
| corrida 0710 (Spoke sem numeração visível) | 12 | 12 | 12 |

## Critérios

- nenhum código duplicado entre entregas;
- nenhuma entrega codificada sem endereço físico identificável;
- sequência de entregas completa quando o PDF fornece numeração;
- múltiplas agrupadas por logradouro + número do imóvel;
- apartamento, bloco, torre, sala e complemento não criam nova parada física;
- `Destino` não vira pacote;
- `BR-050` e textos semelhantes não viram código de pacote.
