# Pacote É Mato — V81 HOTFIX FINAL 3

Versão V81 com a **regra definitiva de paradas físicas** aplicada sobre o `Pacote-Em-Mato-V81-HOTFIX-FINAL-2`.

## Regra definitiva de parada física

A identidade da parada física considera **somente**:

```text
LOGRADOURO NORMALIZADO + NÚMERO PRINCIPAL DO IMÓVEL
```

Apartamento, bloco, torre, sala, loja, casa interna, unidade, andar e demais complementos **não participam da chave de agrupamento**. Eles continuam preservados como informações de entrega para exibição ao motorista.

Exemplo:

```text
Rua Ancara, 105, Bloco 3, Apto 903
Rua Ancara, 105, Bloco 1, Apto 501
=> UMA PARADA FÍSICA
```

Se o número principal não puder ser determinado com segurança, a entrega fica isolada; o sistema não agrupa somente pelo nome da rua e nunca usa número de apartamento/bloco como substituto do número principal.

## Pacotes, entregas e Bipagem

- A formação continua seguindo **PACOTE → ENTREGA ORIGINAL DO PDF → PARADA FÍSICA**.
- Vários BRs de uma mesma entrega permanecem dentro da entrega original.
- `entregaOriginalPorPacote[BR]` continua preservando a numeração original do PDF.
- Uma parada com `pacotes.length > 1` é uma **PARADA MÚLTIPLA**.
- Agrupar pacotes na mesma parada **não** os bipa juntos. Cada BR continua independente.
- `BIPADOS` e `FALTAM` contam pacotes; `PARADAS FÍSICAS` conta destinos físicos.
- `js/bipagem/`: **0 arquivos modificados** nesta revisão.

## Validação desta revisão

- Regra sintética completa do manifesto Spoke de 123 pacotes: **107 paradas / 8 múltiplas / 24 pacotes em múltiplas**.
- `91.pdf` real processado pelo parser do app: **102 pacotes / 78 paradas / 18 múltiplas / 42 pacotes em múltiplas**.
- Apartamentos/blocos diferentes no mesmo logradouro+número permaneceram na mesma parada.
- Todos os BRs permaneceram independentes.
- A otimização, mapa, login, navigation-active e manobras do HOTFIX FINAL 2 não foram alterados por esta revisão, salvo o novo cache-buster de `app.js`.

Consulte `docs/RELATORIO-V81-ENDERECOS-NAVEGACAO.md` para os testes, comparação e limitações.
