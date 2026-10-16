# Relatório V80 — aviso normal pós-login

## Problema
Na V79 o comunicado normal era renderizado como banner dentro de `moduloRoteirizacao`. O listener do Firestore funcionava, mas o banner podia permanecer invisível quando o módulo ainda não estava visível após a autenticação ou quando o motorista estava em outro módulo.

## Correção
O comunicado normal passou a usar uma camada global própria, alimentada pelo mesmo `onSnapshot` de `sistema_config/broadcast` usado pela manutenção.

Regras:
- nunca aparece enquanto `telaBloqueio` (login/renovação) estiver visível;
- aparece imediatamente quando a sessão do cliente é liberada e a tela da rota/mapa está ativa;
- é informativo e fechável, sem bloquear o app depois do aceite;
- um comunicado novo (novo `atualizadoEm`) pode aparecer novamente;
- se publicado enquanto o cliente está na Bipagem ou Configurações, fica pendente até voltar à rota;
- manutenção ativa tem prioridade sobre o comunicado normal.

O banner antigo foi mantido no HTML apenas por compatibilidade, mas fica desativado pelo JavaScript para não duplicar a mensagem.
