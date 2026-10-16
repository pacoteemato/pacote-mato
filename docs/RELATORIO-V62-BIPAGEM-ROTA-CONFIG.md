# Pacote É Mato — V62

## Correções principais

- Bipagem/PDF: leitura de códigos BR fragmentados pelo PDF.js, evitando perda de pacotes na contagem.
- A rota só é liberada quando a quantidade de pacotes associada bate com a quantidade de códigos BR detectada no PDF.
- Leitor visual parcial não encerra mais o processamento antes de o leitor universal tentar recuperar os demais códigos.
- Otimização: geometria dividida em blocos menores e subdivisão automática quando um trecho grande falhar.
- Se o percurso continuar incompleto, o sistema confere todas as coordenadas e tenta novamente uma vez, sem apagar paradas.
- Configurações de navegação, veículo e tempo por parada deixaram de ser obrigatórias. Agora são apenas recomendadas e não bloqueiam otimização/navegação.
- Mantidas as correções de localização, botão voltar e diálogos próprios das versões anteriores.
