# Relatório V76 — localização, busca de endereço e operação de pacotes

## Localização
O WebView pode retornar estado incorreto em `navigator.permissions` mesmo depois de a permissão nativa estar liberada. A V76 deixa de bloquear o uso apenas por esse valor e valida a permissão pelo resultado real de `navigator.geolocation.getCurrentPosition`. O aviso de ativação só deve aparecer quando a tentativa real retornar negação de localização.

## Adicionar e editar parada
As ações normais de adicionar/editar no planejador usam agora `routingStopSearch`, com o mesmo dropdown de resultados já visível na lista. A edição preserva pacotes/status e altera somente o endereço. O editor avançado antigo continua reservado ao fluxo de conferência da importação.

## Duplicidade visual de endereço
A exibição limpa o número do imóvel quando ele já estiver embutido no logradouro e deduplica formas equivalentes de complemento como `Ap 23` e `Apartamento 23`.

## Adicionar pacotes à rota
`confirmadosExistentes` agora participa da tela de conferência e da habilitação do botão de confirmação. Pacotes já existentes continuam sem ser adicionados novamente. Quando todos os pacotes conferidos já estavam na rota, a operação pode ser concluída sem recalcular a rota desnecessariamente.
