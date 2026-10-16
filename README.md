# Pacote É Mato V75 — ajustes pontuais

Esta versão altera somente o que foi solicitado após a V74:

- corrige a exportação do PDF, com suporte ao salvamento nativo no Android (quando o MainActivity V75 estiver instalado), Web Share e download como fallback;
- mantém o layout do PDF V74 (verde/branco/preto, ordem atual, SPX TN e ponto final);
- adicionar parada, editar parada e ponto final agora usam a mesma busca de endereço com sugestões abaixo do campo;
- evita repetição de número da casa/apartamento no editor separando endereço físico de complemento;
- corrige “Voltar à rota” em Configurações para sair imediatamente sem aguardar processamento pendente e sem prender o histórico interno;
- acrescenta no Painel do Dono a Central de problemas e Versões do app, além de versão/último uso na ficha do cliente;
- registra somente telemetria operacional mínima no documento existente do usuário (versão, plataforma, último uso e último erro). Não registra endereços/rotas nem localização para o painel;
- preserva o leitor/Bipagem V73 e as demais funções da V74 sem alteração funcional.

## Firebase / Worker
Não é necessário criar nova coleção, rota no Worker ou secret. Os novos campos são gravados no documento já existente `usuarios/{whatsapp}`. Se as regras do Firestore bloquearem campos novos, ajuste as Rules para permitir esses campos ao próprio usuário.

## Android
Para o botão Exportar PDF abrir o seletor nativo “Salvar como” dentro do WebView, use também o pacote Android V75 fornecido junto da entrega. O Manifest não precisa de permissão de armazenamento.
