# Testes V73 - leitor deterministico de PDF

A V73 remove a dependencia da sequencia perfeita da coluna `#`.

O leitor usa a propria faixa visual da entrega:

- PDF com BR: o codigo BR e a ancora principal;
- BR quebrado (Circuit): `BR + 12 digitos` e o caractere final so sao unidos quando estao na mesma coluna e muito proximos;
- PDF sem BR: usa linha numerada/horario para montar a lista de enderecos, mas nao inventa pacotes;
- a numeracao exibida e reconstruida pela ordem real das entregas no PDF;
- destino/retorno nao conta como entrega;
- multiplas sao agrupadas por logradouro + numero do imovel.

## Regressao com PDFs reais enviados

| Arquivo | Entregas | Codigos BR | Paradas fisicas |
|---|---:|---:|---:|
| Spoke (26) | 93 | 93 | 82 |
| Spoke (30) | 11 | 11 | 11 |
| Spoke (29) | 46 | 46 | 44 |
| Spoke (32) | 69 | 69 | 64 |
| Circuit b (2) | 93 | 93 | 75 |
| Circuit 838484884 | 30 | 0 | 26 |
| corrida 0710 | 12 | 12 | 12 |

Os testes posicionais foram executados com itens de texto e coordenadas extraidos dos PDFs reais, aplicando as mesmas funcoes deterministicas do `app.js`.
