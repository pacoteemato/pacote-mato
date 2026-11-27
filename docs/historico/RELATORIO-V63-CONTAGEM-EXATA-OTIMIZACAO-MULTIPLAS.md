# V63 — Contagem exata e otimização de múltiplas

## Bipagem
- Código SPX BR validado como `BR` + 13 caracteres alfanuméricos.
- Rodovias como `BR-050` não podem mais virar código de pacote.
- Códigos fragmentados pelo PDF.js ainda são reconstruídos, com regras mais restritas.
- A contagem usa consenso entre leitura estrita, leitura visual e leitura universal.
- O fallback legado descarta endereço sem logradouro + número.

## Otimização
- Entregas múltiplas no mesmo endereço são agrupadas em uma visita física antes de chamar o Route Planner.
- A ordem retornada para as visitas físicas é expandida novamente para todos os IDs de entrega, sem perder pacote.
- A geometria elimina waypoints repetidos do mesmo endereço.
- Exemplo validado em teste: 30 entregas / 26 paradas físicas -> 26 visitas enviadas ao otimizador, 30 entregas devolvidas na ordem final.
