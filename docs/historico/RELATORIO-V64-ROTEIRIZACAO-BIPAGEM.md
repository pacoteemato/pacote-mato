# Relatório V64 - Roteirização e Bipagem revisadas

## Fonte revisada

Esta versão foi criada diretamente a partir do ZIP V62 enviado pelo usuário nesta revisão.

## Roteirização

### Problema identificado 1 - domínio do Worker

O arquivo `cloudflare/wrangler.toml` autorizava apenas:

`https://joaovitor250p-cloud.github.io`

O app publicado atualmente usa:

`https://pacoteemato.github.io`

Isso podia fazer o navegador bloquear as chamadas ao Worker por CORS. Como o comparador de percursos agrupava as falhas, a tela terminava mostrando somente a mensagem genérica de percurso incompleto.

### Problema identificado 2 - múltiplas como waypoints repetidos

Uma rota com 30 entregas em 26 endereços físicos podia enviar 30 jobs/waypoints ao roteador. Entregas no mesmo imóvel repetiam a visita física e podiam gerar pontos consecutivos idênticos.

### Correção

- a otimização trabalha por parada física;
- 30 entregas / 26 endereços => 26 jobs no otimizador;
- a ordem física é expandida novamente para os 30 IDs de entrega;
- entregas do mesmo imóvel permanecem juntas;
- a geometria não repete waypoints consecutivos;
- blocos continuam limitados a 12 pontos por chamada;
- se `short` falhar, a geometria tenta `balanced` mantendo o mesmo perfil de veículo;
- o Worker também remove pontos consecutivos repetidos como proteção adicional.

## Bipagem/PDF

### Problema identificado

O leitor flexível aceitava sequências amplas iniciadas em `BR`. Ao compactar toda a linha, referências que não eram pacote podiam virar um código aparentemente válido, causando contagem maior que a quantidade real.

### Correção

O código de pacote BR passa a ser validado como:

`BR` + `12 dígitos` + `1 caractere alfanumérico final`

Espaços/hífens internos continuam permitidos apenas para reconstruir um código realmente fragmentado pelo PDF.js.

Exemplos:

- `BR260967904580Q` -> válido
- `BR2609 67904580Q` -> reconstruído como válido
- `BR-050` -> ignorado

Além disso:

- uma linha de entrega aceita somente um código de pacote;
- pacote sem endereço estrutural não cria uma parada falsa;
- o agrupamento físico continua sendo logradouro + número, ignorando apartamento/bloco/sala;
- o estado antigo da Bipagem anterior à V64 não é retomado automaticamente, evitando reaproveitar contagens incorretas.

## Testes executados

- validação sintática de todos os arquivos JavaScript do projeto;
- teste simulado de 30 entregas em 26 endereços físicos;
- confirmação de 26 jobs enviados ao otimizador e 30 IDs devolvidos na ordem operacional;
- confirmação de múltiplos adjacentes no resultado;
- confirmação de no máximo 12 pontos por chamada de geometria;
- teste do extrator BR com PDF textual disponível no ambiente: 12 códigos reais reconhecidos e `BR-050` rejeitado;
- teste de normalização de múltiplos para Rua/R./Avenida/Av. e complementos diferentes no mesmo imóvel.
