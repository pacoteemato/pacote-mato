# Pacote É Mato V63

Correções principais desta versão:

- Bipagem: contagem de códigos BR endurecida para não criar pacote fantasma.
- PDFs: a contagem esperada agora usa consenso entre leitores que associam código + endereço válido; a varredura bruta não manda sozinha.
- PDFs: leitor legado não aceita mais endereço malformado como somente "Rua".
- Otimização: múltiplas entregas no mesmo endereço viram uma única visita física para o roteador.
- Geometria: waypoints repetidos no mesmo imóvel são removidos antes de traçar o percurso.
- As entregas continuam preservadas individualmente depois da otimização (ex.: 30 entregas em 26 paradas físicas = 30 entregas mantidas).
- Configurações continuam como recomendação, sem bloquear otimização ou início da rota.
