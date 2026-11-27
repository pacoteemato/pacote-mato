# Relatório V75 — correções pontuais solicitadas

## Escopo alterado
- Exportação de PDF: substituído `doc.save()` por uma camada de salvamento com ponte Android nativa, Web Share e download web como fallback. O conteúdo/layout do PDF V74 foi preservado.
- Endereços: adicionar parada, editar parada e ponto final passaram a compartilhar busca com sugestões abaixo do campo. O endereço físico e o complemento são mantidos separados no editor para evitar repetição de número da casa/apartamento.
- Configurações: o botão Voltar à rota deixa a tela imediatamente e não espera aplicação assíncrona de preferências; também evita o passo extra de histórico interno nesse retorno específico.
- Painel do Dono: adicionadas Central de problemas e Versões do app, mais versão/plataforma/último uso na ficha do cliente.
- Telemetria: grava somente versão, plataforma, último uso e diagnóstico operacional no documento `usuarios/{whatsapp}`. Não envia endereço de cliente, conteúdo de rota ou localização.

## Preservado
- Leitor e Bipagem V73.
- Worker Holy-Frog e endpoints administrativos existentes.
- Roteamento, refinamento/desenho, ponto final, navegação, voz e localização fora dos ajustes acima.

## Verificações
- 33 arquivos JavaScript passaram em `node --check`.
- Teste de exportação com ponte Android confirmou nome `Pacote É Mato - Rota teste.pdf` e payload PDF em Base64.
- Teste de fallback web confirmou disparo do download por Blob.
- `js/app.js` difere da V74 somente pela chamada de diagnóstico no `catch` da leitura de PDF; o parser V73 não foi alterado.
- AndroidManifest do pacote Android V75 permanece idêntico ao pacote Android anterior; não foi adicionada permissão de armazenamento.
