# V56 — Admin login corrigido

- PIN administrativo agora aceita letras e números no celular (sem teclado numérico forçado).
- Painel chama diretamente `/admin/login`.
- Compatível com retorno `token` ou `adminToken`.
- Mensagem explícita se o Worker não devolver sessão.
- Corrigido payload de Comunicados para `ativo`, `mensagem` e `horas`, conforme Worker atual.
- Cache-bust dos arquivos do painel atualizado para V56.
